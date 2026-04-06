# Multicycle Multiplier

**Domain:** computer-architecture — Cache & Memory  
**Difficulty:** Hard  
**Topics:** Multiplier, Datapath, RTL

---

## Problem Statement

Design Multicycle Iterative Multiplier

Implement a multicycle multiplier using shift-and-add. Takes two WIDTH-bit operands, produces a 2*WIDTH-bit result over multiple cycles.\n\n' +
        '**Example (WIDTH=8):**\n' +
        '```\nA=3, B=7 → result=21 (after ~8 cycles)\nA=255, B=255 → result=65025 (fits in 16 bits)\n```\n\n' +
        '**Constraints:**\n' +
        '- Handshake: start, busy, done signals\n' +
        '- Result is 2*WIDTH bits (no truncation)\n' +
        '- Typically WIDTH cycles for radix-2

---

## Requirements

1. ALGORITHM: Implement iterative multiplication (e.g., shift-and-add, Booth encoding). Document algorithm clearly (e.g., 

2. ).

3. HANDSHAKE INTERFACE: (1) start input: initiates multiplication on rising edge, (2) busy output: asserted during computation, (3) done output: pulsed for one cycle when result ready.

4. OPERANDS AND RESULT: Inputs A and B are WIDTH bits each. Output result is 2*WIDTH bits (to hold full product without truncation).

5. CYCLE COUNT: Define expected number of cycles (typically WIDTH cycles for radix-2). Document in specification.

6. BACK-TO-BACK OPERATIONS: Support starting new multiplication immediately after done pulse (on next cycle).

7. RESET HANDLING: On reset, clear busy/done signals and internal state (accumulator, counter).

8. Test Case 1 - Simple Multiply: WIDTH=8, A=3, B=7. After ~8 cycles, result=21 (0x0015). Verify done pulse and busy timing.

9. Test Case 2 - Zero Operand: A=0, B=any value. Expected: result=0, completes in defined cycle count.

10. Test Case 3 - Maximum Values: WIDTH=8, A=255, B=255. Expected: result=65025 (0xFE01), no overflow (fits in 16 bits).

11. Test Case 4 - Back-to-Back: Start first multiply (A=5, B=4). After done, immediately start second multiply (A=6, B=3) next cycle. Verify both results correct and timing proper.

---

## Hints

<details>
<summary>Hint 1</summary>
Initialize accumulator=0. For each multiplier bit: if bit=1, add A to accumulator. Shift appropriately.
</details>

<details>
<summary>Hint 2</summary>
Accumulator must be 2*WIDTH bits.
</details>

<details>
<summary>Hint 3</summary>
FSM: IDLE → COMPUTE → DONE.
</details>

<details>
<summary>Hint 4</summary>
Latch inputs on start to avoid corruption during computation.
</details>
