# Arbiter — Priority Starvation in Round-Robin Wrapper

**Domain:** RTL Debug — Arbiter  
**Difficulty:** Hard  
**Bug Type:** fairness / pointer update

---

## Summary

A 2-request round-robin arbiter wrapper forgets to advance priority after a grant, causing repeated grants to the same requester.

## Expected Behavior

- With both requests asserted continuously, grants should alternate.
- rr_ptr should advance only on successful grants.
- Reset should initialize arbitration pointer deterministically.

## Signals to Watch

`clk`, `rst`, `req`, `grant`, `rr_ptr`

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
Watch rr_ptr in waveform when grants are issued.
</details>
