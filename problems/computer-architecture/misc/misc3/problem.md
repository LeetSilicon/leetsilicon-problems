# Round-Robin Arbiter

**Domain:** computer-architecture — Cache & Memory  
**Difficulty:** Hard  
**Topics:** Arbiter, RTL

---

## Problem Statement

Design Round-Robin Arbiter for Fair Request Arbitration

Implement a round-robin arbiter granting one requestor per cycle with rotating priority.\n\n' +
        '**Example:**\n' +
        '```\nrequest=111 → grants rotate: 0→1→2→0→1→2...\nrequest=010 → always grants requestor 1\nrequest=000 → grant_valid=0, pointer unchanged\n```\n\n' +
        '**Constraints:**\n' +
        '- One-hot grant output\n' +
        '- Maintain last_grant pointer for fairness\n' +
        '- Fair share over time for continuous requestors

---

## Requirements

1. INPUTS: request vector (N bits, request[i]=1 means requestor i wants grant).

2. OUTPUTS: (1) grant vector (N bits, one-hot encoding of granted requestor), (2) grant_valid (1 if grant issued, 0 if no requests).

3. ONE-HOT GRANT: At most one grant bit is asserted per cycle. Use one-hot encoding (only grant[i]=1 for granted requestor i).

4. ROUND-ROBIN PRIORITY: Maintain last_grant pointer (register storing last granted index). On next grant, search for requests starting from (last_grant+1) with wrap-around.

5. POINTER UPDATE: On successful grant, update last_grant to granted index. If no grant (no requests), last_grant unchanged.

6. NO REQUESTS: When request vector is all zeros, grant_valid=0, grant vector all zeros, last_grant unchanged.

7. FAIRNESS: Over time, if all requestors continuously request, each gets grant in rotating order (fair share).

8. Test Case 1 - Continuous Requests: request[0:2]=111 (all request continuously). Expected: grants rotate: grant[0], grant[1], grant[2], grant[0], ... each cycle.

9. Test Case 2 - Sparse Requests: request changes dynamically (e.g., 110, 010, 101, ...). Expected: arbiter grants next eligible requestor after last_grant in round-robin order.

10. Test Case 3 - Single Requestor: Only request[2]=1. Expected: grant[2]=1 every cycle (no competition).

---

## Hints

<details>
<summary>Hint 1</summary>
Rotate request to place last_grant at LSB, priority encode, rotate back.
</details>

<details>
<summary>Hint 2</summary>
Update: if (grant_valid) last_grant <= granted_index;
</details>

<details>
<summary>Hint 3</summary>
Assertion: $onehot0(grant).
</details>
