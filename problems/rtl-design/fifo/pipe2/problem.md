# Pipeline Registers with Flush/Stall

**Domain:** rtl-design — FIFO / Queue  
**Difficulty:** Medium  
**Topics:** Pipeline, Control, Design

---

## Problem Statement

Implement Pipeline Stage Registers with Flush and Stall Controls

Design pipeline registers supporting stall (hold) and flush (NOP injection).\n\n' +
        '**Behavior:**\n' +
        '```\nStall=1 → hold current value\nFlush=1 → load NOP (all writes disabled)\nBoth=1  → defined priority (document choice)\n```\n\n' +
        '**Constraints:**\n' +
        '- Define simultaneous stall+flush priority\n' +
        '- NOP: valid=0, all control writes=0\n' +
        '- Reset to safe NOP state

---

## Requirements

1. PIPELINE REGISTER CONTENTS: Typical fields: (1) data/instruction, (2) control signals, (3) valid bit, (4) other metadata (e.g., PC, destination register).

2. STALL OPERATION: Input 

3.  signal. When stall=1, pipeline register holds current value (does not update from input). Implement as clock enable: enable = !stall. Register retains value for stall duration.

4. FLUSH OPERATION: Input 

5.  signal. When flush=1, pipeline register loads NOP/bubble values instead of input. NOP typically: valid=0, control signals=0 (no side effects).

6. SIMULTANEOUS STALL+FLUSH: Define priority when both stall=1 and flush=1 asserted. Options: (1) Flush takes priority (overrides stall), (2) Stall takes priority (ignores flush). Common: flush priority (flush always wins). Document clearly.

7. VALID BIT HANDLING: On normal operation: valid passes through. On flush: valid=0 (invalidate stage). On stall: valid holds.

8. RESET: On reset, initialize register to NOP/safe state (valid=0, controls inactive).

9. PARAMETERIZATION: Support parameterizable data width and control signal width.

10. Test Case 1 - Stall Holds Values: Load register with instruction A and control signals. Assert stall=1 for 3 cycles. Expected: Register outputs unchanged for all 3 cycles (holds instruction A).

11. Test Case 2 - Flush Inserts Bubble: Load register with valid instruction B. Next cycle, assert flush=1. Expected: Register outputs become NOP (valid=0, controls=0). Valid bit cleared.

12. Test Case 3 - Normal Operation: Load instruction C into register without stall or flush. Next cycle: register outputs instruction C (passed through normally).

13. Test Case 4 - Simultaneous Stall+Flush: Load instruction D. Assert both stall=1 and flush=1. Expected: Behavior matches documented priority. If flush priority: output is NOP. If stall priority: output is held instruction D.

14. Test Case 5 - Sequential Operations: Load instruction E, stall for 2 cycles, flush, load instruction F. Verify correct sequence: E held, then NOP, then F.

---

## Hints


