# Priority Encoder

**Domain:** rtl-design — FIFO / Queue  
**Difficulty:** Medium  
**Topics:** Priority Encoder, Combinational, Design

---

## Problem Statement

Build Priority Encoder for Pipeline Resource Selection

Implement a priority encoder selecting the highest-priority asserted bit from an N-bit request vector.\n\n' +
        '**Example (LSB-first):**\n' +
        '```\nrequest=0b00101100 → index=2, valid=1\nrequest=0b00000000 → index=0, valid=0\n```\n\n' +
        '**Constraints:**\n' +
        '- Parameterizable N-bit input\n' +
        '- Document priority direction (MSB or LSB first)\n' +
        '- Purely combinational

---

## Requirements

1. INPUT: Request vector (N bits). Each bit represents a request. request[i]=1 means requester i is requesting.

2. PRIORITY DIRECTION: Define priority direction clearly. Common: (1) LSB has highest priority (index 0 highest), (2) MSB has highest priority (index N-1 highest). Document choice.

3. OUTPUTS: (1) index (log2(N) bits): Index of highest-priority asserted request, (2) valid (1 bit): Indicates at least one request present. valid=1 if any request bit set, valid=0 if all zero.

4. ZERO INPUT: When request vector is all zeros (no requests), valid=0. Index output should be a defined value (typically 0) or don't care. Document behavior.

5. MULTIPLE REQUESTS: When multiple requests asserted, select highest-priority according to defined direction. Lower-priority requests ignored.

6. COMBINATIONAL LOGIC: Priority encoder is purely combinational (no clock, no state).

7. PARAMETERIZATION: Parameter N for number of requesters.

8. Test Case 1 - Single Request: request = 0b00001000 (bit 3 set), priority=LSB-first. Expected: index=3, valid=1.

9. Test Case 2 - Multiple Requests LSB Priority: request = 0b00101100 (bits 2,3,5 set), priority=LSB-first (bit 0 highest). Expected: index=2 (lowest set bit), valid=1.

10. Test Case 3 - Multiple Requests MSB Priority: request = 0b00101100 (bits 2,3,5 set), priority=MSB-first (bit N-1 highest). Expected: index=5 (highest set bit), valid=1.

11. Test Case 4 - All Zeros: request = 0b00000000. Expected: valid=0, index=0 (or defined value).

12. Test Case 5 - All Ones: request = 0b11111111, priority=LSB-first. Expected: index=0, valid=1.

---

## Hints


