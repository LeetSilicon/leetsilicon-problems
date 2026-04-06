# Register Renaming

**Domain:** computer-architecture — Cache & Memory  
**Difficulty:** Hard  
**Topics:** Register File, Renaming, RTL

---

## Problem Statement

Design Register Renaming Logic with Map Table and Free List

Implement register renaming for out-of-order execution.\n\n' +
        'Maintain a map table (architectural → physical) and a free list of available physical registers.\n\n' +
        '**Operations:**\n' +
        '```\nRename: read map table for sources, allocate new phys for dest\nCommit: return old physical register to free list\nFlush:  restore map table to checkpoint\n```\n\n' +
        '**Constraints:**\n' +
        '- Stall when free list is empty\n' +
        '- Save old mapping for recovery\n' +
        '- Support misspeculation recovery

---

## Requirements

1. MAP TABLE: Array mapping architectural register ID to physical register ID. Size: NUM_ARCH_REGS entries. Each entry stores current physical register ID for that architectural register.

2. FREE LIST: List/FIFO of available physical register IDs. Initially contains all physical registers except those reserved for initial architectural state.

3. RENAME OPERATION: On instruction rename: (1) Read map table for source architectural registers → get source physical registers. (2) Allocate new physical register from free list for destination. (3) Update map table: arch_dest → new_phys_reg. (4) Save old physical register mapping for recovery.

4. FREE LIST EMPTY: When free list is empty, stall rename (cannot allocate new physical register). Assert stall/backpressure signal.

5. COMMIT/DEALLOCATION: On instruction commit (in-order): return old physical register (that was overwritten in map table) to free list. This physical register is no longer needed.

6. RECOVERY (OPTIONAL): On branch mispredict or exception: restore map table to checkpoint state and return speculative physical registers to free list.

7. OUTPUTS: (1) new_phys_reg (allocated physical register), (2) old_phys_reg (previous mapping, for recovery), (3) rename_grant (allocation successful), (4) stall (free list empty).

8. Test Case 1 - Simple Rename: Rename architectural register r1 twice in sequence. Expected: map table for r1 updates to new physical register each time. Two different physical registers allocated.

9. Test Case 2 - Free List Empty: Allocate physical registers until free list exhausted. Next rename request. Expected: rename_grant=0, stall asserted, no allocation.

10. Test Case 3 - Commit Frees Physical Register: Rename r1 (allocates p5, old mapping was p2). Later commit instruction. Expected: p2 returned to free list and becomes available for reallocation.

---

## Hints


