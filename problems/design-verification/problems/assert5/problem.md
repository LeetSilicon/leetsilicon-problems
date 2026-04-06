# Output Equals Sum

**Domain:** design-verification — Constraints  
**Difficulty:** Easy  
**Topics:** Assertions, Basic, Arithmetic

---

## Problem Statement

Output Equals Sum of Two Inputs

Write SystemVerilog assertion to verify that output "out" always equals the sum of input signals "a" and "b". Account for arithmetic width, overflow, and pipeline delay if applicable.

---

## Requirements

1. ARITHMETIC OPERATION: out should equal a + b.

2. WIDTH HANDLING: Define widths of a, b, out. If out narrower than full sum, overflow/wrapping occurs. Document expected behavior.

3. OVERFLOW: If a and b are N-bit, sum is potentially N+1 bits. If out is N-bit, check: out == a + b (modulo 2^N wrapping). Or assert no overflow expected.

4. SIGNEDNESS: Specify if a, b, out are signed or unsigned. Affects sum computation.

5. PIPELINE DELAY: If out is registered (combinational or pipelined), add appropriate delay. out == a + b (combinational). out == $past(a,1) + $past(b,1) (1-cycle pipeline).

6. RESET: disable iff (rst).

7. UNKNOWN HANDLING: Gate assertion when inputs are X: !$isunknown({a,b}) |-> (out == a+b).

8. Test Case 1 - Correct Sum: a=5, b=3, out=8. Assertion passes.

9. Test Case 2 - Incorrect Sum: a=5, b=3, out=7. Assertion fails.

10. Test Case 3 - Overflow: a=255 (8-bit), b=1. Sum=256 (9-bit). If out 8-bit, out=0 (wrap). Verify assertion accounts for wrap: out == (a+b) & 8'hFF.

11. Test Case 4 - X Inputs: a=X or b=X. Assertion gated if using !$isunknown, else may fail unpredictably.

12. Test Case 5 - Pipelined: If out registered, delay inputs: out == $past(a,1) + $past(b,1). Test with various delays.

---

## Hints

<details>
<summary>Hint 1</summary>
Combinational adder: assert property (@(posedge clk) disable iff (rst) (out == a + b));
</details>

<details>
<summary>Hint 2</summary>
Width matching: If a,b,out all N-bit, sum wraps at 2^N. Assertion: out == (a + b); Implicit modulo.
</details>

<details>
<summary>Hint 3</summary>
Explicit width: out == (a + b) & MASK; where MASK = (1<<WIDTH)-1.
</details>

<details>
<summary>Hint 4</summary>
Pipelined: out == $past(a,D) + $past(b,D); where D = pipeline delay in cycles.
</details>

<details>
<summary>Hint 5</summary>
Signed arithmetic: If signed, cast: out == $signed(a) + $signed(b); Be careful with overflow.
</details>

<details>
<summary>Hint 6</summary>
Unknown gating: (!$isunknown(a) && !$isunknown(b)) |-> (out == a+b);
</details>

<details>
<summary>Hint 7</summary>
Alternative: (a !== \
</details>

<details>
<summary>Hint 8</summary>
x) |-> (out == a+b); for 4-state.
</details>

<details>
<summary>Hint 9</summary>
Test: Sweep a,b values including edge cases (0, max, max-1). Verify sum correct for all.
</details>
