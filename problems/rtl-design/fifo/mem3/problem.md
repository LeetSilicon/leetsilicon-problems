# Direct-Mapped Cache

**Domain:** rtl-design — FIFO / Queue  
**Difficulty:** Hard  
**Topics:** Cache, Memory, Design

---

## Problem Statement

Implement Direct-Mapped Cache with Tag, Valid, and Data Storage

Design a direct-mapped cache with tag comparison for hit/miss detection.\n\n' +
        '**Address breakdown:**\n' +
        '```\n[  TAG  |  INDEX  |  OFFSET  ]\nTag: stored for comparison\nIndex: selects cache line\nOffset: selects byte within line\n```\n\n' +
        '**Constraints:**\n' +
        '- Hit: valid[index]=1 AND tag[index]=addr_tag\n' +
        '- Choose write policy (write-through or write-back)\n' +
        '- No replacement choice (direct-mapped)

---

## Requirements

1. CACHE ORGANIZATION: Direct-mapped: each memory address maps to exactly one cache line (set). Cache has NUM_LINES lines. Each line contains: (1) valid bit, (2) tag bits, (3) data block.

2. ADDRESS BREAKDOWN: Split incoming address into three fields: (1) Offset: selects byte/word within cache line (low bits), (2) Index: selects cache line/set (middle bits), (3) Tag: stored with line for comparison (high bits). Index_bits = log2(NUM_LINES). Offset_bits = log2(LINE_SIZE). Tag_bits = ADDR_WIDTH - Index_bits - Offset_bits.

3. HIT/MISS DETECTION: Access cache line at Index. Check: valid[Index]==1 AND tag[Index]==Address_Tag. If both true: HIT, return data. Else: MISS.

4. CACHE LINE FILL (ON MISS): On miss, allocate cache line: (1) Set valid[Index]=1, (2) Store tag[Index]=Address_Tag, (3) Fetch data from memory and store in data[Index]. For simplicity, can implement single-word lines (LINE_SIZE=1 word) to avoid burst transfers.

5. WRITE POLICY: Define and implement: (1) Write-Through: On write hit, update cache and immediately write to memory. On write miss, write directly to memory (with or without allocation to cache). (2) Write-Back: On write hit, update cache and set dirty bit (implement dirty bit). On eviction of dirty line, write back to memory. Document chosen policy.

6. WRITE-ALLOCATE POLICY: On write miss: (1) Write-Allocate: Fetch line into cache then write, (2) No-Write-Allocate: Write directly to memory, don't allocate a cache line. Document choice.

7. REPLACEMENT: Direct-mapped has no choice - always replace the line at computed index on miss.

8. RESET: On reset, clear all valid bits to 0 (invalidate entire cache). Tags and data can be undefined.

9. Test Case 1 - Cold Miss Then Hit: Access address A (maps to index I, tag T). First access: valid[I]=0, MISS. Fill cache: valid[I]=1, tag[I]=T, data[I]=memory[A]. Second access to same address A: valid[I]=1, tag[I]==T, HIT, return data[I].

10. Test Case 2 - Conflict Miss: Access address A (index I, tag T1), fills cache. Access address B (same index I, different tag T2). Result: MISS (tag mismatch), evict A, fill with B. Access A again: MISS (tag mismatch), evict B, fill with A.

11. Test Case 3 - Write Hit (Write-Through): Write to cached address C. Expected: cache data updated, write request to memory issued. Both cache and memory have new value.

12. Test Case 4 - Write Miss (Write-Allocate): Write to uncached address D. Expected: MISS, fetch line from memory into cache (allocate), then write to cache. If write-through, also write to memory.

13. Test Case 5 - Multiple Accesses: Read addr 0x100, 0x104, 0x108 (assuming they map to different indices). Each should be independent miss then hit on re-access.

---

## Hints


