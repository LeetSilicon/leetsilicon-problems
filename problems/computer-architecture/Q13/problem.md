# Sequential Divider

**Domain:** computer-architecture — Cache & Memory  
**Difficulty:** Hard  
**Topics:** Divider, Datapath, RTL

---

## Problem Statement

Implement Sequential Divider Using Shift-Subtract Algorithm

Design a sequential divider computing quotient and remainder using restoring or non-restoring division.\n\n' +
        '**Example (WIDTH=8):**\n' +
        '```\n20 / 5 → quotient=4, remainder=0\n22 / 5 → quotient=4, remainder=2\n7 / 0 → divide_by_zero flag=1\n```\n\n' +
        '**Constraints:**\n' +
        '- Handshake: start, busy, done\n' +
        '- Typically WIDTH+1 cycles\n' +
        '- Define divide-by-zero behavior

---

## Requirements

1. ALGORITHM: Implement restoring division or non-restoring division (document which). Typical cycle count: WIDTH+1 cycles for WIDTH-bit operands.

2. OUTPUTS: (1) quotient (WIDTH bits), (2) remainder (WIDTH bits), (3) done signal (1-cycle pulse when complete).

3. DIVIDE-BY-ZERO: Define behavior when divisor=0. Options: (1) assert divide_by_zero flag and set quotient/remainder to defined values (e.g., all 1s), (2) quotient=0, remainder=dividend.

4. HANDSHAKE: (1) start input initiates division, (2) busy output indicates computation in progress, (3) done output pulses when result ready.

5. SIGNED VS UNSIGNED: Document whether divider is signed or unsigned. Unsigned is simpler. Signed requires additional sign handling.

6. BACK-TO-BACK OPERATIONS: Support starting new division immediately after done.

7. Test Case 1 - Exact Division: WIDTH=8, dividend=20, divisor=5. Expected: quotient=4, remainder=0.

8. Test Case 2 - Non-Exact Division: dividend=22, divisor=5. Expected: quotient=4, remainder=2.

9. Test Case 3 - Divide by Zero: dividend=7, divisor=0. Expected: divide_by_zero flag=1, quotient and remainder defined per spec (e.g., quotient=0xFF, remainder=0x07).

10. Test Case 4 - Divisor Greater Than Dividend: dividend=3, divisor=10. Expected: quotient=0, remainder=3.

---

## Hints

<details>
<summary>Hint 1</summary>
Restoring: shift remainder left, subtract divisor, restore if negative.
</details>

<details>
<summary>Hint 2</summary>
Divide-by-zero: check on start, skip computation, assert error flag.
</details>

<details>
<summary>Hint 3</summary>
For signed: divide absolute values, adjust signs at end.
</details>
