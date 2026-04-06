# Equal 1s and 0s

**Domain:** design-verification — Constraints  
**Difficulty:** Medium  
**Topics:** Constraints, Balance

---

## Problem Statement

Generate Value with Equal Number of 1-Bits and 0-Bits

Write uvm sv constraint for variable where number of 1-bits equals number of 0-bits. Balanced bit pattern. Requires even bit width. Implement popcount without $countones if needed.

---

## Requirements

1. WIDTH: Must be even (W % 2 == 0). Odd width makes equal 1s/0s impossible. Specify W (e.g., W=10).

2. BALANCE: Number of 1s = Number of 0s = W/2.

3. ODD WIDTH HANDLING: If W is odd, constraint is UNSAT. Verify randomize fails or define W as even.

4. POPCOUNT: Exactly W/2 bits set.

5. NO $COUNTONES IN CONSTRAINTS: Implement via explicit sum or construction.

6. Test Case 1 - Even Width Balance: W=10. Verify $countones(x) == 5 in testbench.

7. Test Case 2 - Odd Width UNSAT: W=11. Add constraint for equal 1s/0s. Verify randomize() fails.

8. Test Case 3 - Pattern Variety: Randomize 100 times. Verify different balanced patterns appear.

9. Test Case 4 - W=2: Minimal case. Possible values: 01 (1 one, 1 zero) or 10. Both valid.

10. Test Case 5 - Large W: W=32. Verify 16 ones, 16 zeros.

---

## Hints

<details>
<summary>Hint 1</summary>
Width check: Assert W is even before applying constraint. static assert(W % 2 == 0);
</details>

<details>
<summary>Hint 2</summary>
Popcount constraint: int k = W/2; int cnt = sum of all bits; constraint { cnt == k; }
</details>
