# Synchronous FIFO with Flags

**Domain:** rtl-design — FIFO / Queue  
**Difficulty:** Hard  
**Topics:** FIFO, Design, Flags

---

## Problem Statement

Design Synchronous FIFO with Full, Empty, Almost-Full, and Almost-Empty Flags

Implement a synchronous FIFO (single clock domain) with comprehensive status flags and programmable thresholds.\n\n' +
        '**Interface:**\n' +
        '```\nwrite_en + write_data → push (when not full)\nread_en → pop (when not empty)\nFlags: full, empty, almost_full, almost_empty\n```\n\n' +
        '**Constraints:**\n' +
        '- Parameterizable DEPTH (power of 2) and WIDTH\n' +
        '- Simultaneous read+write when neither full nor empty\n' +
        '- Overflow/underflow: ignore operation (no corruption)\n' +
        '- Configurable ALMOST_FULL and ALMOST_EMPTY thresholds

---

## Requirements

1. PARAMETERIZATION: Support parameters DEPTH (number of entries, power of 2 recommended) and WIDTH (data width in bits).

2. RESET BEHAVIOR: Define reset type (synchronous or asynchronous). On reset: (1) read/write pointers initialize to 0, (2) occupancy counter initializes to 0, (3) all flags clear (full=0, empty=1, almost flags depend on thresholds).

3. WRITE OPERATION: Input write_en signal. When write_en=1 and full=0, store write_data at write pointer location and increment write pointer. When full=1, ignore write (data not stored).

4. READ OPERATION: Input read_en signal. When read_en=1 and empty=0, output data from read pointer location and increment read pointer. When empty=1, ignore read (output can be previous value or don't care).

5. OCCUPANCY TRACKING: Maintain counter tracking number of valid entries. Increment on write (when not full), decrement on read (when not empty). On simultaneous read+write when neither full nor empty, count unchanged.

6. FLAG GENERATION: (1) full = (count == DEPTH), (2) empty = (count == 0), (3) almost_full = (count >= ALMOST_FULL_THRESHOLD), (4) almost_empty = (count <= ALMOST_EMPTY_THRESHOLD).

7. THRESHOLD PARAMETERS: ALMOST_FULL_THRESHOLD (default: DEPTH-1) and ALMOST_EMPTY_THRESHOLD (default: 1). Must satisfy: 0 <= ALMOST_EMPTY_THRESHOLD < ALMOST_FULL_THRESHOLD <= DEPTH.

8. SIMULTANEOUS READ+WRITE: When read_en=1 and write_en=1 and FIFO is neither full nor empty: perform both operations in same cycle. Net occupancy change is zero.

9. OVERFLOW/UNDERFLOW: Define behavior: (1) Option A: ignore operation (recommended), (2) Option B: assert error flag. Document chosen behavior.

10. Test Case 1 - Basic FIFO Operation: DEPTH=8, WIDTH=8. Push values [0xAA, 0xBB, 0xCC]. Then pop 3 times. Expected: outputs are [0xAA, 0xBB, 0xCC] in order (FIFO property).

11. Test Case 2 - Full Flag Boundary: DEPTH=8. Write 8 entries. Expected: full=1 after 8th write. Attempt 9th write with write_en=1. Expected: write ignored, full remains 1, count=8.

12. Test Case 3 - Empty Flag Boundary: Start with 3 entries. Read 3 times. Expected: empty=1 after 3rd read. Attempt 4th read with read_en=1. Expected: read ignored, empty remains 1, count=0.

13. Test Case 4 - Almost-Full Threshold: DEPTH=8, ALMOST_FULL_THRESHOLD=6. Write 6 entries. Expected: almost_full=1, full=0. Write 7th entry. Expected: almost_full=1, full=0. Write 8th entry. Expected: full=1.

14. Test Case 5 - Almost-Empty Threshold: DEPTH=8, ALMOST_EMPTY_THRESHOLD=2, start with 3 entries. Read 1 entry (count=2). Expected: almost_empty=1, empty=0. Read another (count=1). Expected: almost_empty=1. Read last (count=0). Expected: empty=1.

15. Test Case 6 - Simultaneous Read+Write: FIFO has 4 entries (not full, not empty). Assert read_en=1 and write_en=1 in same cycle. Expected: oldest entry read out, new entry written in, count remains 4.

---

## Hints

<details>
<summary>Hint 1</summary>
Counter method: increment on write, decrement on read, unchanged on both.
</details>

<details>
<summary>Hint 2</summary>
Alternative: pointer comparison (full when write_ptr+1 == read_ptr).
</details>

<details>
<summary>Hint 3</summary>
Almost flags: simple threshold comparison on count.
</details>
