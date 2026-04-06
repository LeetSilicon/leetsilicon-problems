# Driver-Monitor Communication

**Domain:** design-verification — Constraints  
**Difficulty:** Hard  
**Topics:** Assertions, UVM, Components

---

## Problem Statement

Verify UVM Driver and Monitor Communication

Write assertion to verify proper communication between UVM driver and monitor. Ensure every driven item is observed by monitor with matching fields within latency bound.

---

## Requirements

1. COMMUNICATION CONTRACT: Every item driver sends must be observed by monitor. Fields must match (address, data, etc.).

2. LATENCY BOUND: Monitor may observe transaction with delay (pipeline latency). Define acceptable latency.

3. TIMESTAMP: In driver, record timestamp when item driven. In monitor, record when observed. Check latency.

4. ANALYSIS PORTS: Driver and monitor use analysis ports to send transactions to scoreboard. Scoreboard correlates.

5. ASSERTION LOCATION: Procedural assertion in scoreboard (immediate assertion) or SVA in interface (concurrent assertion).

6. RACE AVOIDANCE: Sample at stable points (clocking blocks) to avoid race conditions.

7. Test Case 1 - Matching Items: Driver sends item A. Monitor observes A. Scoreboard verifies match.

8. Test Case 2 - Latency: Driver sends item at cycle 10. Monitor observes at cycle 12 (2-cycle latency). Verify within bound.

9. Test Case 3 - Mismatch: Driver sends A, monitor observes B (due to bus error). Assertion fails.

10. Test Case 4 - Lost Transaction: Driver sends item, monitor never observes. Timeout assertion fails.

11. Test Case 5 - Out-of-Order: Driver sends A then B. Monitor observes B then A. If order required, assertion fails.

---

## Hints


