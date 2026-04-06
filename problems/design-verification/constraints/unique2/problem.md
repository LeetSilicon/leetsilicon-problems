# Divide into Three Unique Queues

**Domain:** design-verification — Constraints  
**Difficulty:** Hard  
**Topics:** Constraints, Queue

---

## Problem Statement

Partition Queue into Three Disjoint Queues

Write UVM SV constraint: given one input queue, divide all elements into three output queues such that: (1) Each input element appears in exactly one output queue (partition), (2) Three output queues are pairwise disjoint (no element in multiple queues), (3) Concatenating three outputs in any order reproduces input multiset.

---

## Requirements

1. INPUT QUEUE: Source queue q_in with N elements. Values may have duplicates.

2. OUTPUT QUEUES: Three queues q_out[0], q_out[1], q_out[2].

3. PARTITION PROPERTY: Every element from q_in appears in exactly one output queue. No element dropped, no element duplicated.

4. DISJOINTNESS: q_out[0], q_out[1], q_out[2] have no common elements (by position, not value). Intersection(q_out[i], q_out[j]) == empty for i≠j.

5. MULTISET EQUALITY: Concatenate q_out[0] + q_out[1] + q_out[2] (any order). Result contains same elements (with multiplicity) as q_in.

6. QUEUE SIZES: q_out[0].size() + q_out[1].size() + q_out[2].size() == q_in.size().

7. EMPTY QUEUES ALLOWED: Output queues may be empty (unless additional constraint). No requirement for non-empty unless specified.

8. Test Case 1 - Partition Verification: After randomize, concatenate all output queues. Sort both input and concatenated output. Assert equal.

9. Test Case 2 - Non-Trivial Split: Verify not all elements go to one queue always. Check all three queues receive elements over multiple randomizations.

10. Test Case 3 - Duplicates Handling: q_in = [5,3,5,7]. Verify partition handles duplicates correctly (both 5s assigned independently).

11. Test Case 4 - Size Consistency: Assert sum of output sizes equals input size.

---

## Hints


