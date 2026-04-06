# Warp Scheduler

**Domain:** computer-architecture — Cache & Memory  
**Difficulty:** Hard  
**Topics:** GPU, Scheduler, RTL

---

## Problem Statement

Implement Warp Scheduler with Round-Robin or Priority Selection

Design a warp scheduler selecting one ready warp from multiple warps each cycle.\n\n' +
        '**Example:**\n' +
        '```\nready=0b0111 (warps 0,1,2 ready)\n→ grants rotate: 0→1→2→0→1→2...\n\nready=0b0000 → grant_valid=0\n```\n\n' +
        '**Constraints:**\n' +
        '- Round-robin fairness or priority-based\n' +
        '- Track last granted warp\n' +
        '- No grant when no warps ready

---

## Requirements

1. INPUT: Ready mask (bit-vector indicating which warps are ready). Size: NUM_WARPS bits. ready[i]=1 means warp i can execute.

2. OUTPUT: (1) grant_valid (1 if a warp is granted, 0 if none ready), (2) grant_warp_id (log2(NUM_WARPS) bits, which warp is selected).

3. SCHEDULING POLICY: Document policy. Options: (1) Round-robin: rotate among ready warps starting from last_grant+1. (2) Priority: fixed priority, lowest warp ID wins.

4. ROUND-ROBIN BEHAVIOR: Maintain last_grant register. On grant, search for next ready warp starting from (last_grant+1) with wrap-around. Update last_grant to granted warp.

5. NO READY WARPS: When ready mask is all zeros, grant_valid=0. Do not issue any warp. grant_warp_id can be dont care or held stable.

6. GRANT STABILITY: When no valid grant (grant_valid=0), grant_warp_id should remain stable (hold last value or defined value).

7. Test Case 1 - Round-Robin Fairness: Ready mask = 0b0111 (warps 0,1,2 ready continuously). Expected: grants rotate 0→1→2→0→1→2... each cycle.

8. Test Case 2 - Sparse Readiness: Only warp 2 is ready (ready=0b0100). Expected: grant_warp_id=2 every cycle when granted.

9. Test Case 3 - No Ready Warps: Ready mask = 0b0000. Expected: grant_valid=0, no warp selected.

---

## Hints

<details>
<summary>Hint 1</summary>
Rotate ready mask to place last_grant at LSB, priority encode, rotate back.
</details>

<details>
<summary>Hint 2</summary>
Update: if (grant_valid) last_grant <= grant_warp_id;
</details>
