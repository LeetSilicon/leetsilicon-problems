# Signal Within Range

**Domain:** design-verification — Constraints  
**Difficulty:** Medium  
**Topics:** Assertions, Coverage, Range

---

## Problem Statement

Write Parameterized Assertion: Signal Within Specified Range

Write parameterized assertion to verify that signal "data" is always within specified range [MIN, MAX]. Include coverage bins for boundary hits.

---

## Requirements

1. PARAMETERS: Define MIN and MAX as parameters or localparams. Assertion uses these values.

2. RANGE CHECK: data must be >= MIN and <= MAX on every cycle.

3. SIGNED vs UNSIGNED: Clarify signedness. For signed: $signed(data) >= $signed(MIN). For unsigned: default comparison.

4. COVERAGE BINS: Add coverpoint with bins for MIN, MAX, and mid-range values to track boundary hits.

5. RESET: disable iff (rst).

6. UNKNOWN: Gate X values: !$isunknown(data) |-> range_check.

7. Test Case 1 - Within Range: data values between MIN and MAX. Assertion passes continuously.

8. Test Case 2 - At MIN: data = MIN. Assertion passes. Coverage bin for MIN hits.

9. Test Case 3 - At MAX: data = MAX. Assertion passes. Coverage bin for MAX hits.

10. Test Case 4 - Below MIN: data = MIN - 1. Assertion fails.

11. Test Case 5 - Above MAX: data = MAX + 1. Assertion fails.

---

## Hints

<details>
<summary>Hint 1</summary>
Parameterized assertion: parameter MIN = 0; parameter MAX = 255; assert property (@(posedge clk) disable iff (rst) (data >= MIN && data <= MAX));
</details>
