# Two Arrays with Sorted Relationship

**Domain:** design-verification — Constraints  
**Difficulty:** Hard  
**Topics:** Constraints, Dynamic Array, Sorting

---

## Problem Statement

Generate Two Dynamic Arrays with Size, Sorted, and Membership Constraints

Generate two related dynamic arrays using UVM SystemVerilog constraints: (1) array1 size is in [6:9], (2) array2 size equals array1 size, (3) array1 is sorted in ascending order, and (4) every array2 element is a member of array1.

---

## Requirements

1. ARRAY1 SIZE: Size must be in range [6:9]. Can be 6, 7, 8, or 9 elements.

2. ARRAY2 SIZE: Must equal array1.size(). Both arrays same length.

3. SORTING: array1 sorted in ascending order. For all i, array1[i] ≤ array1[i+1]. Non-strictly ascending (duplicates allowed) unless specified otherwise.

4. MEMBERSHIP: Every element in array2 must exist in array1. array2[i] inside {array1} for all i.

5. STRICTLY ASCENDING (OPTIONAL): If requiring strict: array1[i] < array1[i+1]. Document choice. Default: non-decreasing (≤).

6. VALUE DOMAIN: Define element ranges (e.g., [0:100]) for both arrays.

7. MULTIPLICITY: array2 can have duplicates from array1. Not required to be permutation, just subset.

8. Test Case 1 - Size Range: Randomize 100 times. Verify array1.size() in {6,7,8,9}. All values in range appear.

9. Test Case 2 - Equal Sizes: For each randomization, assert array1.size() == array2.size().

10. Test Case 3 - Sorted Property: For array1, verify for all i: array1[i] ≤ array1[i+1] (or < if strict).

11. Test Case 4 - Membership: For each array2[i], verify value exists in array1. Check array2[i] in set(array1).

12. Test Case 5 - Multiplicity Handling: array1=[1,2,3,4,5,6]. array2 can be [2,2,3,4,5,6] (2 appears twice). Both 2s are valid (both from array1).

---

## Hints


