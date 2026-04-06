# Event Precedence by 10 Cycles

**Domain:** design-verification — Constraints  
**Difficulty:** Medium  
**Topics:** Assertions, Sequence, Precedence

---

## Problem Statement

Event1 Precedes Event2 by At Least 10 Cycles

Write sequence assertion to verify that event1 always occurs at least 10 clock cycles before event2. When event2 occurs, event1 must have occurred at least 10 cycles prior.

---

## Requirements

1. PRECEDENCE: event1 must happen first, and event2 cannot occur until at least 10 cycles after event1.

2. TRIGGER: On event2 occurrence, check that event1 occurred at least 10 cycles earlier.

3. ALTERNATIVE (Forward): On event1, event2 cannot occur in next 9 cycles: $rose(event1) |-> ##[1:9] !$rose(event2).

4. MULTIPLE OCCURRENCES: If event1 and event2 can occur multiple times, track latest event1 relative to each event2.

5. PAST FUNCTION: $past(sig, N) references signal value N cycles ago. Must be within simulation history.

6. RESET: disable iff (rst). Also ensure $past not accessed before N cycles elapsed (use $past validity or cycle counter).

7. Test Case 1 - Correct Precedence: event1 at cycle 5, event2 at cycle 15 (10 cycles gap). Assertion passes.

8. Test Case 2 - Violation (Too Soon): event1 at cycle 5, event2 at cycle 14 (9 cycles gap). Assertion fails.

9. Test Case 3 - No event1 Before event2: event2 at cycle 10, no prior event1. Assertion fails (assuming $past returns 0/false).

10. Test Case 4 - Multiple event1s: event1 at cycles 5, 8, 12. event2 at cycle 20. Latest event1 is cycle 12 (8 cycles before). Depending on property, may pass or fail.

11. Test Case 5 - Back-to-Back: event1 at cycle 10, event2 at cycle 20. Then event1 at cycle 21, event2 at cycle 31. Both satisfy 10-cycle gap.

---

## Hints

<details>
<summary>Hint 1</summary>
Backward check: On event2, verify event1 occurred 10+ cycles ago: $rose(event2) |-> $past($rose(event1), 10);
</details>
