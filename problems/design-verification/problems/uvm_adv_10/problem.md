# Protocol Assertion Monitor

**Domain:** design-verification — Constraints  
**Difficulty:** Hard  
**Topics:** UVM, Monitor, Protocol Checks

---

## Problem Statement

Implement Protocol Checking Monitor with Inline Assertions

Design lightweight UVM monitor that performs protocol violation checking using procedural assertions (if statements with `uvm_error). Monitor samples interface continuously and checks for protocol violations: (1) valid deasserted mid-packet, (2) ready toggling when not allowed, (3) data stability violations, (4) illegal state transitions. No SystemVerilog Assertions (SVA) used, only procedural checks. Report violations immediately with detailed error messages.

---

## Requirements

1. MONITOR CLASS: Extend uvm_monitor. Sample interface signals in run_phase.

2. PROTOCOL RULES: Define specific protocol rules to check. Examples: (1) valid must remain high once asserted until packet complete, (2) data must be stable while valid high and ready low, (3) ready cannot toggle during specific phases.

3. VIOLATION DETECTION: Use if statements to detect violations. Example: if(valid_dropped_mid_packet) `uvm_error(

4. , 

5. );

6. STATE TRACKING: Maintain FSM or flags to track protocol state (idle, packet_in_progress, waiting_for_ready, etc.).

7. VALID PERSISTENCE: Once valid asserted, track expected duration. Error if deasserted early.

8. DATA STABILITY: Store data value when valid asserted. If valid remains high and ready low, data must not change.

9. READY TOGGLING: Track ready state. Error if ready toggles when protocol forbids (e.g., during ACK phase).

10. SEVERITY: Use `uvm_error for violations. Use `uvm_warning for suspicious patterns.

11. ERROR MESSAGES: Include detailed context in error messages: cycle count, signal values, expected vs actual.

12. Test Case 1 - Valid Drop Mid-Packet: Start packet (valid=1), deassert valid before completion. Monitor reports error.

13. Test Case 2 - Data Change: valid=1, ready=0, data changes. Monitor reports stability violation.

14. Test Case 3 - Ready Toggle: ready toggles during forbidden phase. Monitor reports error.

15. Test Case 4 - Valid Packet: Protocol followed correctly. No errors reported.

16. Test Case 5 - Multiple Violations: Inject multiple violations in sequence. Verify all detected and reported.

17. Test Case 6 - Edge Cases: Back-to-back packets, zero-length packets, reset during packet. Verify correct checking.

---

## Hints

<details>
<summary>Hint 1</summary>
State tracking: typedef enum {IDLE, PKT_IN_PROGRESS, WAITING_ACK} state_t; state_t state; In run_phase: always @(posedge vif.clk) case(state) IDLE: if(vif.valid) begin state = PKT_IN_PROGRESS; ... end PKT_IN_PROGRESS: if(!vif.valid) `uvm_error(
</details>

<details>
<summary>Hint 2</summary>
, 
</details>

<details>
<summary>Hint 3</summary>
); ... endcase
</details>

<details>
<summary>Hint 4</summary>
Valid persistence: int pkt_length; int beat_count; if(state == PKT_IN_PROGRESS) begin if(!vif.valid) `uvm_error(
</details>

<details>
<summary>Hint 5</summary>
, $sformatf(
</details>

<details>
<summary>Hint 6</summary>
, beat_count, pkt_length)); beat_count++; end
</details>
