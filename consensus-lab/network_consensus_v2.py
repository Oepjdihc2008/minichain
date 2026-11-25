import json
import os
import socket
import secrets
import time
import multiprocessing as mp
from collections import Counter
from ledger import save_round
from validators import rpc, encode
from cryptography.hazmat.primitives.asymmetric.ed25519 import (
    Ed25519PrivateKey, Ed25519PublicKey
)

NODES = {"A": 8545, "B": 8546, "C": 8547}

def validator(name, port, address, challenge, conn):
    try:
        key = Ed25519PrivateKey.generate()
        conn.send_bytes(key.public_key().public_bytes_raw())

        chain_id = int(rpc(port, "eth_chainId", []), 16)
        if chain_id != 31337:
            raise ValueError("Incorrect network")

        block = rpc(
            port, "eth_getBlockByNumber",
            ["latest", False]
        )

        vote = {
            "validator": name,
            "pid": os.getpid(),
            "round": challenge,
            "chain_id": chain_id,
            "height": int(block["number"], 16),
            "hash": block["hash"]
        }

        packet = {
            "vote": vote,
            "signature": key.sign(encode(vote)).hex()
        }

        with socket.create_connection(address, timeout=5) as s:
            s.sendall(encode(packet) + b"\n")

    finally:
        conn.close()

def main():
    ctx = mp.get_context("spawn")
    challenge = secrets.token_hex(32)

    workers = {}
    public = {}
    accepted = {}
    evidence = {}
    counts = Counter()

    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server.bind(("127.0.0.1", 0))
    server.listen(8)

    address = server.getsockname()

    print("MINICHAIN TCP CONSENSUS")
    print("Listening:", address)

    try:
        for name, port in NODES.items():
            parent, child = ctx.Pipe(duplex=False)

            process = ctx.Process(
                target=validator,
                args=(name, port, address, challenge, child)
            )

            process.start()
            child.close()
            workers[name] = (process, parent)

        for name, (process, conn) in workers.items():
            if conn.poll(5):
                try:
                    public[name] = Ed25519PublicKey.from_public_bytes(
                        conn.recv_bytes(32)
                    )
                except Exception:
                    print("Registration rejected:", name)

        deadline = time.monotonic() + 12

        while len(accepted) < len(NODES):
            remaining = deadline - time.monotonic()

            if remaining <= 0:
                break

            server.settimeout(remaining)

            try:
                client, peer = server.accept()
            except socket.timeout:
                break

            with client:
                try:
                    client.settimeout(2)

                    with client.makefile("rb") as stream:
                        raw = stream.readline(8193)

                    if len(raw) > 8192 or not raw.endswith(b"\n"):
                        raise ValueError("Invalid message size")

                    packet = json.loads(raw)
                    vote = packet["vote"]
                    name = vote["validator"]

                    if (
                        name not in public
                        or name in accepted
                        or vote["round"] != challenge
                        or vote["chain_id"] != 31337
                        or vote["pid"] != workers[name][0].pid
                        or type(vote["height"]) is not int
                        or vote["height"] < 0
                    ):
                        raise ValueError("Invalid vote")

                    h = vote["hash"]
                    if len(h) != 66 or not h.startswith("0x"):
                        raise ValueError("Invalid block hash")

                    bytes.fromhex(h[2:])

                    public[name].verify(
                        bytes.fromhex(packet["signature"]),
                        encode(vote)
                    )

                    accepted[name] = vote
                    evidence[name] = {
                        "vote": vote,
                        "signature": packet["signature"],
                        "public_key": public[name].public_bytes_raw().hex()
                    }
                    counts[(vote["height"], h)] += 1

                    print(f"Validator {name}: TCP VOTE VERIFIED")

                except Exception as e:
                    print("Rejected packet:", type(e).__name__)

        save_round(challenge, evidence, counts)
        print("\nVALID VOTES:", len(accepted))

        if counts and counts.most_common(1)[0][1] >= 2:
            winner, total = counts.most_common(1)[0]
            print("TCP CONSENSUS REACHED")
            print("Votes:", total, "/ 3")
            print("Height:", winner[0])
            print("Hash:", winner[1])
        else:
            print("NO CONSENSUS")

    finally:
        server.close()

        for process, conn in workers.values():
            conn.close()
            process.join(timeout=2)

            if process.is_alive():
                process.terminate()
                process.join()

if __name__ == "__main__":
    main()
