# Clock Divide by 3 (50%)

**Domain:** rtl-design — FIFO / Queue  
**Difficulty:** Hard  
**Topics:** RTL, Clock Divider

---

## Problem Statement

Divide-by-3 with ~50% Duty Cycle (Glitch-Free)

Implement a divide-by-3 clock divider with approximately 50% duty cycle using both edges and glitch-free construction.\n\n' +
        '**Constraints:**\n' +
        '- Output frequency = clk/3\n' +
        '- ~50% duty cycle\n' +
        '- No runt pulses (glitch-free)

---

## Requirements

1. INPUTS: clk, rst_n.

2. OUTPUT: clk_div3_50.

3. DIVIDE: Output frequency = clk/3.

4. DUTY: Approximately 50% duty.

5. GLITCH FREE: Output must not generate runt pulses.

6. Test Case - Output period equals 3 input cycles.

7. Test Case - Glitch-free enable/reset behavior: transitions occur only at intended clock boundaries with no runt pulses.

---

## Hints

<details>
<summary>Hint 1</summary>
Common approach: posedge counter + negedge capture + OR/AND combine.
</details>
