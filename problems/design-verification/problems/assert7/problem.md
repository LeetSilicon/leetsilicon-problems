# Event Within 5 Cycles

**Domain:** design-verification — Constraints  
**Difficulty:** Medium  
**Topics:** Assertions, Temporal, Timing

---

## Problem Statement

Event1 Occurs Within 5 Cycles After Event0

Write temporal assertion to verify that event1 occurs within 5 clock cycles after event0. Use bounded delay operator to specify timing window.

---

## Requirements

1. EVENT DEFINITION: Define what constitutes event0 and event1. Typically rising edges: $rose(event0_sig), $rose(event1_sig).

2. TIMING WINDOW: event1 must occur within 1 to 5 cycles after event0. Use ##[1:5].

3. SAME-CYCLE: Decide if event1 in same cycle as event0 allowed. If yes: ##[0:5]. If no: ##[1:5].

4. IMPLICATION: When event0 occurs, event1 must follow within window.

5. OVERLAPPING EVENTS: If event0 can re-trigger before event1, multiple assertion threads may run. Ensure this is acceptable or use non-overlapping implication |=>.

6. RESET: disable iff (rst).

7. Test Case 1 - Event1 at Cycle 3: event0 at cycle 0, event1 at cycle 3. Within [1:5]. Assertion passes.

8. Test Case 2 - Event1 at Cycle 6: event0 at cycle 0, event1 at cycle 6. Outside window. Assertion fails.

9. Test Case 3 - Event1 Same Cycle: event0 and event1 both at cycle 0. If using ##[0:5], passes. If ##[1:5], fails.

10. Test Case 4 - No Event1: event0 occurs, event1 never. Assertion fails (bounded eventually violated).

11. Test Case 5 - Back-to-Back Event0: event0 at cycle 0 and cycle 2. Two assertion threads. event1 at cycle 4 satisfies first, event1 at cycle 5 satisfies second. Test overlap handling.

---

## Hints


