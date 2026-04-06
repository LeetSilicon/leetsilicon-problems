# ALU Control Decoder

**Domain:** computer-architecture — Cache & Memory  
**Difficulty:** Medium  
**Topics:** ALU, Decoder, RTL

---

## Problem Statement

Design ALU Control Signal Decoder

Implement a decoder that converts instruction opcode/function fields into ALU control signals.\n\n' +
        'Takes opcode, funct3, funct7 as inputs. Produces ALU operation select and operand controls. Handles illegal opcodes with safe defaults.\n\n' +
        '**Example:**\n' +
        '```\nR-type ADD: opcode=0110011, funct3=000, funct7=0000000\n→ alu_op=ADD, alu_src=reg, reg_write=1\n\nIllegal opcode=0xFF\n→ alu_op=ADD, reg_write=0, illegal=1\n```\n\n' +
        '**Constraints:**\n' +
        '- Complete mapping from opcode/funct to control signals\n' +
        '- Safe defaults for undefined opcodes (no writes)\n' +
        '- Assign defaults before case to prevent latches

---

## Requirements

1. INPUT SIGNALS: (1) opcode (e.g., 7 bits), (2) funct3 (3 bits), (3) funct7 (7 bits) or similar encoding per ISA. Define input encoding clearly.

2. OUTPUT SIGNALS: (1) alu_op (operation select for ALU), (2) alu_src (select immediate vs register), (3) optional: reg_write enable, mem_read, mem_write, branch control.

3. ENCODING DEFINITION: Document complete mapping from opcode/funct to control signals in comment block or specification.

4. DEFAULT/ILLEGAL HANDLING: For undefined or illegal opcode combinations, output safe defaults (e.g., alu_op=ADD, reg_write=0, no memory access).

5. LATCH AVOIDANCE: Assign default values to all outputs before case statement, then override specific cases. Prevents inferred latches.

6. OPTIONAL ILLEGAL FLAG: Generate illegal_instruction output flag when opcode is not recognized.

7. Test Case 1 - Known Opcodes: Provide opcode mapping table. For each entry, verify decoder produces correct control signal combination.

8. Test Case 2 - Illegal Opcode: Input opcode=0xFF (undefined). Expected: outputs are safe defaults (no writes, no memory access), optional illegal_instruction=1.

9. Test Case 3 - One-Hot Control Check: If using one-hot encoding for certain controls, verify exactly one bit is set for all legal opcodes.

---

## Hints

<details>
<summary>Hint 1</summary>
Truth table: (opcode, funct3, funct7) → controls.
</details>

<details>
<summary>Hint 2</summary>
Default: alu_op=ADD, reg_write=0, mem_write=0.
</details>

<details>
<summary>Hint 3</summary>
Separate main decode from ALU decode for cleaner design.
</details>
