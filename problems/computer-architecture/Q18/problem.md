# Instruction Decode

**Domain:** computer-architecture — Cache & Memory  
**Difficulty:** Medium  
**Topics:** Pipeline, Decode, RTL

---

## Problem Statement

Implement Instruction Decode Logic

Design the main instruction decoder extracting fields from a 32-bit instruction and generating pipeline control signals.\n\n' +
        '**Example:**\n' +
        '```\nR-type ADD: → RegWrite=1, ALUSrc=reg, MemRead=0\nLoad LW:    → RegWrite=1, ALUSrc=imm, MemRead=1\nStore SW:   → RegWrite=0, MemWrite=1\nIllegal:    → all writes=0, illegal_instruction=1\n```\n\n' +
        '**Constraints:**\n' +
        '- Support R/I/S/B/U/J instruction formats\n' +
        '- Sign-extend immediates per format\n' +
        '- Safe defaults for illegal opcodes

---

## Requirements

1. INPUT: 32-bit instruction word (or other defined width).

2. INSTRUCTION FIELD EXTRACTION: Extract fields based on ISA encoding: (1) opcode, (2) Rd (destination register), (3) Rs1, Rs2 (source registers), (4) funct3, funct7 (function fields), (5) immediate values (sign-extended).

3. CONTROL SIGNAL OUTPUTS: Generate signals for all pipeline stages: (1) RegWrite (write to register file), (2) MemRead, MemWrite (memory access), (3) ALUSrc (ALU operand from register or immediate), (4) ALUOp (ALU operation type), (5) Branch (branch instruction), (6) Jump, (7) MemToReg (write back from memory or ALU), (8) others as needed.

4. INSTRUCTION FORMAT DECODE: Identify instruction type (R/I/S/B/U/J) from opcode. Extract and sign-extend immediate based on format.

5. ILLEGAL INSTRUCTION HANDLING: For undefined opcodes: (1) Set all write enables (RegWrite, MemWrite) to 0 (prevent state changes), (2) Optionally assert illegal_instruction flag, (3) Can also trigger exception in later design.

6. LATCH AVOIDANCE: Assign default values to all control signals, then override in case statement for legal opcodes.

7. Test Case 1 - R-Type Decode: Instruction: add x3, x1, x2. Expected: RegWrite=1, ALUSrc=0 (use register), MemRead=0, MemWrite=0, ALUOp=ADD.

8. Test Case 2 - Load Decode: Instruction: lw x5, 8(x2). Expected: MemRead=1, RegWrite=1, ALUSrc=1 (use immediate), MemToReg=1 (write from memory), ALUOp=ADD (for address calc).

9. Test Case 3 - Store Decode: Instruction: sw x6, 12(x3). Expected: MemWrite=1, RegWrite=0, ALUSrc=1, MemToReg=X

10. Test Case 4 - Illegal Instruction: Opcode: 0x7F (undefined). Expected: RegWrite=0, MemWrite=0, MemRead=0, illegal_instruction=1.

---

## Hints

<details>
<summary>Hint 1</summary>
Case on opcode: 0110011 → R-type, 0000011 → Load, 0100011 → Store.
</details>
