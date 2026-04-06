# AXI Write-Only Control

**Domain:** rtl-design — FIFO / Queue  
**Difficulty:** Easy  
**Topics:** AXI, Control, RTL

---

## Problem Statement

Build AXI-Lite Write-Only Control Block

Implement a write-only AXI-Lite peripheral with enable and mode control registers.\n\n' +
        '**Register map:**\n' +
        '```\n0x00: enable register (write-only)\n0x04: mode register   (write-only)\nAny read → error response\n```\n\n' +
        '**Constraints:**\n' +
        '- Writes update control registers\n' +
        '- Reads always return error on R channel\n' +
        '- Reset clears enable and mode

---

## Requirements

1. REGISTER MAP: 0x00 = enable register, 0x04 = mode register.

2. WRITE SUPPORT: Writes to valid addresses update corresponding control registers.

3. READ ERROR: Any read attempt should return an error response on R channel.

4. AXI-LITE PROTOCOL: Support proper AW, W, B, AR, and R handshake behavior.

5. RESET: Clear enable and mode registers on reset.

6. WRITE ORDERING: Accept AW and W in any order.

7. WRITE RESPONSE: Return OKAY for valid writes and error for invalid writes.

8. Test Case 1 - Enable Write: Write 1 to 0x00. Expected: enable register becomes 1.

9. Test Case 2 - Mode Write: Write 3 to 0x04. Expected: mode register becomes 3.

10. Test Case 3 - Read Attempt: Read 0x00. Expected: RRESP indicates error.

11. Test Case 4 - Invalid Write: Write to 0x08. Expected: BRESP indicates error.

12. Test Case 5 - Reset: After writing registers, assert reset. Expected: enable and mode clear to 0.

---

## Hints

<details>
<summary>Hint 1</summary>
Implement two internal registers for enable and mode.
</details>

<details>
<summary>Hint 2</summary>
Writes behave like a normal AXI-Lite register slave.
</details>

<details>
<summary>Hint 3</summary>
For reads, return RVALID with an error response code.
</details>

<details>
<summary>Hint 4</summary>
Use address decode to select which control register to update.
</details>

<details>
<summary>Hint 5</summary>
This is a good starter problem for learning AXI-Lite write flow.
</details>
