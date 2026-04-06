# Grouped 1s in Binary

**Domain:** design-verification — Constraints  
**Difficulty:** Medium  
**Topics:** Constraints, Pattern

---

## Problem Statement

Generate Number with All 1-Bits Grouped in Single Contiguous Run

Write uvm sv constraint to generate number whose binary representation has all 1-bits grouped together in single contiguous run. Pattern: some 0s, then all 1s together, then some 0s. Run length can be 0 to W (width). Support all-zeros and all-ones edge cases if specified.

---

## Requirements

1. WIDTH: Define bit width W (e.g., 16-bit, 32-bit).

2. PATTERN: All 1-bits form single contiguous run. Examples: 000111110000, 11111000, 00001111111.

3. NO GAPS: No 0s between 1s. Pattern like 01101 is invalid (gap in middle).

4. EDGE CASES: All-zeros (run length=0) and all-ones (run length=W). Specify if allowed. Default: allow both.

5. RUN PARAMETERS: Can represent as (start_position, run_length). start in [0:W-1], length in [0:W], start+length ≤ W.

6. MASK GENERATION: x = ((1 << length) - 1) << start for width ≤64. For larger, use different representation.

7. Test Case 1 - Contiguous Check: Find first and last 1-bit positions (ffs, fls). All bits between first and last must be 1. All bits outside must be 0.

8. Test Case 2 - Edge Runs: start=0, length=W (all-ones). start=any, length=0 (all-zeros). Verify both appear in randomizations.

9. Test Case 3 - Single-Bit Run: length=1. Pattern: single 1 at some position. Valid contiguous run.

10. Test Case 4 - Degenerate (if allowing all-zeros): x=0. Technically 

11.  (empty group). Clarify if allowed.

12. Test Case 5 - Mid-Run: start=5, length=3, W=16. Pattern: ...00011100000... Verify generated.

---

## Hints


