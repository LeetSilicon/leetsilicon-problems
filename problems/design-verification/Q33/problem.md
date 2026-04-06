# Tic-Tac-Toe Constraints

**Domain:** design-verification — Constraints  
**Difficulty:** Medium  
**Topics:** Constraints, Game, Tic-Tac-Toe

---

## Problem Statement

Generate Valid Tic-Tac-Toe Board State with Reachability Constraints

Write SystemVerilog UVM constraints for 3×3 Tic-Tac-Toe board. Define encoding (empty/X/O). Optionally enforce reachability: board represents valid game state (legal move sequence exists, turn counts correct, at most one winner).

---

## Requirements

1. BOARD SIZE: 3×3 grid (9 cells).

2. CELL ENCODING: Each cell in {EMPTY, X, O}. Define enum or integer encoding (e.g., 0=EMPTY, 1=X, 2=O).

3. SIMPLE BOARD (Option 1): Any combination of EMPTY/X/O allowed. No game rules enforced. Just randomize cells.

4. REACHABLE BOARD (Option 2): Board must be reachable through legal game play. Constraints: (1) Turn count: #X == #O or #X == #O+1 (X moves first), (2) At most one winner: not (X wins AND O wins), (3) If X wins, no more O moves after (optional).

5. WINNER DETECTION: Check rows, columns, diagonals for three-in-a-row.

6. TURN COUNT: count(X) - count(O) in {0, 1}. If X starts, X can have at most one more mark than O.

7. TERMINAL vs NON-TERMINAL (Optional): Specify if board is terminal (game over) or mid-game (can continue).

8. Test Case 1 - Reachable Turn Count: Count X and O marks. Verify count(X) == count(O) or count(X) == count(O)+1.

9. Test Case 2 - Winner Logic: Check all 8 win conditions (3 rows, 3 cols, 2 diags). Verify at most one player wins.

10. Test Case 3 - Empty Board: All cells EMPTY. Valid reachable state (game start).

11. Test Case 4 - Full Board: All 9 cells filled. Verify turn count valid (5 X, 4 O).

12. Test Case 5 - Randomization Variety: Over many randomizations, generate mix of empty, partial, and full boards with different patterns.

---

## Hints


