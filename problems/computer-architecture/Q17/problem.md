# Branch Comparator

**Domain:** computer-architecture — Cache & Memory  
**Difficulty:** Medium  
**Topics:** Pipeline, Branch, RTL

---

## Problem Statement

Design Branch Comparator and Control Logic

Implement branch comparison logic evaluating BEQ, BNE, BLT, BGE conditions. Generate branch-taken signal and next-PC selection.\n\n' +
        '**Example:**\n' +
        '```\nBEQ: Rs1=5, Rs2=5 → taken=1\nBLT: Rs1=-1(0xFF), Rs2=+1(0x01) → taken=1\nBLTU: Rs1=255(0xFF), Rs2=1(0x01) → taken=0\n```\n\n' +
        '**Constraints:**\n' +
        '- Support BEQ, BNE, BLT, BGE, BLTU, BGEU\n' +
        '- Consider forwarding into comparator\n' +
        '- Output: branch_taken, PC_src

---

## Requirements

1. BRANCH TYPES SUPPORTED: Document which branch types are implemented. Minimum: (1) BEQ (branch if equal), (2) BNE (branch if not equal). Optional: (3) BLT (less than, signed), (4) BGE (greater or equal, signed), (5) BLTU, BGEU (unsigned versions).

2. COMPARISON LOGIC: Compare two register operands (typically Rs1 and Rs2). Generate comparison flags: (1) eq (equal), (2) lt_signed (less than, signed), (3) lt_unsigned (less than, unsigned).

3. BRANCH DECISION: Based on branch_type input and comparison flags, generate branch_taken output. BEQ: taken = eq. BNE: taken = !eq. BLT: taken = lt_signed. BGE: taken = !lt_signed.

4. CONTROL OUTPUTS: (1) branch_taken (1-bit), (2) next_pc_select or PC_src to choose between PC+4 and branch_target.

5. OPERAND FORWARDING: If branch comparator is in ID stage, operands may need forwarding from EX, MEM, or WB stages. Define forwarding muxes for branch operands.

6. BRANCH TYPE ENCODING: Define branch_type encoding clearly (e.g., 3-bit: 000=BEQ, 001=BNE, 010=BLT, 011=BGE, 100=BLTU, 101=BGEU).

7. Test Case 1 - BEQ Taken: Rs1=5, Rs2=5, branch_type=BEQ. Expected: branch_taken=1.

8. Test Case 2 - BNE Not Taken: Rs1=3, Rs2=3, branch_type=BNE. Expected: branch_taken=0.

9. Test Case 3 - BLT Signed: Rs1=0xFF (-1 signed, 8-bit), Rs2=0x01 (+1), branch_type=BLT. Expected: branch_taken=1 (since -1 < 1).

10. Test Case 4 - BLTU Unsigned: Rs1=0xFF (255 unsigned), Rs2=0x01 (1), branch_type=BLTU. Expected: branch_taken=0 (255 > 1 unsigned).

---

## Hints

<details>
<summary>Hint 1</summary>
eq = (Rs1 == Rs2); lt_signed = ($signed(Rs1) < $signed(Rs2));
</details>

<details>
<summary>Hint 2</summary>
Branch mux: case(type) BEQ: eq; BNE: !eq; BLT: lt_signed; ...
</details>

<details>
<summary>Hint 3</summary>
PC_src = branch_taken & is_branch_instruction.
</details>
