# Fibonacci Generator

**Domain:** rtl-design — FIFO / Queue  
**Difficulty:** Medium  
**Topics:** RTL, Datapath, Registers

---

## Problem Statement

Fibonacci Sequence Generator with Enable

Implement a Fibonacci generator advancing only when enable is asserted.\n\n' +
        '**State:** `a, b registers; next = a + b`\n\n' +
        '**Constraints:**\n' +
        '- Parameterizable output width W\n' +
        '- enable=0 holds output\n' +
        '- Reset initializes to produce 0, 1, 1, 2, 3, 5, ...

---

## Requirements

1. PARAM: W (output width).

2. INPUTS: clk, rst_n, enable.

3. OUTPUT: fib_out.

4. STATE: Two registers a,b; next=a+b.

5. UPDATE: If enable, a<=b, b<=a+b.

6. RESET: Initialize to produce sequence starting 0,1,... (define exact first outputs).

7. Test Case - Hold: enable=0 holds outputs.

8. Test Case - Resume: enable=1 continues sequence.

---

## Hints

<details>
<summary>Hint 1</summary>
Use two always_ff regs and one combinational add.
</details>
