# Sequence A Before B

**Domain:** design-verification — Constraints  
**Difficulty:** Easy  
**Topics:** Assertions, Sequence, Order

---

## Problem Statement

Sequence A Occurs Before Sequence B

Write sequence assertion to ensure that sequence A always occurs before sequence B in the clock domain. Define concrete sequences and establish temporal ordering.

---

## Requirements

1. SEQUENCE DEFINITION: Define what constitutes sequence A and sequence B. Example: A = (sig1 ##1 sig2); B = (sig3 ##1 sig4);

2. ORDERING CONSTRAINT: B cannot complete before A has completed. Or: When B completes, A must have completed earlier.

3. ALTERNATIVE (B forbidden until A): property p_no_B_until_A; @(posedge clk) disable iff (rst) !A_done |-> !B; endproperty Track A completion with flag.

4. EVENTUAL OCCURRENCE: Clarify if B must eventually occur after A, or just that B cannot precede A.

5. UNBOUNDED: For 

6. , use state machine or flag tracking A completion.

7. RESET: disable iff (rst).

8. Test Case 1 - Correct Order: Sequence A completes at cycle 10, B completes at cycle 20. Assertion passes.

9. Test Case 2 - Wrong Order: Sequence B completes at cycle 10, A completes at cycle 20 (or never). Assertion fails.

10. Test Case 3 - A Only: Sequence A completes, B never occurs. Assertion passes (no violation, B not triggered).

11. Test Case 4 - Neither: Neither A nor B occurs. Assertion vacuously passes.

12. Test Case 5 - Multiple A Before B: A completes at cycle 5, 10, 15. B completes at cycle 20. Verify earliest A (cycle 5) satisfies precedence.

---

## Hints

<details>
<summary>Hint 1</summary>
Sequence ended: Use .ended property of sequence or track with flag. sequence A; sig1 ##1 sig2; endsequence
</details>

<details>
<summary>Hint 2</summary>
Backward check on B: When B ends, verify A ended earlier: B.ended |-> $past(A.ended);
</details>

<details>
<summary>Hint 3</summary>
Forward prevention: On A not complete, prevent B: !A_complete |-> !B_start;
</details>

<details>
<summary>Hint 4</summary>
Flag tracking: reg A_done; always @(posedge clk) if(A.matched) A_done <= 1; Then: B |-> A_done;
</details>
