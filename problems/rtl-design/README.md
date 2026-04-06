# RTL Design Problems

Design synthesizable RTL modules in SystemVerilog.

## Categories

| Category | Problems |
|----------|----------|
| FIFO / Queue | sync FIFO, async FIFO, width conversion, credit-based |
| FSM | Mealy, Moore, sequence detectors, traffic light |
| Memory / Cache | SRAM, register file, scratchpad, CAM |
| Counters / Registers | Gray code, LFSR, Johnson, shift registers |
| Pipeline / Datapath | 5-stage, hazard detection, forwarding, stall |
| Arithmetic | ALU, multiplier, divider, FP adder, CRC |
| Interfaces / Bus | AXI-Lite, APB, SPI, I2C, UART |
| Misc Classic RTL | Arbiters, encoders, crossbars, PWM |

## Difficulty Guide

- **Easy** — Combinational logic, simple registers, basic counters
- **Medium** — Single-clock FSMs, basic pipelines, parameterized modules
- **Hard** — CDC, multi-clock, complex pipelines, protocol interfaces

## Folder Structure

Each problem lives in its own folder:

```
<category-slug>/<problem-id>/
  problem.md        ← Read this first
  problem.json      ← Structured metadata
  template.sv       ← Start coding here
  solution.sv       ← Reference solution
  testbench.sv      ← Self-checking testbench
```

## Contributing a New RTL Design Problem

See [CONTRIBUTING.md](../../CONTRIBUTING.md). Make sure your testbench:
- Uses `$display("PASS: ...")` / `$display("FAIL: ...")` per test case
- Ends with either `All tests passed.` or a non-zero exit for CI
- Compiles cleanly with `iverilog -g2012`
