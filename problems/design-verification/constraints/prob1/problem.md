# Conditional Probability Constraint

**Domain:** design-verification — Constraints  
**Difficulty:** Hard  
**Topics:** Constraints, Probability

---

## Problem Statement

Variable Probability Based on Previous Value Parity

Write uvm sv constraint for 8-bit variable where next value parity depends on previous value: (1) If previous value was odd, next value is even with 75% probability, (2) If previous value was even, next value is even with 25% probability. Maintain state between randomizations.

---

## Requirements

1. VARIABLE: 8-bit variable x (rand bit [7:0] x).

2. STATE: Maintain previous value in variable prev (not randomized). Updated after each randomization.

3. PROBABILITY RULE 1: If prev is odd (prev[0]==1), then x is even with probability 75%, odd with probability 25%.

4. PROBABILITY RULE 2: If prev is even (prev[0]==0), then x is even with probability 25%, odd with probability 75%.

5. INITIALIZATION: On first randomization, prev uninitialized. Define behavior: treat as even, or seed with fixed value. Document.

6. PARITY: Even number: LSB==0 (x[0]==0). Odd number: LSB==1 (x[0]==1).

7. DISTRIBUTION: Use dist construct to specify probabilities. Weights approximate 75/25 split.

8. STATE UPDATE: In post_randomize(), update prev = x for next call.

9. Test Case 1 - Previous Odd: Set prev=3 (odd). Randomize 10,000 times. Count how many times x is even. Expected: ~7,500 (75% ± tolerance).

10. Test Case 2 - Previous Even: Set prev=4 (even). Randomize 10,000 times. Count even x. Expected: ~2,500 (25% ± tolerance).

11. Test Case 3 - Initialization: First randomize with prev uninitialized (or default 0). Verify behavior matches documented initial rule.

12. Test Case 4 - State Persistence: Randomize with prev=5, then prev=6. Verify probability distribution changes between runs.

13. Test Case 5 - Statistical Tolerance: Use chi-square or binomial test with significance level (e.g., 95% confidence interval).

---

## Hints


