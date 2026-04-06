# No Consecutive Zeros

**Domain:** design-verification — Constraints  
**Difficulty:** Hard  
**Topics:** Constraints, Dynamic Array, Pattern

---

## Problem Statement

Dynamic Array Size 300 with No Adjacent Zeros

Generate dynamic array of 300 elements with values from {0,1,2,3,4,5}. UVM SV Constraints: (1) Each value appears at least 40 times, (2) No two consecutive 0s (adjacent 0s forbidden). Value 0 must be interspersed with other values.

---

## Requirements

1. ARRAY SIZE: Dynamic array, size = 300.

2. VALUE DOMAIN: Each a[i] inside {0,1,2,3,4,5}. Six possible values.

3. MINIMUM FREQUENCY: Each value {0,1,2,3,4,5} appears at least 40 times. Total min = 6*40 = 240. Leaves 60 flexible.

4. NO CONSECUTIVE ZEROS: Pattern 0,0 forbidden. For all i, NOT(a[i]==0 AND a[i+1]==0).

5. ZEROS STILL APPEAR: Value 0 must appear >= 40 times but interspersed. Pattern like 0,1,0,2,0 is valid.

6. FEASIBILITY: With 300 elements and needing >= 40 zeros non-adjacent, maximum consecutive 0s = 1. Achievable by spacing with other values.

7. Test Case 1 - No Adjacent 0s: Scan array for i in [0:298]. Assert NOT(a[i]==0 AND a[i+1]==0). No two 0s side-by-side.

8. Test Case 2 - Frequency Check: Count each value 0-5. Assert each count >= 40.

9. Test Case 3 - 0s Present: Verify value 0 appears in array (count > 0). Ensure constraint doesnt accidentally exclude 0.

10. Test Case 4 - Corner Case Exact Count: Add temporary constraint forcing count(0)==40 exactly. Verify still satisfiable with spacing constraint.

11. Test Case 5 - Stress Test: Randomize 100 times. No failures. Verify solver performance acceptable.

---

## Hints


