# Instruction Repetition Constraints

**Domain:** design-verification — Constraints  
**Difficulty:** Hard  
**Topics:** Constraints, Pipeline, Instructions

---

## Problem Statement

Instruction Stream with Repetition Window Constraints

Write uvm sv constraints to generate instruction stream from {ADD, SUB, MUL, NOP} with rules: (1) ADD cannot repeat within last 3 cycles, (2) SUB cannot repeat within last 3 valid instructions, (3) NOP not allowed at all.

---

## Requirements

1. INSTRUCTION SET: {ADD, SUB, MUL}. NOP excluded entirely.

2. STREAM LENGTH: Define T cycles (e.g., T=30 for testing).

3. ADD SPACING: If instr[t]==ADD, then instr[t-1], instr[t-2], instr[t-3] must not be ADD (cycle-based window).

4. SUB SPACING: SUB cannot repeat within last 3 valid (non-bubble) instructions. Define 

5.  (all instructions valid or handle bubbles).

6. NOP EXCLUSION: No instruction can be NOP. constraint { instr[t] != NOP; }

7. Test Case 1 - ADD Window: Generate sequence length 30. For each t where instr[t]==ADD, verify instr[t-1], instr[t-2], instr[t-3] ≠ ADD.

8. Test Case 2 - SUB Window: Track last 3 valid SUB positions. Verify spacing >= 3 valid instructions.

9. Test Case 3 - No NOP: Verify instr[] contains only {ADD, SUB, MUL}.

10. Test Case 4 - Feasibility: With 3 opcodes and spacing constraints, verify randomize succeeds over many seeds.

11. Test Case 5 - Distribution: Over many runs, verify all 3 opcodes appear (not stuck on one).

---

## Hints

<details>
<summary>Hint 1</summary>
Stateful generation: Maintain history queue. Generate one instruction at a time with constraints against history.
</details>
