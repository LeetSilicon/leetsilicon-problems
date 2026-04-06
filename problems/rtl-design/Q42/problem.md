# Reset Sync

**Domain:** rtl-design — FIFO / Queue  
**Difficulty:** Medium  
**Topics:** RTL, Reset

---

## Problem Statement

Async Assert, Sync Deassert Reset

Implement reset circuitry that asserts asynchronously but deasserts synchronously using a 2-flop synchronizer chain.\n\n' +
        '**Constraints:**\n' +
        '- Assert: immediately when async_rst_n goes low\n' +
        '- Deassert: only on clock edge(s) after release\n' +
        '- 2-flop chain for synchronous deassert

---

## Requirements

1. INPUTS: clk, async_rst_n.

2. OUTPUT: rst_n_sync.

3. ASSERT: rst_n_sync asserts immediately when async_rst_n goes low.

4. DEASSERT: rst_n_sync deasserts after synchronizer delay (e.g., 2 cycles).

5. Test Case - Assert: pulling async_rst_n low immediately forces rst_n_sync active.

6. Test Case - Deassert: releasing async_rst_n only deasserts rst_n_sync on clock edge(s) after the synchronizer delay.

---

## Hints

<details>
<summary>Hint 1</summary>
Use flops with async clear, shift in 1s after release.
</details>
