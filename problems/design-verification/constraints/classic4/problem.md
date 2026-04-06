# Magic Square

**Domain:** design-verification — Constraints  
**Difficulty:** Hard  
**Topics:** Constraints, Magic Square

---

## Problem Statement

Generate N×N Magic Square with All Sums Equal

Write uvm sv constraints to create magic square of size N where each row, column, and both main diagonals sum to the same magic constant. Use numbers 1 to N². All numbers appear exactly once. Start with N=3 (magic constant=15).

---

## Requirements

1. SIZE: N×N square (parameterized). Start with N=3. Note: N=2 has no magic square. N=1 is trivial.

2. VALUES: Use integers 1 to N² each exactly once.

3. MAGIC CONSTANT: S = N*(N²+1)/2. For N=3: S = 3*10/2 = 15.

4. ROW SUMS: Each row sums to S.

5. COLUMN SUMS: Each column sums to S.

6. DIAGONAL SUMS: Both main diagonals sum to S. Main diagonal: (0,0), (1,1), ..., (N-1,N-1). Anti-diagonal: (0,N-1), (1,N-2), ..., (N-1,0).

7. UNIQUENESS: All N² cells contain distinct values from [1:N²].

8. SYMMETRY BREAKING: Fix one cell (e.g., grid[0][0]=1) or first row ordering to reduce equivalent solutions.

9. Test Case 1 - Value Uniqueness: Flatten grid. Verify all values in [1:N²] and all distinct.

10. Test Case 2 - Row Sums: For each row, sum all elements. Assert sum == S.

11. Test Case 3 - Column Sums: For each column, assert sum == S.

12. Test Case 4 - Diagonal Sums: Main diagonal sum == S. Anti-diagonal sum == S.

13. Test Case 5 - Known N=3 Solution: Verify generated solution matches known magic squares (e.g., 2,7,6 / 9,5,1 / 4,3,8).

---

## Hints


