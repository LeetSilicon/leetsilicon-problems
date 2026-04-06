# Data Stable for One Cycle

**Domain:** design-verification — Constraints  
**Difficulty:** Easy  
**Topics:** Assertions, Basic, Stability

---

## Problem Statement

Data Remains Stable When Enable Asserted

Write SystemVerilog assertion to verify that signal "data" remains stable (unchanged) for at least one clock cycle after "enable" is asserted. Stability means data value at current cycle equals value at next cycle.

---

## Requirements

1. ASSERTION TYPE: Clocked assert property.

2. STABILITY DEFINITION: Data stable = data[current_cycle] == data[next_cycle]. Use $stable(data) which is equivalent to (data == $past(data)).

3. TRIGGER: When enable asserted (enable==1), check stability in NEXT cycle. Use implication with ##1.

4. ENABLE SEMANTICS: Clarify if 

5.  means: (1) stability for exactly 1 cycle after enable, or (2) stability while enable remains high. Default: one cycle after.

6. RESET HANDLING: disable iff (rst).

7. UNKNOWN HANDLING: If enable or data can be X, gate appropriately.

8. Test Case 1 - Pass: enable=1 at cycle N, data=5. At cycle N+1, data=5. Assertion passes.

9. Test Case 2 - Fail: enable=1 at cycle N, data=5. At cycle N+1, data=7. Assertion fails.

10. Test Case 3 - Multiple Enables: enable=1 for 3 consecutive cycles. Data changes each cycle. Verify each enable checks its own next cycle.

11. Test Case 4 - Enable with X: enable=X. Verify assertion gated or handles correctly.

12. Test Case 5 - Data Change Before Enable: data changes, then enable=1, then data stable. Assertion passes (only checks after enable).

---

## Hints

<details>
<summary>Hint 1</summary>
Stability operator: $stable(signal) returns true if signal unchanged from previous sample. Equivalent to (signal == $past(signal,1)).
</details>

<details>
<summary>Hint 2</summary>
One-cycle delay: enable |-> ##1 $stable(data). When enable true, check data stable at next cycle.
</details>
