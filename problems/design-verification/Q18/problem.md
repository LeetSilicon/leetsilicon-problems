# Sub-Square Maximum Constraint

**Domain:** design-verification — Constraints  
**Difficulty:** Hard  
**Topics:** Constraints, Matrix

---

## Problem Statement

Odd-Sized Matrix with Unique Sub-Square Maximums

Write uvm sv constraints to generate odd-sized square matrix where: (1) Divide matrix into non-overlapping sub-squares, (2) Each sub-square has exactly one unique maximum, (3) All other elements in sub-square less than max, (4) Maximum values across all sub-squares are distinct, (5) Design scales to 32-bit integer limits.

---

## Requirements

1. MATRIX SIZE: Odd dimension N×N (e.g., N=9 for 9×9 matrix).

2. SUB-SQUARE PARTITIONING: Define partitioning scheme. Example: For N=9, divide into 9 non-overlapping 3×3 sub-squares. Or define other tiling. Document clearly.

3. UNIQUE MAX PER SUB-SQUARE: Each sub-square region has exactly one maximum element (strict, appears once). All other elements in that region < max.

4. CROSS-REGION UNIQUENESS: Maximum values from all sub-squares are pairwise distinct.

5. SCALING TO 32-BIT: Avoid combinatorial explosion. Use construction or efficient encoding. dont create factorial-sized domains.

6. REGION MEMBERSHIP: Define function region(i,j) returning which sub-square cell (i,j) belongs to.

7. Test Case 1 - Sub-Square Max Unique: For each sub-square region, find max. Verify appears exactly once in that region.

8. Test Case 2 - Strict Inequality: Within each region, verify all non-max elements < max.

9. Test Case 3 - Maxima Distinct: Collect max from each region. Verify all different.

10. Test Case 4 - Boundary Regions: Verify edge and corner sub-squares handled correctly.

11. Test Case 5 - Large Matrix: Test with N=15 or N=21. Verify solver completes.

---

## Hints


