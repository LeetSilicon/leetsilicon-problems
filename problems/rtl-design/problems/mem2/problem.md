# Dual-Port RAM

**Domain:** rtl-design — FIFO / Queue  
**Difficulty:** Medium  
**Topics:** Memory, Dual-Port, Design

---

## Problem Statement

Design Dual-Port RAM with Simultaneous Read and Write Capability

Implement a dual-port RAM allowing two independent simultaneous accesses.\n\n' +
        '**Types:**\n' +
        '```\nSimple dual-port: Port A write-only, Port B read-only\nTrue dual-port:   Both ports can read or write\n```\n\n' +
        '**Constraints:**\n' +
        '- Define collision behavior (same-address R+W, W+W)\n' +
        '- Document priority for write-write collision\n' +
        '- Parameterizable DEPTH and WIDTH

---

## Requirements

1. DUAL-PORT TYPES: (1) Simple Dual-Port: Port A write-only, Port B read-only. (2) True Dual-Port: Both ports can read or write independently. Document which type is implemented.

2. PARAMETERIZATION: DEPTH (number of words), WIDTH (bits per word).

3. PORT A INTERFACE: addr_a, write_data_a, write_en_a, read_data_a (if true dual-port), read_en_a (if true dual-port).

4. PORT B INTERFACE: addr_b, write_data_b (if true dual-port), write_en_b (if true dual-port), read_data_b, read_en_b.

5. INDEPENDENT OPERATION: Both ports operate independently on same clock. Can access different addresses simultaneously without conflict.

6. SAME ADDRESS READ+WRITE: Define behavior when one port writes and other port reads same address in same cycle. Options: (1) Read returns old value (read-first), (2) Read returns new written value (write-first), (3) Undefined. Document and implement consistently.

7. WRITE-WRITE COLLISION (TRUE DUAL-PORT ONLY): Define behavior when both ports write to same address simultaneously. Options: (1) Port A has priority (Port B write ignored), (2) Port B has priority, (3) Bitwise OR/AND (rare), (4) Assert error flag. Common: define priority and document.

8. READ LATENCY: Define per port. Typically 1-cycle synchronous read for both ports (registered outputs).

9. RESET: Optional. Can clear memory or leave undefined.

10. Test Case 1 - Simultaneous R/W Different Addresses: Port A writes addr=1 with data=0xAA. Port B reads addr=2. Expected: Both operations succeed independently. Port B reads whatever is in mem[2]. No conflict.

11. Test Case 2 - Same Address One Write One Read: Port A writes addr=3 with data=0xBB. Port B reads addr=3 simultaneously. Expected: Per documented behavior: if write-first, Port B read (after latency) returns 0xBB. If read-first, returns old value.

12. Test Case 3 - Write-Write Collision (True Dual-Port): Both Port A and Port B write to addr=5 with different data (Port A: 0xCC, Port B: 0xDD). Expected: Memory at addr=5 contains value per priority rule (e.g., Port A priority → 0xCC stored). Optionally collision flag asserted.

13. Test Case 4 - Independent Reads: Both ports read different addresses simultaneously. Expected: Both return correct data from respective addresses.

14. Test Case 5 - Simple Dual-Port: Port A writes addr=7 with 0xEE. Port B reads addr=7 next cycle. Expected: Port B reads 0xEE (after write completes).

---

## Hints

<details>
<summary>Hint 1</summary>
Collision detection: wire collision = (addr_a == addr_b) && write_en_a && write_en_b;
</details>

<details>
<summary>Hint 2</summary>
Simple dual-port is more common and resource-efficient.
</details>
