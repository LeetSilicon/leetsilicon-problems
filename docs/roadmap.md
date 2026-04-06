# Roadmap

## Current Coverage

### RTL Design ✅
- FIFO / Queue (sync, async, width conversion, credit-based)
- FSM (Mealy, Moore, sequence detectors)
- Memory / Cache (SRAM, register file, scratchpad)
- Counters / Registers (gray code, LFSR, shift registers)
- Pipeline / Datapath (5-stage, hazard detection, forwarding)
- Arithmetic (ALU, multiplier, divider, FP adder)
- Interfaces / Bus (AXI-Lite, APB, SPI, I2C, UART)
- Misc Classic RTL (arbiters, encoders, crossbars)

### Computer Architecture ✅
- Caches (direct-mapped, set-associative, LRU)
- Branch Predictors (1-bit, 2-bit, BTB)
- Out-of-Order Execution (ROB, Tomasulo)
- ALUs and Datapaths

### Design Verification ✅
- SVA Assertions
- Constrained-Random (UVM sequences)
- UVM Advanced (scoreboards, monitors, coverage)

### RTL Debug ✅
- FSM bugs
- Pipeline hazard bugs
- CDC bugs
- Timing / off-by-one bugs

### Programming ✅
- HDL scripting tasks

---

## Wanted: Community Contributions

### High Priority
- [ ] AXI4 Full protocol problems
- [ ] RISC-V instruction decoder
- [ ] Floating point multiplier
- [ ] Formal verification problems (using SymbiYosys)
- [ ] More RTL debug challenges (memory, arithmetic bugs)

### Medium Priority
- [ ] UVM agent/env structure problems
- [ ] Power-aware design (clock gating, power domains)
- [ ] Timing constraint / SDC problems

### Tooling
- [ ] GitHub Actions CI to auto-run all testbenches on PR
- [ ] Script to auto-generate `problem.md` from `problem.json`
- [ ] Web viewer for browsing problems without cloning

---

## How to Propose

Open an issue with the **New Problem** template, or start a Discussion to suggest a new category or domain.
