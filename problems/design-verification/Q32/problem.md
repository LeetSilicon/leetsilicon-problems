# Achieve Without Constraints

**Domain:** design-verification — Constraints  
**Difficulty:** Hard  
**Topics:** Alternative, Pipeline, Implementation

---

## Problem Statement

Implement Instruction Generation Rules Without SystemVerilog Constraints

Write uvm sv constraints to implement the instruction repetition and non-overlap rules from pipe1 and pipe2 using procedural code (algorithmic random generation) instead of declarative constraints. Must maintain same functional behavior: spacing rules, no-overlap, deterministic seed-based reproduction.

---

## Requirements

1. NO SV CONSTRAINTS: Cannot use rand variables with constraint blocks. Pure procedural/algorithmic approach.

2. FUNCTIONAL EQUIVALENCE: Must enforce same rules as constrained versions (ADD spacing, SUB spacing, latency-based overlap).

3. RANDOM GENERATION: Use $urandom or $random with seed for randomness. Not deterministic selection.

4. STATE MANAGEMENT: Maintain history, cooldown counters, or other state to track constraints.

5. LEGAL FILTERING: Each step, determine legal opcodes (those not violating rules), then randomly select from legal set.

6. SEED REPRODUCIBILITY: Same seed must produce same instruction sequence (deterministic).

7. NO DEADLOCK: If no legal opcode exists, define behavior: insert bubble/NOP (if allowed), backtrack, or restart. Document choice.

8. Test Case 1 - Rule Compliance: Generate long sequence (1000 instructions). Verify all spacing and overlap rules hold.

9. Test Case 2 - Stress Test: Worst-case latencies and small opcode sets. Verify generator produces outputs without hanging.

10. Test Case 3 - Determinism: Generate sequence with seed=42. Reset and regenerate with same seed. Verify identical sequences.

11. Test Case 4 - Distribution: Over many seeds, verify opcodes distributed reasonably (not heavily biased unless required).

12. Test Case 5 - No Deadlock: Test with tight constraints. Verify generator handles cases where few/no legal opcodes remain.

---

## Hints


