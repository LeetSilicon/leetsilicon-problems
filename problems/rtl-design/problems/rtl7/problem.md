# Divisible by 3

**Domain:** rtl-design — FIFO / Queue  
**Difficulty:** Medium  
**Topics:** RTL, FSM, Arithmetic

---

## Problem Statement

FSM for Divisibility by 3 with Serial Bit Input

Implement an FSM with 3 remainder states that updates on each incoming bit and asserts output when remainder is 0.\n\n' +
        '**Constraints:**\n' +
        '- 3 states representing remainder mod 3\n' +
        '- Track only remainder, not the full number\n' +
        '- Start at remainder 0

---

## Requirements

1. INPUTS: clk, rst_n, bit_in.

2. OUTPUT: div_by_3.

3. FSM: 3 states represent remainder modulo 3.

4. UPDATE: On each bit, transition to next remainder state.

5. RESET: Start at remainder 0.

6. Test Case - Divisible value: serial stream representing 3, 6, or 9 eventually drives div_by_3=1 when remainder returns to 0.

7. Test Case - Non-divisible value: serial stream representing 1, 2, 4, or 5 leaves div_by_3=0.

8. Test Case - Reset: immediately after reset, the FSM is in remainder-0 state and div_by_3 reflects that state per the documented convention.

---

## Hints

<details>
<summary>Hint 1</summary>
Track only remainder, not the full number.
</details>
