from itertools import combinations

def find_conflict(n, quorum, faults):
    validators = set(range(n))

    groups = [
        set(group)
        for group in combinations(validators, quorum)
    ]

    for bad in combinations(validators, faults):
        bad = set(bad)

        for x in groups:
            for y in groups:

                # Honest validators cannot sign
                # two conflicting blocks in one round.
                if (x & y).issubset(bad):
                    return {
                        "block_x": sorted(x),
                        "block_y": sorted(y),
                        "faulty": sorted(bad)
                    }

    return None

tests = [
    ("3 nodes / 2 votes / 0 faults", 3, 2, 0, True),
    ("3 nodes / 2 votes / 1 fault", 3, 2, 1, False),
    ("4 nodes / 3 votes / 0 faults", 4, 3, 0, True),
    ("4 nodes / 3 votes / 1 fault", 4, 3, 1, True),
    ("4 nodes / 3 votes / 2 faults", 4, 3, 2, False),
    ("7 nodes / 5 votes / 2 faults", 7, 5, 2, True),
    ("7 nodes / 5 votes / 3 faults", 7, 5, 3, False),
]

passed = 0

print("MINICHAIN BFT SAFETY LAB")
print("=" * 55)

for name, n, q, f, expected in tests:
    conflict = find_conflict(n, q, f)
    safe = conflict is None
    success = safe == expected
    passed += int(success)

    print("\n" + name)
    print("Safety:", "SAFE" if safe else "UNSAFE")
    print("Test:", "PASS" if success else "FAIL")

    if conflict:
        print("Conflicting quorums:", conflict)

print("\n" + "=" * 55)
print(f"TOTAL: {passed}/{len(tests)}")
print("BFT MODEL:", "PASS" if passed == len(tests) else "FAIL")
