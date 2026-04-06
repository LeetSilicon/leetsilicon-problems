# Synchronous FIFO — Full Flag Off-by-One

**Domain:** RTL Debug — FIFO  
**Difficulty:** Hard  
**Bug Type:** pointer / flag logic

---

## Summary

Fix a synchronous FIFO whose full flag asserts too early, causing usable entries to be lost.

## Expected Behavior

- full must assert only when FIFO reaches DEPTH entries.
- empty must assert only when FIFO has 0 entries.
- Simultaneous read+write should preserve count (when both legal).

## Signals to Watch

`clk`, `rst`, `wr_en`, `rd_en`, `wptr`, `rptr`, `count`, `full`, `empty`

---

## Instructions

1. Open `buggy_design.sv`
2. Run `testbench.sv` to observe the failure
3. Find the root cause and fix `buggy_design.sv`
4. Verify all test cases pass
5. Compare your fix to `fixed_design.sv`

---

## Hints

<details>
<summary>Hint 1</summary>
Look at count update order when wr_en and rd_en happen together.
</details>

<details>
<summary>Hint 2</summary>
Check full assignment threshold against DEPTH.
</details>

<details>
<summary>Hint 3</summary>
Flags should be derived from next count or carefully ordered sequential updates.
</details>
