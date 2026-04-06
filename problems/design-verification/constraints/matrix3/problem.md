# Unique Row Maximums

**Domain:** design-verification — Constraints  
**Difficulty:** Hard  
**Topics:** Constraints, Matrix

---

## Problem Statement

Matrix Where Each Row Has Unique Maximum and All Maximums Distinct

Write uvm sv constraints to generate 2D array (M rows, N columns) with constraints: (1) Each row has exactly one maximum value (strict maximum, appears once in that row), (2) Maximum values across all rows are distinct (no two rows share same max value).

---

## Requirements

1. DIMENSIONS: M rows, N columns.

2. ROW MAXIMUM: For each row r, there exists exactly one maximum value. All other entries in row r are strictly less than this maximum.

3. STRICT MAXIMUM: Maximum appears exactly once per row. No ties. For row r: max_value > all other values in that row.

4. CROSS-ROW UNIQUENESS: Maximum values of all rows must be pairwise distinct. If row0 max=50, row1 max=75, etc., all different.

5. VALUE DOMAIN: Must support M distinct maxima plus smaller values. Example: M=4 requires 4 distinct max values. Domain [0:100] sufficient.

6. Test Case 1 - Row Unique Max: For each row, find maximum value. Count occurrences in that row. Assert count == 1.

7. Test Case 2 - Strict Inequality: For each row, verify all non-max elements < max element.

8. Test Case 3 - Cross-Row Uniqueness: Collect max value from each row. Verify all M max values are distinct.

9. Test Case 4 - UNSAT Corner: Restrict all values to be equal (e.g., all=5). Verify randomize fails (cant have unique max per row).

10. Test Case 5 - Distribution: Over randomizations, verify different values serve as row maxima.

---

## Hints


