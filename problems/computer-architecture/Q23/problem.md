# SIMD Execution Unit

**Domain:** computer-architecture — Cache & Memory  
**Difficulty:** Hard  
**Topics:** GPU, SIMD, RTL

---

## Problem Statement

Design SIMD Execution Unit for Parallel Lane Processing

Implement a SIMD unit performing the same operation across multiple data lanes with per-lane masking.\n\n' +
        '**Example (4 lanes):**\n' +
        '```\nADD: A=[1,2,3,4], B=[10,10,10,10], mask=1111\n→ result=[11,12,13,14]\n\nmask=0101 → only lanes 0,2 updated\n```\n\n' +
        '**Constraints:**\n' +
        '- Parameterizable NUM_LANES and DATA_WIDTH\n' +
        '- Single opcode shared across all lanes\n' +
        '- Inactive lanes hold previous value or output zero

---

## Requirements

1. PARAMETERIZATION: (1) NUM_LANES (number of parallel lanes, e.g., 32 for warp size), (2) DATA_WIDTH (bits per lane, e.g., 32).

2. INPUTS: (1) operation opcode (shared across all lanes), (2) operand A (NUM_LANES * DATA_WIDTH bits, A[0], A[1], ..., A[NUM_LANES-1]), (3) operand B (similar), (4) lane_mask (NUM_LANES bits, 1=active, 0=inactive).

3. OUTPUT: result (NUM_LANES * DATA_WIDTH bits), one result per lane.

4. OPERATION: All active lanes execute the same opcode (e.g., ADD, SUB, MUL, AND, OR). Each lane processes its own operands independently.

5. LANE MASKING: Inactive lanes (lane_mask[i]=0) should: (1) Not update their result (hold previous value), OR (2) Output zero (document choice).

6. CONTROL SHARING: Single control logic decodes opcode and generates operation signals for all lanes. Each lane has its own datapath (ALU).

7. Test Case 1 - Vector Add: NUM_LANES=4, opcode=ADD, A=[1,2,3,4], B=[10,10,10,10], mask=1111. Expected: result=[11,12,13,14].

8. Test Case 2 - Lane Masking: NUM_LANES=4, opcode=ADD, A=[1,2,3,4], B=[10,10,10,10], mask=0b0101 (lanes 0 and 2 active). Expected: result lanes 0,2 updated to [11, ?, 13, ?]. Lanes 1,3 hold previous/zero per spec.

9. Test Case 3 - Overflow Wrap: DATA_WIDTH=8, opcode=ADD, A[0]=255, B[0]=1. Expected: result[0]=0 (wraps, standard unsigned add).

---

## Hints

<details>
<summary>Hint 1</summary>
Generate loop to instantiate NUM_LANES scalar ALUs.
</details>
