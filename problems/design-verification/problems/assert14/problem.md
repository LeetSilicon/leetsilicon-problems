# Data Consistent After Enable

**Domain:** design-verification — Constraints  
**Difficulty:** Medium  
**Topics:** Assertions, Sequence, Consistency

---

## Problem Statement

Data Remains Stable for 5 Cycles After Enable

Write sequence assertion to ensure data signal remains consistent (unchanged) for 5 consecutive clock cycles after enable signal is asserted.

---

## Requirements

1. CONSISTENCY: Data value must not change for 5 cycles after enable asserted.

2. BASELINE SAMPLE: Capture data value when enable asserts. Compare subsequent cycles against this baseline.

3. TRIGGER: Use $rose(enable) to trigger check, avoiding re-trigger every cycle enable is high.

4. ALTERNATIVE: Store data value at trigger: $rose(enable) |-> ##1 (data == $past(data,1))[*5]; Data at cycles 1-5 after trigger equals data at trigger.

5. OVERLAPPING ENABLES: If enable can assert again within 5-cycle window, multiple threads run. Define if this is allowed or should be prevented.

6. RESET: disable iff (rst).

7. UNKNOWN DATA: If data can be X, gate: !$isunknown(data) throughout sequence.

8. Test Case 1 - Stable Data: enable rises at cycle 10, data=0x55 from cycle 10-15. Assertion passes.

9. Test Case 2 - Data Changes: enable rises at cycle 10, data=0x55. data changes to 0xAA at cycle 12. Assertion fails.

10. Test Case 3 - Exact 5 Cycles: enable at cycle 10, data stable 10-14 (5 cycles), changes at 15. Assertion passes (checks cycles 10-14).

11. Test Case 4 - Overlapping Enables: enable rises at cycle 10 and 12. Two threads checking data stability. Both must pass independently.

12. Test Case 5 - Enable Level vs Edge: If using level (enable==1) instead of $rose(enable), triggers every cycle enable high. Use edge-based trigger.

---

## Hints


