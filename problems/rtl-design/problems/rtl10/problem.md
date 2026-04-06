# Clock Divide by 2

**Domain:** rtl-design — FIFO / Queue  
**Difficulty:** Easy  
**Topics:** RTL, Clock Divider

---

## Problem Statement

Divide-by-2 Clock Divider

Implement divide-by-2 clock using a toggling flip-flop.\n\n' +
        '**Constraints:**\n' +
        '- Output toggles on each rising edge of clk\n' +
        '- 50% duty cycle\n' +
        '- Define initial state on reset

---

## Requirements

1. INPUTS: clk, rst_n.

2. OUTPUT: clk_div2.

3. TOGGLE: clk_div2 toggles on each rising edge of clk.

4. RESET: Define initial output state.

5. Test Case - Frequency: output frequency is clk/2.

6. Test Case - Reset: after reset, clk_div2 returns to the documented initial state before toggling resumes.

---

## Hints

<details>
<summary>Hint 1</summary>
clk_div2 <= ~clk_div2 in always_ff.
</details>
