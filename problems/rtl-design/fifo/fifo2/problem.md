# Asynchronous FIFO

**Domain:** rtl-design — FIFO / Queue  
**Difficulty:** Hard  
**Topics:** FIFO, CDC, Metastability

---

## Problem Statement

Implement Asynchronous FIFO with Clock Domain Crossing

Design an asynchronous FIFO with independent read and write clocks. Use Gray code pointers and multi-stage synchronizers for metastability-safe CDC.\n\n' +
        '**Key CDC mechanism:**\n' +
        '```\nBinary ptr → Gray code → 2-stage sync → compare\nFull:  write_gray_next matches read_gray_sync (MSB inverted)\nEmpty: read_gray == write_gray_sync\n```\n\n' +
        '**Constraints:**\n' +
        '- DEPTH must be power of 2 (Gray code requirement)\n' +
        '- No phase/frequency relationship assumed between clocks\n' +
        '- N+1 bit pointers (extra bit disambiguates full vs empty)

---

## Requirements

1. DUAL CLOCK DOMAINS: Two independent, asynchronous clocks: write_clk (write side) and read_clk (read side). No phase or frequency relationship assumed.

2. PARAMETERIZATION: DEPTH (must be power of 2 for Gray code simplicity), WIDTH (data width).

3. GRAY CODE POINTERS: Maintain binary read/write pointers in respective domains. Convert to Gray code before crossing domains. Gray code ensures only 1 bit changes per increment (glitch-free CDC).

4. SYNCHRONIZERS: Use 2-stage (or 3-stage) synchronizer flip-flops to safely cross Gray pointers between domains. Write Gray pointer synchronized into read domain; read Gray pointer synchronized into write domain.

---

## Hints

<details>
<summary>Hint 1</summary>
Binary to Gray: gray = (binary >> 1) ^ binary.
</details>

<details>
<summary>Hint 2</summary>
Synchronizer: two back-to-back flip-flops, no logic between stages.
</details>

<details>
<summary>Hint 3</summary>
Pointer width: N+1 bits for N-entry FIFO.
</details>
