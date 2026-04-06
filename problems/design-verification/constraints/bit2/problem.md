# 5 Non-Adjacent Set Bits

**Domain:** design-verification — Constraints  
**Difficulty:** Hard  
**Topics:** Constraints, Adjacent

---

## Problem Statement

10-bit Value with Exactly 5 Non-Adjacent 1-Bits

Write uvm sv constraints to generate 10-bit value with exactly 5 bits set such that no two set bits are adjacent (neighbors). Pattern must have gaps between 1s. Implement without using $countones in constraints

---

## Requirements

1. WIDTH: 10 bits (bit [9:0] x).

2. POPCOUNT: Exactly 5 bits set. Total number of 1s = 5.

3. NON-ADJACENT: For all i, NOT(x[i]==1 AND x[i+1]==1). No two consecutive bits both 1.

4. FEASIBILITY: Maximum non-adjacent 1s in 10 bits is 5. Pattern: 1010101010 (5 ones). Constraint is feasible.

5. NO $COUNTONES IN CONSTRAINTS: Implement popcount via explicit bit sum or construction.

6. Test Case 1 - Non-Adjacent Check: For i in [0:8], verify NOT(x[i] AND x[i+1]). No adjacent 1s.

7. Test Case 2 - Popcount: In testbench, verify $countones(x) == 5 for every randomization.

8. Test Case 3 - Pattern Uniqueness: Randomize 100 times. Verify multiple different valid patterns appear (not always 1010101010).

9. Test Case 4 - Edge Bits: Verify bits 0 and 9 can be 1 (not excluded by constraints).

10. Test Case 5 - Maximum Density: With 5 ones non-adjacent, minimum width needed is 9 (101010101). 10 bits has 1 spare, allowing variations.

---

## Hints

<details>
<summary>Hint 1</summary>
Construction approach: Choose 5 positions p0 < p1 < p2 < p3 < p4 with constraint p{k+1} >= p{k}+2 (gap ≥1 between positions) and p4 <= 9.
</details>
