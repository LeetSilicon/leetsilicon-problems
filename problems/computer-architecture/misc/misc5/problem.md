# Functional Unit Tracker

**Domain:** computer-architecture — Cache & Memory  
**Difficulty:** Medium  
**Topics:** Functional Unit, Tracking, RTL

---

## Problem Statement

Design Functional Unit Busy/Free Tracking Module

Implement a tracker for functional unit availability in a multi-issue processor.\n\n' +
        '**Interface:**\n' +
        '```\nAllocate unit i → busy[i]=1\nDone unit i    → busy[i]=0\navailable = ~busy, any_available = |available\n```\n\n' +
        '**Constraints:**\n' +
        '- Bit-vector tracking: 1=busy, 0=free\n' +
        '- Define same-cycle allocate+free precedence\n' +
        '- Reset: all units free

---

## Requirements

1. BUSY VECTOR: Bit-vector indicating status of each functional unit. Size: NUM_UNITS bits. busy[i]=1 means unit i is occupied.

2. AVAILABILITY: available[i] = ~busy[i]. Scheduler uses available vector to select free unit.

3. ALLOCATION: On instruction issue to unit i, set busy[i]=1. Provide allocate interface: allocate_valid, allocate_unit_id.

4. DEALLOCATION: On instruction completion from unit i, clear busy[i]=0. Provide done interface: done_valid, done_unit_id.

5. SAME-CYCLE ALLOCATE+FREE: Define behavior when same unit is freed and allocated in same cycle. Common: free takes effect first, then allocate (allows immediate reuse).

6. INITIALIZATION: On reset, all units free (busy=0).

7. OUTPUTS: (1) available vector (which units are free), (2) any_available flag (at least one unit free), (3) optional: suggested unit (lowest free unit ID).

8. Test Case 1 - Allocate Unit: All units initially free. Allocate unit 0. Expected: busy[0]=1, available[0]=0.

9. Test Case 2 - Free Unit: Unit 0 busy. Done signal for unit 0. Expected: busy[0]=0, available[0]=1, unit becomes available.

10. Test Case 3 - All Busy: Allocate all units. New request arrives. Expected: any_available=0, scheduler must stall.

---

## Hints

<details>
<summary>Hint 1</summary>
available = ~busy; any_available = |available;
</details>

<details>
<summary>Hint 2</summary>
Suggested unit: priority encoder on available vector.
</details>

<details>
<summary>Hint 3</summary>
Same-cycle: if both, allocate takes precedence (or document free-then-allocate).
</details>
