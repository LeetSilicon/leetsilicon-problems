# Edge Detector

**Domain:** rtl-design — FIFO / Queue  
**Difficulty:** Easy  
**Topics:** Edge Detection, Sequential, Design

---

## Problem Statement

Implement Rising and Falling Edge Detector

Design an edge detector generating single-cycle pulses on rising (0→1) and falling (1→0) transitions.\n\n' +
        '**Logic:**\n' +
        '```\nrise_pulse = sig_in & ~sig_prev\nfall_pulse = ~sig_in & sig_prev\n```\n\n' +
        '**Constraints:**\n' +
        '- Single-cycle pulse per detection\n' +
        '- No re-triggering while input holds steady\n' +
        '- Reset: sig_prev = 0

---

## Requirements

1. INPUT: Signal to monitor for edges 

2.  (1 bit).

3. OUTPUTS: (1) rise_pulse (1 bit): Pulses high for one cycle on rising edge, (2) fall_pulse (1 bit): Pulses high for one cycle on falling edge.

4. RISING EDGE DETECTION: Rising edge occurs when signal transitions from 0 to 1. Detect by comparing current value with previous (sampled last cycle). Condition: sig_in=1 AND sig_prev=0.

5. FALLING EDGE DETECTION: Falling edge occurs when signal transitions from 1 to 0. Condition: sig_in=0 AND sig_prev=1.

6. PREVIOUS SAMPLE REGISTER: Maintain register 

7.  storing value of sig_in from previous clock cycle. Updated every cycle.

8. SINGLE-CYCLE PULSE: Edge pulses asserted for exactly one clock cycle on detection, then deassert (even if input remains at new value).

9. NO RE-TRIGGERING: If input holds high or low, no repeated pulses. Only transitions generate pulses.

10. RESET: On reset, initialize sig_prev to known value (typically 0). No pulses generated at reset.

11. Test Case 1 - Rising Edge: sig_in sequence: 0, 0, 1, 1, 1. Expected: rise_pulse=1 at cycle 2 (transition 0→1). rise_pulse=0 at cycles 0,1,3,4.

12. Test Case 2 - Falling Edge: sig_in sequence: 1, 1, 0, 0, 0. Expected: fall_pulse=1 at cycle 2 (transition 1→0). fall_pulse=0 at cycles 0,1,3,4.

13. Test Case 3 - Multiple Edges: sig_in sequence: 0, 1, 0, 1, 0. Expected: rise_pulse at cycles 1,3. fall_pulse at cycles 2,4.

14. Test Case 4 - No Edges: sig_in holds 0 for 5 cycles, then holds 1 for 5 cycles. Expected: rise_pulse=1 at transition cycle only. No repeated pulses.

15. Test Case 5 - Reset: Assert reset with sig_in=1. Expected: sig_prev=0 after reset. If sig_in remains 1, next cycle: rise_pulse=1 (detects 0→1 transition from reset state).

---

## Hints

<details>
<summary>Hint 1</summary>
Previous sample register: reg sig_prev; always_ff @(posedge clk) if (rst) sig_prev <= 0; else sig_prev <= sig_in;
</details>

<details>
<summary>Hint 2</summary>
Rising edge detection: assign rise_pulse = sig_in & ~sig_prev; Combinational logic.
</details>

<details>
<summary>Hint 3</summary>
Falling edge detection: assign fall_pulse = ~sig_in & sig_prev;
</details>

<details>
<summary>Hint 4</summary>
Both edges: assign rise_pulse = sig_in & ~sig_prev; assign fall_pulse = ~sig_prev & sig_in; Wait, thats wrong for fall. Correct: assign fall_pulse = ~sig_in & sig_prev;
</details>

<details>
<summary>Hint 5</summary>
Initialization: On reset, sig_prev=0 ensures first sample of sig_in is compared against 0. If sig_in=1 at reset release, rise_pulse will detect it.
</details>

<details>
<summary>Hint 6</summary>
Alternative: Use posedge/negedge in always block (not synthesizable in all tools): always @(posedge sig_in) rise_pulse <= 1; But this is not recommended for RTL. Use comparison method.
</details>

<details>
<summary>Hint 7</summary>
Applications: Detecting button presses, synchronizing asynchronous signals, triggering on signal transitions.
</details>

<details>
<summary>Hint 8</summary>
Synchronization: If sig_in is asynchronous to clock, add synchronizer (2-stage flip-flop) before edge detector to prevent metastability.
</details>
