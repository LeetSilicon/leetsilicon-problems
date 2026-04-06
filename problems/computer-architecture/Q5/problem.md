# Write-Back Dirty Bit Management

**Domain:** computer-architecture — Cache & Memory  
**Difficulty:** Medium  
**Topics:** Cache, Write-Back, RTL

---

## Problem Statement

Implement Dirty Bit Logic for Write-Back Cache

Design dirty bit management for a write-back cache.\n\n' +
        'Set dirty on write hit, clear after writeback completes. Generate writeback requests when evicting dirty lines. Clean lines are replaced without writeback.\n\n' +
        '**Example:**\n' +
        '```\nRead miss fills line A → dirty=0\nWrite hit to A → dirty=1\nEvict A → writeback request generated\n```\n\n' +
        '**Constraints:**\n' +
        '- Dirty bit stored per cache line alongside tag and valid\n' +
        '- Writeback address = victim tag + cache index\n' +
        '- Clean eviction requires no memory traffic

---

## Requirements

1. DIRTY BIT UPDATE: On write hit to cache line, set dirty bit for that line to 1. On cache miss with refill (read), initialize dirty bit to 0 for newly filled line.

2. WRITE-ALLOCATE: If cache uses write-allocate policy and write occurs on refill, set dirty=1. Otherwise keep dirty=0 on read refill.

3. EVICTION CHECK: On cache line eviction (replacement), check victim line dirty bit. If dirty=1, must writeback before reusing line. If dirty=0, can immediately reuse.

4. WRITEBACK REQUEST: When evicting dirty line, assert writeback request signal with victim address (tag + index). Provide victim data for writeback.

5. DIRTY BIT CLEAR: After writeback completes (acknowledgment from memory), clear dirty bit for that line. Line can now be safely reused.

6. EDGE CASES: Handle reset (all dirty bits cleared), line invalidation (clear dirty), concurrent write and eviction.

7. Test Case 1 - Write Hit Sets Dirty: Read miss fills line A (dirty=0). Write hit to line A. Expected: dirty bit for A becomes 1.

8. Test Case 2 - Clean Eviction: Line B is victim for replacement, dirty=0. Expected: no writeback request generated, line immediately reusable.

9. Test Case 3 - Dirty Eviction Writeback: Line C is victim, dirty=1. Expected: (1) writeback request asserted with address from tag+index of C, (2) writeback data provided, (3) after memory ack, dirty bit cleared.

---

## Hints

<details>
<summary>Hint 1</summary>
Update dirty in same cycle as write commit.
</details>

<details>
<summary>Hint 2</summary>
Writeback FSM: IDLE → WB_REQ → WB_WAIT → WB_DONE → clear dirty.
</details>

<details>
<summary>Hint 3</summary>
Separate need_writeback from writeback_in_flight to avoid double-issue.
</details>
