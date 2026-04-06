# FIFO with Width Conversion

**Domain:** rtl-design — FIFO / Queue  
**Difficulty:** Hard  
**Topics:** FIFO, Width Conversion, Design

---

## Problem Statement

Design FIFO with Asymmetric Read and Write Data Widths

Implement a FIFO with different data widths on read and write interfaces (width conversion).\n\n' +
        '**Example:**\n' +
        '```\nWRITE_WIDTH=32, READ_WIDTH=8\nWrite 0xA1B2C3D4 → Read 4 times: [0xD4, 0xC3, 0xB2, 0xA1]\n\nWRITE_WIDTH=8, READ_WIDTH=32\nWrite [0x11, 0x22, 0x33, 0x44] → Read once: 0x44332211\n```\n\n' +
        '**Constraints:**\n' +
        '- Widths must have integer ratio\n' +
        '- Document packing order (LSB-first or MSB-first)\n' +
        '- Partial word blocking for read-wide from write-narrow

---

## Requirements

1. ASYMMETRIC WIDTHS: Write data width WRITE_WIDTH and read data width READ_WIDTH. Widths must have integer ratio: WRITE_WIDTH/READ_WIDTH = integer OR READ_WIDTH/WRITE_WIDTH = integer.

2. WIDTH RATIO: Define RATIO. If WRITE_WIDTH > READ_WIDTH: RATIO = WRITE_WIDTH/READ_WIDTH (one write produces RATIO reads). If READ_WIDTH > WRITE_WIDTH: RATIO = READ_WIDTH/WRITE_WIDTH (RATIO writes produces one read).

3. STORAGE GRANULARITY: Choose smallest unit as storage granularity (typically min(WRITE_WIDTH, READ_WIDTH)). Track occupancy in units of this granularity.

4. PACKING ORDER: Define bit ordering clearly. Common: LSB-first (little-endian). For write-wide: write_data[7:0] is first byte out, write_data[15:8] is second byte. Document chosen order.

5. WRITE-WIDE TO READ-NARROW: Example: WRITE_WIDTH=32, READ_WIDTH=8. One write stores 4 bytes. Subsequent reads return bytes in documented order (e.g., [7:0], [15:8], [23:16], [31:24]).

6. READ-WIDE FROM WRITE-NARROW: Example: WRITE_WIDTH=8, READ_WIDTH=32. Buffer 4 writes before one complete read available. Track partial word accumulation.

7. FULL CONDITION: Full when cannot accept another write. For write-wide: when remaining capacity < WRITE_WIDTH bits. For write-narrow: when remaining capacity < WRITE_WIDTH bits.

8. EMPTY CONDITION: Empty when cannot provide complete read. For read-wide: when available data < READ_WIDTH bits. For read-narrow: when available data < READ_WIDTH bits.

9. PARTIAL WORD HANDLING: When READ_WIDTH > WRITE_WIDTH and insufficient writes accumulated, read blocks (empty=1 for that read) until enough data available.

10. FLAG GENERATION: Almost-full/almost-empty based on byte/bit occupancy, accounting for width conversion boundaries.

11. Test Case 1 - Write-Wide to Read-Narrow: WRITE_WIDTH=32, READ_WIDTH=8. Write 0xA1B2C3D4 (one 32-bit write). Read 4 times. Expected outputs (LSB-first): [0xD4, 0xC3, 0xB2, 0xA1]. Verify order matches documented packing.

12. Test Case 2 - Write-Narrow to Read-Wide: WRITE_WIDTH=8, READ_WIDTH=32. Write four bytes: [0x11, 0x22, 0x33, 0x44]. Read once. Expected: 0x44332211 (if LSB-first packing). Verify correct assembly.

13. Test Case 3 - Partial Read Blocking: WRITE_WIDTH=8, READ_WIDTH=32. Write only 3 bytes [0xAA, 0xBB, 0xCC]. Attempt read. Expected: empty=1, read blocks. Write 4th byte 0xDD. Now read succeeds with 0xDDCCBBAA.

14. Test Case 4 - Full Condition with Width Conversion: DEPTH=8 bytes, WRITE_WIDTH=32 (4 bytes). Write twice (8 bytes total). Expected: full=1. Attempt 3rd write. Expected: write blocked.

15. Test Case 5 - Mixed Operations: Write 32-bit word, read 8-bit byte, write another 32-bit word, read three 8-bit bytes. Verify FIFO order maintained correctly across width boundaries.

16. Test Case 6 - Alignment: WRITE_WIDTH=16, READ_WIDTH=8, DEPTH=16 bytes. Fill with 16-bit writes, drain with 8-bit reads. Verify all data retrieved correctly and flags consistent.

---

## Hints

<details>
<summary>Hint 1</summary>
Storage granularity: min(WRITE_WIDTH, READ_WIDTH).
</details>

<details>
<summary>Hint 2</summary>
Write-wide: break into storage units, write sequentially.
</details>

<details>
<summary>Hint 3</summary>
Read-wide: accumulate writes in shift register until complete.
</details>
