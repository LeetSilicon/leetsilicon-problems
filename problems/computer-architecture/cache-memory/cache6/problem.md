# Cache Line Refill FSM

**Domain:** computer-architecture — Cache & Memory  
**Difficulty:** Hard  
**Topics:** Cache, FSM, RTL

---

## Problem Statement

Design Finite State Machine for Cache Line Refill from Memory

Implement an FSM to manage cache line refills from main memory.\n\n' +
        'States: `IDLE → REQUEST → WAIT → FILL → COMPLETE`. Handle burst transfers, update cache data and metadata, and manage pipeline stalls.\n\n' +
        '**Example:**\n' +
        '```\nCache miss → IDLE→REQUEST→WAIT→FILL(beat0)→...→FILL(last)→COMPLETE→IDLE\nTag and valid updated only at COMPLETE\n```\n\n' +
        '**Constraints:**\n' +
        '- Cache line = N bytes, bus = M bytes wide → N/M beats\n' +
        '- Do not mark valid until all beats received\n' +
        '- Stall pipeline while FSM is not IDLE

---

## Requirements

1. STATE MACHINE: Define FSM with states: IDLE (no refill), REQUEST (issue memory request), WAIT (wait for memory response), FILL (receive data beats), COMPLETE (finalize metadata updates).

2. STATE TRANSITIONS: IDLE→REQUEST (on cache miss), REQUEST→WAIT (after request sent), WAIT→FILL (on first data beat), FILL→FILL (for each beat except last), FILL→COMPLETE (on last beat), COMPLETE→IDLE.

3. BURST HANDLING: Cache line is N bytes, memory bus is M bytes wide, requiring N/M beats. Track beat counter (0 to beats-1). Write each beat to correct word offset within cache line.

4. METADATA UPDATE: Only set valid bit and update tag after receiving complete cache line (all beats). Avoid partial-valid bug where line is marked valid before all data arrives.

5. PIPELINE STALL: While FSM is not IDLE, assert cache stall signal to prevent new requests. Release stall only after returning to IDLE.

6. RESET HANDLING: On reset assertion during refill, immediately return to IDLE. Do not leave partially filled line marked as valid.

7. Test Case 1 - Basic Refill: Cache miss triggers FSM. States: IDLE→REQUEST→WAIT→FILL(beat0)→FILL(beat1)→...→FILL(last_beat)→COMPLETE→IDLE. Verify tag updated, valid=1, data array filled.

8. Test Case 2 - Reset Mid-Refill: Assert reset while FSM in WAIT or FILL state. Expected: FSM returns to IDLE immediately. Cache line remains invalid (valid=0), no partial data visible.

9. Test Case 3 - Back-to-Back Misses: First miss starts refill (FSM busy). Second miss occurs before first completes. Expected: second miss stalls until first refill reaches COMPLETE/IDLE.

---

## Hints

<details>
<summary>Hint 1</summary>
Beat counter: 0 to (line_size/bus_width - 1), increment on each data_valid.
</details>

<details>
<summary>Hint 2</summary>
Tag and valid update in COMPLETE state, not during FILL.
</details>

<details>
<summary>Hint 3</summary>
Test memory latency variations and reset mid-refill.
</details>
