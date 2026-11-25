import os
import json
import hashlib
from pathlib import Path
from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PrivateKey

ROOT = Path(__file__).resolve().parent
KEYS = ROOT / "validator_keys_v4"
REGISTRY = ROOT / "trusted_validators_v4.json"
NAMES = ("A", "B", "C", "D")

def load_key(name):
    if name not in NAMES:
        raise ValueError("Unknown validator")

    return Ed25519PrivateKey.from_private_bytes(
        (KEYS / (name + ".key")).read_bytes()
    )

def trusted_key(name):
    registry = json.loads(REGISTRY.read_text())
    return bytes.fromhex(registry[name])

def registered_key(name, supplied):
    if supplied != trusted_key(name):
        raise ValueError("Untrusted validator key")
    return supplied

def initialize():
    KEYS.mkdir(mode=0o700, exist_ok=True)

    if not REGISTRY.exists():
        if any(KEYS.iterdir()):
            raise RuntimeError("Existing keys without registry")

        registry = {}

        for name in NAMES:
            key = Ed25519PrivateKey.generate()

            fd = os.open(
                KEYS / (name + ".key"),
                os.O_WRONLY | os.O_CREAT | os.O_EXCL,
                0o600
            )

            with os.fdopen(fd, "wb") as f:
                f.write(key.private_bytes_raw())

            registry[name] = (
                key.public_key().public_bytes_raw().hex()
            )

        with REGISTRY.open("x") as f:
            json.dump(registry, f, indent=2)

    for name in NAMES:
        public = load_key(name).public_key().public_bytes_raw()
        registered_key(name, public)

        fingerprint = hashlib.sha256(public).hexdigest()

        print(f"Validator {name}: REGISTERED")
        print("Fingerprint:", fingerprint[:24])

    fake = Ed25519PrivateKey.generate()
    try:
        registered_key("A", fake.public_key().public_bytes_raw())
    except ValueError:
        print("Unknown key: REJECTED")
    else:
        raise RuntimeError("Identity test failed")

    print("IDENTITY REGISTRY: PASS")

if __name__ == "__main__":
    initialize()
