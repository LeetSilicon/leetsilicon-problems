# Multiplier

**Domain:** rtl-design — FIFO / Queue  
**Difficulty:** Hard  
**Topics:** Arithmetic, Multiplier, Design

---

## Problem Statement

Implement Multiplier using Sequential or Combinational Method

Design a multiplier producing 2*WIDTH-bit result from two WIDTH-bit operands.\n\n' +
        '**Options:**\n' +
        '```\nSequential: shift-and-add, ~WIDTH cycles, small area\nCombinational: single-cycle, larger area\nPipelined: multi-stage, high throughput\n```\n\n' +
        '**Constraints:**\n' +
        '- Result is 2*WIDTH bits (no truncation)\n' +
        '- Handshake interface for sequential: start, busy, done\n' +
        '- Support back-to-back operations

---

## Requirements

1. PARAMETERIZATION: Parameter WIDTH defines operand width. Result width is 2*WIDTH to hold full product without truncation.

2. IMPLEMENTATION CHOICE: Choose method and document: (1) Sequential: Multi-cycle, uses shift-and-add algorithm, (2) Combinational: Single-cycle, larger area (Wallace tree, array), (3) Pipelined: Multi-stage, combines area and throughput. Document chosen method.

3. SEQUENTIAL MULTIPLIER: If chosen: (1) Inputs: A, B (WIDTH bits each), start (begin multiplication), (2) Outputs: result (2*WIDTH bits), done (completion signal), busy (operation in progress), (3) Latency: Typically WIDTH cycles for radix-2 shift-and-add.

4. COMBINATIONAL MULTIPLIER: If chosen: (1) Inputs: A, B (WIDTH bits), (2) Output: result (2*WIDTH bits), (3) Latency: 0 cycles (combinational), result available same cycle.

5. HANDSHAKE (SEQUENTIAL): Start signal initiates operation. Busy asserted during computation. Done pulses for one cycle when result valid. Support back-to-back operations.

6. ALGORITHM (SEQUENTIAL): Shift-and-add: Initialize accumulator=0. For each bit of multiplier B (LSB to MSB): if bit=1, add multiplicand A to accumulator. Shift accumulator and multiplicand. Repeat WIDTH times.

7. RESULT SIZE: Must be 2*WIDTH bits to avoid overflow. For WIDTH=8: 255*255=65025 requires 16 bits.

8. RESET: For sequential: On reset, clear busy, done, internal state. For combinational: Not applicable.

9. Test Case 1 - Basic Multiplication: WIDTH=8, A=3, B=7. Expected: result=21 (0x0015). For sequential: after ~8 cycles, done=1, result valid.

10. Test Case 2 - Zero Operand: A=0, B=any value (or vice versa). Expected: result=0. For sequential: completes in defined cycle count.

11. Test Case 3 - Maximum Values: WIDTH=8, A=255 (0xFF), B=255. Expected: result=65025 (0xFE01, fits in 16 bits, no overflow).

12. Test Case 4 - Back-to-Back (Sequential): Start first multiply (A=5, B=4). After done, immediately start second multiply (A=6, B=3) next cycle. Expected: Both results correct (20, 18), timing proper.

13. Test Case 5 - Power of Two: A=16 (0x10), B=4 (0x04). Expected: result=64 (0x0040). Verify shift-based patterns work correctly.

---

## Hints


