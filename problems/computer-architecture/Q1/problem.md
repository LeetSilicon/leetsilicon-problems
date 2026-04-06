# LRU Replacement Policy

**Domain:** computer-architecture — Cache & Memory  
**Difficulty:** Hard  
**Topics:** Cache, Replacement Policy, RTL

---

## Problem Statement

Implement True LRU Replacement for 4-Way Set-Associative Cache

Design a 4-way set-associative cache implementing true Least Recently Used (LRU) replacement policy.\n\n' +
        'Track access order for each cache set. On cache miss with all ways occupied, evict the least recently used way. Update LRU state on every access (hit or refill). The LRU module does not distinguish read vs write — it simply tracks the order of accesses.\n\n' +
        '**Example:**\n' +
        '```\nFill set with tags A, B, C, D (in order)\nAccess B (hit) → B becomes MRU\nAccess new tag E (miss) → Evicts A (true LRU)\n```\n\n' +
        '**Constraints:**\n' +
        '- 4-way set-associative\n' +
        '- Prefer invalid ways before evicting valid ones\n' +
        '- Update LRU on every access type

---

## Requirements

1. CORRECTNESS: Update LRU ordering state on every cache access (read hit, write hit, miss with refill).

2. ALLOCATION PRIORITY: On cache miss, if any way in the set is invalid (free), allocate that invalid way before evicting any valid way.

3. EVICTION POLICY: On cache miss with all ways valid, select and evict the way with the oldest access timestamp (true LRU).

4. STATE MANAGEMENT: Maintain per-set LRU state using either timestamps (one per way) or a ranking/ordering scheme that clearly identifies the LRU way.

5. EDGE CASES: Handle reset (initialize all ways as invalid), concurrent accesses, and invalid inputs gracefully.

6. Test Case 1 - Cold Miss: Starting from empty cache, access set S with tag A (read operation). Expected: miss detected, allocate any invalid way, mark valid, set that way as Most Recently Used (MRU).

7. Test Case 2 - LRU Update on Hit: Fill cache set with tags A, B, C, D in order. Access tag B (hit). Expected: B becomes MRU. Then access new tag E (miss). Expected: E evicts the true LRU (not B), which should be A.

8. Test Case 3 - Write Hit Updates: After filling set with A, B, C, D, perform write to tag C. Expected: C becomes MRU. Verify LRU victim selection excludes C on next miss (victim should be A or whichever is true LRU).

---

## Hints

<details>
<summary>Hint 1</summary>
Implement using: (1) timestamp counter per way, (2) LRU ordering matrix, or (3) LRU stack.
</details>

<details>
<summary>Hint 2</summary>
On each access, update accessed way to MRU and shift others down.
</details>

<details>
<summary>Hint 3</summary>
Check all ways for invalid status before evicting any valid way.
</details>
