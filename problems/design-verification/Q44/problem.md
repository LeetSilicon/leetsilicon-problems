# High for 3 Consecutive Cycles

**Domain:** design-verification — Constraints  
**Difficulty:** Easy  
**Topics:** Assertions, Temporal, Consecutive

---

## Problem Statement

Signal High for 3 Consecutive Cycles

Write temporal assertion to verify that signal "sig" is high (logic 1) for at least 3 consecutive clock cycles at some point. Use consecutive repetition operator.

---

## Requirements

1. CONSECUTIVE REPETITION: Signal must be 1 for 3 consecutive samples. Use sig[*3].

2. COVERAGE vs ASSERTION: Typically 

3.  is covered, not asserted (liveness). Use cover property. If asserting, need trigger condition.

4. TRIGGER CONDITION: If asserting, define when 3-cycle high must occur. Example: 

5. : enable |-> sig[*3].

6. MINIMUM vs EXACT: sig[*3] means exactly 3. sig[*3:$] means 3 or more. Clarify requirement.

7. RESET: disable iff (rst).

8. Test Case 1 - Exactly 3: sig=1 for cycles 10-12. sig[*3] matches. Cover hits.

9. Test Case 2 - More Than 3: sig=1 for cycles 10-15. sig[*3] matches at 10-12 and subsequent. Cover hits.

10. Test Case 3 - Less Than 3: sig=1 for cycles 10-11, then 0. sig[*3] does not match.

11. Test Case 4 - Interrupted: sig=1,1,0,1,1,1. Second group of 3 matches. Cover hits.

12. Test Case 5 - Never 3: sig toggles frequently, never 3 consecutive. Cover never hits.

---

## Hints


