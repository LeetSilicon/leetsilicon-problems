# Map to N Non-Empty Queues

**Domain:** design-verification — Constraints  
**Difficulty:** Hard  
**Topics:** Constraints, Queue

---

## Problem Statement

Randomly Distribute Array into N Non-Empty Queues

Given an input array, randomly map elements to N output queues (N parameterized). Use UVM SystemVerilog constraints so that: (1) each input element appears in exactly one output queue, (2) all N output queues are non-empty, and (3) feasibility requires N ≤ input_size.

---

## Requirements

1. INPUT ARRAY: Fixed size array arr with M elements.

2. PARAMETER N: Number of output queues. Must satisfy N ≤ M for feasibility (cannot create N non-empty queues from fewer than N elements).

3. OUTPUT QUEUES: Array of queues out_q[N].

4. EXACT ASSIGNMENT: Each arr[i] assigned to exactly one out_q[k]. No element dropped, no duplication.

5. NON-EMPTY: For all k in [0:N-1], out_q[k].size() >= 1. Every output queue has at least one element.

6. DUPLICATE VALUES: If input has duplicate values, assignment is by position (index), not value. Value duplicates can go to same or different queues.

7. FEASIBILITY CONDITION: N ≤ M. If N > M, constraint is UNSAT (cannot create more non-empty queues than elements).

8. Test Case 1 - Exact Cover: After randomize, collect all elements from all output queues. Verify multiset equals input array.

9. Test Case 2 - Non-Empty Check: For each out_q[k], assert size() >= 1. All queues populated.

10. Test Case 3 - Feasibility Boundary: Set N=M (each queue gets exactly 1 element). Verify randomize succeeds.

11. Test Case 4 - Infeasibility: Set N=M+1. Verify randomize() fails (returns 0).

12. Test Case 5 - Distribution Variety: Randomize many times with N<M. Verify different elements go to different queues across runs (not deterministic).

---

## Hints


