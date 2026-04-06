# 8 Queens Problem

**Domain:** design-verification — Constraints  
**Difficulty:** Hard  
**Topics:** Constraints, Queens

---

## Problem Statement

Solve 8 Queens Problem Using Constraints

Write uvm sv constraints to Place 8 queens on 8×8 chessboard such that no two queens attack each other. Queens attack same row, column, or diagonal. Model as constraint problem: assign column position for each row\'s queen.

---

## Requirements

1. BOARD: 8×8 chessboard.

2. QUEENS: 8 queens, one per row.

3. MODELING: Use array col[8] where col[r] = column position of queen in row r. Domain: col[r] in [0:7].

4. NO COLUMN CONFLICTS: No two queens in same column. unique{col}.

5. NO DIAGONAL CONFLICTS: No two queens on same diagonal. For rows i,j: abs(col[i]-col[j]) ≠ abs(i-j).

6. Test Case 1 - No Column Duplicates: Verify unique(col). All 8 values in [0:7] and distinct.

7. Test Case 2 - Diagonal Check: For all pairs (i,j) with i<j, verify abs(col[i]-col[j]) ≠ abs(i-j).

8. Test Case 3 - Solution Validity: Place queens on board per col[] assignments. Visually verify no attacks.

9. Test Case 4 - Multiple Solutions: Randomize with different seeds. Verify different valid placements (8-Queens has 92 solutions, 12 unique under symmetry).

10. Test Case 5 - UNSAT: Add conflicting constraint (e.g., col[0]==col[1]). Verify randomize fails.

---

## Hints


