# 2-Read 1-Write Register File

**Domain:** computer-architecture — Cache & Memory  
**Difficulty:** Medium  
**Topics:** Register File, RTL

---

## Problem Statement

Implement 2-Read 1-Write Register File

Design a register file with two asynchronous read ports and one synchronous write port.\n\n' +
        '**Interface:**\n' +
        '```\nRead: rd_addr1, rd_addr2 → rd_data1, rd_data2 (combinational)\nWrite: wr_addr, wr_data, wr_en → write on posedge clk\n```\n\n' +
        '**Constraints:**\n' +
        '- Parameterizable NUM_REGS and DATA_WIDTH\n' +
        '- Define read-during-write semantics (write-first or read-first)\n' +
        '- Optional: hardwired zero register (x0)

---

## Requirements

1. PARAMETERIZATION: Support parameters: (1) NUM_REGS (number of registers, e.g., 32), (2) DATA_WIDTH (width per register, e.g., 32 bits).

2. READ PORTS: Two asynchronous/combinational read ports. Inputs: rd_addr1, rd_addr2 (log2(NUM_REGS) bits each). Outputs: rd_data1, rd_data2 (DATA_WIDTH bits each).

3. WRITE PORT: One synchronous write port. Inputs: wr_addr (log2(NUM_REGS) bits), wr_data (DATA_WIDTH bits), wr_en (write enable). Write occurs on rising clock edge when wr_en=1.

4. READ-DURING-WRITE SEMANTICS: Define behavior when reading same address being written in same cycle. Options: (1) Write-first (read sees new data), (2) Read-first (read sees old data). Document chosen behavior and implement consistently.

5. HARDWIRED ZERO REGISTER (OPTIONAL): If implementing RISC-V style: register 0 always reads as 0. Writes to register 0 are ignored (wr_en for reg[0] always disabled).

6. RESET: On reset, optionally initialize all registers to 0 (or leave undefined for faster synthesis).

7. Test Case 1 - Independent Reads: Write value 0x55 to register 3. Read register 3 on both read ports. Expected: rd_data1=0x55, rd_data2=0x55.

8. Test Case 2 - Same-Cycle Read/Write: Write value 0xAA to register 5. In same cycle, read register 5. Expected: rd_data follows chosen semantics (write-first: 0xAA; read-first: old value).

9. Test Case 3 - Zero Register (if applicable): Write 0xFF to register 0. Read register 0. Expected: rd_data=0x00 (hardwired zero). Register 0 unchanged.

---

## Hints


