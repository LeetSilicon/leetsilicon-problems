# Reorder Buffer Entry

**Domain:** computer-architecture — Cache & Memory  
**Difficulty:** Hard  
**Topics:** ROB, OOO, RTL

---

## Problem Statement

Implement Reorder Buffer (ROB) Entry Management Logic

Design ROB entry management for an out-of-order processor.\n\n' +
        '**Operations:**\n' +
        '```\nAllocate: store instruction at tail, increment tail\nWriteback: mark entry ready, store result\nCommit: retire from head if valid+ready, increment head\nFlush: invalidate entries between flush point and tail\n```\n\n' +
        '**Constraints:**\n' +
        '- Circular buffer with head/tail pointers\n' +
        '- Commit only in-order from head\n' +
        '- Full when (tail+1) % size == head

---

## Requirements

1. ROB ENTRY FIELDS: Each entry contains: (1) valid (entry occupied), (2) ready (instruction completed), (3) dest_reg (destination register tag), (4) value (result value or pointer to physical register), (5) exception flags (optional), (6) PC (optional, for debugging).

2. CIRCULAR BUFFER: ROB is circular buffer with head and tail pointers. Size: NUM_ENTRIES. Head points to oldest instruction (commit candidate). Tail points to next free entry (allocation).

3. ALLOCATION (DISPATCH): On instruction dispatch, allocate entry at tail. Store instruction info. Increment tail pointer. If full (tail+1 == head), stall dispatch.

4. WRITEBACK (MARK READY): When instruction completes, find its ROB entry (by ROB ID), mark ready=1, store result value.

5. COMMIT (RETIRE): Commit instructions in-order from head. Only commit if head entry is valid and ready. Increment head pointer. Free entry (valid=0).

6. FLUSH: On mispredict or exception, invalidate all younger entries (between flush point and tail). Options: (1) Reset tail to flush point, (2) Invalidate entries individually.

7. FULL/EMPTY STATUS: Full when (tail+1) % NUM_ENTRIES == head. Empty when tail == head.

8. Test Case 1 - Allocate, Writeback, Commit: Allocate instruction at tail. Later, mark ready. Then commit from head. Verify head increments, entry freed.

9. Test Case 2 - Not-Ready Blocks Commit: Head entry not ready (ready=0). Younger entry is ready. Expected: commit stalls at head, does not skip to younger entry.

10. Test Case 3 - Flush on Mispredict: Allocate several instructions. Mispredict detected. Flush entries after mispredict point. Expected: tail updated, flushed entries invalid.

---

## Hints


