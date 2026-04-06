# CDC Slow→Fast (1-bit)

**Domain:** rtl-design — FIFO / Queue  
**Difficulty:** Medium  
**Topics:** RTL, CDC

---

## Problem Statement

2-FF Synchronizer for 1-bit CDC (Slow to Fast)

Implement a classic 2-flop synchronizer in destination domain for a 1-bit signal.\n\n' +
        '**Constraints:**\n' +
        '- Two serial flip-flops in dst_clk domain\n' +
        '- Output changes after 2 flops latency\n' +
        '- No combinational logic between stages

---

## Requirements

1. INPUTS: dst_clk, dst_rst_n, async_sig_in.

2. OUTPUT: sig_sync.

3. SYNC: Two serial always_ff flops in dst_clk domain.

4. RESET: Reset clears both synchronizer stages and the synchronized output.

5. Test Case - Rising input: async input toggle propagates to sig_sync only after the 2-flop latency.

6. Test Case - Falling input: deassertion also propagates with the same two-stage latency.

---

## Hints

<details>
<summary>Hint 1</summary>
Mark synchronizer flops with attributes if desired.
</details>
