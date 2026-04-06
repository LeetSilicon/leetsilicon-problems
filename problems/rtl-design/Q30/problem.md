# 1-Cycle Pulse Detector

**Domain:** rtl-design — FIFO / Queue  
**Difficulty:** Easy  
**Topics:** RTL, Sequential Logic

---

## Problem Statement

Detect a One-Cycle High Pulse (0→1→0)

Assert output when input is high for exactly one clock cycle (pattern 0,1,0 in consecutive samples).\n\n' +
        '**Constraints:**\n' +
        '- Keep 2-cycle history\n' +
        '- Two-cycle high (0,1,1,0) does NOT trigger

---

## Requirements

1. INPUTS: clk, rst_n (optional), sig_in.

2. OUTPUT: onecycle_pulse.

3. HISTORY: Keep 2-cycle history using two registers.

4. DETECT: Assert onecycle_pulse for 1 cycle when pattern 0,1,0 is observed in consecutive samples.

5. Test Case - Valid: ...0,1,0... triggers onecycle_pulse once.

6. Test Case - Two-cycle high: ...0,1,1,0... does not trigger.

7. Test Case - Stuck high: ...1,1,1... does not trigger.

---

## Hints

<details>
<summary>Hint 1</summary>
Pipeline: d1<=sig_in, d2<=d1; detect using (d2, d1, sig_in).
</details>
