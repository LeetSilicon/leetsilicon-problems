# Barrel Shifter

**Domain:** computer-architecture — Cache & Memory  
**Difficulty:** Hard  
**Topics:** Shifter, Datapath, RTL

---

## Problem Statement

Design Barrel Shifter Supporting Logical and Arithmetic Shifts

Implement a barrel shifter for SLL (shift left logical), SRL (shift right logical), and SRA (shift right arithmetic). Must complete in one cycle.\n\n' +
        '**Example (WIDTH=8):**\n' +
        '```\nSRL: A=0x80, shift=1 → 0x40\nSRA: A=0x80(-128), shift=1 → 0xC0 (sign-extended)\nSLL: A=0x01, shift=3 → 0x08\n```\n\n' +
        '**Constraints:**\n' +
        '- Parameterizable WIDTH\n' +
        '- Shift amount: log2(WIDTH) bits\n' +
        '- Single-cycle combinational design

---

## Requirements

1. SHIFT OPERATIONS: (1) SLL (shift left logical): fill with zeros from right, (2) SRL (shift right logical): fill with zeros from left, (3) SRA (shift right arithmetic): fill with sign bit (MSB) from left.

2. PARAMETERIZATION: Support parameter WIDTH for data width. Shift amount width = log2(WIDTH) bits. For WIDTH=8, shift amount is 3 bits (0-7).

3. SHIFT AMOUNT RANGE: Valid shift amounts are 0 to WIDTH-1. Define behavior for shift amount >= WIDTH (typically: result = 0 for SRL/SLL, result = all sign bits for SRA).

4. OPERATION SELECTION: Input signal shift_op (2 bits) selects operation. Define encoding (e.g., 00=SLL, 01=SRL, 10=SRA).

5. COMBINATIONAL DESIGN: Entire shift must complete in one cycle using barrel shifter structure (multi-stage muxing) or synthesizable shift operators.

6. SIGN EXTENSION: For SRA, replicate sign bit A[WIDTH-1] into shifted-in positions.

7. Test Case 1 - SRL: WIDTH=8, A=0b10000000 (0x80), shift_amount=1. Expected: result=0b01000000 (0x40).

8. Test Case 2 - SRA: WIDTH=8, A=0b10000000 (0x80, -128 signed), shift_amount=1. Expected: result=0b11000000 (0xC0, sign-extended).

9. Test Case 3 - SLL: WIDTH=8, A=0b00000001 (0x01), shift_amount=3. Expected: result=0b00001000 (0x08).

10. Test Case 4 - Zero Shift: shift_amount=0 for all operations. Expected: result=A (unchanged).

11. Test Case 5 - Maximum Shift: WIDTH=8, shift_amount=7. Verify correct behavior for all three operations.

---

## Hints

<details>
<summary>Hint 1</summary>
Classic barrel shifter: log2(WIDTH) stages, each shifts by power-of-2.
</details>
