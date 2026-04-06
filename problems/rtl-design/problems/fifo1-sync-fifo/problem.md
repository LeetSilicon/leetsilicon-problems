# Synchronous FIFO with Flags

**Domain:** RTL Design — FIFO / Queue  
**Difficulty:** Hard  
**Topics:** FIFO, Design, Flags

---

## Problem Statement

Implement a synchronous FIFO (single clock domain) with comprehensive status flags and programmable thresholds.

**Interface:**
```
write_en + write_data → push (when not full)
read_en              → pop  (when not empty)
Flags: full, empty, almost_full, almost_empty
```

**Constraints:**
- Parameterizable `DEPTH` (power of 2) and `WIDTH`
- Simultaneous read+write when neither full nor empty
- Overflow/underflow: ignore operation (no corruption)
- Configurable `ALMOST_FULL_THRESHOLD` and `ALMOST_EMPTY_THRESHOLD`

---

## Requirements

1. **PARAMETERIZATION** — Support `DEPTH` (number of entries, power of 2 recommended) and `WIDTH` (data width in bits).

2. **RESET BEHAVIOR** — On reset:
   - Read/write pointers initialize to 0
   - Occupancy counter initializes to 0
   - `full=0`, `empty=1`, almost flags depend on thresholds

3. **WRITE OPERATION** — When `write_en=1` and `full=0`, store `write_data` at write pointer and increment pointer. When `full=1`, ignore write.

4. **READ OPERATION** — When `read_en=1` and `empty=0`, output data from read pointer and increment pointer. When `empty=1`, ignore read.

5. **OCCUPANCY TRACKING** — Maintain a counter. Increment on write (when not full), decrement on read (when not empty). On simultaneous read+write (when neither full nor empty), count unchanged.

6. **FLAG GENERATION:**
   - `full  = (count == DEPTH)`
   - `empty = (count == 0)`
   - `almost_full  = (count >= ALMOST_FULL_THRESHOLD)`
   - `almost_empty = (count <= ALMOST_EMPTY_THRESHOLD)`

7. **THRESHOLDS** — `ALMOST_FULL_THRESHOLD` (default: `DEPTH-1`), `ALMOST_EMPTY_THRESHOLD` (default: `1`).

8. **SIMULTANEOUS READ+WRITE** — Both operations execute in the same cycle; net count unchanged.

9. **OVERFLOW/UNDERFLOW** — Ignore the operation; no data corruption.

---

## Test Cases

| # | Name | Setup | Expected |
|---|------|-------|----------|
| 1 | Basic FIFO Operation | DEPTH=8, push [0xAA, 0xBB, 0xCC], pop 3× | outputs [0xAA, 0xBB, 0xCC] in order |
| 2 | Full Flag Boundary | Write 8 entries, attempt 9th | full=1 after 8th, 9th ignored |
| 3 | Empty Flag Boundary | Push 3, pop 3, attempt 4th pop | empty=1 after 3rd, 4th ignored |
| 4 | Almost-Full Threshold | ALMOST_FULL_THRESHOLD=6, write 6 | almost_full=1, full=0 |
| 5 | Almost-Empty Threshold | ALMOST_EMPTY_THRESHOLD=2, drain to 2 | almost_empty=1, empty=0 |
| 6 | Simultaneous Read+Write | 4 entries, assert read_en+write_en same cycle | oldest popped, new pushed, count=4 |

---

## Hints

<details>
<summary>Hint 1</summary>
Counter method: increment on write, decrement on read, unchanged when both happen simultaneously.
</details>

<details>
<summary>Hint 2</summary>
Alternative approach: pointer comparison. Full when `write_ptr + 1 == read_ptr` (wrapping). But you lose the count, so flags need pointer arithmetic.
</details>

<details>
<summary>Hint 3</summary>
Almost flags are just threshold comparisons on `count`. No extra logic needed.
</details>
