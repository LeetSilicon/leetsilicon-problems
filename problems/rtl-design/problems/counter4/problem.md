# Parameterizable Barrel Shifter

**Domain:** rtl-design — FIFO / Queue  
**Difficulty:** Hard  
**Topics:** Barrel Shifter, Combinational, Design

---

## Problem Statement

Implement Parameterizable Barrel Shifter for Shift Operations

Design a single-cycle barrel shifter for SLL, SRL, and SRA operations.\n\n' +
        '**Example (WIDTH=8):**\n' +
        '```\nSRL: 0x80, shift=1 → 0x40 (zero-fill MSB)\nSRA: 0x80, shift=1 → 0xC0 (sign-extend MSB)\nSLL: 0x01, shift=3 → 0x08 (zero-fill LSB)\n```\n\n' +
        '**Constraints:**\n' +
        '- Parameterizable WIDTH, shift amount = log2(WIDTH) bits\n' +
        '- Single-cycle combinational design\n' +
        '- log2(WIDTH) stages, each shifts by power-of-2

---

## Requirements

1. PARAMETERIZATION: Parameter WIDTH defines operand width. Shift amount width = log2(WIDTH) bits.

2. SHIFT OPERATIONS: (1) SLL (Shift Left Logical): Fill vacated LSB positions with 0. (2) SRL (Shift Right Logical): Fill vacated MSB positions with 0. (3) SRA (Shift Right Arithmetic): Fill vacated MSB positions with sign bit (MSB of input). Document which operations implemented.

3. SHIFT AMOUNT: Input 

4.  (log2(WIDTH) bits). Valid range: 0 to WIDTH-1. Define behavior for shift_amt >= WIDTH (typically: result = 0 for SLL/SRL, all sign bits for SRA).

5. OPERATION SELECT: Input 

6.  to select operation. Encoding example: 2'b00=SLL, 2'b01=SRL, 2'b10=SRA.

7. SINGLE CYCLE: All shift operations complete in one clock cycle (combinational logic). No multi-cycle shifting.

8. BARREL SHIFTER STRUCTURE: Implement using staged conditional shifts (log2(WIDTH) stages). Each stage shifts by power-of-2 (1, 2, 4, 8, ...) conditioned on shift amount bits.

9. INPUTS: data_in (WIDTH bits), shift_amt (log2(WIDTH) bits), shift_op (operation select).

10. OUTPUT: data_out (WIDTH bits, shifted result).

11. Test Case 1 - SLL: WIDTH=8, data_in=0b00000001 (0x01), shift_amt=3. Expected: data_out=0b00001000 (0x08, shifted left 3 positions).

12. Test Case 2 - SRL: WIDTH=8, data_in=0b10000000 (0x80), shift_amt=1. Expected: data_out=0b01000000 (0x40, shifted right 1, MSB filled with 0).

13. Test Case 3 - SRA: WIDTH=8, data_in=0b10000000 (0x80, -128 signed), shift_amt=1. Expected: data_out=0b11000000 (0xC0, shifted right 1, MSB filled with sign bit 1).

14. Test Case 4 - Zero Shift: shift_amt=0 for all operations. Expected: data_out = data_in (no change).

15. Test Case 5 - Maximum Shift: WIDTH=8, shift_amt=7. SLL: data_out=0x00 (if data_in[0]=0) or 0x80 (if data_in[0]=1). SRL: data_out=0x00 (if data_in[7]=0) or 0x01 (if data_in[7]=1). SRA: data_out=0xFF (if sign bit=1) or 0x00 (if sign bit=0).

16. Test Case 6 - Shift Amount Boundary: WIDTH=8, shift_amt=8 (out of range). Expected: Defined behavior (all zeros for SLL/SRL, all sign for SRA, or handle as error).

---

## Hints


