# Glitch-Free Clock Gate

**Domain:** rtl-design — FIFO / Queue  
**Difficulty:** Medium  
**Topics:** RTL, Clock Gating

---

## Problem Statement

Glitch-Free Clock Gating Cell with Enable

Implement a latch-based glitch-free clock gating cell (ICG style).\n\n' +
        '**Operation:** `clk_gated = clk_in & enable_latched`\n\n' +
        '**Constraints:**\n' +
        '- Sample enable when clk_in is low (latch)\n' +
        '- Hold when clk_in is high\n' +
        '- Enable toggle while clk high must not glitch output

---

## Requirements

1. INPUTS: clk_in, enable.

2. OUTPUT: clk_gated.

3. LATCH: Sample enable when clk_in is low; hold when clk_in is high.

4. GATE: clk_gated = clk_in & enable_latched.

5. Test Case - Disabled gate: when enable=0, clk_gated stays low.

6. Test Case - Enabled gate: when enable=1 and sampled during clk low, clk_gated follows clk_in.

7. Test Case - enable toggles while clk_in high does not glitch clk_gated.

---

## Hints

<details>
<summary>Hint 1</summary>
Model latch with always_latch; use synthesis-safe coding style.
</details>
