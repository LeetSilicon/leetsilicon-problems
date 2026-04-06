# No Repeat in Next 3 Draws

**Domain:** design-verification — Constraints  
**Difficulty:** Hard  
**Topics:** Constraints, Pattern

---

## Problem Statement

Pick Ball from 10 Colors, No Repeat in Next 3 Picks

Randomly select a colored ball from 10 options. Once picked, that color cannot be selected in the next 3 draws (cooldown period). Write uvm sv constraint to implement sliding exclusion window of last 3 picks.

---

## Requirements

1. COLORS: 10 different colored balls (e.g., values 0-9).

2. EXCLUSION RULE: If color C picked at time t, then C cannot be picked at times t+1, t+2, t+3.

3. SLIDING WINDOW: Maintain last 3 picks. Next pick must not match any of last 3.

4. FEASIBILITY: 10 colors, exclude 3 → 7 available each turn. Always feasible.

5. WITH REPLACEMENT: Same color can be picked multiple times (not permanent removal), just not within cooldown window.

6. COOLDOWN EXPIRY: After 3 draws, color becomes available again. Color picked at t becomes available again at t+4.

---

## Hints


