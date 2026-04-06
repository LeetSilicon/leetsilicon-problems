# No Signal Overlap

**Domain:** design-verification — Constraints  
**Difficulty:** Medium  
**Topics:** Assertions, Temporal, Mutual Exclusion

---

## Problem Statement

Start and End Signals Do Not Overlap

Write temporal assertion to ensure that signals "start" and "end" do not overlap in time, meaning both cannot be asserted simultaneously in any clock cycle.

---

## Requirements

1. NON-OVERLAP: start and end cannot both be 1 in same cycle. !(start && end).

2. SIMPLE INVARIANT: This is Boolean check every cycle, not complex temporal pattern.

3. ALTERNATIVE: property p_no_overlap; @(posedge clk) disable iff (rst) (start && end) == 0; endproperty

4. PULSE ORDERING (Optional): If start and end are pulses with ordering (start before end), add: start |-> !end[*1:$] ##1 end. But basic non-overlap is simpler.

5. UNKNOWN HANDLING: !(start===1'b1 && end===1'b1) for 4-state safety.

6. RESET: disable iff (rst).

7. Test Case 1 - No Overlap: start=1, end=0 for some cycles. Then start=0, end=1. Assertion passes.

8. Test Case 2 - Overlap: start=1, end=1 simultaneously. Assertion fails.

9. Test Case 3 - Both Low: start=0, end=0. Assertion passes.

10. Test Case 4 - Start Pulse Then End Pulse: start pulse at cycle 5, end pulse at cycle 10. No overlap. Assertion passes.

11. Test Case 5 - Overlapping Pulses: start pulse cycles 5-7, end pulse cycles 6-8. Overlap at cycles 6-7. Assertion fails.

---

## Hints

<details>
<summary>Hint 1</summary>
Mutual exclusion: assert property (@(posedge clk) disable iff (rst) !(start && end));
</details>

<details>
<summary>Hint 2</summary>
Equivalent forms: (start && end) == 0; or start |-> !end; or end |-> !start;
</details>

<details>
<summary>Hint 3</summary>
Bitwise AND: !(start & end) for bit-level. Same for 1-bit signals.
</details>

<details>
<summary>Hint 4</summary>
Unknown gating: !(start===1\
</details>

<details>
<summary>Hint 5</summary>
b1) or (start!==1\
</details>

<details>
<summary>Hint 6</summary>
b1).
</details>
