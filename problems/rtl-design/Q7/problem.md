# Single-Port Synchronous RAM

**Domain:** rtl-design — FIFO / Queue  
**Difficulty:** Medium  
**Topics:** Memory, RAM, Design

---

## Problem Statement

Implement Single-Port Synchronous RAM with Read/Write Control

Design a single-port synchronous RAM with parameterizable depth and width.\n\n' +
        '**Interface:**\n' +
        '```\nWrite: write_en=1 + address + write_data → store on posedge\nRead:  read_en=1 + address → read_data (define latency)\n```\n\n' +
        '**Constraints:**\n' +
        '- Parameterizable DEPTH and WIDTH\n' +
        '- Define read latency (0-cycle or 1-cycle)\n' +
        '- Define read-during-write behavior (write-first or read-first)

---

## Requirements

1. PARAMETERIZATION: Parameters DEPTH (number of words) and WIDTH (bits per word). Address width = ceil(log2(DEPTH)).

2. SINGLE PORT: One address port, one data input port, one data output port. Cannot read and write different addresses simultaneously (single port limitation).

3. CONTROL SIGNALS: (1) write_en (write enable, when high with clock edge, write occurs), (2) read_en (read enable, when high, read operation occurs), (3) Optional: chip_enable (enable entire module).

4. WRITE OPERATION: On rising clock edge when write_en=1, store write_data at address location. Write is synchronous.

5. READ OPERATION: Define read latency. Option 1: Synchronous read (1-cycle latency): Register output. On cycle N with read_en=1, read_data valid on cycle N+1. Option 2: Combinational read (0-cycle latency): read_data updates combinationally with address. Document chosen implementation.

6. READ-DURING-WRITE (SAME ADDRESS): Define behavior when write_en=1 and read_en=1 to same address in same cycle. Options: (1) Write-first: read returns new written data (requires forwarding), (2) Read-first: read returns old data before write, (3) Undefined: explicitly document as undefined. Common choice: write-first or read-first.

7. RESET: Optional. If implemented, can clear memory to known state or leave undefined (faster synthesis). Document behavior.

8. MEMORY ARRAY: Implement as reg array: reg [WIDTH-1:0] mem [0:DEPTH-1];

9. Test Case 1 - Write Then Read: Write data=0xAA to addr=3 (cycle N). Next cycle (N+1): read addr=3 with read_en=1. If 1-cycle read latency: data valid at cycle N+2 with value 0xAA.

10. Test Case 2 - Read Latency: For 1-cycle latency: assert read_en=1 at cycle N with addr=5. Expected: read_data valid at cycle N+1 with value from mem[5]. For 0-cycle: read_data valid same cycle.

11. Test Case 3 - Same-Address Read-During-Write: Cycle N: write_en=1, read_en=1, addr=7, write_data=0xBB. If write-first: read_data at appropriate cycle = 0xBB. If read-first: read_data = old value of mem[7].

12. Test Case 4 - Multiple Writes: Write addr=0 with 0x11, addr=1 with 0x22, addr=2 with 0x33. Read each back. Expected: values match written data.

13. Test Case 5 - Address Boundaries: Write and read at addr=0 (minimum) and addr=DEPTH-1 (maximum). Verify correct operation.

---

## Hints


