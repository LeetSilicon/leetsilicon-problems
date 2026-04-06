# Data Forwarding Logic

**Domain:** computer-architecture — Cache & Memory  
**Difficulty:** Hard  
**Topics:** Pipeline, Forwarding, RTL

---

## Problem Statement

Implement Data Forwarding Unit for Pipeline Hazard Mitigation

Design a forwarding unit that detects RAW hazards and forwards results from EX/MEM and MEM/WB stages to ALU inputs.\n\n' +
        '**Forwarding priority:**\n' +
        '```\nEX/MEM forward (most recent) takes priority over MEM/WB\nForwardA/B: 00=no fwd, 01=MEM/WB, 10=EX/MEM\n```\n\n' +
        '**Constraints:**\n' +
        '- EX/MEM has priority over MEM/WB for same register\n' +
        '- Never forward for zero register (x0)\n' +
        '- Only forward when source RegWrite=1

---

## Requirements

1. FORWARDING SOURCES: (1) EX/MEM stage: result from previous instruction just computed, (2) MEM/WB stage: result from instruction two cycles ago (from memory or ALU).

2. FORWARDING TARGETS: ALU operand A and operand B in EX stage. Insert muxes before ALU inputs to select between register file data, EX forwarding, or MEM forwarding.

3. FORWARD CONDITION FOR EX HAZARD: Forward from EX/MEM when: (1) EX_MEM.RegWrite=1, (2) EX_MEM.Rd != 0, (3) EX_MEM.Rd == ID_EX.Rs1 (for operand A) or EX_MEM.Rd == ID_EX.Rs2 (for operand B).

4. FORWARD CONDITION FOR MEM HAZARD: Forward from MEM/WB when: (1) MEM_WB.RegWrite=1, (2) MEM_WB.Rd != 0, (3) MEM_WB.Rd == ID_EX.Rs1 or MEM_WB.Rd == ID_EX.Rs2, (4) NOT already forwarding from EX/MEM (EX has priority).

5. FORWARDING PRIORITY: If both EX/MEM and MEM/WB can forward to same operand, EX/MEM takes priority (it has more recent data).

6. ZERO REGISTER: If ISA has hardwired zero (x0), never forward for Rd=0 or Rs=0.

7. FORWARD SELECT SIGNALS: Generate 2-bit select signals (ForwardA, ForwardB) for each ALU operand: 00=no forward (use register file), 01=forward from MEM/WB, 10=forward from EX/MEM.

8. Test Case 1 - EX Forward: Cycle N: add x1, x2, x3 (writes x1 in EX/MEM). Cycle N+1: sub x4, x1, x5 (needs x1 in EX). Expected: ForwardA=10 (forward from EX/MEM stage).

9. Test Case 2 - MEM Forward: Cycle N: add x1, x2, x3 (writes x1). Cycle N+1: nop. Cycle N+2: and x6, x1, x7 (needs x1). Expected: ForwardA=01 (forward from MEM/WB stage).

10. Test Case 3 - Priority Resolution: Cycle N: add x1, ... (in MEM/WB). Cycle N: sub x1, ... (in EX/MEM). Cycle N+1: or x2, x1, x3. Expected: ForwardA=10 (EX/MEM wins over MEM/WB).

---

## Hints

<details>
<summary>Hint 1</summary>
ForwardA: if (EX_MEM matches) 10; else if (MEM_WB matches) 01; else 00.
</details>

<details>
<summary>Hint 2</summary>
Mux at ALU: case(ForwardA) 00: reg_data; 01: MEM_WB_data; 10: EX_MEM_data.
</details>

<details>
<summary>Hint 3</summary>
Priority is critical: always check EX/MEM before MEM/WB.
</details>
