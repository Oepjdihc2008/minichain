import json
import os
import secrets
import urllib.request
import multiprocessing as mp
from collections import Counter
from cryptography.hazmat.primitives.asymmetric.ed25519 import (
    Ed25519PrivateKey, Ed25519PublicKey
)

NODES = {"A": 8545, "B": 8546, "C": 8547}

def encode(data):
    return json.dumps(data, sort_keys=True).encode()

def rpc(port, method, params):
    req = urllib.request.Request(
        f"http://127.0.0.1:{port}",
        data=encode({
            "jsonrpc": "2.0",
            "id": 1,
            "method": method,
            "params": params
        }),
        headers={"Content-Type": "application/json"}
    )

    with urllib.request.urlopen(req, timeout=5) as r:
        response = json.load(r)

    if "error" in response:
        raise RuntimeError(response["error"])

    return response["result"]

def validator(name, port, conn):
    try:
        key = Ed25519PrivateKey.generate()

        conn.send(key.public_key().public_bytes_raw())

        challenge = conn.recv()

        chain_id = int(rpc(port, "eth_chainId", []), 16)

        if chain_id != 31337:
            raise RuntimeError("Incorrect network")

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

        conn.send((vote, key.sign(encode(vote))))

    finally:
        conn.close()

def main():
    ctx = mp.get_context("spawn")
    workers = {}
    counts = Counter()
    challenge = secrets.token_hex(16)

    print("MINICHAIN INDEPENDENT VALIDATORS")

    try:
        for name, port in NODES.items():
            parent, child = ctx.Pipe()

            process = ctx.Process(
                target=validator,
                args=(name, port, child)
            )

            process.start()
            child.close()
            workers[name] = (process, parent)

        for name, (process, conn) in workers.items():
            try:
                if not conn.poll(5):
                    raise TimeoutError("Registration timeout")

                public = Ed25519PublicKey.from_public_bytes(
                    conn.recv()
                )

                conn.send(challenge)

                if not conn.poll(10):
                    raise TimeoutError("Voting timeout")

                vote, signature = conn.recv()

                public.verify(signature, encode(vote))

                if (
                    vote["validator"] != name
                    or vote["pid"] != process.pid
                    or vote["round"] != challenge
                    or vote["chain_id"] != 31337
                ):
                    raise ValueError("Invalid vote")

                counts[(vote["height"], vote["hash"])] += 1

                print(f"\nValidator {name}: PASS")
                print("PID:", vote["pid"])
                print("Height:", vote["height"])
                print("Hash:", vote["hash"])

            except Exception as e:
                print(f"Validator {name}: FAIL - {e}")

        print("\n--- CONSENSUS RESULT ---")

        if counts and counts.most_common(1)[0][1] >= 2:
            winner, total = counts.most_common(1)[0]
            print("CONSENSUS REACHED")
            print("Votes:", total, "/ 3")
            print("Height:", winner[0])
            print("Selected hash:", winner[1])
        else:
            print("NO CONSENSUS")

    finally:
        for process, conn in workers.values():
            conn.close()
            process.join(timeout=2)
            if process.is_alive():
                process.terminate()
                process.join()

if __name__ == "__main__":
    main()
