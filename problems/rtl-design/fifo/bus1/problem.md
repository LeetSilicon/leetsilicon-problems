# Memory-Mapped GPIO

**Domain:** rtl-design — FIFO / Queue  
**Difficulty:** Medium  
**Topics:** GPIO, Memory-Mapped, Design

---

## Problem Statement

Implement Memory-Mapped GPIO Module with Direction Control

Design a memory-mapped GPIO peripheral with register-based control.\n\n' +
        '**Register map:**\n' +
        '```\n0x00: GPIO_OUT  (output data)\n0x04: GPIO_IN   (input data, read-only)\n0x08: GPIO_DIR  (direction: 1=output, 0=input per bit)\n```\n\n' +
        '**Constraints:**\n' +
        '- Parameterizable GPIO_WIDTH\n' +
        '- Output pins driven when dir=1, high-Z when dir=0\n' +
        '- Define invalid address behavior

---

## Requirements

1. REGISTER MAP: Define memory-mapped registers with specific addresses. Example: (1) GPIO_OUT (offset 0x00): Output data register (write to drive outputs), (2) GPIO_IN (offset 0x04): Input data register (read to sample inputs), (3) GPIO_DIR (offset 0x08): Direction control register (1=output, 0=input per bit).

2. NUMBER OF PINS: Parameterize GPIO_WIDTH (number of GPIO pins, e.g., 8, 16, 32).

3. BUS INTERFACE: Simple memory-mapped interface: (1) address (input), (2) write_data (input), (3) write_en (input), (4) read_en (input), (5) read_data (output).

4. WRITE OPERATION: When write_en=1, decode address to determine target register. Update corresponding register with write_data.

5. READ OPERATION: When read_en=1, decode address to determine source register. Output register value on read_data.

6. DIRECTION CONTROL: Each GPIO pin has direction bit in GPIO_DIR. If dir[i]=1, pin i is output (driven by GPIO_OUT[i]). If dir[i]=0, pin i is input (GPIO_IN[i] samples external pin).

7. OUTPUT DRIVE: For output pins (dir[i]=1), drive gpio_pins[i] with GPIO_OUT[i]. For input pins (dir[i]=0), gpio_pins[i] is high-Z or input (don't drive).

8. INPUT SAMPLING: GPIO_IN register samples gpio_pins values. For input pins (dir[i]=0), GPIO_IN[i] = gpio_pins[i]. For output pins, GPIO_IN can be don't care or loopback (GPIO_IN[i] = GPIO_OUT[i]).

9. INVALID ADDRESS: Define behavior for access to unmapped address. Options: (1) Return 0 on read, ignore write, (2) Assert error signal. Document choice.

10. RESET: On reset, initialize registers: GPIO_OUT=0, GPIO_DIR=0 (all inputs), GPIO_IN=sampled values.

11. Test Case 1 - Write Then Readback: Write 0x5A to GPIO_OUT (address 0x00). Read from address 0x00. Expected: read_data=0x5A.

12. Test Case 2 - Direction Control: Set GPIO_DIR=0xFF (all outputs). Write GPIO_OUT=0xAA. Expected: gpio_pins outputs driven with 0xAA (on output-enabled pins).

13. Test Case 3 - Input Sampling: Set GPIO_DIR=0x00 (all inputs). External gpio_pins driven with 0x33. Read GPIO_IN. Expected: read_data=0x33.

14. Test Case 4 - Mixed Direction: GPIO_DIR=0xF0 (upper 4 bits output, lower 4 input). GPIO_OUT=0xA5. External gpio_pins[3:0]=0x3. Expected: gpio_pins[7:4] driven with 0xA. GPIO_IN read returns 0xA3.

15. Test Case 5 - Invalid Address: Write to address 0x0C (unmapped). Read from address 0x0C. Expected: Write ignored, read returns 0 (or error flag per spec).

---

## Hints


