# Two Matrices Unique Minimums

**Domain:** design-verification — Constraints  
**Difficulty:** Medium  
**Topics:** Constraints, Matrix, Minimum

---

## Problem Statement

Generate Two 3×3 Matrices with Different Minimum Values

Write SystemVerilog uvm constraints to generate two 3×3 matrices such that the minimum value in matrix A differs from the minimum value in matrix B. Optionally enforce minimum uniqueness within each matrix.

---

## Requirements

1. TWO MATRICES: matA[3][3] and matB[3][3].

2. ELEMENT RANGE: Define value domain (e.g., int [0:100]).

3. MINIMUM VALUES: minA = minimum element in matA. minB = minimum element in matB.

4. UNIQUENESS ACROSS MATRICES: minA ≠ minB. The two minimum values must differ.

5. WITHIN-MATRIX UNIQUENESS (Optional): Minimum value in each matrix appears exactly once (strict minimum). Not required unless specified.

6. VALUE REPETITION: Values can repeat within and across matrices (unless uniqueness enforced).

7. Test Case 1 - Minimum Computation: After randomize, compute minA = min(matA). Compute minB = min(matB). Verify minA ≠ minB.

8. Test Case 2 - Boundary Values: Force minA=0 (add temp constraint). Verify minB ≠ 0 and solver succeeds.

9. Test Case 3 - UNSAT: Constrain all elements in both matrices to equal same value (e.g., all=50). Verify randomize fails (would force minA==minB).

10. Test Case 4 - Distribution: Over many randomizations, verify minA and minB span domain (not stuck at same values).

11. Test Case 5 - Within-Matrix Min Unique (if enforced): For each matrix, verify minimum appears exactly once.

---

## Hints


