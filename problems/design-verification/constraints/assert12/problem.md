# Signal Toggles Every 4 Cycles

**Domain:** design-verification — Constraints  
**Difficulty:** Medium  
**Topics:** Assertions, Sequence, Toggle

---

## Problem Statement

Signal Toggles Every 4 Clock Cycles

Write sequence assertion to verify that a signal toggles (changes state) every 4 clock cycles, creating a regular periodic pattern.

---

## Requirements

1. TOGGLE DEFINITION: Signal changes value from previous check. If sig was 0, now 1. If was 1, now 0.

2. EVERY 4 CYCLES: Check toggle every 4 clock cycles. sig at cycle N should differ from sig at cycle N-4.

3. INITIAL CYCLES: $past(sig, 4) valid only after 4 cycles. Gate: (cycle_count >= 4) |-> ...

4. PERFECT SQUARE WAVE: If expecting perfect 50% duty cycle at 4-cycle period: sig high for 2, low for 2, repeat. Check: sig == $past(sig, 2) && sig != $past(sig, 4).

5. ALTERNATIVE (Edge-based): $rose(sig) or $fell(sig) must occur within every 4-cycle window.

6. RESET: disable iff (rst). Also avoid checking first 4 cycles.

7. Test Case 1 - Perfect Toggle: sig pattern: 0,0,0,0,1,1,1,1,0,0,0,0,... (toggles at cycles 4,8,12,...). Assertion passes.

8. Test Case 2 - Toggle at Every 4th: sig: 0 at cycle 0, 1 at cycle 4, 0 at cycle 8. sig != $past(sig,4) always true. Passes.

9. Test Case 3 - Missed Toggle: sig: 0 for cycles 0-7, then 1. Toggle at cycle 4 missed. Assertion fails at cycle 4.

10. Test Case 4 - Faster Toggle: sig toggles every 2 cycles. sig != $past(sig,4) may still be true (depends on pattern). Test edge case.

11. Test Case 5 - Initial Period: First 4 cycles undefined for $past(sig,4). Use $past_valid or cycle counter to skip.

---

## Hints

<details>
<summary>Hint 1</summary>
Toggle check: (sig != $past(sig, 4)) true if signal different from 4 cycles ago.
</details>

<details>
<summary>Hint 2</summary>
Gating initial: Use $past_valid(4) or cycle_count: (cycle_count >= 4) |-> (sig != $past(sig,4));
</details>

<details>
<summary>Hint 3</summary>
Perfect square wave: sig toggles every 4, creating 8-cycle period. Check: sig == $past(sig,2) (same 2 cycles ago, period/2) and sig != $past(sig,4) (different 4 cycles ago, full period).
</details>

<details>
<summary>Hint 4</summary>
At least once per window: 
</details>

<details>
<summary>Hint 5</summary>
 different from 
</details>

<details>
<summary>Hint 6</summary>
. Clarify requirement.
</details>

<details>
<summary>Hint 7</summary>
Alternative: Track last toggle cycle. (current_cycle - last_toggle_cycle) <= 4.
</details>

<details>
<summary>Hint 8</summary>
Example: assert property (@(posedge clk) disable iff (rst) ($past_valid(4)) |-> (sig != $past(sig,4)));
</details>

<details>
<summary>Hint 9</summary>
Test: Generate perfect 4-cycle toggle pattern. Verify passes. Introduce skip (no toggle at expected cycle). Verify fails.
</details>
