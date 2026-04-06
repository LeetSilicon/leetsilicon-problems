# Exactly 5 Consecutive Bits

**Domain:** design-verification — Constraints  
**Difficulty:** Hard  
**Topics:** Constraints, Consecutive

---

## Problem Statement

100-bit Variable with Exactly One Run of 5 Consecutive 1s

Write uvm sv constraints to generate 100-bit variable where exactly 5 consecutive bits are 1, and all other bits are 0. Single contiguous run of five 1s. Run can start at any position from 0 to 95.

---

## Requirements

1. WIDTH: Fixed at 100 bits (bit [99:0] x).

2. PATTERN: Exactly five consecutive 1s. Example: ...000111110000...

3. ALL OTHERS ZERO: All bits except the 5-bit run must be 0.

4. RUN POSITION: Run can start at any bit position s in [0:95]. If start=0, pattern: 11111000...000. If start=95, pattern: ...00011111.

5. UNIQUENESS: Only one run. Not 6+ consecutive 1s, not multiple separate runs.

6. POPCOUNT: Total 1-bits = 5 exactly.

7. Test Case 1 - Structure Verification: Find all indices where x[i]==1. Must be exactly 5 indices and consecutive (i, i+1, i+2, i+3, i+4).

8. Test Case 2 - Boundary Starts: Force start=0 (if exposing start variable). Verify x = 100'b11111000...000. Force start=95. Verify x = 100'b000...00011111.

9. Test Case 3 - No Extra 1s: Verify popcount == 5. No additional 1s outside run.

10. Test Case 4 - Run Length Exactly 5: Verify no length-6 run exists. Pattern must be 0(if exists)111110(if exists).

11. Test Case 5 - Start Position Variety: Over many randomizations, verify run starts at different positions (uniform distribution over [0:95]).

---

## Hints

<details>
<summary>Hint 1</summary>
Simplest approach: Choose start position s, then set x = (5\
</details>
