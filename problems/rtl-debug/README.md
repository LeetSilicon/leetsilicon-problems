# RTL Debug Challenges

Each challenge gives you **broken RTL** and a testbench. Your job is to find the bug and fix it.

## How It Works

1. Open `buggy_design.sv` — this is the broken RTL.
2. Read `problem.md` to understand what the module *should* do.
3. Read the hints (if you want them).
4. Find the bug, fix `buggy_design.sv`.
5. Run the testbench to verify your fix:
   ```bash
   iverilog -g2012 -o sim testbench.sv buggy_design.sv
   vvp sim
   ```
6. Compare your fix against `fixed_design.sv` (the reference solution).

## Categories

| Category | Bug Types |
|----------|-----------|
| FSM | State/output timing, missing default, reset bugs |
| Pipeline | Hazard detection, forwarding, stall logic |
| CDC | Missing synchronizer, Gray code errors |
| Arithmetic | Off-by-one, overflow, carry bugs |
| Memory | Address decoding, enable polarity |
| Interfaces | Handshake violations, ready/valid bugs |

## Folder Structure

```
<category>/<challenge-id>/
  problem.md          ← Bug description and expected behavior
  problem.json        ← Structured metadata
  buggy_design.sv     ← The broken RTL — fix this
  fixed_design.sv     ← Reference fix (don't peek!)
  testbench.sv        ← Self-checking testbench
```

## Contributing a Debug Challenge

Good debug challenges have:
- A **realistic** bug (something you'd actually encounter)
- A **clear symptom** visible in waveforms or test output
- A **non-obvious** root cause (not just a typo)
- At least 3 expected behavior bullets

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for the full guide.
