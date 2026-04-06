# Pattern in Last N

**Domain:** rtl-design — FIFO / Queue  
**Difficulty:** Medium  
**Topics:** RTL, Shift Register

---

## Problem Statement

Detect Pattern 10110 Anywhere in Last N Samples

Use an N-bit shift register and combinational decode to detect a K-bit pattern at any alignment in the window.\n\n' +
        '**Constraints:**\n' +
        '- Parameterizable N (window), K=5, PATTERN=10110\n' +
        '- Compare each K-bit slice, OR all matches\n' +
        '- found=0 once pattern shifts out of window

---

## Requirements

1. PARAM: N (window size), K=5, PATTERN=5b10110.

2. INPUTS: clk, rst_n, bit_in.

3. OUTPUT: found.

4. SHIFT: Maintain last N samples in a shift register.

5. DECODE: Compare each K-bit slice to PATTERN and OR matches.

6. Test Case - Found: pattern appears within last N → found=1.

7. Test Case - Shift out: once pattern moves out of window → found=0.

---

## Hints

<details>
<summary>Hint 1</summary>
Generate compares with a for-generate loop.
</details>
