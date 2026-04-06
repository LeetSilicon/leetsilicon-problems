# AXI-Lite Single Register

**Domain:** rtl-design — FIFO / Queue  
**Difficulty:** Medium  
**Topics:** AXI, RTL, Registers

---

## Problem Statement

Build AXI-Lite Single Register Slave

Implement an AXI-Lite slave with one 32-bit register at address 0x00.\n\n' +
        '**Channels:**\n' +
        '```\nWrite: AW(addr) + W(data) → B(response)\nRead:  AR(addr) → R(data+response)\nAW and W may arrive in any order\n```\n\n' +
        '**Constraints:**\n' +
        '- All five AXI-Lite channels with VALID/READY handshake\n' +
        '- AW and W are independent (may arrive in either order)\n' +
        '- Hold BVALID/RVALID until accepted

---

## Requirements

1. AXI-LITE CHANNELS: Implement AW, W, B, AR, and R channels with VALID/READY handshaking.

2. SINGLE REGISTER: Support one 32-bit register mapped at address 0x00.

3. WRITE TRANSACTION: Accept AW and W in any order. Perform register write only after both address and data are received.

4. READ TRANSACTION: On AR handshake, return register value on R channel.

5. WRITE RESPONSE: After successful write, assert BVALID with BRESP=2'b00.

6. READ RESPONSE: After successful read, assert RVALID with RRESP=2'b00.

7. CHANNEL INDEPENDENCE: AW and W channels are independent and may arrive in different cycles.

8. BACKPRESSURE: Hold BVALID until BREADY is asserted. Hold RVALID until RREADY is asserted.

9. RESET: Clear register and deassert all response valids on reset.

10. Test Case 1 - Simple Write: Write 0x12345678 to address 0x00. Expected: internal register updates correctly.

11. Test Case 2 - Simple Read: Read from address 0x00 after write. Expected: RDATA returns stored register value.

12. Test Case 3 - AW before W: Address arrives first, data arrives later. Expected: write still completes correctly.

13. Test Case 4 - W before AW: Data arrives first, address arrives later. Expected: write still completes correctly.

14. Test Case 5 - Backpressure on R: Slave asserts RVALID but master delays RREADY. Expected: RVALID remains asserted until handshake.

---

## Hints

<details>
<summary>Hint 1</summary>
Track address and data reception separately using flags like aw_done and w_done.
</details>

<details>
<summary>Hint 2</summary>
Latch AWADDR when AWVALID && AWREADY, latch WDATA when WVALID && WREADY.
</details>

<details>
<summary>Hint 3</summary>
Perform write only when both address and data have been accepted.
</details>

<details>
<summary>Hint 4</summary>
For reads, latch ARADDR on handshake and drive RDATA from register.
</details>

<details>
<summary>Hint 5</summary>
Keep BVALID high until BREADY, and RVALID high until RREADY.
</details>

<details>
<summary>Hint 6</summary>
Use simple decode: only address 0x00 is valid.
</details>
