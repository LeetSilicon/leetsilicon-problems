# Counter — Terminal Count Glitch

**Domain:** RTL Debug — Counter  
**Difficulty:** Easy  
**Bug Type:** combinational output timing

---

## Summary

Terminal-count pulse is generated from the current count and appears one cycle late for a mod-10 counter.

## Expected Behavior

- tc_pulse should assert exactly when count transitions from 9 back to 0.
- Pulse width should be one cycle only.
- Counter should restart cleanly after reset.

## Signals to Watch

`clk`, `rst`, `en`, `count`, `tc_pulse`

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
Check whether tc_pulse is computed using current count or next count.
</details>

<details>
<summary>Hint 2</summary>
A terminal-count pulse is often easiest to derive from the same condition that causes wrap.
</details>

<details>
<summary>Hint 3</summary>
Make sure tc_pulse deasserts on non-wrap cycles.
</details>
