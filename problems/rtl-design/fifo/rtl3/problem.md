# Sequence Detector FSM

**Domain:** rtl-design — FIFO / Queue  
**Difficulty:** Medium  
**Topics:** RTL, FSM

---

## Problem Statement

FSM Sequence Detector for 1,0,1,1,0

Implement an FSM detecting serial pattern `10110` with a 1-cycle match pulse.\n\n' +
        '**Constraints:**\n' +
        '- States represent progress through matching\n' +
        '- Define overlapping support\n' +
        '- Reset returns to IDLE

---

## Requirements

1. INPUTS: clk, rst_n, bit_in.

2. OUTPUT: match_pulse (1 cycle).

3. FSM: States represent progress through matching 10110.

4. OVERLAP: Define whether overlapping matches are supported and implement consistently.

5. RESET: Return to IDLE state.

6. Test Case - Match: stream contains 10110 → match_pulse asserted on final bit.

7. Test Case - No match: stream without 10110 → match_pulse never asserts.

---

## Hints

<details>
<summary>Hint 1</summary>
Use enum for states and always_ff for state register.
</details>
