# Clock Divide by N

**Domain:** rtl-design — FIFO / Queue  
**Difficulty:** Medium  
**Topics:** RTL, Clock Divider, Parameterization

---

## Problem Statement

Generic Divide-by-N with ~50% Duty Cycle

Implement programmable or parameterized divide-by-N clock divider handling even and odd N.\n\n' +
        '**Constraints:**\n' +
        '- Even N: toggle every N/2 cycles\n' +
        '- Odd N: use dual-edge method or define duty strategy\n' +
        '- Parameterizable or runtime-configurable N

---

## Requirements

1. PARAM or INPUT: N/div_value.

2. INPUTS: clk, rst_n.

3. OUTPUT: clk_divN.

4. EVEN: Toggle every N/2 cycles.

5. ODD: Use dual-edge method (or define duty-cycle strategy).

6. Test Case - N=4 gives clk/4 with 50% duty.

7. Test Case - N=5 gives clk/5 with defined duty characteristics.

---

## Hints

<details>
<summary>Hint 1</summary>
Separate counter/state generation from output register.
</details>
