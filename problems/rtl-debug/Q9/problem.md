# Single-Port RAM — Read-After-Write Mismatch

**Domain:** RTL Debug — Memory  
**Difficulty:** Medium  
**Bug Type:** read/write timing semantics

---

## Summary

Synchronous RAM read data is captured from the wrong source during write cycles, causing confusing read-after-write behavior.

## Expected Behavior

- Writes should update memory contents only when we is asserted.
- Reads should return stored data for the selected address on the expected cycle.
- Behavior should be consistent and deterministic across repeated accesses.

## Signals to Watch

`clk`, `we`, `addr`, `wdata`, `rdata`

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
Check what rdata is assigned during write cycles.
</details>

<details>
<summary>Hint 2</summary>
Decide the intended RAM semantics and implement one consistently.
</details>

<details>
<summary>Hint 3</summary>
Waveform should show memory update first, then readback matching stored value.
</details>
