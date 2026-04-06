# Priority Encoder

**Domain:** computer-architecture — Cache & Memory  
**Difficulty:** Medium  
**Topics:** Encoder, RTL

---

## Problem Statement

Implement Priority Encoder

Design a priority encoder finding the index of the highest-priority asserted bit.\n\n' +
        '**Example (LSB-first priority):**\n' +
        '```\ninput=0b001000 → index=3, valid=1\ninput=0b101100 → index=2 (lowest set bit)\ninput=0b000000 → index=0, valid=0\n```\n\n' +
        '**Constraints:**\n' +
        '- Parameterizable N-bit input\n' +
        '- LSB-first priority (bit 0 = highest priority)\n' +
        '- valid=0 when no bits set

---

## Requirements

1. INPUT: N-bit vector (e.g., request bits, ready bits).

2. OUTPUTS: (1) index (log2(N) bits, index of highest-priority 1), (2) valid (1 if any input bit is 1, 0 if all zeros).

3. PRIORITY DIRECTION: Document priority. Common choices: (1) MSB has highest priority (index returns highest bit position), (2) LSB has highest priority (index returns lowest bit position).

4. ZERO INPUT: When input=0 (all zeros), valid=0. Index can be 0 or dont care (document choice).

5. STABILITY: When valid=0, index output should be stable (held at defined value, e.g., 0).

6. PARAMETERIZATION: Support parameter N for input width.

7. Test Case 1 - Single Bit: Input=0b001000, priority=LSB-first. Expected: index=3, valid=1.

8. Test Case 2 - Multiple Bits: Input=0b101100, priority=LSB-first. Expected: index=2 (lowest set bit). Priority=MSB-first: index=5 (highest set bit).

9. Test Case 3 - All Zeros: Input=0b000000. Expected: valid=0, index=0 (or defined value).

---

## Hints

<details>
<summary>Hint 1</summary>
LSB-first: scan from bit 0 to N-1, return first set.
</details>

<details>
<summary>Hint 2</summary>
MSB-first: scan from N-1 to 0.
</details>

<details>
<summary>Hint 3</summary>
Use casez or priority if-else chain.
</details>
