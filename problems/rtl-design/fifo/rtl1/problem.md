# Edge / Toggle Detector

**Domain:** rtl-design — FIFO / Queue  
**Difficulty:** Easy  
**Topics:** RTL, Sequential Logic

---

## Problem Statement

Detect Rising, Falling, and Any Transition

Design synchronous RTL detecting transitions of a 1-bit input.\n\n' +
        '**Outputs:**\n' +
        '```\nrise_pulse:   1 cycle on 0→1\nfall_pulse:   1 cycle on 1→0\ntoggle_pulse: 1 cycle on any change\n```\n\n' +
        '**Constraints:**\n' +
        '- Uses previous-cycle register for comparison\n' +
        '- Single-cycle pulse on each detection

---

## Requirements

1. INPUTS: clk, rst_n (optional), sig_in.

2. OUTPUTS: rise_pulse, fall_pulse, toggle_pulse.

3. REGISTER: Capture previous value of sig_in each cycle.

4. TOGGLE: toggle_pulse asserts for 1 cycle when sig_in != sig_prev.

5. RISING: rise_pulse asserts for 1 cycle when sig_in=1 and sig_prev=0.

6. FALLING: fall_pulse asserts for 1 cycle when sig_in=0 and sig_prev=1.

7. Test Case - Rising: 0→1 transition produces rise_pulse=1 for one cycle.

8. Test Case - Falling: 1→0 transition produces fall_pulse=1 for one cycle.

9. Test Case - No Toggle: constant input produces no pulses.

---

## Hints

<details>
<summary>Hint 1</summary>
Use always_ff for sig_prev register.
</details>

<details>
<summary>Hint 2</summary>
Use combinational compares for pulse generation.
</details>
