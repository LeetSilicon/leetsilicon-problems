# Power of 4

**Domain:** design-verification — Constraints  
**Difficulty:** Easy  
**Topics:** Constraints, Math, Power

---

## Problem Statement

Generate Number that is Power of 4

Write uvm sv constraint to generate number that is a power of 4: x = 4^n for some non-negative integer n. Values: 1, 4, 16, 64, 256, ... Bit pattern: single 1-bit at even bit position.

---

## Requirements

1. POWER OF 4: x ∈ {4^0, 4^1, 4^2, ...} = {1, 4, 16, 64, 256, ...} within width limits.

2. BIT PATTERN: Power of 4 in binary: single bit set at position 0,2,4,6,... (even positions). 4^0=1 (bit 0), 4^1=4 (bit 2), 4^2=16 (bit 4), etc.

3. VALUE DOMAIN: For W-bit variable, maximum n such that 4^n < 2^W. Example: 32-bit allows up to 4^15 = 2^30.

4. ZERO EXCLUDED: Typically x > 0. Power of 4 starts at 4^0=1.

5. Test Case 1 - Valid Set: Randomize 1000 times. Verify all generated values are in {1,4,16,64,256,...} up to width limit.

6. Test Case 2 - Bit Position: Verify each generated value has exactly one bit set at even position (0,2,4,6,...).

7. Test Case 3 - Edge Case: Largest power of 4 fitting in width appears sometimes.

8. Test Case 4 - Invalid Value: Add constraint x==12. Verify randomize fails (12 not power of 4).

9. Test Case 5 - Distribution: Over randomizations, multiple different powers appear (not stuck on one value).

---

## Hints

<details>
<summary>Hint 1</summary>
Bit trick: Power of 4 ⇔ (exactly one bit set) AND (bit position is even). $onehot(x) AND (x & 0x55555555) == x for 32-bit.
</details>

<details>
<summary>Hint 2</summary>
One-hot check: $onehot(x) returns true if exactly one bit set. $countones(x) == 1.
</details>

<details>
<summary>Hint 3</summary>
Even position mask: For 32-bit: 0x55555555 = 0101 0101 ... (1s at even positions). x & mask == x means all 1-bits at even positions.
</details>

<details>
<summary>Hint 4</summary>
Combined: constraint c_pow4 { $onehot(x) && ((x & 32\
</details>

<details>
<summary>Hint 5</summary>
,
        
</details>
