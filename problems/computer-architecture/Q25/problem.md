# Bank Conflict Detector

**Domain:** computer-architecture — Cache & Memory  
**Difficulty:** Hard  
**Topics:** GPU, Memory, RTL

---

## Problem Statement

Design Shared Memory Bank Conflict Detector

Implement a bank conflict detector for GPU shared memory.\n\n' +
        'Given thread addresses and active mask, detect if multiple active threads access the same memory bank.\n\n' +
        '**Example (4 banks):**\n' +
        '```\nactive=1111, banks=[0,1,2,3] → no conflict\nactive=1111, banks=[1,1,2,3] → conflict on bank 1\nactive=0110, banks=[1,1,1,3] → no conflict (threads 0,2 masked)\n```\n\n' +
        '**Constraints:**\n' +
        '- NUM_BANKS is power of 2\n' +
        '- Bank index = (addr >> offset) & (NUM_BANKS-1)\n' +
        '- Masked threads excluded from detection

---

## Requirements

1. INPUTS: (1) addresses (NUM_THREADS * ADDR_WIDTH bits, one address per thread), (2) active_mask (NUM_THREADS bits), (3) NUM_BANKS parameter (number of memory banks, power of 2).

2. BANK EXTRACTION: For each thread, compute bank index: bank[i] = (address[i] >> BANK_OFFSET) & (NUM_BANKS-1). BANK_OFFSET depends on word size (e.g., 2 for 4-byte words).

3. CONFLICT DETECTION: For each bank, count how many active threads access it. If count > 1 for any bank, conflict exists.

4. INACTIVE THREAD EXCLUSION: Threads with active_mask[i]=0 must not contribute to conflict detection (ignore their addresses).

5. OUTPUTS: (1) conflict_detected (1 if any bank has multiple active accesses), (2) conflict_bank_id (which bank has conflict, if multiple conflicts, report one or all), (3) can_issue (0 if conflict, requires serialization).

6. SERIALIZATION (OPTIONAL): Decide which access to service first. Can use priority scheme (lowest thread ID) or round-robin.

7. Test Case 1 - No Conflict: NUM_BANKS=4, active_mask=1111, addresses map to banks [0,1,2,3] (all different). Expected: conflict_detected=0, can_issue=1.

8. Test Case 2 - Conflict Detected: NUM_BANKS=4, active_mask=1111, addresses map to banks [1,1,2,3] (threads 0 and 1 → bank 1). Expected: conflict_detected=1, conflict_bank_id=1.

9. Test Case 3 - Masked Thread Ignored: NUM_BANKS=4, active_mask=0110, addresses map to banks [1,1,1,3]. Threads 0,2 inactive. Only threads 1,3 active → banks [1,3]. Expected: conflict_detected=0.

---

## Hints

<details>
<summary>Hint 1</summary>
Bank index: (addr >> log2(bytes_per_bank)) % NUM_BANKS.
</details>

<details>
<summary>Hint 2</summary>
Per-bank bitmask of accessing threads, popcount > 1 = conflict.
</details>

<details>
<summary>Hint 3</summary>
Serialization: priority encode among conflicting threads.
</details>
