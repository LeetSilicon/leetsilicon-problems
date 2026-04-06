# Detect Rising Edge

**Domain:** design-verification — Constraints  
**Difficulty:** Easy  
**Topics:** Assertions, Basic, Edge Detection

---

## Problem Statement

Detect Rising Edge on Signal

Write SystemVerilog assertion to detect a rising edge on a signal. Typically detect edge of a control signal (not the clock itself). Use $rose() function sampled on clock.

---

## Requirements

1. SIGNAL: Detect rising edge on signal 

2.  (not clock). Clock is sampling reference.

3. EDGE FUNCTION: Use $rose(sig) which detects 0→1 transition sampled at clock edge.

4. SAMPLING: @(posedge clk). $rose(sig) compares current sample with previous sample.

5. RESET: disable iff (rst) to avoid false detections during reset.

6. COVER vs ASSERT: For edge detection, typically use cover property to count occurrences. Can also assert if edge must occur under certain conditions.

7. Test Case 1 - Rising Edge: sig transitions 0→1 at clock edge. $rose(sig) returns true. Cover hits.

8. Test Case 2 - No Edge: sig remains 0 or 1. $rose(sig) returns false.

9. Test Case 3 - Falling Edge: sig transitions 1→0. $rose(sig) false (use $fell for falling).

10. Test Case 4 - X Transition: sig transitions X→1 or 0→X. $rose behavior may vary by tool. Test.

11. Test Case 5 - Reset: During reset, sig may toggle. With disable iff, edge detection disabled.

---

## Hints

<details>
<summary>Hint 1</summary>
Edge detection: $rose(signal) true when signal was 0 at previous sample and 1 at current sample.
</details>

<details>
<summary>Hint 2</summary>
Falling edge: $fell(signal) for 1→0 transitions.
</details>

<details>
<summary>Hint 3</summary>
Stable signal: $stable(signal) for no change.
</details>

<details>
<summary>Hint 4</summary>
Cover property example: cover property (@(posedge clk) $rose(enable));
</details>
