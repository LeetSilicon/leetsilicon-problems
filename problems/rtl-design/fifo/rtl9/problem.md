# ms to sec/min/hr

**Domain:** rtl-design — FIFO / Queue  
**Difficulty:** Easy  
**Topics:** RTL, Counters

---

## Problem Statement

Generate Second/Minute/Hour Pulses from 1 ms Tick

Use counters driven by a 1 ms pulse to generate derived timebase pulses.\n\n' +
        '**Conversion:** `1000 ticks → sec, 60 sec → min, 60 min → hr`\n\n' +
        '**Constraints:**\n' +
        '- Each pulse is 1 cycle wide at rollover\n' +
        '- Cascaded counters

---

## Requirements

1. INPUTS: clk, rst_n, tick_1ms.

2. OUTPUTS: sec_pulse, min_pulse, hour_pulse.

3. COUNT: 1000 ticks => 1 second, 60 seconds => 1 minute, 60 minutes => 1 hour.

4. PULSE WIDTH: 1 cycle asserted at rollover event.

5. Test Case - 1000 ticks produce one sec_pulse.

6. Test Case - 60 sec_pulse events produce one min_pulse.

---

## Hints

<details>
<summary>Hint 1</summary>
Use tick_1ms as clock-enable for cascaded counters.
</details>
