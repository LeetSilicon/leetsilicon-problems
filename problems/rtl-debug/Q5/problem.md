# Shift Register — Parallel Load Priority Bug

**Domain:** RTL Debug — Shift Register  
**Difficulty:** Medium  
**Bug Type:** control priority

---

## Summary

When load and shift are asserted together, the register shifts instead of taking the parallel load.

## Expected Behavior

- Parallel load should have higher priority than shift.
- Shift should occur only when load=0 and shift_en=1.
- Reset should clear q to 0.

## Signals to Watch

`clk`, `rst`, `load`, `shift_en`, `ser_in`, `par_in`, `q`

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
Review if/else ordering in the sequential block.
</details>

<details>
<summary>Hint 2</summary>
Interviewers often expect an explicit control priority comment and implementation.
</details>

<details>
<summary>Hint 3</summary>
Simulate a cycle where load=1 and shift_en=1 to see the wrong behavior.
</details>
