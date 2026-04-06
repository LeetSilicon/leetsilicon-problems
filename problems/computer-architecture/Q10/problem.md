# Overflow Detection

**Domain:** computer-architecture — Cache & Memory  
**Difficulty:** Easy  
**Topics:** ALU, Overflow, RTL

---

## Problem Statement

Implement Signed Addition Overflow Detection Logic

Design overflow detection for signed two\'s complement addition.\n\n' +
        'Overflow occurs when adding two same-sign numbers produces an opposite-sign result. Must be independent of carry-out.\n\n' +
        '**Example (WIDTH=8, range -128 to +127):**\n' +
        '```\nA=127, B=1 → sum=128(0x80=-128) → overflow=1\nA=-128, B=-1 → sum=-129(0x7F=+127) → overflow=1\nA=50, B=20 → sum=70 → overflow=0\n```\n\n' +
        '**Constraints:**\n' +
        '- Parameterizable WIDTH\n' +
        '- Purely combinational logic on sign bits\n' +
        '- Independent of carry-out

---

## Requirements

1. OVERFLOW CONDITION: Overflow occurs when: (1) Adding two positive numbers produces negative result, OR (2) Adding two negative numbers produces positive result.

2. FORMULA: overflow = (A[MSB] == B[MSB]) && (A[MSB] != sum[MSB]), where MSB = WIDTH-1.

3. INDEPENDENCE FROM CARRY: Overflow detection must work correctly regardless of carry-out value. Carry and overflow are distinct conditions.

4. NO OVERFLOW CASES: (1) Adding positive and negative never overflows, (2) Result has same sign as inputs means no overflow.

5. PARAMETERIZATION: Support parameterizable WIDTH. MSB position = WIDTH-1.

6. Test Case 1 - Positive Overflow: WIDTH=8 (range -128 to +127), A=127 (0x7F), B=1 (0x01). sum=128 (0x80 = -128 in signed). Expected: overflow=1.

7. Test Case 2 - Negative Overflow: WIDTH=8, A=-128 (0x80), B=-1 (0xFF). sum=-129 (wraps to 0x7F = +127). Expected: overflow=1.

8. Test Case 3 - No Overflow: WIDTH=8, A=50 (0x32), B=20 (0x14). sum=70 (0x46). Expected: overflow=0.

---

## Hints


