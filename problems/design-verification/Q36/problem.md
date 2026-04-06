# Queue with Size-Based Range

**Domain:** design-verification — Constraints  
**Difficulty:** Medium  
**Topics:** Constraints, Queue, Range

---

## Problem Statement

Generate Queue with Element Count and Value Range Dependent on Size

Write uvm sv constraint to populate a queue with exactly "size" elements, where each element value is in range [0:size]. The queue length and element values are coupled through the size variable.

---

## Requirements

1. SIZE VARIABLE: rand int size. Can be constrained to specific range (e.g., [0:20]) or left wide.

2. QUEUE SIZE: Queue q must have exactly size elements. q.size() == size.

3. ELEMENT RANGE: Each element q[i] must be in range [0:size] inclusive. Value depends on size.

4. DYNAMIC SIZING: Queue is dynamic, sized during randomization based on size value.

5. SIZE=0 CASE: If size=0, queue is empty (q.size()==0). No elements.

6. SIZE>0 CASE: For size=5, queue has 5 elements, each in [0:5].

7. Test Case 1 - Size Match: For size in {0,1,5,10,20}, randomize and verify q.size() == size.

8. Test Case 2 - Element Range: For each element q[i], verify 0 <= q[i] <= size.

9. Test Case 3 - Edge Case size=0: Verify queue empty (size 0, no elements).

10. Test Case 4 - Edge Case size=1: Verify queue has 1 element in range [0:1] (values 0 or 1).

11. Test Case 5 - Distribution: Over many randomizations, verify size values and element values distributed.

---

## Hints


