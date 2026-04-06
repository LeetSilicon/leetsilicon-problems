# FSM Sequence Detector — Late Detect Pulse

**Domain:** RTL Debug — FSM  
**Difficulty:** Medium  
**Bug Type:** state/output timing

---

## Summary

Debug a 1011 sequence detector where detect pulse is asserted one cycle late after reset release.

## Expected Behavior

- detect should pulse exactly when sequence 1011 completes.
- Reset should initialize state machine deterministically.
- No extra detect pulse on reset deassertion or idle cycles.

## Signals to Watch

`clk`, `rst`, `in_bit`, `state`, `next_state`, `detect`

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
Check whether detect is derived from current state or next state.
</details>

<details>
<summary>Hint 2</summary>
Compare nonblocking updates of state and detect in the same clocked block.
</details>

<details>
<summary>Hint 3</summary>
A common fix is computing detect combinationally from next_state / input or registering it in the proper cycle.
</details>
