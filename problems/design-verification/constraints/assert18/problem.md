# Array Index Valid Range

**Domain:** design-verification — Constraints  
**Difficulty:** Medium  
**Topics:** Assertions, Coverage, Array

---

## Problem Statement

Array Access Index Within Valid Range

Write assertion to ensure that array "data_array" is accessed only with valid indices within range [0, SIZE-1]. Catch out-of-bounds accesses.

---

## Requirements

1. ARRAY SIZE: Define array size (fixed or dynamic). Example: logic [7:0] data_array [0:15]; SIZE=16.

2. ACCESS CONTROL: Index valid only when access occurring (read_en or write_en asserted).

3. INDEX RANGE: index must be in [0:SIZE-1] when accessing.

4. DYNAMIC ARRAY: For dynamic array, use data_array.size(): index < data_array.size().

5. UNKNOWN INDEX: Gate X: !$isunknown(index) when accessing.

6. COVERAGE: Cover boundary indices (0, SIZE-1) to ensure edge access tested.

7. Test Case 1 - Valid Index: read_en=1, index=5 (within [0:15]). Assertion passes.

8. Test Case 2 - Index 0: Access with index=0. Assertion passes. Coverage bin hits.

9. Test Case 3 - Index MAX: Access with index=15 (SIZE-1). Assertion passes. Coverage bin hits.

10. Test Case 4 - Index Out-of-Bounds (Negative): index=-1. Assertion fails (if signed index).

11. Test Case 5 - Index Out-of-Bounds (Over): index=16 (>= SIZE). Assertion fails.

---

## Hints


