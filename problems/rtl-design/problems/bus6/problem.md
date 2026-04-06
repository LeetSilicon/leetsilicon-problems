# AXI Read-Only Status

**Domain:** rtl-design — FIFO / Queue  
**Difficulty:** Easy  
**Topics:** AXI, Status, Peripheral

---

## Problem Statement

Build AXI-Lite Read-Only Status Block

Implement a read-only AXI-Lite peripheral exposing version and status registers.\n\n' +
        '**Register map:**\n' +
        '```\n0x00: version (hardcoded constant)\n0x04: status  (driven from input)\nAny write → error response\n```\n\n' +
        '**Constraints:**\n' +
        '- Reads return register contents\n' +
        '- Writes always return error on B channel\n' +
        '- Version is constant, status from input port

---

## Requirements

1. REGISTER MAP: 0x00 = version register, 0x04 = status register.

2. READ-ONLY DESIGN: Reads from valid addresses return register contents.

3. WRITE ERROR: Any write attempt should generate an error response on B channel.

4. AXI-LITE HANDSHAKE: Implement proper VALID/READY protocol for all channels.

5. CONSTANT VERSION: Version register can be hardcoded to a constant value.

6. STATUS INPUT: Status register may be driven from an input signal.

7. RESET: Deassert response valid signals on reset.

8. Test Case 1 - Read Version: Read 0x00. Expected: fixed version value returned.

9. Test Case 2 - Read Status: Read 0x04. Expected: current status value returned.

10. Test Case 3 - Write Attempt: Write to 0x00. Expected: BRESP indicates error.

11. Test Case 4 - Invalid Read: Read 0x08. Expected: error or zero based on design choice.

12. Test Case 5 - Backpressure: Hold RREADY low after read response. Expected: RVALID stays high until accepted.

---

## Hints

<details>
<summary>Hint 1</summary>
This is simpler than a normal AXI-Lite slave because no internal writeable register is needed.
</details>

<details>
<summary>Hint 2</summary>
Use a case statement for read address decode.
</details>

<details>
<summary>Hint 3</summary>
On any write handshake completion, return SLVERR on B channel.
</details>

<details>
<summary>Hint 4</summary>
Keep version as a localparam or constant register.
</details>

<details>
<summary>Hint 5</summary>
Status can come from an input port and be sampled during read.
</details>
