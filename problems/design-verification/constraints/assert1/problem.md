# Signal High When Valid

**Domain:** design-verification — Constraints  
**Difficulty:** Easy  
**Topics:** Assertions, Basic, Signal

---

## Problem Statement

Data Signal High Whenever Valid Asserted

Write UVM SystemVerilog assertion to verify that signal "data" is high (logic 1) whenever signal "valid" is asserted (logic 1). This is a basic implication property: when valid=1, data must equal 1 in the same clock cycle.

---

## Requirements

1. ASSERTION TYPE: Use assert property (not immediate assertion). Clocked assertion for RTL verification.

2. CLOCKING: Sample on clock edge: @(posedge clk). Synchronous assertion.

3. RESET HANDLING: Use disable iff (rst) to prevent assertion failures during reset. Define reset polarity (active high/low).

4. IMPLICATION: When valid==1, require data==1. Property: valid |-> data.

5. UNKNOWN HANDLING: If valid can be X/Z, use 4-state equality: valid===1'b1 to avoid X-propagation failures. Or gate with valid==1 (2-state).

6. Test Case 1 - Basic Pass: valid=1, data=1 for several cycles. Assertion passes.

7. Test Case 2 - Basic Fail: valid=1, data=0 for one cycle. Assertion fails.

8. Test Case 3 - No Implication: valid=0, data=0 or data=1. Assertion passes (antecedent false, property vacuously true).

9. Test Case 4 - X/Z Handling: Drive valid=X or data=X. Verify assertion behavior per chosen handling (gated or fails).

10. Test Case 5 - Reset Behavior: Assert reset. Drive valid=1, data=0. Assertion should NOT fail (disabled during reset). Release reset, repeat. Assertion should fail.

---

## Hints

<details>
<summary>Hint 1</summary>
Basic form: assert property (@(posedge clk) disable iff (rst) valid |-> data);
</details>

<details>
<summary>Hint 2</summary>
Implication operator |-> : If antecedent (valid) true, consequent (data) must be true same cycle.
</details>

<details>
<summary>Hint 3</summary>
Reset disable: disable iff (rst) prevents checking during reset. Choose polarity: active-high rst or active-low !rst_n.
</details>

<details>
<summary>Hint 4</summary>
4-state vs 2-state: valid===1\
</details>

<details>
<summary>Hint 5</summary>
,
        
</details>

<details>
<summary>Hint 6</summary>
b1) |-> (data===1\
</details>

<details>
<summary>Hint 7</summary>
,
        
</details>

<details>
<summary>Hint 8</summary>
,
        
</details>
