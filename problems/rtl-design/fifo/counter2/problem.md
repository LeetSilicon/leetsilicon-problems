# Gray-Code Counter

**Domain:** rtl-design — FIFO / Queue  
**Difficulty:** Medium  
**Topics:** Counter, Gray Code, Design

---

## Problem Statement

Implement Gray Code Counter

Design a counter where successive values differ by exactly one bit (Hamming distance = 1).\n\n' +
        '**Conversion:**\n' +
        '```\ngray = (binary >> 1) ^ binary\n4-bit sequence: 0000,0001,0011,0010,0110,...\n```\n\n' +
        '**Constraints:**\n' +
        '- Parameterizable N-bit width\n' +
        '- Successive values differ by exactly 1 bit\n' +
        '- Useful for CDC (clock domain crossing)

---

## Requirements

1. GRAY CODE PROPERTY: Successive values differ by exactly 1 bit. For example, 4-bit Gray: 0000, 0001, 0011, 0010, 0110, 0111, 0101, 0100, 1100, 1101, 1111, 1110, 1010, 1011, 1001, 1000, (wrap to 0000).

2. PARAMETERIZATION: Parameter N defines counter width.

3. IMPLEMENTATION APPROACH: Option 1 (Recommended): Maintain binary counter internally, convert to Gray code each cycle. Option 2: Directly implement Gray sequence (complex). Document chosen approach.

4. BINARY TO GRAY CONVERSION: Formula: gray = (binary >> 1) ^ binary; Apply to binary counter value to produce Gray output.

5. ENABLE CONTROL: When enable=1, counter advances. When enable=0, holds current value.

6. RESET: On reset, counter initializes to 0 (Gray code 0000...0).

7. WRAPAROUND: After maximum Gray value, wraps back to 0.

8. OUTPUT: Gray code counter value 

9.  (N bits).

10. Test Case 1 - Gray Conversion Correctness: For N=3, binary sequence 0-7 converts to Gray: 000, 001, 011, 010, 110, 111, 101, 100. Verify conversion formula produces correct Gray values.

11. Test Case 2 - Single-Bit Change Property: Enable counter continuously. For each transition, compute Hamming distance between successive gray_count values. Expected: Hamming distance = 1 for all transitions (exactly one bit changes).

12. Test Case 3 - Wraparound: N=4. Count through full sequence (16 values). After gray_count=1000 (Gray for binary 15), next value is 0000 (Gray for binary 0). Verify transition 1000→0000 also has Hamming distance 1.

13. Test Case 4 - Enable Control: Count to Gray value 0011. Disable (enable=0) for 3 cycles. Expected: gray_count remains 0011. Re-enable, advances to next Gray value 0010.

14. Test Case 5 - Reset: At arbitrary Gray count. Assert reset. Expected: gray_count=0.

---

## Hints


