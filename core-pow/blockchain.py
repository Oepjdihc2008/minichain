import hashlib
import json
from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PrivateKey, Ed25519PublicKey

DIFFICULTY = 3

def encode(data):
    return json.dumps(data, sort_keys=True).encode()

def sha256(data):
    return hashlib.sha256(encode(data)).hexdigest()

# Virtual users
alice = Ed25519PrivateKey.generate()
bob = Ed25519PrivateKey.generate()

def address(key):
    return key.public_key().public_bytes_raw().hex()

A = address(alice)
B = address(bob)

initial_balances = {A: 100, B: 0}
chain = []

# Create a signed transaction
def transaction(key, receiver, amount, nonce):
    tx = {
        "sender": address(key),
        "receiver": receiver,
        "amount": amount,
        "nonce": nonce
    }
    signature = key.sign(encode(tx)).hex()
    return {"data": tx, "signature": signature}

# Proof of work
def mine(transactions):
    block = {
        "index": len(chain),
        "previous_hash": chain[-1]["hash"] if chain else "0",
        "transactions": transactions,
        "nonce": 0
    }

    while True:
        h = sha256(block)
        if h.startswith("0" * DIFFICULTY):
            block["hash"] = h
            chain.append(block)
            print("\nBlock mined:", block["index"])
            print("Nonce:", block["nonce"])
            print("Hash:", h)
            return
        block["nonce"] += 1

# Validate blockchain
def validate():
    balances = initial_balances.copy()
    nonces = {}
    previous = "0"

    for i, block in enumerate(chain):
        data = {k: v for k, v in block.items() if k != "hash"}
        h = sha256(data)

        if (block["index"] != i
            or h != block["hash"]
            or block["previous_hash"] != previous
            or not h.startswith("0" * DIFFICULTY)):
            return False, {}

        for signed in block["transactions"]:
            tx = signed["data"]
            sender = tx["sender"]
            receiver = tx["receiver"]
            amount = tx["amount"]

            try:
                key = Ed25519PublicKey.from_public_bytes(
                    bytes.fromhex(sender)
                )
                key.verify(
                    bytes.fromhex(signed["signature"]),
                    encode(tx)
                )
            except Exception:
                return False, {}

            if type(amount) is not int or amount <= 0:
                return False, {}

            if balances.get(sender, 0) < amount:
                return False, {}

            if tx["nonce"] != nonces.get(sender, 0):
                return False, {}

            balances[sender] -= amount
            balances[receiver] = balances.get(receiver, 0) + amount
            nonces[sender] = nonces.get(sender, 0) + 1

        previous = h

    return True, balances

# Genesis block
mine([])

# Simulated transactions
mine([transaction(alice, B, 30, 0)])
mine([transaction(bob, A, 10, 0)])

valid, balances = validate()

print("\n--- RESULT ---")
print("Blockchain valid:", valid)
print("Alice:", balances.get(A))
print("Bob:", balances.get(B))

# Tampering experiment
print("\n--- TAMPERING TEST ---")
chain[1]["transactions"][0]["data"]["amount"] = 999
print("Blockchain valid:", validate()[0])
