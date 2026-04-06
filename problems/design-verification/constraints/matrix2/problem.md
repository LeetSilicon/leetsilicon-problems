# Adjacent Elements Distinct

**Domain:** design-verification — Constraints  
**Difficulty:** Hard  
**Topics:** Constraints, Matrix

---

## Problem Statement

Generate m×m Matrix with All Adjacent Elements Different

Write uvm sv constraints to generate square matrix (m×m) where all adjacent elements are distinct. Adjacent means 4-neighborhood (up, down, left, right). Diagonals not considered adjacent unless specified. Include boundary elements (edges have fewer neighbors).

---

## Requirements

1. MATRIX SIZE: Square m×m (e.g., m=4 gives 4×4=16 elements).

2. ADJACENCY: 4-connected neighborhood. Cell (i,j) adjacent to (i-1,j), (i+1,j), (i,j-1), (i,j+1) if they exist.

3. DISTINCT REQUIREMENT: For all adjacent pairs (a,b), a ≠ b.

4. BOUNDARY HANDLING: Edge and corner cells have fewer neighbors. Only compare with existing neighbors.

5. VALUE DOMAIN: Define range (e.g., [0:10]). Must be large enough: minimum domain size = max_degree + 1. For grid, degree ≤4, so need ≥3 colors theoretically, but ≥5 recommended.

6. DIAGONAL ADJACENCY (DEFAULT: NO): By default, diagonals not adjacent. If including diagonals (8-neighborhood), state explicitly.

7. Test Case 1 - Adjacency Check: For each cell (i,j), compare with up/down/left/right neighbors (if exist). Assert all pairs different.

8. Test Case 2 - Small Domain UNSAT: Restrict values to {0,1} (2 values). For m≥3, verify randomize fails (graph coloring requires ≥3 colors for grid).

9. Test Case 3 - Solver Performance: m=5 (25 cells). Randomize 50 times. Verify completes without timeout.

10. Test Case 4 - Boundary Cells: Verify corner cells (4 in m×m) and edge cells checked correctly (dont over-constrain non-existent neighbors).

11. Test Case 5 - Distribution: Over randomizations, verify values distributed (not always same value assignments).

---

## Hints


