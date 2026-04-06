# Design Verification Problems

Write verification components in SystemVerilog and UVM.

## Categories

| Category | Problems |
|----------|----------|
| Assertions (SVA) | Protocol checks, handshake validation, data integrity |
| Constrained-Random | UVM sequence items, constraint blocks |
| UVM Advanced | Scoreboards, monitors, coverage, drivers, analysis FIFOs |

## Difficulty Guide

- **Medium** — Simple SVA properties, basic constrained-random items
- **Hard** — UVM out-of-order scoreboards, split-beat monitors, coverage closures

## Folder Structure

```
<category-slug>/<problem-id>/
  problem.md
  problem.json
  template.sv       ← UVM class or SVA module starter
  solution.sv       ← Reference implementation
```

Design verification problems may not always include a full testbench — the solution *is* the verification component.

## Notes

- All UVM problems target UVM 1.2.
- Assertion problems use IEEE 1800-2017 SVA syntax.
- Compile with: `iverilog -g2012 -Wall`
