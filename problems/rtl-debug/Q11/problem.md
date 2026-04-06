# One-Hot FSM — Missing Default Next-State

**Domain:** RTL Debug — FSM  
**Difficulty:** Medium  
**Bug Type:** always_comb stale next_state

---

## Summary

One-hot FSM misses a default next_state assignment in combinational logic, causing stale transitions and hard-to-read waveforms.

## Expected Behavior

- next_state should be fully assigned in every combinational evaluation.
- FSM should transition IDLE->BUSY on start and BUSY->IDLE on done.
- Reset must return to IDLE one-hot encoding.

## Signals to Watch

`clk`, `rst`, `start`, `done`, `state`, `next_state`

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
Check always_comb for a default assignment such as next_state = state.
</details>

<details>
<summary>Hint 2</summary>
Missing assignments can infer latches or stale combinational values.
</details>

<details>
<summary>Hint 3</summary>
Waveforms often show next_state stuck at a previous value when no branch executes.
</details>
