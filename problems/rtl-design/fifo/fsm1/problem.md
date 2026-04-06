# Sequence Detector (1011)

**Domain:** rtl-design — FIFO / Queue  
**Difficulty:** Medium  
**Topics:** FSM, Sequence Detection, Design

---

## Problem Statement

Design Overlapping Sequence Detector for Pattern 1011

Implement an FSM to detect binary sequence "1011" in a serial input stream with overlapping support.\n\n' +
        '**Example:**\n' +
        '```\nInput:  0 1 0 1 1 0 1 0 1 1\nDetect: _ _ _ _ ^ _ _ _ _ ^\n```\n\n' +
        '**Constraints:**\n' +
        '- Support overlapping detection\n' +
        '- Moore or Mealy (document choice)\n' +
        '- All states must have transitions for both in=0 and in=1

---

## Requirements

1. PATTERN: Detect binary sequence 

2.  (four bits).

3. OVERLAPPING SUPPORT: After detecting 

4. , immediately continue looking for the next occurrence starting from the longest valid suffix. Example: input 

5.  should detect two matches (positions ending at bits 3 and 6).

6. FSM TYPE: Can implement as Moore (output depends only on state) or Mealy (output depends on state and input). Document choice. For Mealy: detect pulse on transition. For Moore: detect asserted in detection state.

7. INPUT: Serial input signal 

8.  (1 bit per clock cycle).

9. OUTPUT: Detection signal 

10.  (1-bit pulse or level depending on Moore/Mealy).

11. RESET: Synchronous or asynchronous reset (document choice). On reset, FSM returns to initial state IDLE, detect=0.

12. STATE ENCODING: Define states clearly. Example states: IDLE (no match), S1 (seen 

13. ), S10 (seen 

14. ), S101 (seen 

15. ), S1011 (complete match).

16. COMPLETE TRANSITIONS: Every state must have defined transitions for in=0 and in=1. No incomplete state diagrams (prevents latches).

17. Test Case 1 - Single Match: Input sequence: 0 1 0 1 1 0. Expected: detect pulses (or asserts) at cycle 4 when 

18.  completes.

19. Test Case 2 - Overlapping Sequences: Input: 1 0 1 1 1. After first 

20.  at bit 3, bit 4 (another 

21. ) should create potential for overlap. However, 

22.  contains 

23.  followed by 

24. , not another complete 

25. . Verify detect pulse occurs exactly once at correct position.

26. Test Case 3 - Multiple Non-Overlapping Matches: Input: 1 0 1 1 0 1 0 1 1. Expected: detect pulses at two positions (after 4th and 9th bits).

27. Test Case 4 - No Match: Input: 0 0 0 1 1 0 0 (no 

28. ). Expected: detect never asserts.

29. Test Case 5 - Reset During Sequence: Input 

30. , then assert reset. Expected: FSM returns to IDLE, detect=0. Continue with 

31. . Expected: detect pulses at completion.

32. Test Case 6 - Fallback Transitions: Input 

33.  (breaks sequence at 4th bit). Expected: FSM falls back to appropriate state (S10) and continues looking.

---

## Hints

<details>
<summary>Hint 1</summary>
State design for overlapping: After matching 
</details>

<details>
<summary>Hint 2</summary>
, next input 
</details>

<details>
<summary>Hint 3</summary>
 should transition to S1 (start of potential new match), not back to IDLE.
</details>

<details>
<summary>Hint 4</summary>
State transition table: IDLE: in=1 → S1, in=0 → IDLE. S1: in=0 → S10, in=1 → S1. S10: in=1 → S101, in=0 → IDLE. S101: in=1 → S1011 (match), in=0 → S10. S1011: in=1 → S1, in=0 → S10.
</details>

<details>
<summary>Hint 5</summary>
Output logic (Mealy): detect = (state==S101 && in==1); Pulsed for one cycle when match completes.
</details>

<details>
<summary>Hint 6</summary>
Output logic (Moore): Add separate DETECT state; detect = (state==DETECT); Stay for one cycle then transition based on input.
</details>

<details>
<summary>Hint 7</summary>
Overlapping key insight: When you match 
</details>

<details>
<summary>Hint 8</summary>
 and the next bit is 
</details>

<details>
<summary>Hint 9</summary>
, you\
</details>

<details>
<summary>Hint 10</summary>
1
</details>

<details>
<summary>Hint 11</summary>
,
        
</details>

<details>
<summary>Hint 12</summary>
101011011
</details>

<details>
<summary>Hint 13</summary>
,
        
</details>
