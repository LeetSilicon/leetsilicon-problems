# Signal Pattern Match

**Domain:** design-verification — Constraints  
**Difficulty:** Medium  
**Topics:** Assertions, Coverage, Pattern

---

## Problem Statement

Signal Matches Predefined Bit Pattern

Write assertion to verify that a signal pattern matches a predefined bit pattern, optionally with masking for don\'t-care bits. Ensure pattern validity.

---

## Requirements

1. PATTERN DEFINITION: Define expected pattern as parameter/localparam. Example: PATTERN = 8'b1010_xxxx.

2. MASK: If partial match (some bits don't care), define mask. Example: MASK = 8'b1111_0000 (upper 4 bits checked).

3. MATCH CHECK: (signal & MASK) == (PATTERN & MASK). Only masked bits compared.

4. PERSISTENCE: If pattern must persist for N cycles, use [*N] repetition.

5. COVERAGE: Add cover property to ensure pattern reached: cover property (@(posedge clk) (signal & MASK) == (PATTERN & MASK));

6. RESET: disable iff (rst).

7. Test Case 1 - Exact Match: signal = 8'b1010_1111, PATTERN = 8'b1010_xxxx, MASK = 8'b1111_0000. Match on upper 4 bits. Assertion passes.

8. Test Case 2 - Mismatch: signal = 8'b0010_1111. Upper 4 bits don't match pattern 1010. Assertion fails.

9. Test Case 3 - Full Match (No Mask): signal = PATTERN exactly. MASK = all 1s. Assertion passes.

10. Test Case 4 - Persistent Pattern: signal matches pattern for 3 consecutive cycles. If checking persistence, assertion passes.

11. Test Case 5 - Coverage: Generate pattern match in simulation. Verify cover property hits.

---

## Hints

<details>
<summary>Hint 1</summary>
Pattern with mask: assert property (@(posedge clk) disable iff (rst) ((signal & MASK) == (PATTERN & MASK)));
</details>

<details>
<summary>Hint 2</summary>
No mask (full match): assert property (@(posedge clk) disable iff (rst) (signal == PATTERN));
</details>
