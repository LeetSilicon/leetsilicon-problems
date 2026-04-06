# APB Slave — PREADY Asserted in Setup Phase

**Domain:** RTL Debug — APB  
**Difficulty:** Medium  
**Bug Type:** protocol phase timing

---

## Summary

APB slave asserts PREADY during setup instead of access phase, creating protocol timing violations.

## Expected Behavior

- PREADY should only assert in the access phase (PSEL=1 and PENABLE=1).
- Read data should be valid when transfer completes.
- Reset should deassert PREADY.

## Signals to Watch

`PCLK`, `PRESETn`, `PSEL`, `PENABLE`, `PWRITE`, `PREADY`, `PRDATA`

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
APB has setup and access phases — check PENABLE usage carefully.
</details>

<details>
<summary>Hint 2</summary>
If PREADY rises with PSEL before PENABLE, the slave is responding too early.
</details>

<details>
<summary>Hint 3</summary>
Gate PREADY and data completion logic to the access phase.
</details>
