# Knight

**Domain:** design-verification — Constraints  
**Difficulty:** Hard  
**Topics:** Constraints, Knight

---

## Problem Statement

Generate Knight

Write uvm sv constraints to solve Knight's Tour problem: knight visits every square on chessboard exactly once using legal knight moves. Represent as sequence of 64 positions with knight-move adjacency between successive positions. Pure constraints very difficult; consider algorithmic generation.

---

## Requirements

1. BOARD SIZE: Standard 8×8 (64 squares). Can start with smaller (e.g., 5×5) for testing.

2. TOUR LENGTH: 64 moves (for 8×8). Visit each square exactly once.

3. POSITION REPRESENTATION: Each position as (row, col) pair or single index 0-63.

4. KNIGHT MOVE: From (r,c), knight moves to (r±1,c±2) or (r±2,c±1). 8 possible moves per position (if on board).

5. ADJACENCY: For sequence pos[0], pos[1], ..., pos[63], each consecutive pair must be valid knight move.

6. UNIQUENESS: All 64 positions must be distinct (visit each square once).

7. STARTING POSITION: Can be fixed (e.g., (0,0)) or random.

8. PURE CONSTRAINTS DIFFICULTY: This is extremely hard for solvers. Recommend algorithmic generation (Warnsdorff heuristic).

9. Test Case 1 - Move Validity: For each consecutive pair pos[i], pos[i+1], verify delta is valid knight move.

10. Test Case 2 - Uniqueness: Verify all 64 positions distinct.

11. Test Case 3 - Full Coverage: Verify set of positions equals all board squares.

12. Test Case 4 - Start Position: Test with fixed start (0,0) and with random start.

13. Test Case 5 - Smaller Board: 5×5 board (25 squares) as simpler Test Case.

---

## Hints


