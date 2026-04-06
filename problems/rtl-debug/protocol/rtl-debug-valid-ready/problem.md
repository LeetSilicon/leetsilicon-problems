# Valid/Ready Handshake — Data Instability

**Domain:** RTL Debug — Protocol  
**Difficulty:** Medium  
**Bug Type:** handshake stability

---

## Summary

Data changes while valid remains asserted and ready is low. Fix producer-side holding behavior.

## Expected Behavior

- When valid=1 and ready=0, src_data must remain stable.
- Data may change only on a successful transfer or when idle.
- Reset should clear valid cleanly.

## Signals to Watch

`clk`, `rst`, `src_valid`, `src_ready`, `src_data`, `load_new`

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
Check whether src_data is updated whenever load_new is high, regardless of backpressure.
</details>

<details>
<summary>Hint 2</summary>
Hold valid/data until a handshake occurs (valid && ready).
</details>

<details>
<summary>Hint 3</summary>
Think in terms of “accept new request” vs “present current request”.
</details>
