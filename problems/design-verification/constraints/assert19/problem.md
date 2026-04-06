# Protocol Event Sequence Coverage

**Domain:** design-verification — Constraints  
**Difficulty:** Hard  
**Topics:** Assertions, Coverage, Protocol

---

## Problem Statement

Write Coverage for Protocol Event Sequences

Write coverage assertions to measure coverage of different valid event sequences in a communication protocol. Track sequence patterns and protocol phases.

---

## Requirements

1. EVENT DEFINITION: Define protocol events (e.g., REQ, ACK, DATA, DONE).

2. VALID SEQUENCES: Identify valid event sequences. Example: REQ→ACK→DATA→DONE, REQ→ACK→DONE (no data).

3. COVERAGE PROPERTIES: Create cover property for each valid sequence.

4. INVALID SEQUENCES: Optionally assert against invalid sequences (e.g., DATA before ACK).

5. SEQUENCE MARKERS: Define clear start/end markers to avoid counting overlapping sequences incorrectly.

6. BINS: Use covergroup bins for sequence types or SVA cover properties for temporal sequences.

7. RESET: disable iff (rst).

8. Test Case 1 - Sequence REQ→ACK→DATA→DONE: Generate this sequence. Verify coverage bin/cover property hits.

9. Test Case 2 - Sequence REQ→ACK→DONE: Generate short sequence without DATA. Verify separate coverage.

10. Test Case 3 - Multiple Sequences: Generate several sequences of different types. Verify each tracked independently.

11. Test Case 4 - Overlapping Sequences: REQ at cycle 0, another REQ at cycle 5 (before first DONE). Verify both sequences tracked correctly.

12. Test Case 5 - Coverage Report: Ensure all expected sequences covered before test end.

---

## Hints


