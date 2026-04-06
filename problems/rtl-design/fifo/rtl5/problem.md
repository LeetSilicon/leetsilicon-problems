# Debounce + Sync

**Domain:** rtl-design — FIFO / Queue  
**Difficulty:** Medium  
**Topics:** RTL, CDC, Debounce

---

## Problem Statement

Debounce an Asynchronous Input (2-cycle stable) + Rising Pulse

Synchronize async input, filter glitches (require 2 consecutive stable highs), and generate debounced rising-edge pulse.\n\n' +
        '**Constraints:**\n' +
        '- 2-flop synchronizer for async input\n' +
        '- Accept high only after 2 stable samples\n' +
        '- Output: debounced_level + debounced_rise_pulse

---

## Requirements

1. INPUTS: clk, rst_n, async_in.

2. OUTPUTS: debounced_level, debounced_rise_pulse.

3. SYNC: 2-flop synchronizer for async_in.

4. FILTER: Accept high only after 2 consecutive synchronized high samples.

5. PULSE: debounced_rise_pulse asserted for 1 cycle on 0→1 of debounced_level.

6. Test Case - Glitch: short high glitch rejected.

7. Test Case - Stable high: stable high accepted and pulse generated once.

---

## Hints

<details>
<summary>Hint 1</summary>
Filter using 2-bit shift history or small saturating counter.
</details>
