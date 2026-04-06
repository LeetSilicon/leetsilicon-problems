# Rising Then Falling Edge

**Domain:** design-verification — Constraints  
**Difficulty:** Medium  
**Topics:** Assertions, Sequence, Edge

---

## Problem Statement

Rising Edge Followed by Falling Edge Within 10 Cycles

Write sequence assertion to verify that a rising edge on signal is followed by a falling edge within 10 clock cycles. Ensure edge ordering and timing.

---

## Requirements

1. EDGE DETECTION: Rising edge: $rose(sig). Falling edge: $fell(sig).

2. TIMING CONSTRAINT: After rising edge, falling edge must occur within 1 to 10 cycles.

3. SAME-CYCLE: Typically rising and falling cannot occur same cycle (signal cannot be both 0→1 and 1→0). Window starts at ##1.

4. MULTIPLE RISES: If signal can rise again before falling, property handles with multiple threads. Each rise must be followed by fall within 10.

5. INTERMEDIATE STATE: Signal may rise, stay high for N cycles, then fall. As long as N <= 10, passes.

6. RESET: disable iff (rst).

7. Test Case 1 - Rise at 0, Fall at 5: sig rises at cycle 0, falls at cycle 5. Within [1:10]. Assertion passes.

8. Test Case 2 - Rise at 0, Fall at 11: sig rises at cycle 0, falls at cycle 11. Outside window. Assertion fails.

9. Test Case 3 - Rise at 0, Fall at 1: sig rises cycle 0, falls cycle 1 (minimum delay). Assertion passes.

10. Test Case 4 - No Fall: sig rises, never falls. Assertion fails (bounded eventually violated).

11. Test Case 5 - Multiple Rises: sig rises at cycle 0, rises again at cycle 3 (after going low at 2), falls at cycle 6. Two threads: first satisfied by fall at 6 (if sig went low at 2 first), second satisfied by fall at 6. Verify.

---

## Hints

<details>
<summary>Hint 1</summary>
Edge detection: $rose(sig) for 0→1 transition, $fell(sig) for 1→0 transition.
</details>
