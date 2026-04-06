# Transaction Data Validity

**Domain:** design-verification — Constraints  
**Difficulty:** Hard  
**Topics:** Assertions, UVM, Transaction

---

## Problem Statement

Write UVM Assertion: Transaction Data Validity Check

Write assertion to check transaction data validity in UVM sequence or monitor. Verify data fields meet protocol requirements (parity, range, no X).

---

## Requirements

1. DATA VALIDITY: Define what makes data valid. Examples: (1) No X/Z values, (2) Parity correct, (3) Value within range, (4) Checksum/CRC correct.

2. CHECKING POINT: Decide where to check: (1) In sequence before/after item send, (2) In driver before driving, (3) In monitor after sampling, (4) In interface with SVA.

3. IMMEDIATE ASSERTION: For checks in sequence/driver (procedural code), use immediate assertion: assert (condition) else $error.

4. CONCURRENT ASSERTION: For cycle-accurate checks, use SVA in interface.

5. UVM INTEGRATION: Place SVA in interface. Access via virtual interface in monitor. Or use immediate assertions in sequence/driver.

6. Test Case 1 - Valid Data: data=0x55 (no X, within range). Assertion passes.

7. Test Case 2 - X Data: data=8'hXX. Assertion fails if checking for no X.

8. Test Case 3 - Out-of-Range: data=0x1FF (out of [0:255]). Assertion fails.

9. Test Case 4 - Parity Error: data with incorrect parity bit. Parity checker fails.

---

## Hints

<details>
<summary>Hint 1</summary>
No unknown: assert property (@(posedge clk) valid |-> !$isunknown(data));
</details>
