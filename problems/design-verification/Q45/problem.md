# Counter Zero After Reset

**Domain:** design-verification — Constraints  
**Difficulty:** Medium  
**Topics:** Assertions, Temporal, Reset

---

## Problem Statement

Counter Zero Within 1 Cycle After Reset De-assertion

Write temporal assertion to ensure that after reset is de-asserted, counter becomes zero within 1 clock cycle. Handles synchronous reset with timing check.

---

## Requirements

1. RESET DE-ASSERTION: Detect when reset goes inactive. Use $fell(reset) for active-high reset, $rose(rst_n) for active-low.

2. TIMING WINDOW: Counter must be 0 within 0 to 1 cycles after reset de-assertion. ##[0:1] (counter==0).

3. SYNCHRONOUS RESET: For synchronous reset, counter becomes 0 at clock edge when reset de-asserts.

4. ASYNCHRONOUS RESET: Counter may become 0 immediately or at next clock.

5. EXACT TIMING: If counter guaranteed 0 at exact cycle after reset: ##1 (counter==0). If same cycle: ##0 or just (counter==0).

6. RESET: Do not use disable iff here, as we are checking reset behavior.

7. Test Case 1 - Reset De-assert, Counter 0 Same Cycle: reset falls, counter=0 immediately. Assertion passes.

8. Test Case 2 - Reset De-assert, Counter 0 Next Cycle: reset falls at cycle N, counter=0 at cycle N+1. If using ##[0:1], passes.

9. Test Case 3 - Reset De-assert, Counter Not 0: reset falls, counter=5 at both N and N+1. Assertion fails.

10. Test Case 4 - Multiple Reset Pulses: Assert and de-assert reset multiple times. Each de-assertion must satisfy property.

11. Test Case 5 - Reset During Count: Counter at 10, reset asserts, then de-asserts. Counter should be 0 within window.

---

## Hints

<details>
<summary>Hint 1</summary>
Reset de-assertion detection: $fell(reset) for active-high. $rose(!reset) alternative.
</details>

<details>
<summary>Hint 2</summary>
Active-low reset: $fell(rst_n) becomes $rose(rst_n) to detect de-assertion.
</details>

<details>
<summary>Hint 3</summary>
Synchronous reset: Counter updates on clock edge. $fell(reset) sampled on clk edge, so counter==0 same cycle.
</details>

<details>
<summary>Hint 4</summary>
Asynchronous reset: Counter clears immediately when reset asserts, but we check after de-assert. May need ##0 or ##1 depending on when counter re-enables.
</details>
