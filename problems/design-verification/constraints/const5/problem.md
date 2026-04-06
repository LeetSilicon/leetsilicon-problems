# Even-Odd Index Constraint

**Domain:** design-verification — Constraints  
**Difficulty:** Medium  
**Topics:** Constraints, Array, Parity

---

## Problem Statement

Array with Even Values at Even Indices, Odd Values at Odd Indices

Write UVM SV constraint for array where parity of index matches parity of value. Even indices (0,2,4,...) contain even values. Odd indices (1,3,5,...) contain odd values. Support arbitrary integer values (positive, negative, or zero).

---

## Requirements

1. ARRAY SIZE: Fixed size (define, e.g., 10 elements).

2. PARITY RULE: For all indices i: (i % 2) == (a[i] % 2). Index parity matches value parity.

3. EVEN INDEX: If i is even (i % 2 == 0), then a[i] must be even (a[i] % 2 == 0).

4. ODD INDEX: If i is odd (i % 2 == 1), then a[i] must be odd (a[i] % 2 == 1).

5. VALUE DOMAIN: Define a finite range or allow the full 32-bit int domain. Support negative values if desired.

6. PARITY OF NEGATIVE NUMBERS: For negative numbers, parity defined by LSB or modulo. Be consistent. LSB method recommended: a[i][0] (bit 0) indicates odd/even.

7. Test Case 1 - Parity Verification: For all i in [0:size-1], verify (a[i] % 2) == (i % 2). Use abs() if needed for negative modulo.

8. Test Case 2 - Even Indices: For i in {0,2,4,6,8}, verify a[i] is even (a[i] % 2 == 0 or a[i][0] == 0).

9. Test Case 3 - Odd Indices: For i in {1,3,5,7,9}, verify a[i] is odd (a[i] % 2 == 1 or a[i][0] == 1).

10. Test Case 4 - Range Boundaries: If bounds are from -100 to 100, verify extreme values (-100, -99, 99, 100) appear and satisfy the parity rule.

11. Test Case 5 - Robustness: Randomize 1000 times. Verify no failures, all parities correct.

---

## Hints


