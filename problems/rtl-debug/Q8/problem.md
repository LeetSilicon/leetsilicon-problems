# Edge Detector — Double Pulse on Held Input

**Domain:** RTL Debug — Pulse Logic  
**Difficulty:** Medium  
**Bug Type:** pulse generation / ordering

---

## Summary

Rising-edge detector incorrectly behaves like level detect and keeps pulsing while input stays high.

## Expected Behavior

- pulse should be high for exactly one cycle on a rising edge only.
- Holding sig_in high for multiple cycles must not generate repeated pulses.
- Reset should clear pulse and previous-sample state.

## Signals to Watch

`clk`, `rst`, `sig_in`, `prev_in`, `pulse`

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
A pulse output usually needs a default deassert every cycle.
</details>

<details>
<summary>Hint 2</summary>
Compare edge-detect expression with level-detect expression.
</details>

<details>
<summary>Hint 3</summary>
Check how prev_in is updated relative to pulse generation.
</details>
