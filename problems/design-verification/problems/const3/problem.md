# Dynamic Array with Repetition Rules

**Domain:** design-verification — Constraints  
**Difficulty:** Hard  
**Topics:** Constraints, Dynamic Array, Consecutive

---

## Problem Statement

Dynamic Array Size 300 with Value Frequency and Consecutive Constraints

Generate dynamic array of exactly 300 elements. Elements take values from {0,1,2,3,4}. UVM SV Constraints: (1) Each value (0,1,2,3,4) appears at least 40 times, (2) Value 0 can appear consecutively, (3) Values 1,2,3,4 cannot appear consecutively (no adjacent repeats).

---

## Requirements

1. ARRAY SIZE: Dynamic array with size = 300 (fixed).

2. VALUE DOMAIN: Each element a[i] inside {0,1,2,3,4}. Only 5 possible values.

3. MINIMUM FREQUENCY: Each value {0,1,2,3,4} must appear at least 40 times. Total minimum = 5*40 = 200. Leaves 100 elements flexible.

4. CONSECUTIVE RULE FOR 0: Value 0 may appear consecutively. Pattern like 0,0,0 is allowed.

5. NO CONSECUTIVE FOR 1-4: Values 1,2,3,4 cannot appear consecutively. If a[i] in {1,2,3,4} and a[i]==a[i+1], constraint violated. Each value 1-4 must alternate with different values.

6. FEASIBILITY: 300 elements, 5 values, min 40 each = 200 mandatory, 100 flexible. Alternation for 1-4 is feasible with value 0 as separator.

7. Test Case 1 - Frequency Count: After randomize, count occurrences of each value 0,1,2,3,4. Assert each count >= 40.

8. Test Case 2 - Consecutive Rule for 1-4: Scan array: for i in [0:298], if a[i] in {1,2,3,4}, assert a[i] != a[i+1]. No adjacent repeats for these values.

9. Test Case 3 - Consecutive Allowed for 0: Verify pattern like a[i]=0, a[i+1]=0 exists somewhere in array (value 0 can repeat).

10. Test Case 4 - Stress Test: Randomize 200 times. Verify no randomization failures. Check solver performance (should complete in reasonable time).

11. Test Case 5 - Edge Frequency: Verify at least one value appears exactly 40 times sometimes (not always much more).

---

## Hints

<details>
<summary>Hint 1</summary>
Array size constraint: constraint c_size { a.size() == 300; }
</details>
