# No Overlapping Instructions

**Domain:** design-verification — Constraints  
**Difficulty:** Hard  
**Topics:** Constraints, Pipeline, Latency

---

## Problem Statement

Generate Instruction Schedule with Latency-Based Non-Overlap Constraints

Write uvm sv constraints to generate instruction schedule where each instruction has execution latency. Constraint: No two identical instructions (same opcode) can have overlapping execution windows. Different opcodes can overlap. Instructions: ADD, SUB, MUL, NOP with defined latencies.

---

## Requirements

1. INSTRUCTIONS: {ADD, SUB, MUL, NOP} with execution latencies. Define latencies: ADD=3 cycles, SUB=2 cycles, MUL=5 cycles, NOP=1 cycle (example values).

2. ISSUE RATE: One instruction can issue per cycle (or define rate). Issues are scheduled at specific start times.

3. EXECUTION WINDOW: Instruction issued at time t with latency L occupies cycles [t, t+L-1].

4. NON-OVERLAP RULE: Two instructions with same opcode cannot have overlapping execution windows. If ADD issues at t=0 (occupies 0-2), next ADD cannot issue before t=3.

5. DIFFERENT OPCODES: Different opcodes CAN overlap. ADD and MUL can execute simultaneously.

6. SCHEDULE LENGTH: Define total cycles T (e.g., T=20).

7. REPRESENTATION: Schedule as array of issued instructions per cycle, or array of (opcode, start_time) pairs.

8. Test Case 1 - No Same-Opcode Overlap: For each opcode, find all issue times. Verify for same opcode, if issued at t1 and t2 (t1<t2), then t2 >= t1 + latency(opcode).

9. Test Case 2 - Different Opcode Overlap Allowed: Verify cases where ADD and MUL overlap (issued such that execution windows intersect).

10. Test Case 3 - Boundary: Set latency=1 for all. Overlap constraint becomes 

11.  (trivial, always satisfied if one issue per cycle).

12. Test Case 4 - Dense Schedule: Short latencies, long schedule. Verify many instructions scheduled without conflicts.

13. Test Case 5 - Latency Respect: For opcode with latency L, verify minimum spacing between consecutive issues is L cycles.

---

## Hints

<details>
<summary>Hint 1</summary>
Stateful generation (easiest): Maintain per-opcode 
</details>
