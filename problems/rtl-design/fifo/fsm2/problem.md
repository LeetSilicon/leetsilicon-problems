# Traffic Light Controller

**Domain:** rtl-design — FIFO / Queue  
**Difficulty:** Medium  
**Topics:** FSM, Moore Machine, Design

---

## Problem Statement

Implement Traffic Light Controller Using Moore FSM

Design a traffic light controller for a two-way intersection using a Moore FSM with timers.\n\n' +
        '**State sequence:**\n' +
        '```\nNS_GREEN(10cy) → NS_YELLOW(2cy) → EW_GREEN(10cy) → EW_YELLOW(2cy) → repeat\n```\n\n' +
        '**Constraints:**\n' +
        '- Moore FSM: outputs depend only on current state\n' +
        '- Never both directions green simultaneously\n' +
        '- Always transition through yellow (safety)

---

## Requirements

1. MOORE FSM: Outputs (light states) depend only on current state, not on inputs. Outputs change only on state transitions (synchronous to clock).

2. TRAFFIC DIRECTIONS: Two directions: North-South (NS) and East-West (EW). Each direction has three lights: RED, YELLOW, GREEN.

3. STATES: Define at least 4 states: (1) NS_GREEN (NS green, EW red), (2) NS_YELLOW (NS yellow, EW red), (3) EW_GREEN (EW green, NS red), (4) EW_YELLOW (EW yellow, NS red).

4. TIMING: Each state has a duration controlled by a timer/counter. Example: NS_GREEN lasts 10 seconds, NS_YELLOW lasts 2 seconds, EW_GREEN lasts 10 seconds, EW_YELLOW lasts 2 seconds. Parameterize or define durations.

5. TIMER IMPLEMENTATION: Maintain a counter that counts down (or up to threshold) in each state. When timer expires, transition to next state and reset timer.

6. STATE SEQUENCE: Normal cycle: NS_GREEN → NS_YELLOW → EW_GREEN → EW_YELLOW → (repeat). Never go directly from GREEN to RED (always through YELLOW for safety).

7. RESET BEHAVIOR: On reset, enter a safe initial state (e.g., NS_GREEN with EW_RED, or an ALL_RED state). Timer initializes to state duration.

8. OUTPUTS: Generate signals for each light: ns_red, ns_yellow, ns_green, ew_red, ew_yellow, ew_green. Exactly one light per direction asserted (except during all-red if implemented).

9. NO GLITCHES: Outputs change only on clock edges (Moore property). No combinational hazards in output logic.

10. Test Case 1 - Normal Cycle: After reset, observe state sequence: NS_GREEN (10 cycles) → NS_YELLOW (2 cycles) → EW_GREEN (10 cycles) → EW_YELLOW (2 cycles) → repeat. Verify light outputs match states.

11. Test Case 2 - Reset Mid-Cycle: Start in NS_GREEN, wait 5 cycles. Assert reset. Expected: FSM returns to initial state (NS_GREEN or defined reset state), timer resets, correct outputs.

12. Test Case 3 - Output Stability (Moore Property): During a state, even if there were inputs (e.g., sensor), outputs remain constant until next clock edge when state changes. Verify no glitches.

13. Test Case 4 - Timer Boundaries: Verify timer counts correctly and transitions occur at exact cycle count. For NS_YELLOW with duration=2, verify transition happens after exactly 2 cycles.

14. Test Case 5 - Illegal Light Combinations: Verify never both directions green simultaneously, never both directions yellow simultaneously. Only one active light per direction.

---

## Hints

<details>
<summary>Hint 1</summary>
Timer implementation: Maintain counter register. Decrement each cycle (or increment to threshold). When counter reaches 0 (or threshold), transition to next state and reload counter with next state duration.
</details>

<details>
<summary>Hint 2</summary>
State encoding: Can use binary (2 bits for 4 states) or one-hot (4 bits). One-hot makes output decode simpler.
</details>

<details>
<summary>Hint 3</summary>
Output assignment (Moore): In separate always_comb or assign statements, decode current state to light signals. Example: assign {ns_red, ns_yellow, ns_green} = (state==NS_GREEN) ? 3\
</details>

<details>
<summary>Hint 4</summary>
b010 : 3\
</details>

<details>
<summary>Hint 5</summary>
,
        
</details>

<details>
<summary>Hint 6</summary>
,
        
</details>

<details>
<summary>Hint 7</summary>
,
        
</details>

<details>
<summary>Hint 8</summary>
,
        
</details>
