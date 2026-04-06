# 5 Bits Set with Consecutive Probability

**Domain:** design-verification — Constraints  
**Difficulty:** Hard  
**Topics:** Constraints, Probability

---

## Problem Statement

5 Set Bits, 80% Consecutive, 20% Non-Consecutive

Write uvm sv constraints to generate random number with exactly 5 bits set. With 80% probability, the 5 bits are consecutive (contiguous run). With 20% probability, the 5 bits are non-consecutive (spread out). Define word width to accommodate.

---

## Requirements

1. POPCOUNT: Exactly 5 bits set (popcount = 5). Always.

2. WORD WIDTH: Define width W (must be ≥5). Example: W=16 or W=32.

3. CONSECUTIVE (80%): 5 bits form contiguous run. Pattern: 00011111000 (example). Run can start at any position 0 to W-5.

4. NON-CONSECUTIVE (20%): 5 bits set but NOT all consecutive. Example: 01010100100 (5 bits spread). No length-5 run exists.

5. PROBABILITY: 80% consecutive, 20% non-consecutive.

6. MODE SELECTION: Use helper variable to select mode. Then apply pattern constraint.

7. Test Case 1 - Popcount Always 5: For every randomization, verify $countones(x) == 5 in testbench.

8. Test Case 2 - Consecutive Rate: Randomize 10,000 times. Detect if x has contiguous 5-bit run. Expected ~8,000 have run (80% ± tolerance).

9. Test Case 3 - Non-Consecutive Valid: In 20% cases (no run), verify popcount still 5 and no length-5 run exists.

10. Test Case 4 - Start Position Variety: For consecutive mode, verify run starts at different positions across randomizations.

11. Test Case 5 - Pattern Validity: Manually inspect samples to confirm 80/20 split visually.

---

## Hints

<details>
<summary>Hint 1</summary>
Mode selection: rand bit is_consec; constraint c_mode { is_consec dist {1:=80, 0:=20}; }
</details>
