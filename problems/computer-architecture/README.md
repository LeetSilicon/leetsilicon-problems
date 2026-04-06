# Computer Architecture Problems

Design microarchitecture components in SystemVerilog.

## Categories

| Category | Problems |
|----------|----------|
| Cache | Direct-mapped, set-associative, LRU, victim cache |
| Branch Predictor | 1-bit, 2-bit saturating, BTB, tournament |
| Out-of-Order | ROB, reservation stations, Tomasulo algorithm |
| Datapath / ALU | Multi-cycle ALU, barrel shifter, divider |
| Memory Hierarchy | TLB, page table walker, prefetcher |

## Difficulty Guide

- **Medium** — Direct-mapped cache, simple branch predictor, basic ALU
- **Hard** — Set-associative with LRU, Tomasulo, out-of-order commit

## Folder Structure

```
<category-slug>/<problem-id>/
  problem.md
  problem.json
  template.sv
  solution.sv
  testbench.sv
```
