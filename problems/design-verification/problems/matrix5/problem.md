# Matrix 90° Rotation

**Domain:** design-verification — Constraints  
**Difficulty:** Medium  
**Topics:** Constraints, Matrix, Rotation

---

## Problem Statement

Generate Matrix and Its 90° Counterclockwise Rotation

Write uvm sv constraints to generate square matrix A and its 90° counterclockwise rotated version B. Establish constraint relationship between A and B such that B is exact rotation of A. Support parameterizable matrix size N.

---

## Requirements

1. MATRIX SIZE: Square N×N. Both A and B are N×N.

2. ROTATION: B is A rotated 90° counterclockwise (CCW).

3. ROTATION MAPPING: For N×N, CCW rotation: B[N-1-j][i] = A[i][j] for all i,j.

4. CONSTRAINT vs PROCEDURAL: Clarify if both matrices randomized independently then constrained, or A randomized then B derived procedurally.

5. BIJECTIVITY: Rotation preserves all elements. Multiset(A) == Multiset(B).

6. Test Case 1 - Mapping Verification: After randomize, verify for all i,j: B[N-1-j][i] == A[i][j].

7. Test Case 2 - Small Sizes: N=1 (trivial), N=2. Verify rotation correct.

8. Test Case 3 - Multiset Equality: Flatten both matrices to 1D lists. Sort both. Assert equal.

9. Test Case 4 - N=3 Example: A={{1,2,3},{4,5,6},{7,8,9}} → B={{3,6,9},{2,5,8},{1,4,7}}. Verify manually.

10. Test Case 5 - Multiple Randomizations: Randomize A differently, verify B tracks correctly.

---

## Hints


