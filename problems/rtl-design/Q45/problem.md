# Gray Pointer for CDC

**Domain:** rtl-design — FIFO / Queue  
**Difficulty:** Medium  
**Topics:** RTL, CDC, Gray Code

---

## Problem Statement

Gray Code Pointers for CDC (FIFO-style)

Implement binary pointer + Gray pointer generation suitable for async FIFO pointer synchronization.\n\n' +
        '**Constraints:**\n' +
        '- Gray pointer changes by 1 bit per increment\n' +
        '- Binary pointer for internal use, Gray for CDC\n' +
        '- Validate: gray = bin ^ (bin >> 1)

---

## Requirements

1. INPUTS: clk, rst_n, inc.

2. OUTPUTS: bin_ptr, gray_ptr.

3. BINARY PTR: bin_ptr increments only when inc=1 and wraps naturally at the pointer width.

4. GRAY: gray_ptr changes by 1 bit per increment.

5. Test Case - Reset: bin_ptr and gray_ptr both clear to 0.

6. Test Case - Formula: validate gray_ptr = bin_ptr ^ (bin_ptr >> 1) across several increments.

7. Test Case - One-bit change: successive Gray values differ by exactly one bit when inc=1.

---

## Hints

<details>
<summary>Hint 1</summary>
Use registered binary pointer; compute gray combinationally.
</details>
