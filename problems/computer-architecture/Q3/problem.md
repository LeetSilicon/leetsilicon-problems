# LFU Cache Design

**Domain:** computer-architecture — Cache & Memory  
**Difficulty:** Hard  
**Topics:** Cache, Replacement Policy, RTL

---

## Problem Statement

Design LFU Cache with Counter-Based Replacement

Implement a Least Frequently Used (LFU) cache with per-line frequency counters.\n\n' +
        'Increment the counter on each hit. On miss, evict the line with lowest frequency. Handle counter saturation and define a tie-breaking strategy.\n\n' +
        '**Example:**\n' +
        '```\nFill lines A (freq=3) and B (freq=1)\nMiss on C → Evicts B (lower frequency)\n```\n\n' +
        '**Constraints:**\n' +
        '- Configurable counter width (e.g., 4 bits)\n' +
        '- Counters saturate at max, do not wrap\n' +
        '- Deterministic tie-breaking required

---

## Requirements

1. COUNTER MANAGEMENT: Maintain one frequency counter per cache line. Define counter width (e.g., 4 bits) and saturation behavior at maximum value (hold at max, do not wrap).

2. INCREMENT POLICY: On cache hit, increment the frequency counter for the accessed line. On cache miss with refill, initialize new line counter to 1 (or 0, document your choice).

3. EVICTION SELECTION: On cache miss requiring eviction, find the line with minimum frequency count. If multiple lines have the same minimum frequency, apply tie-breaking rule.

4. TIE-BREAKING: Define deterministic tie-breaker when multiple lines have minimum frequency. Options: (1) use LRU timestamp among tied lines, (2) select lowest way index, (3) other documented policy.

5. COUNTER RESET: On line invalidation or replacement, reset counter to initial value. On line fill, set counter appropriately.

6. EDGE CASES: Handle all-invalid cache (cold start), counter saturation, all counters at same value.

7. Test Case 1 - Frequency-Based Eviction: Fill lines A and B. Hit A three times (freq=3), hit B once (freq=1). Miss on C requiring eviction. Expected: B evicted (lower frequency).

8. Test Case 2 - Counter Saturation: Use 2-bit counter (max=3). Hit line A repeatedly. Expected: counter saturates at 3, does not wrap to 0.

9. Test Case 3 - Tie-Breaking: Lines A and B both have freq=1 but different timestamps/indices. Miss on C. Expected: evict older line (or lower index) per documented tie-break policy.

---

## Hints

<details>
<summary>Hint 1</summary>
Saturation: use conditional increment (if counter < MAX).
</details>

<details>
<summary>Hint 2</summary>
Always define tie-break rule explicitly.
</details>

<details>
<summary>Hint 3</summary>
Consider periodic global decay (right-shift all counters) to prevent saturation.
</details>
