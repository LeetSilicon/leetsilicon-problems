# Sudoku Puzzle Constraints

**Domain:** design-verification — Constraints  
**Difficulty:** Hard  
**Topics:** Constraints, Sudoku, Classic

---

## Problem Statement

Generate Valid Solved 9×9 Sudoku Puzzle

Write UVM SystemVerilog constraints to generate a valid, complete 9×9 Sudoku solution. Constraints: Each row contains 1-9 exactly once, each column contains 1-9 exactly once, each 3×3 box contains 1-9 exactly once.

---

## Requirements

1. GRID: 9×9 array, values 1-9.

2. ROW CONSTRAINT: For each row r, all 9 cells contain 1-9 exactly once (permutation).

3. COLUMN CONSTRAINT: For each column c, all 9 cells contain 1-9 exactly once.

4. BOX CONSTRAINT: Grid divided into 9 non-overlapping 3×3 boxes. Each box contains 1-9 exactly once.

5. BOX INDEXING: Box b = (row/3)*3 + (col/3). 9 boxes total (0-8).

6. SOLVER PERFORMANCE: Pure constraint solving for 9×9 Sudoku is computationally expensive. Consider symmetry breaking.

7. SYMMETRY BREAKING: Fix first row to 1,2,3,4,5,6,7,8,9 to eliminate equivalent solutions. Reduces search space.

8. Test Case 1 - Row Validity: For each row, verify all 9 values distinct and in [1:9].

9. Test Case 2 - Column Validity: For each column, verify all 9 values distinct and in [1:9].

10. Test Case 3 - Box Validity: For each 3×3 box, collect 9 values. Verify distinct and in [1:9].

11. Test Case 4 - Multiple Solutions: Randomize with different seeds. Verify different valid solutions generated.

12. Test Case 5 - Symmetry Break: If fixing first row, verify solutions still valid and diverse.

---

## Hints


