# Bus Arbiter

**Domain:** rtl-design — FIFO / Queue  
**Difficulty:** Hard  
**Topics:** Arbiter, Bus, Design

---

## Problem Statement

Implement Multi-Master Bus Arbiter with Priority or Round-Robin

Design an arbiter for a shared bus with multiple masters.\n\n' +
        '**Example (round-robin):**\n' +
        '```\nrequest=0b111 → grants rotate: 0→1→2→0→...\nrequest=0b000 → grant_valid=0, pointer unchanged\n```\n\n' +
        '**Constraints:**\n' +
        '- One-hot grant output\n' +
        '- Fixed-priority or round-robin (document choice)\n' +
        '- Parameterizable NUM_MASTERS

---

## Requirements

1. NUMBER OF MASTERS: Parameterize NUM_MASTERS (number of masters requesting bus access).

2. INPUTS: request vector (NUM_MASTERS bits). request[i]=1 means master i requesting bus.

3. OUTPUTS: grant vector (NUM_MASTERS bits, one-hot encoding). grant[i]=1 means master i granted bus access. Only one grant bit can be 1 per cycle.

4. ARBITRATION POLICY: Choose and implement: (1) Fixed-Priority: Master 0 has highest priority, master NUM_MASTERS-1 lowest. Grant lowest-index requesting master. (2) Round-Robin: Rotate priority among masters fairly. Last granted master has lowest priority next cycle. Document chosen policy.

5. ROUND-ROBIN POINTER: Maintain last_grant register storing index of last granted master. On next arbitration, search for requests starting from (last_grant+1) with wraparound. Update last_grant on successful grant.

6. ACCEPT CONDITION: Define when to update last_grant pointer. Common: update when grant_valid=1 (grant asserted). Alternatively: update when grant accepted by master (requires accept signal from master).

7. NO REQUESTS: When request vector is all zeros, no grant asserted (grant=0). last_grant pointer holds current value (no update).

8. GRANT STABILITY: Grant signal should be stable for the cycle. Avoid glitches in grant generation.

9. RESET: On reset, clear grant vector. For round-robin: reset last_grant pointer to initial value (e.g., 0 or NUM_MASTERS-1).

10. Test Case 1 - Fixed-Priority Contention: request = 0b0110 (masters 1 and 2 requesting). Expected: grant = 0b0010 (master 1 granted, lower index).

11. Test Case 2 - Round-Robin Fairness: request = 0b0111 (masters 0,1,2 always requesting). Initially last_grant=-1 or 0. Expected: grants rotate: grant[0], grant[1], grant[2], grant[0], grant[1], ... each cycle.

12. Test Case 3 - Sparse Requests: request changes each cycle: 0b0100, 0b0010, 0b1000. Expected: grant follows requests, pointer updates correctly in round-robin.

13. Test Case 4 - Single Master: Only request[3]=1 continuously. Expected: grant[3]=1 every cycle (no contention).

14. Test Case 5 - No Requests: request = 0b0000 for several cycles. Expected: grant = 0b0000, last_grant unchanged.

15. Test Case 6 - Grant One-Hot Property: For all Test Cases, verify at most one grant bit is 1 each cycle (one-hot or all-zero).

---

## Hints

<details>
<summary>Hint 1</summary>
Fixed-priority arbiter: Use priority encoder on request vector. Grant lowest index with request=1. grant = (1 << first_request_index);
</details>
