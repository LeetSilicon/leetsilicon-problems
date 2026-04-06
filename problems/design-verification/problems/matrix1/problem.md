# Binary Matrix with Sum Constraint

**Domain:** design-verification — Constraints  
**Difficulty:** Medium  
**Topics:** Constraints, Matrix, Sum

---

## Problem Statement

Generate M×N Binary Matrix with Total Sum < MAX_SUM

Write uvm sv constraints to generate M×N matrix where each element is {0,1} (binary). Constraint: Sum of all matrix elements must be less than MAX_SUM. Parameterize M, N, MAX_SUM. Avoid using .sum() reduction method.

---

## Requirements

1. DIMENSIONS: M rows, N columns. Total M*N elements.

2. ELEMENT VALUES: Each element mm[i][j] inside {0,1}. Binary only.

3. SUM CONSTRAINT: Sum of all M*N elements < MAX_SUM. Total_count_of_1s < MAX_SUM.

4. PARAMETERS: M, N, MAX_SUM defined as parameters or inputs. Ensure feasibility: 0 ≤ MAX_SUM ≤ M*N.

5. NO .sum() METHOD: Implement sum manually using loops/accumulators.

6. FEASIBILITY CASES: MAX_SUM=0 forces all zeros. MAX_SUM=M*N allows any matrix (no constraint).

7. Test Case 1 - Typical Constraint: M=4, N=4, MAX_SUM=6. Randomize. Count total 1s in matrix. Assert count < 6 (i.e., ≤5).

8. Test Case 2 - Boundary Zero: MAX_SUM=0. Verify all elements = 0 (sum=0 < 0 is false, but sum=0 and constraint<0 means must be 0).

9. Test Case 3 - Boundary Max: MAX_SUM=M*N+1. Any matrix allowed. Verify matrices with different counts of 1s generated.

10. Test Case 4 - UNSAT Detection: Set MAX_SUM negative (if signed). Verify randomize fails. Or add conflicting constraint: count>=MAX_SUM.

11. Test Case 5 - Distribution: Over many randomizations, verify sum values distributed over [0, MAX_SUM-1].

---

## Hints


