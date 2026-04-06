# Req/Ack Handshake — ACK Stuck High

**Domain:** RTL Debug — Handshake  
**Difficulty:** Easy  
**Bug Type:** ack pulse width

---

## Summary

ACK should be a pulse, but buggy logic keeps ACK high when REQ remains asserted.

## Expected Behavior

- ack should pulse for one cycle when a request is accepted.
- ack must deassert even if req stays high.
- busy should return low after service.

## Signals to Watch

`clk`, `rst`, `req`, `ack`, `busy`

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
Pulse outputs need an explicit default low or tightly scoped assertion condition.
</details>

<details>
<summary>Hint 2</summary>
Check for extra assignments to ack later in the always_ff block.
</details>

<details>
<summary>Hint 3</summary>
Differentiate request level from request acceptance event.
</details>
