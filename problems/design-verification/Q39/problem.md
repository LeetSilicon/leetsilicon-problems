# Count Zero on Reset

**Domain:** design-verification — Constraints  
**Difficulty:** Easy  
**Topics:** Assertions, Basic, Reset

---

## Problem Statement

Counter Zero When Reset Asserted

Write SystemVerilog assertion to ensure that "count" signal is zero whenever "reset" signal is asserted. This is synchronous or asynchronous reset check depending on design.

---

## Requirements

1. RESET POLARITY: Define if reset is active-high (rst) or active-low (rst_n). Document clearly.

2. RESET TYPE: Synchronous (sampled at clock edge) or Asynchronous (immediate). Affects assertion structure.

3. SYNCHRONOUS RESET: Check count==0 at clock edge when reset asserted. Property: reset |-> (count==0).

4. ASYNCHRONOUS RESET: Use immediate assertion or concurrent with special handling. Typically still use clocked assertion with disable iff.

5. RESET HANDLING: Do NOT use disable iff for this assertion. Or use separate assertion for reset state.

6. Test Case 1 - Reset Active: reset=1, verify count==0. Assertion passes.

7. Test Case 2 - Reset Violation: reset=1, count=5. Assertion fails.

8. Test Case 3 - Reset Inactive: reset=0, count=10. Assertion passes (antecedent false).

9. Test Case 4 - Reset Edge (sync): reset rises at clock edge. count should be 0 at that edge. Test.

10. Test Case 5 - Reset Edge (async): For async reset, count should become 0 immediately when reset asserted (not at clock edge). May need immediate assertion.

---

## Hints

<details>
<summary>Hint 1</summary>
Synchronous reset assertion: @(posedge clk) reset |-> (count==0);
</details>

<details>
<summary>Hint 2</summary>
Active-low reset: @(posedge clk) !rst_n |-> (count==0);
</details>

<details>
<summary>Hint 3</summary>
Asynchronous reset: Count becomes 0 immediately upon reset assertion, not synchronized to clock. Standard clocked assertion may miss immediate behavior. Consider: always @(reset) if(reset) assert(count==0); (immediate assertion in procedural block).
</details>
