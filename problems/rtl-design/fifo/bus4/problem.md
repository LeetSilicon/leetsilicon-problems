# AXI GPIO

**Domain:** rtl-design — FIFO / Queue  
**Difficulty:** Medium  
**Topics:** AXI, GPIO, Peripheral

---

## Problem Statement

Build AXI-Lite GPIO Peripheral

Implement an AXI-Lite GPIO with output register (0x00) and input register (0x04).\n\n' +
        '**Register map:**\n' +
        '```\n0x00: gpio_out (read/write)\n0x04: gpio_in  (read-only, write returns error or ignored)\n```\n\n' +
        '**Constraints:**\n' +
        '- AXI-Lite protocol with all five channels\n' +
        '- gpio_in samples external pins\n' +
        '- Reset clears gpio_out to 0

---

## Requirements

1. REGISTER MAP: Address 0x00 = GPIO output register, address 0x04 = GPIO input register.

2. WRITE OUTPUT: Writes to 0x00 update gpio_out.

3. READ INPUT: Reads from 0x04 return current gpio_in value.

4. READ OUTPUT: Reads from 0x00 return current output register value.

5. WRITE TO INPUT REGISTER: Writes to 0x04 should return error response or be ignored based on design choice.

6. AXI-LITE PROTOCOL: Implement all five AXI-Lite channels with correct handshake behavior.

7. BACKPRESSURE: BVALID and RVALID must remain asserted until accepted.

8. RESET: Clear gpio_out register on reset.

9. Test Case 1 - Output Write: Write 0xA5A5A5A5 to 0x00. Expected: gpio_out updates to written value.

10. Test Case 2 - Input Read: gpio_in=0x0000000F, read 0x04. Expected: RDATA=0x0000000F.

11. Test Case 3 - Output Readback: Write to 0x00, then read from 0x00. Expected: read returns written output value.

12. Test Case 4 - Invalid Write: Write to 0x04. Expected: error or ignored behavior per spec.

13. Test Case 5 - Reset: Assert reset. Expected: gpio_out clears to 0.

---

## Hints

<details>
<summary>Hint 1</summary>
Use one register for output storage and a direct wire/input for gpio_in.
</details>

<details>
<summary>Hint 2</summary>
Decode address 0x00 for output and 0x04 for input.
</details>

<details>
<summary>Hint 3</summary>
For invalid writes, return SLVERR on B channel if desired.
</details>

<details>
<summary>Hint 4</summary>
Read logic can use a case statement on ARADDR.
</details>

<details>
<summary>Hint 5</summary>
This problem is mainly register decode plus AXI-Lite handshake.
</details>
