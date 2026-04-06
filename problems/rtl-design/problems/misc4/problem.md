# PWM Generator

**Domain:** rtl-design — FIFO / Queue  
**Difficulty:** Medium  
**Topics:** PWM, Signal Generation, Design

---

## Problem Statement

Build Parameterizable Pulse Width Modulation (PWM) Generator

Implement a PWM generator with configurable duty cycle using counter-based approach.\n\n' +
        '**Operation:**\n' +
        '```\npwm_out = (counter < DUTY) ? 1 : 0\ncounter wraps at PERIOD-1\nDUTY=0 → always low, DUTY=PERIOD → always high\n```\n\n' +
        '**Constraints:**\n' +
        '- Parameterizable PERIOD and DUTY\n' +
        '- Handle 0% and 100% duty edge cases\n' +
        '- PWM frequency = f_clk / PERIOD

---

## Requirements

1. PARAMETERIZATION: (1) COUNTER_WIDTH (bits for counter, determines maximum period), (2) Optional: PERIOD and DUTY as parameters or runtime inputs.

2. PWM PRINCIPLE: PWM signal is periodic with defined period. Within each period, signal is high for duty_cycle portion, low for remainder. Duty cycle = (high_time / period) * 100%.

3. COUNTER: Maintain counter that counts from 0 to (PERIOD-1), then wraps to 0 (modulo PERIOD).

4. PWM OUTPUT GENERATION: Compare counter with duty threshold. If counter < DUTY, pwm_out=1 (high). Else, pwm_out=0 (low).

5. PERIOD: Total number of clock cycles per PWM period. Example: PERIOD=100 means 100 clock cycles per period.

6. DUTY: Number of clock cycles per period that output is high. Must satisfy 0 ≤ DUTY ≤ PERIOD.

7. DUTY CYCLE EDGE CASES: (1) DUTY=0: Output always low (0% duty). (2) DUTY=PERIOD: Output always high (100% duty). Define and test these explicitly.

8. RUNTIME CONFIGURABILITY (OPTIONAL): Allow PERIOD and DUTY to be inputs (runtime configurable). Changes take effect on next period boundary or immediately (document).

9. RESET: On reset, counter=0, pwm_out=0 (or initial state).

10. OUTPUT: pwm_out (1 bit), the PWM signal.

11. Test Case 1 - 25% Duty: PERIOD=8, DUTY=2 (25% duty). Expected: Within each 8-cycle period, pwm_out high for 2 cycles, low for 6 cycles. Pattern repeats: 11000000, 11000000, ...

12. Test Case 2 - 50% Duty: PERIOD=10, DUTY=5. Expected: Pattern: 1111100000 repeating.

13. Test Case 3 - 0% Duty: DUTY=0. Expected: pwm_out always 0 (never high).

14. Test Case 4 - 100% Duty: DUTY=PERIOD (e.g., 8). Expected: pwm_out always 1 (never low).

15. Test Case 5 - Duty Change (if runtime configurable): Start with DUTY=2, PERIOD=8. After several periods, change DUTY=6. Expected: Duty cycle updates, new pattern 11111100 repeating.

---

## Hints

<details>
<summary>Hint 1</summary>
Counter: if (counter == PERIOD-1) 0 else counter+1.
</details>

<details>
<summary>Hint 2</summary>
DUTY=0: always false → output 0. DUTY=PERIOD: always true → output 1.
</details>

<details>
<summary>Hint 3</summary>
Runtime update: apply at period boundary to avoid glitches.
</details>
