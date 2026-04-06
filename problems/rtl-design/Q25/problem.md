# AXI Register File

**Domain:** rtl-design — FIFO / Queue  
**Difficulty:** Medium  
**Topics:** AXI, Register File, RTL

---

## Problem Statement

Build AXI-Lite 4-Register File

Implement an AXI-Lite slave with four 32-bit registers at 0x00, 0x04, 0x08, 0x0C.\n\n' +
        '**Register map:**\n' +
        '```\n0x00=reg0, 0x04=reg1, 0x08=reg2, 0x0C=reg3\nInvalid address → SLVERR/DECERR\n```\n\n' +
        '**Constraints:**\n' +
        '- All four registers readable and writable\n' +
        '- Invalid address returns error response\n' +
        '- Reset clears all registers

---

## Requirements

1. REGISTER MAP: 0x00=reg0, 0x04=reg1, 0x08=reg2, 0x0C=reg3.

2. WRITE SUPPORT: Writes to valid addresses update corresponding register.

3. READ SUPPORT: Reads from valid addresses return corresponding register value.

4. INVALID ADDRESS: Access to unsupported address should return SLVERR or DECERR.

5. AXI-LITE CHANNELS: Implement AW, W, B, AR, and R channels correctly.

6. WRITE ORDERING: AW and W may arrive in any order.

7. READ DATA HOLDING: Once RVALID is asserted, hold RDATA stable until RREADY.

8. WRITE RESPONSE HOLDING: Once BVALID is asserted, hold BRESP stable until BREADY.

9. RESET: Clear all registers on reset.

10. Test Case 1 - Write reg0: Write 0x11 to 0x00. Expected: reg0=0x11.

11. Test Case 2 - Write reg3: Write 0xDEADBEEF to 0x0C. Expected: reg3 updates correctly.

12. Test Case 3 - Read reg1: Preload reg1, then read 0x04. Expected: RDATA=reg1.

13. Test Case 4 - Invalid Read: Read from 0x10. Expected: error response.

14. Test Case 5 - Reset: After writing all registers, assert reset. Expected: all registers clear to 0.

---

## Hints


