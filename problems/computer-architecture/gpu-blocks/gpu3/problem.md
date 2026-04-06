# Thread Mask Logic

**Domain:** computer-architecture — Cache & Memory  
**Difficulty:** Medium  
**Topics:** GPU, Predication, RTL

---

## Problem Statement

Implement Thread Mask Logic for Predicated Execution

Design thread masking logic for GPU-style predicated execution.\n\n' +
        '**Operations:**\n' +
        '```\nif-branch:   new_mask = active_mask & predicate\nelse-branch: new_mask = active_mask & ~predicate\nnested:      push/pop mask stack\n```\n\n' +
        '**Constraints:**\n' +
        '- Inactive threads must not write registers or issue memory ops\n' +
        '- Support push/pop stack for nesting\n' +
        '- Initialize to all active on reset

---

## Requirements

1. ACTIVE MASK: Bit-vector indicating which threads are currently active. Size: NUM_THREADS bits. active_mask[i]=1 means thread i is active.

2. PREDICATE EVALUATION: Input predicate mask (result of condition evaluation per thread). Combine with current active_mask to produce new active_mask.

3. MASK UPDATE SEMANTICS: For if-statement: new_mask = active_mask & predicate. For else-statement: new_mask = active_mask & ~predicate. Document combining logic clearly.

4. NESTED PREDICATES: Support push/pop stack of masks for nested if-else. On entering if: push current mask, apply new mask. On exiting if: pop mask to restore previous level.

5. SIDE EFFECT GATING: Inactive threads (active_mask[i]=0) must not: (1) Write to registers (gate write enable), (2) Issue memory requests (gate mem_req[i]), (3) Update any architectural state.

6. INITIALIZATION: On reset or kernel launch, active_mask initializes to all 1s (all threads active).

7. Test Case 1 - Basic Predication: Initial active_mask=1111, predicate=1010. After if-statement. Expected: new active_mask=1010 (threads 0,2 active).

8. Test Case 2 - No Active Threads: active_mask=1111, predicate=0000. Expected: new active_mask=0000 (all inactive). Verify no writes or memory requests from any thread.

9. Test Case 3 - Nested Predicates: active_mask=1111, apply pred1=1100 → active=1100. Then apply pred2=1010 (AND with 1100). Expected: active=1000 (only thread 3 active in nested region).

---

## Hints

<details>
<summary>Hint 1</summary>
Stack for nesting: push(active_mask); active_mask = new_mask; On endif: pop().
</details>
