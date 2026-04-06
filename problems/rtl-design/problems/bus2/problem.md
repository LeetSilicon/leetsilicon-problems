# APB Slave Peripheral

**Domain:** rtl-design — FIFO / Queue  
**Difficulty:** Hard  
**Topics:** APB, Protocol, Design

---

## Problem Statement

Design APB Slave Peripheral Following AMBA APB Protocol

Implement an APB slave compliant with AMBA APB two-phase transfer protocol.\n\n' +
        '**Transfer phases:**\n' +
        '```\nSetup:  PSEL=1, PENABLE=0 (decode address)\nEnable: PSEL=1, PENABLE=1 (transfer when PREADY=1)\n```\n\n' +
        '**Constraints:**\n' +
        '- Two-phase transfer: setup + enable\n' +
        '- PREADY for wait states\n' +
        '- PSLVERR for error response

---

## Requirements

1. APB SIGNALS: Implement required APB slave signals: (1) PSEL (slave select), (2) PENABLE (enable phase), (3) PWRITE (write=1, read=0), (4) PADDR (address), (5) PWDATA (write data), (6) PRDATA (read data output), (7) PREADY (ready output, slave controls), (8) PSLVERR (error response output, optional).

2. TWO-PHASE TRANSFER: APB uses two phases: (1) Setup phase: PSEL=1, PENABLE=0. Slave decodes address, prepares for transfer. (2) Enable phase: PSEL=1, PENABLE=1. Transfer completes when PREADY=1.

3. WRITE TRANSFER: Setup: PSEL=1, PENABLE=0, PWRITE=1, PADDR valid, PWDATA valid. Enable: PENABLE=1. Slave samples PWDATA when PSEL=1, PENABLE=1, PREADY=1.

4. READ TRANSFER: Setup: PSEL=1, PENABLE=0, PWRITE=0, PADDR valid. Enable: PENABLE=1. Slave drives PRDATA. Transfer completes when PSEL=1, PENABLE=1, PREADY=1.

5. PREADY CONTROL: Slave asserts PREADY=1 when ready to complete transfer. Can hold PREADY=0 to insert wait states (extend enable phase). Master waits until PREADY=1.

6. PSLVERR: Slave asserts PSLVERR=1 to indicate error (e.g., invalid address, write to read-only register). PSLVERR sampled on final transfer cycle (PSEL=1, PENABLE=1, PREADY=1).

7. REGISTER MAP: Define internal registers with addresses. Example: REG0 (read/write), REG1 (read-only), REG2 (write-only).

8. ADDRESS DECODE: In setup phase, decode PADDR to determine target register. Prepare data for read or register write for write.

9. ZERO WAIT STATE: If slave always ready, assert PREADY=1 continuously. Transfer completes in 2 cycles (setup + enable).

10. MULTI-CYCLE: If slave needs time (e.g., memory access), hold PREADY=0 in enable phase until ready, then assert PREADY=1.

11. RESET: On reset, deassert PREADY, PSLVERR. Internal registers reset to defined values.

12. Test Case 1 - APB Write (Zero Wait): Cycle 0: PSEL=1, PENABLE=0, PWRITE=1, PADDR=0x00, PWDATA=0xAA (setup). Cycle 1: PENABLE=1, PREADY=1 (enable completes). Expected: REG0 updated to 0xAA after cycle 1.

13. Test Case 2 - APB Read (Zero Wait): Cycle 0: PSEL=1, PENABLE=0, PWRITE=0, PADDR=0x00 (setup). Cycle 1: PENABLE=1, PREADY=1, PRDATA valid with REG0 value. Expected: Master samples PRDATA at cycle 1.

14. Test Case 3 - Wait States: Cycle 0: setup phase. Cycle 1: PENABLE=1, PREADY=0 (wait). Cycle 2: PREADY=0 (wait). Cycle 3: PREADY=1 (complete). Expected: Transfer completes at cycle 3.

15. Test Case 4 - Error Response: Write to invalid address 0xFF. Expected: PSLVERR=1 asserted when transfer completes (PENABLE=1, PREADY=1).

16. Test Case 5 - Back-to-Back Transfers: Write to REG0, then immediately read from REG1 (no idle cycles). Expected: Both transfers complete correctly with proper setup/enable phases.

---

## Hints

<details>
<summary>Hint 1</summary>
APB slave FSM: States not strictly required, but can use: IDLE, SETUP, ENABLE. Or handle with combinational logic based on PSEL and PENABLE.
</details>

<details>
<summary>Hint 2</summary>
Transfer completion condition: (PSEL && PENABLE && PREADY) is the condition for actual data transfer (write sample or read valid).
</details>

<details>
<summary>Hint 3</summary>
Write logic: always_ff @(posedge clk) if (PSEL && PENABLE && PREADY && PWRITE) case(PADDR) ADDR_REG0: reg0 <= PWDATA; ... endcase
</details>

<details>
<summary>Hint 4</summary>
Read logic: always_comb case(PADDR) ADDR_REG0: PRDATA = reg0; ADDR_REG1: PRDATA = reg1; default: PRDATA = 0; endcase
</details>

<details>
<summary>Hint 5</summary>
PREADY generation: If always ready: assign PREADY = 1; If multi-cycle: Use counter or FSM to control PREADY timing.
</details>

<details>
<summary>Hint 6</summary>
PSLVERR: Generate based on address decode. wire addr_valid = (PADDR == ADDR_REG0) || (PADDR == ADDR_REG1) || ...; assign PSLVERR = PSEL && PENABLE && !addr_valid;
</details>

<details>
<summary>Hint 7</summary>
PSLVERR timing: Only meaningful when PSEL=1 and PENABLE=1 (enable phase). Should be low otherwise.
</details>

<details>
<summary>Hint 8</summary>
Important: PRDATA must be driven during read transfers (PWRITE=0). Can be don\
</details>

<details>
<summary>Hint 9</summary>
,
        
</details>

<details>
<summary>Hint 10</summary>
,
        
</details>
