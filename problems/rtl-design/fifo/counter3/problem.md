# Shift Register with Parallel Load

**Domain:** rtl-design — FIFO / Queue  
**Difficulty:** Medium  
**Topics:** Shift Register, Sequential, Design

---

## Problem Statement

Design Shift Register with Parallel Load and Serial Output

Implement a shift register supporting parallel load and serial shift with configurable direction.\n\n' +
        '**Operations:**\n' +
        '```\nload=1  → register = data_in (parallel)\nshift=1 → shift one position (serial_out = shifted bit)\nBoth=1  → load takes priority\n```\n\n' +
        '**Constraints:**\n' +
        '- Parameterizable WIDTH\n' +
        '- Define shift direction (left or right)\n' +
        '- Define load vs shift priority

---

## Requirements

1. PARAMETERIZATION: Parameter WIDTH defines register width (number of bits).

2. PARALLEL LOAD: Input 

3.  signal (control) and 

4.  (WIDTH bits). When load=1, entire register loaded with data_in in one clock cycle.

5. SERIAL SHIFT: Input 

6.  signal (control). When shift=1 and load=0, register shifts by one position. Define shift direction: left or right. Document choice.

7. SHIFT DIRECTION: If shift right: LSB shifted out, MSB filled (with 0 or serial input). If shift left: MSB shifted out, LSB filled. Choose and document.

8. SERIAL OUTPUT: Output 

9.  (1 bit). Provides bit shifted out each shift cycle. For right shift: serial_out = register[0] (LSB). For left shift: serial_out = register[WIDTH-1] (MSB).

10. SERIAL INPUT (OPTIONAL): Input 

11.  (1 bit). Bit shifted into register during shift. For right shift: fills MSB. For left shift: fills LSB. If not implemented, fill with 0.

12. CONTROL PRIORITY: Define behavior when both load=1 and shift=1 asserted simultaneously. Options: (1) Load has priority (shift ignored), (2) Shift has priority (load ignored), (3) Undefined (error). Common: load priority. Document clearly.

13. RESET: On reset, register initializes to 0.

14. PARALLEL OUTPUT (OPTIONAL): Output entire register value for parallel readout.

15. Test Case 1 - Parallel Load: Load=1, data_in=0b1011 (WIDTH=4). Next cycle: register = 0b1011.

16. Test Case 2 - Serial Shift Out: Register=0b1011, shift right. Shift=1 for 4 cycles. Expected serial_out sequence: 1, 1, 0, 1 (bits shifted out from LSB). After 4 shifts, register=0b0000 (if serial_in=0).

17. Test Case 3 - Load Priority: Register=0b0101. Assert load=1 with data_in=0b1100 and shift=1 simultaneously. Expected: load takes priority, register=0b1100, no shift occurs.

18. Test Case 4 - Shift with Serial Input: Register=0b0011, shift right with serial_in=1. Expected: serial_out=1 (LSB out), register becomes 0b1001 (serial_in fills MSB).

19. Test Case 5 - Multiple Loads and Shifts: Load 0b1010, shift once (right), load 0b0110, shift twice. Verify register values at each step match expected sequence.

---

## Hints


