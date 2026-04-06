# Array Sum Constraint

**Domain:** design-verification — Constraints  
**Difficulty:** Medium  
**Topics:** Constraints, Array, Sum

---

## Problem Statement

Generate Integer Array of Size 10 with Sum Exactly 100

Write UVM SystemVerilog constraint to generate an integer array of size 10 where the sum of all elements equals exactly 100. Implement sum calculation without using .sum() array reduction method. Define element bounds to ensure solver feasibility.

---

## Requirements

1. ARRAY SIZE: Fixed size = 10 elements.

2. SUM REQUIREMENT: Sum of all 10 elements must equal exactly 100. Total = a[0] + a[1] + ... + a[9] = 100.

3. NO .sum() METHOD: Cannot use array.sum() built-in. Must implement sum using foreach loop with accumulator variable or explicit addition.

4. ELEMENT BOUNDS: Define range for each element (e.g., each element in [0:100] or [minus 50:150]). Without bounds, solver has infinite domain (unsolvable).

5. SUM VARIABLE: Introduce intermediate variable (e.g., int unsigned tmp_sum) to hold computed sum. Constrain tmp_sum == 100 and tmp_sum == (a[0]+a[1]+...).

6. SOLVER PERFORMANCE: Bounds improve solver speed. Tighter bounds = faster solving.

7. Test Case 1 - Sum Verification: Randomize 100 times. For each randomization, compute actual_sum = a[0]+a[1]+...+a[9] in testbench. Assert actual_sum == 100.

8. Test Case 2 - Array Size: Verify a.size() == 10 after each randomization.

9. Test Case 3 - Boundary Solution: Add temporary constraint forcing a[0]=100, all others=0. Verify randomize succeeds and sum still equals 100.

---

## Hints


