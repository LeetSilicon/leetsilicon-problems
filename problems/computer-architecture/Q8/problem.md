# Parameterized ALU

**Domain:** computer-architecture — Cache & Memory  
**Difficulty:** Medium  
**Topics:** ALU, Datapath, RTL

---

## Problem Statement

Design Parameterized ALU with Multiple Arithmetic and Logic Operations

Implement a parameterized ALU supporting add, subtract, bitwise AND/OR/XOR, and signed less-than (SLT). Generate optional status flags.\n\n' +
        '**Example (WIDTH=8):**\n' +
        '```\nADD: A=10, B=3 → result=13\nSLT: A=0xFF(-1), B=0x01(+1) → result=1 (true)\nAND: A=0xAA, B=0x0F → result=0x0A\n```\n\n' +
        '**Constraints:**\n' +
        '- Parameterizable WIDTH (8, 16, 32, 64 bits)\n' +
        '- Operation selected via `alu_op` input\n' +
        '- Optional flags: zero, negative, carry, overflow

---

## Requirements

1. PARAMETERIZATION: Support parameter WIDTH for operand and result width. Typical values: 8, 16, 32, 64 bits.

2. OPERATIONS SUPPORTED: (1) ADD: result = A + B, (2) SUB: result = A - B, (3) AND: result = A & B, (4) OR: result = A | B, (5) XOR: result = A ^ B, (6) SLT (signed less-than): result = (signed(A) < signed(B)) ? 1 : 0.

3. SLT BEHAVIOR: Output 1 in LSB if A < B (signed comparison), all other bits zero. For WIDTH=8, result range is 0x00 or 0x01.

4. OPERATION SELECTION: Input signal alu_op (3-bit or as needed) selects operation. Define encoding clearly (e.g., 000=ADD, 001=SUB, 010=AND, 011=OR, 100=XOR, 101=SLT).

5. OUTPUT FLAGS (OPTIONAL): (1) zero: result == 0, (2) negative: result[WIDTH-1] == 1, (3) carry: carry-out from MSB for add/sub, (4) overflow: signed overflow for add/sub.

6. EDGE CASES: Handle invalid alu_op (output zeros or last valid result), WIDTH=1, maximum/minimum values.

7. Test Case 1 - Add/Subtract: WIDTH=8, A=10 (0x0A), B=3 (0x03). ADD: result=13 (0x0D). SUB: result=7 (0x07).

8. Test Case 2 - Bitwise Operations: WIDTH=8, A=0xAA (10101010), B=0x0F (00001111). AND: result=0x0A. OR: result=0xAF. XOR: result=0xA5.

9. Test Case 3 - SLT Signed Comparison: WIDTH=8, A=0xFF (-1 signed), B=0x01 (+1 signed). SLT: result=0x01 (true, -1 < 1).

---

## Hints

<details>
<summary>Hint 1</summary>
Use case statement on alu_op.
</details>

<details>
<summary>Hint 2</summary>
For SLT: $signed(A) < $signed(B).
</details>
