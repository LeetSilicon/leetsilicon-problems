# Hazard Detection Unit

**Domain:** computer-architecture — Cache & Memory  
**Difficulty:** Hard  
**Topics:** Pipeline, Hazards, RTL

---

## Problem Statement

Design Hazard Detection Unit for Load-Use Data Hazard

Implement hazard detection for load-use data hazards in a pipelined processor.\n\n' +
        'Detect when an instruction in decode depends on a load in execute. Generate stall and bubble signals.\n\n' +
        '**Detection condition:**\n' +
        '```\nID_EX.MemRead == 1 AND\n(ID_EX.Rd == IF_ID.Rs1 OR ID_EX.Rd == IF_ID.Rs2) AND\nID_EX.Rd != 0\n```\n\n' +
        '**Constraints:**\n' +
        '- Stall for exactly 1 cycle\n' +
        '- Do not stall for hardwired zero register\n' +
        '- Gate Rs2 check for immediate instructions

---

## Requirements

1. LOAD-USE HAZARD DEFINITION: Occurs when: (1) Instruction in EX stage is a load (ID_EX.MemRead=1), (2) Instruction in ID stage uses the load destination register as source operand, (3) ID_EX.Rd matches IF_ID.Rs1 or IF_ID.Rs2.

2. HAZARD DETECTION LOGIC: Check if (ID_EX.MemRead==1) AND ((ID_EX.Rd == IF_ID.Rs1) OR (ID_EX.Rd == IF_ID.Rs2)). If true, assert hazard.

3. ZERO REGISTER EXCEPTION: If ISA has hardwired zero register (e.g., x0 in RISC-V), do NOT treat it as dependency. Add condition: AND (ID_EX.Rd != 0).

4. SOURCE REGISTER USAGE: Only compare Rs1/Rs2 if they are actually used by the instruction. For immediate instructions (no Rs2), ignore Rs2 comparison. Use instruction format decode or control signals.

5. STALL ACTIONS: On hazard detection: (1) Prevent PC update (PCWrite=0), (2) Prevent IF/ID update (IFIDWrite=0), (3) Insert NOP into EX stage by clearing ID/EX control signals (set RegWrite=0, MemWrite=0, etc.).

6. STALL DURATION: Stall for exactly 1 cycle to allow load to complete. After 1 cycle, data forwarding can resolve remaining dependencies.

7. Test Case 1 - Load-Use Hazard Detected: EX stage: lw x1, 0(x2) (MemRead=1, Rd=x1). ID stage: add x3, x1, x4 (Rs1=x1). Expected: hazard detected, stall asserted for 1 cycle.

8. Test Case 2 - No Hazard Different Registers: EX stage: lw x1, 0(x2). ID stage: add x3, x5, x6 (does not use x1). Expected: no hazard, no stall.

9. Test Case 3 - Source Not Used (Immediate Instruction): EX stage: lw x1, 0(x2). ID stage: addi x3, x1, 10 (uses Rs1=x1, but Rs2 is immediate). Expected: hazard detected for Rs1, not for Rs2.

---

## Hints

<details>
<summary>Hint 1</summary>
Hazard = ID_EX.MemRead & (ID_EX.Rd == IF_ID.Rs1 | ID_EX.Rd == IF_ID.Rs2) & (ID_EX.Rd != 0).
</details>

<details>
<summary>Hint 2</summary>
PCWrite = ~hazard; IFIDWrite = ~hazard.
</details>

<details>
<summary>Hint 3</summary>
Gate Rs2 check using instruction format decode.
</details>
