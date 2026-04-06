# 3D Array All Unique

**Domain:** design-verification — Constraints  
**Difficulty:** Medium  
**Topics:** Constraints, 3D Array, Uniqueness

---

## Problem Statement

Generate 3×3×3 Array with All 27 Elements Unique

Write UVM SV constraint to randomize a 3-dimensional array (3×3×3 = 27 elements) such that all elements are distinct. No two elements can have the same value. Value domain must support at least 27 unique values.

---

## Requirements

1. ARRAY DIMENSIONS: 3D array: a[3][3][3]. Total 27 elements.

2. UNIQUENESS: All 27 elements must be pairwise unique. No value appears more than once.

3. VALUE DOMAIN: Must support at least 27 distinct values. Example: int [0:255] provides 256 values (sufficient). Minimum domain: [0:26].

4. CONSTRAINT FORM: Apply unique constraint across all 27 elements. May need to flatten 3D indices.

5. NO OVER-CONSTRAINT: Do not add unnecessary constraints (like sorted order) unless required. Only enforce uniqueness.

6. Test Case 1 - Uniqueness Verification: Flatten array to 1D list of 27 values. Assert all unique using set or histogram (all counts == 1).

7. Test Case 2 - Domain Too Small: Restrict values to [0:10] (only 11 values < 27 required). Verify randomize() fails (UNSAT).

8. Test Case 3 - Distribution Check: Over 100 randomizations, verify values distributed across domain (not clustered in small range).

9. Test Case 4 - All Values Used: If domain size == 27 exactly, verify all 27 values from domain appear (permutation of domain).

10. Test Case 5 - Index Access: Verify a[0][0][0], a[2][2][2], a[1][2][0] all different values.

---

## Hints


