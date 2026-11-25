from itertools import combinations, product

NODES = set("ABCD")
QUORUM = 3

def conflicting_commits(faults):
    groups = [
        set(g) for g in combinations(sorted(NODES), QUORUM)
    ]

    for bad in combinations(sorted(NODES), faults):
        bad = set(bad)

        for first in groups:
            for second in groups:
                # Honest validators remain locked
                # across rounds at the same height.
                if (first & second).issubset(bad):
                    return {
                        "round_1": sorted(first),
                        "round_2": sorted(second),
                        "faulty": sorted(bad)
                    }

    return None

def possible_quorum(locks, block, offline=()):
    return sum(
        name not in offline and state in ("UNLOCKED", block)
        for name, state in locks.items()
    ) >= QUORUM

def deadlock(locks):
    return not (
        possible_quorum(locks, "X")
        or possible_quorum(locks, "Y")
    )

tests = {
    "Zero Byzantine faults":
        conflicting_commits(0) is None,

    "One Byzantine fault":
        conflicting_commits(1) is None,

    "Two Byzantine faults detected":
        conflicting_commits(2) is not None,

    "Same block progress":
        possible_quorum(
            dict(zip("ABCD", ["X", "X", "X", "Y"])),
            "X"
        ),

    "One offline validator":
        possible_quorum(
            dict(zip("ABCD", ["X"] * 4)),
            "X",
            offline=("B",)
        ),

    "Two offline validators":
        not possible_quorum(
            dict(zip("ABCD", ["X"] * 4)),
            "X",
            offline=("B", "C")
        ),

    "Split lock deadlock detected":
        deadlock(
            dict(zip("ABCD", ["X", "X", "Y", "Y"]))
        )
}

print("MINICHAIN CROSS-ROUND SAFETY LAB")
print("=" * 55)

for name, passed in tests.items():
    print(name + ":", "PASS" if passed else "FAIL")

print("\nEXHAUSTIVE LOCK STATE ANALYSIS")

total = 0
blocked = 0

for states in product(
    ["UNLOCKED", "X", "Y"], repeat=4
):
    locks = dict(zip("ABCD", states))
    total += 1

    if deadlock(locks):
        blocked += 1

print("Possible lock states:", total)
print("Deadlocked states:", blocked)

print("\nSAFETY ANALYSIS")
print("One faulty validator: SAFE")
print("Two faulty validators: UNSAFE")

print("\nLIVENESS ANALYSIS")
print("Strict locking: DEADLOCK POSSIBLE")

passed = sum(tests.values())

print("=" * 55)
print(f"TOTAL: {passed}/{len(tests)}")

if not all(tests.values()):
    raise SystemExit("CROSS-ROUND TEST: FAIL")

print("CROSS-ROUND TEST: PASS")
