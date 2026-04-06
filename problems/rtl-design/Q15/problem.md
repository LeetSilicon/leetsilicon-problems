# Pipelined ALU

**Domain:** rtl-design — FIFO / Queue  
**Difficulty:** Hard  
**Topics:** Pipeline, ALU, Hazards

---

## Problem Statement

Design Pipelined ALU with Hazard Detection and Forwarding

Implement a multi-stage pipelined ALU with valid bit propagation, data forwarding for RAW hazards, and optional stall/flush.\n\n' +
        '**Pipeline stages:**\n' +
        '```\nStage 1 (EX): Execute operation\nStage 2 (WB): Write back result\nThroughput: 1 op/cycle after fill\n```\n\n' +
        '**Constraints:**\n' +
        '- Forwarding resolves RAW hazards without stalling\n' +
        '- Valid bit propagates through stages\n' +
        '- Flush invalidates in-flight operations

---

## Requirements

1. PIPELINE STAGES: Define number of stages (e.g., 2-stage: EX, WB or 3-stage: ID, EX, WB). Document operation of each stage. Example: Stage 1 (EX): Execute operation, Stage 2 (WB): Write back result.

2. OPERATIONS SUPPORTED: Basic ALU ops: ADD, SUB, AND, OR, XOR, etc. Define opcode encoding.

3. LATENCY: For N-stage pipeline, latency is N cycles (result available N cycles after input).

4. THROUGHPUT: After pipeline fill, accept new operation every cycle (throughput = 1 operation/cycle).

5. VALID BIT PROPAGATION: Each pipeline stage has valid bit. Input valid propagates through stages. Output result valid when WB stage valid=1.

6. RAW HAZARD: Read-After-Write hazard occurs when later instruction reads register being written by earlier in-flight instruction.

7. FORWARDING: Implement data forwarding (bypassing). Compare current instruction source registers against pipeline stage destination registers. If match and stage valid, forward result from later stage to earlier stage input.

8. STALLING (OPTIONAL): If forwarding insufficient (e.g., load-use hazard), implement stall. Freeze pipeline registers until hazard resolved.

9. FLUSH (OPTIONAL): On branch misprediction or exception, invalidate in-flight operations. Set valid bits to 0 for flushed stages.

10. RESET: On reset, clear all valid bits and pipeline registers.

11. Test Case 1 - Throughput: Issue independent operations back-to-back (no dependencies). After pipeline fill (N cycles), expected: one result output per cycle. For 2-stage pipeline: input ops at cycle 0,1,2,3,... Results at cycle 2,3,4,5,...

12. Test Case 2 - RAW Hazard with Forwarding: Cycle 0: R1 = R2 + R3 (in EX). Cycle 1: R4 = R1 + R5 (in EX, needs R1 from previous). Expected: Forward R1 from WB stage to EX stage. R4 computes correctly without stall.

13. Test Case 3 - No Hazard: Cycle 0: R1 = R2 + R3. Cycle 1: R6 = R7 + R8 (no dependency on R1). Expected: No forwarding needed, both operations complete normally.

14. Test Case 4 - Flush: Issue op at cycle 0. At cycle 1, assert flush. Expected: Valid bits for in-flight op cleared, no result produced, pipeline ready for new input.

15. Test Case 5 - Back-to-Back Dependent Operations: R1=A+B, R2=R1+C, R3=R2+D (chain dependency). Expected: Forwarding resolves all dependencies, operations complete with correct results at expected latency.

---

## Hints


