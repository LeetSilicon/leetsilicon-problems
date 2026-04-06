# Signal Always High

**Domain:** design-verification — Constraints  
**Difficulty:** Medium  
**Topics:** Assertions, Temporal, Always

---

## Problem Statement

Signal Always High in Clock Domain

Write temporal assertion to ensure signal "sig" is always high (logic 1) on every clock cycle within the clock domain, outside of reset. This is a safety property.

---

## Requirements

1. ALWAYS PROPERTY: Signal must be 1 on every cycle (after reset).

2. RESET HANDLING: disable iff (rst) to exclude reset period.

3. TEMPORAL FORM: No explicit temporal operators needed for 

4. . Simple Boolean check suffices.

5. ALTERNATIVE: property p_signal_always_high; @(posedge clk) disable iff (rst) (sig == 1'b1); endproperty

6. INITIALIZATION: If sig may be 0 initially after reset, add delay: ##1 sig; to check after first cycle.

7. UNKNOWN: Handle X: sig === 1'b1 for strict checking.

8. Test Case 1 - Always High: sig=1 for all cycles. Assertion passes.

9. Test Case 2 - Glitch Low: sig=0 for one cycle. Assertion fails.

10. Test Case 3 - Reset Behavior: During reset, sig=0. After reset, sig=1. Assertion passes (disabled during reset).

11. Test Case 4 - X State: sig=X at some cycle. Assertion may fail or be gated depending on handling.

12. Test Case 5 - Continuous Monitoring: Run for 1000+ cycles with sig=1. Assertion continuously passes.

---

## Hints

<details>
<summary>Hint 1</summary>
Simple form: assert property (@(posedge clk) disable iff (rst) sig);
</details>

<details>
<summary>Hint 2</summary>
Explicit value: assert property (@(posedge clk) disable iff (rst) (sig == 1));
</details>

<details>
<summary>Hint 3</summary>
Safety property: Checked every cycle. If sig ever drops to 0, assertion fails.
</details>

<details>
<summary>Hint 4</summary>
No temporal operator needed: This is not 
</details>

<details>
<summary>Hint 5</summary>
 or 
</details>

<details>
<summary>Hint 6</summary>
. 
</details>

<details>
<summary>Hint 7</summary>
.
</details>
