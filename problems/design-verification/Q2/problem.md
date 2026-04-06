# Exactly 3 Same Values

**Domain:** design-verification — Constraints  
**Difficulty:** Hard  
**Topics:** Constraints, Array, Uniqueness

---

## Problem Statement

Array with Exactly 3 Identical Elements and 7 Unique Elements

Write UVM SystemVerilog constraint for integer array of 10 elements where exactly 3 elements share the same value (triplicate), and the remaining 7 elements are all unique and different from the triplicate value. Total: 8 distinct values (1 appearing 3 times, 7 appearing once each).

---

## Requirements

1. ARRAY SIZE: Fixed at 10 elements.

2. TRIPLICATE: Exactly 3 elements must have identical value. Call this value dup_val.

3. UNIQUE REMAINDER: Remaining 7 elements must be pairwise unique (all different from each other) AND different from dup_val.

4. TOTAL DISTINCT VALUES: 8 unique values total. One value appears 3 times, seven values appear once.

5. INDEX FLEXIBILITY: The 3 identical elements can be at any indices (not fixed positions). Must randomize which indices contain the triplicate.

6. VALUE DOMAIN: Define element value range (e.g., [0:255]) large enough to provide 8+ distinct values.

7. NO CONSTRAINTS ON WHICH VALUE: Any value from domain can be the triplicate or unique values (randomized).

8. Test Case 1 - Count Verification: After randomize, create histogram of values. Verify exactly one value appears 3 times, exactly seven values appear 1 time.

9. Test Case 2 - Index Permutation: Randomize 100 times. Track which indices contain triplicate. Verify different index combinations occur (e.g., indices {0,1,2} sometimes, {2,5,9} other times).

10. Test Case 3 - Value Variety: Over many randomizations, verify different values serve as triplicate (not always same value).

11. Test Case 4 - UNSAT Detection: Add constraint requiring all elements unique (unique constraint on entire array). Verify randomize fails (conflicts with 

12.  requirement).

13. Test Case 5 - Distinctness: Verify 7 unique values are truly distinct from each other and from triplicate value.

---

## Hints


