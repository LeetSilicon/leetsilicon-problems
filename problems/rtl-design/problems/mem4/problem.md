# Write-Back Cache with Replacement

**Domain:** rtl-design — FIFO / Queue  
**Difficulty:** Hard  
**Topics:** Cache, Replacement Policy, Design

---

## Problem Statement

Design Write-Back Set-Associative Cache with LRU or FIFO Replacement

Implement a set-associative cache with write-back policy, dirty bit tracking, and configurable replacement.\n\n' +
        '**Operations:**\n' +
        '```\nWrite hit:  update cache + set dirty (no memory write)\nClean eviction: no writeback needed\nDirty eviction: writeback to memory before refill\n```\n\n' +
        '**Constraints:**\n' +
        '- Set-associative with parallel tag comparison\n' +
        '- LRU or FIFO replacement (document choice)\n' +
        '- Dirty bit management for write-back

---

## Requirements

1. SET-ASSOCIATIVE: Cache divided into sets, each set has multiple ways (associativity). Example: 4-way set-associative. Address maps to set; all ways in set checked in parallel.

2. METADATA PER LINE: Each cache line (way within set) contains: (1) valid bit, (2) dirty bit, (3) tag, (4) data, (5) replacement state (LRU bits or FIFO pointer).

3. ADDRESS MAPPING: Index selects set. Tag compared against all ways in set. Offset selects data within line.

4. HIT DETECTION: Hit if any way in selected set is valid and has matching tag. Identify which way hit (hit_way).

5. WRITE-BACK POLICY: On write hit: (1) Update data in cache, (2) Set dirty bit for that line, (3) Do NOT write to memory immediately. On read/write miss with clean eviction: No writeback needed. On read/write miss with dirty eviction: Generate writeback request before refilling.

6. DIRTY BIT MANAGEMENT: Set dirty=1 on write hit. Clear dirty=0 on line fill (new data). On eviction, if dirty=1, writeback required.

7. REPLACEMENT POLICY: Choose LRU or FIFO, document clearly. LRU: Track access order per set, evict least recently used way. FIFO: Track insertion order per set, evict oldest inserted way.

8. LRU IMPLEMENTATION: For each set, maintain LRU state. On hit: Update accessed way to MRU (Most Recently Used). On miss: Select LRU way as victim, update to MRU after fill.

9. FIFO IMPLEMENTATION: For each set, maintain FIFO pointer indicating next way to replace. On fill: Use FIFO pointer way, increment pointer (circular).

10. WRITEBACK GENERATION: On eviction of dirty line: (1) Assert writeback request, (2) Provide writeback address (victim_tag + index + offset), (3) Provide data to write back, (4) Wait for memory acknowledgment before reusing line.

11. WRITE-ALLOCATE: On write miss, allocate line in cache (fetch from memory if needed, or just allocate), then write. Document if write-allocate or no-write-allocate.

12. RESET: Clear all valid and dirty bits. LRU/FIFO state can reset to known initial state.

13. Test Case 1 - Dirty Eviction: Fill set S with 4 lines (all ways occupied). Write to line in way 0 (dirty[S][0]=1). Access new address mapping to set S with different tag (miss, requires eviction). Expected: Way selected per LRU/FIFO. If victim is way 0 (dirty), writeback request generated with victim address and data. After writeback ack, new line fills way 0.

14. Test Case 2 - Clean Eviction: Fill set S, all lines clean (dirty=0). Access new address causing eviction. Expected: Victim way selected per policy. No writeback request (clean). New line fills immediately.

15. Test Case 3 - Replacement Determinism (LRU): Fill 4-way set with A, B, C, D in order. Access A (hit, A becomes MRU). Access new E (miss). Expected: LRU victim is B (oldest among B,C,D). E replaces B.

16. Test Case 4 - Replacement Determinism (FIFO): Fill 4-way set with A, B, C, D in order. Access A (hit, no change to FIFO order). Access new E (miss). Expected: FIFO victim is A (first inserted). E replaces A.

17. Test Case 5 - Write-Allocate: Write to uncached address X. Expected: MISS, allocate line in cache (may require eviction if set full), mark dirty, store written data.

18. Test Case 6 - Multiple Writebacks: Fill set, write to multiple ways (multiple dirty). Sequential misses evict all dirty ways. Expected: Writeback requests generated for each dirty victim in correct order.

---

## Hints


