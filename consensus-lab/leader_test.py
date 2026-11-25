NODES = "ABCD"
QUORUM = 3

def leader(round_id):
    return NODES[(round_id - 1) % len(NODES)]

def simulate(offline=(), invalid=(), locks=None):
    locks = locks or {}
    history = []

    for round_id in range(1, 9):
        proposer = leader(round_id)

        if proposer in offline:
            history.append((round_id, proposer, "TIMEOUT"))
            continue

        if proposer in invalid:
            history.append((round_id, proposer, "REJECTED"))
            continue

        block = locks.get(proposer, "X")

        votes = sum(
            name not in offline
            and name not in invalid
            and locks.get(name, block) == block
            for name in NODES
        )

        if votes >= QUORUM:
            history.append((round_id, proposer, "COMMIT"))
            return block, history

        history.append((round_id, proposer, "NO QUORUM"))

    return None, history

normal, _ = simulate()
offline, offline_history = simulate(offline=("A",))
invalid, _ = simulate(invalid=("A",))
two_offline, _ = simulate(offline=("A", "B"))

deadlock, _ = simulate(
    locks={"A": "X", "B": "X", "C": "Y", "D": "Y"}
)

tests = {
    "Leader rotation":
        [leader(r) for r in range(1, 9)] == list("ABCDABCD"),

    "Normal leader":
        normal == "X",

    "Offline leader recovery":
        offline == "X",

    "Invalid proposal recovery":
        invalid == "X",

    "Two offline validators":
        two_offline is None,

    "Split lock remains blocked":
        deadlock is None
}

print("MINICHAIN LEADER ROTATION LAB")
print("=" * 55)

for name, passed in tests.items():
    print(name + ":", "PASS" if passed else "FAIL")

print("\nVIEW CHANGE SIMULATION")

for round_id, proposer, status in offline_history:
    print(
        f"Round {round_id} | "
        f"Leader {proposer} | {status}"
    )

print("\n" + "=" * 55)
print(f"TOTAL: {sum(tests.values())}/{len(tests)}")

if not all(tests.values()):
    raise SystemExit("LEADER ROTATION: FAIL")

print("LEADER ROTATION: PASS")
