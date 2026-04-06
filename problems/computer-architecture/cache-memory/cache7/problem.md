# MSHR Implementation

**Domain:** computer-architecture — Cache & Memory  
**Difficulty:** Hard  
**Topics:** Cache, MSHR, RTL

---

## Problem Statement

Implement Miss Status Holding Register (MSHR) for Non-Blocking Cache

Design MSHR structure to track outstanding cache misses and enable non-blocking operation.\n\n' +
        'Each entry stores miss address and requester info. Support merging multiple requests to the same cache line. Implement allocation, deallocation, and matching logic.\n\n' +
        '**Example:**\n' +
        '```\nCPU0 misses on addr A → allocates MSHR[0]\nCPU1 misses on addr A → merges into MSHR[0]\nRefill completes → both CPUs served, MSHR[0] freed\n```\n\n' +
        '**Constraints:**\n' +
        '- Configurable number of MSHR entries\n' +
        '- Backpressure when all entries occupied\n' +
        '- Match on cache line address (ignore block offset)

---

## Requirements

1. ENTRY STRUCTURE: Each MSHR entry contains: (1) valid bit, (2) cache line address (tag + index), (3) requester ID(s) or waiter list, (4) request type (read/write), (5) optional: pending write data.

2. CONFIGURABLE SIZE: Parameterize number of MSHR entries. Define full/empty conditions and backpressure policy when all entries occupied.

3. ALLOCATION: On cache miss, allocate free MSHR entry. Store miss address (line address, not byte address). If no free entry, stall/backpressure cache pipeline.

4. MATCHING/MERGING: On subsequent miss, check all valid MSHR entries for matching line address. If match found, merge request with existing entry (add requester to waiter list) instead of allocating new entry or issuing duplicate memory request.

5. DEALLOCATION: When memory refill completes for an MSHR entry, deallocate that entry (clear valid bit). Wake up all merged requesters waiting on that entry.

6. REQUESTER TRACKING: Support multiple requesters per entry (bitmask or list). On refill completion, signal all waiting requesters.

7. Test Case 1 - Allocate and Complete: CPU miss to address A allocates MSHR[0]. Memory returns data. MSHR[0] deallocated, CPU request completes.

8. Test Case 2 - Merge Same Line: CPU0 misses on address A (allocates MSHR[0]). CPU1 misses on same address A before refill completes. Expected: MSHR[0] records both CPU0 and CPU1 as waiters. Only one memory request issued. On refill, both CPUs served.

9. Test Case 3 - MSHR Full Backpressure: Fill all N MSHR entries. New miss occurs on different address. Expected: cache pipeline stalls/backpressures until an MSHR entry is freed by completing refill.

---

## Hints

<details>
<summary>Hint 1</summary>
Match on (tag + index), ignore block offset.
</details>

<details>
<summary>Hint 2</summary>
Waiter structure: bitmask for small requester IDs, or linked list.
</details>

<details>
<summary>Hint 3</summary>
Free entry: priority encoder to find first invalid entry.
</details>
