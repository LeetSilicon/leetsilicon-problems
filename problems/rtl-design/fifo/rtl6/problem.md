# Binary to Gray

**Domain:** rtl-design — FIFO / Queue  
**Difficulty:** Easy  
**Topics:** RTL, Counter, Gray Code

---

## Problem Statement

Generate Gray Code from a Binary Counter

Implement a binary counter and output Gray code equivalent each cycle.\n\n' +
        '**Conversion:** `gray = bin ^ (bin >> 1)`\n\n' +
        '**Constraints:**\n' +
        '- Parameterizable W (counter width)\n' +
        '- Binary counter registered, Gray derived combinationally

---

## Requirements

1. PARAM: W (counter width).

2. INPUTS: clk, rst_n, enable (optional).

3. OUTPUTS: bin_count[W-1:0], gray_count[W-1:0].

4. UPDATE: If enabled, bin_count increments each cycle.

5. CONVERT: gray_count derived from bin_count.

6. Test Case - Reset: bin=0 => gray=0.

7. Test Case - Sequence: verify first few gray outputs.

---

## Hints

<details>
<summary>Hint 1</summary>
Keep bin_count registered; compute gray combinationally.
</details>
