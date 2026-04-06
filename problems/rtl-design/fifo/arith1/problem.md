# N-bit Adder/Subtractor

**Domain:** rtl-design — FIFO / Queue  
**Difficulty:** Medium  
**Topics:** Arithmetic, Adder, Design

---

## Problem Statement

Design Parameterizable N-bit Adder/Subtractor with Overflow Detection

Implement a combinational adder/subtractor with optional overflow and carry flags.\n\n' +
        '**Operation:**\n' +
        '```\nsub=0: result = A + B\nsub=1: result = A + ~B + 1 (two\'s complement)\n```\n\n' +
        '**Constraints:**\n' +
        '- Parameterizable WIDTH\n' +
        '- Signed overflow: (A_sign == B_sign) && (A_sign != result_sign)\n' +
        '- Carry/borrow flag from MSB addition

---

## Requirements

1. PARAMETERIZATION: Parameter WIDTH defines operand width (N bits).

2. OPERATION CONTROL: Input 

3.  (1 bit). sub=0: perform addition (A+B). sub=1: perform subtraction (A-B).

4. ADDITION: result = A + B. Straightforward addition.

5. SUBTRACTION: Implement using two's complement. result = A + (~B + 1) = A + (~B) + carry_in. Set carry_in=1 for subtraction.

6. OUTPUTS: (1) result (WIDTH bits): sum or difference, (2) Optional: carry_out (1 bit): carry from MSB addition, (3) Optional: overflow (1 bit): signed overflow detection.

7. CARRY/BORROW: For addition: carry_out is carry from MSB. For subtraction: carry_out interpretation as borrow (inverted logic). Document meaning.

8. SIGNED OVERFLOW: Overflow occurs for signed operations when: (1) Adding two positive numbers yields negative result, (2) Adding two negative numbers yields positive result. Overflow formula: overflow = (A_sign == B_sign) && (A_sign != result_sign).

9. UNSIGNED OVERFLOW: Detected by carry_out. For addition: overflow if carry_out=1. For subtraction: underflow if carry_out=0 (borrow occurred).

10. Test Case 1 - Addition: WIDTH=8, A=10 (0x0A), B=3 (0x03), sub=0. Expected: result=13 (0x0D), carry_out=0 (no carry).

11. Test Case 2 - Subtraction: WIDTH=8, A=10 (0x0A), B=3 (0x03), sub=1. Expected: result=7 (0x07), carry_out=1 (no borrow in unsigned).

12. Test Case 3 - Signed Overflow Addition: WIDTH=8 (signed range -128 to +127), A=127 (0x7F), B=1 (0x01), sub=0. Expected: result=128 (0x80, wraps to -128), overflow=1.

13. Test Case 4 - Signed Overflow Subtraction: WIDTH=8, A=-128 (0x80), B=1 (0x01), sub=1. Expected: result=-129 (wraps to +127, 0x7F), overflow=1.

14. Test Case 5 - No Overflow: WIDTH=8, A=50 (0x32), B=20 (0x14), sub=0. Expected: result=70 (0x46), overflow=0, carry_out=0.

---

## Hints

<details>
<summary>Hint 1</summary>
Addition: assign {carry_out, result} = A + B; Use WIDTH+1 bits to capture carry.
</details>

<details>
<summary>Hint 2</summary>
Subtraction: assign {carry_out, result} = A + (~B) + 1; Equivalent to A - B.
</details>
