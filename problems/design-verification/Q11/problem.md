# 5% Probability for Lower Bits Same

**Domain:** design-verification — Constraints  
**Difficulty:** Medium  
**Topics:** Constraints, Probability, Bits

---

## Problem Statement

4-bit Variable with Lower 2 Bits Same Probability 5%

Write uvm sv constraint on 4-bit variable such that the probability of lower two bits being equal is 5%. Lower bits equal means x[1:0] is 00 or 11. Remaining 95% covers patterns 01 and 10.

---

## Requirements

1. VARIABLE: 4-bit variable x (rand bit [3:0] x).

2. LOWER BITS: x[1:0] (bits 1 and 0).

3. SAME PATTERNS: x[1:0] same means 00 or 11. Two patterns total.

4. DIFFERENT PATTERNS: x[1:0] different means 01 or 10. Two patterns total.

5. PROBABILITY TARGET: P(x[1:0] in {00,11}) = 5%. P(x[1:0] in {01,10}) = 95%.

6. DISTRIBUTION: Use dist to assign weights. Total 4 patterns: 2 same, 2 different.

7. UPPER BITS: x[3:2] unconstrained unless specified otherwise.

8. Test Case 1 - Distribution Check: Randomize 10,000 times. Count occurrences where x[1:0] in {2'b00, 2'b11}. Expected: ~500 (5% ± tolerance).

9. Test Case 2 - Pattern Coverage: Verify all 4 lower-bit patterns (00,01,10,11) appear over many samples. Frequencies: 00≈2.5%, 01≈47.5%, 10≈47.5%, 11≈2.5%.

10. Test Case 3 - Upper Bits Randomness: Verify x[3:2] distributed uniformly (if unconstrained).

11. Test Case 4 - Seed Determinism: Different random seeds produce same statistical distribution.

12. Test Case 5 - Edge Cases: Verify both 00 and 11 appear (not just one same pattern).

---

## Hints


