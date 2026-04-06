# Fixed Index Value

**Domain:** design-verification — Constraints  
**Difficulty:** Easy  
**Topics:** Constraints, Array

---

## Problem Statement

Array with Specific Element Fixed at Index 5

Write uvm sv constraints to generate array where element at index 5 is always fixed to value 100, while all other elements are randomized within defined bounds. Array size must be at least 6 to have index 5.

---

## Requirements

1. ARRAY SIZE: Fixed size >= 6. Define exact size (e.g., size=10).

2. FIXED ELEMENT: a[5] must always equal 100. Hard constraint, no randomization.

3. OTHER ELEMENTS: All indices except 5 are randomized. Define bounds (e.g., [0:200]).

4. NO CONFLICTS: Ensure index 5 constraint doesnt conflict with range constraints (100 must be within allowed range).

5. Test Case 1 - Fixed Value: Randomize 1000 times. For every randomization, verify a[5] == 100.

6. Test Case 2 - Other Elements Random: Verify at least one other index changes across randomizations. Not all elements fixed.

7. Test Case 3 - Bounds Check: If element bounds are [0:200], verify 100 is in range. If bounds are [0:50], constraint would be UNSAT (verify failure).

8. Test Case 4 - Index Boundary: Test with size=6 (exactly index 5 exists). Verify works.

9. Test Case 5 - Distribution: For other indices, verify values distributed across allowed range.

---

## Hints


