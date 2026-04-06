# FSM State Transition Coverage

**Domain:** design-verification — Constraints  
**Difficulty:** Hard  
**Topics:** Assertions, Coverage, FSM

---

## Problem Statement

Write Coverage for FSM State Transitions

Write coverage assertions to measure functional coverage of state transitions in a finite state machine. Track all legal and illegal transitions. Ensure comprehensive FSM coverage.

---

## Requirements

1. STATE DEFINITION: Define FSM states (e.g., IDLE, ACTIVE, DONE). Use state encoding from design.

2. LEGAL TRANSITIONS: Define all valid state transitions. Example: IDLE→ACTIVE, ACTIVE→DONE, DONE→IDLE.

3. ILLEGAL TRANSITIONS: Identify and assert against illegal transitions. Example: IDLE→DONE (if not allowed).

4. COVERAGE FORM: Use cover property for each legal transition: cover property (@(posedge clk) (state==IDLE) ##1 (state==ACTIVE));

5. ASSERTION FORM: Assert illegal transitions never occur: assert property (@(posedge clk) disable iff (rst) (state==IDLE) |-> ##1 (state != DONE));

6. RESET STATE: Cover reset to IDLE transition. Assert FSM in IDLE after reset.

7. UNREACHABLE STATES: If certain states should never be reached, assert against them: assert property (@(posedge clk) disable iff (rst) state != UNREACHABLE);

8. CROSS COVERAGE: Use covergroups to cross state transitions with input conditions.

9. Test Case 1 - Legal Transition Coverage: Run random stimulus. Verify all legal transitions hit in coverage report.

10. Test Case 2 - Illegal Transition Detection: Force illegal transition (e.g., IDLE→DONE). Verify assertion fires.

11. Test Case 3 - Reset Coverage: Assert and release reset. Verify coverage hits RESET→IDLE transition.

12. Test Case 4 - Unreachable State: If state encoding allows unreachable states, verify assertion prevents entry.

13. Test Case 5 - Coverage Closure: Ensure 100% state transition coverage achieved before test completion.

---

## Hints

<details>
<summary>Hint 1</summary>
Cover each transition: cover property (@(posedge clk) ($rose(state==S1) ##1 (state==S2)));
</details>

<details>
<summary>Hint 2</summary>
Alternative covergroup: covergroup cg @(posedge clk); cp_state: coverpoint state; cp_trans: coverpoint {$past(state), state}; endgroup
</details>

<details>
<summary>Hint 3</summary>
Cross coverage: cross state with inputs: cross state, input_sig; To track transitions under conditions.
</details>

<details>
<summary>Hint 4</summary>
Assert legal set: assert property (@(posedge clk) disable iff (rst) state inside {IDLE, ACTIVE, DONE});
</details>

<details>
<summary>Hint 5</summary>
Assert specific illegal: assert property (@(posedge clk) disable iff (rst) (state==IDLE) |-> ##1 (state inside {IDLE, ACTIVE})); No direct IDLE→DONE.
</details>

<details>
<summary>Hint 6</summary>
Reset assertion: assert property (@(posedge clk) $rose(!rst) |-> ##1 (state==IDLE));
</details>

<details>
<summary>Hint 7</summary>
Unreachable: If state is 2-bit enum with only 3 states defined, 4th encoding is unreachable: assert property (@(posedge clk) state != 2\
</details>

<details>
<summary>Hint 8</summary>
,
    
</details>
