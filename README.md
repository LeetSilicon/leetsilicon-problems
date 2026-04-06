# Question Bank 🔧

An open-source collection of hardware design problems covering RTL Design, Computer Architecture, Design Verification, RTL Debugging, and HDL Programming. Built for students, interview prep, and anyone learning digital design.

## Domains

| Domain | Problems | Difficulty Range |
|--------|----------|-----------------|
| [RTL Design](./problems/rtl-design/) | FIFO, FSM, Pipeline, Memory, Arithmetic, Interfaces | Easy → Hard |
| [Computer Architecture](./problems/computer-architecture/) | Caches, Branch Predictors, Out-of-Order, ALUs | Medium → Hard |
| [Design Verification](./problems/design-verification/) | Assertions, Constrained-Random, UVM | Medium → Hard |
| [RTL Debug](./problems/rtl-debug/) | Buggy RTL + waveform-based debugging challenges | Easy → Hard |
| [Programming](./problems/programming/) | HDL + scripting tasks | Easy → Hard |

## How to Use

### Browse Problems

Each problem lives in its own folder under `problems/`. Open `problem.md` for the full description, requirements, and hints.

```
problems/rtl-design/fifo/fifo1-sync-fifo/
  ├── problem.md       ← Start here
  ├── problem.json     ← Structured metadata
  ├── template.sv      ← Starter code with TODOs
  ├── solution.sv      ← Reference solution
  └── testbench.sv     ← Reference testbench
```

### Simulate Locally

You can test solutions using [iverilog](https://github.com/steveicarus/iverilog), [Verilator](https://www.veripool.org/verilator/), or any online tool like [EDA Playground](https://www.edaplayground.com/).

```bash
# Example with iverilog
iverilog -g2012 -o sim testbench.sv solution.sv
vvp sim
```

See [docs/how-to-simulate.md](./docs/how-to-simulate.md) for detailed setup instructions.

### Use the JS Question Bank (for app integrations)

```js
import { getDefaultQuestionBank } from './src/index';
const bank = getDefaultQuestionBank();
// bank['rtl-design'], bank['computer-architecture'], etc.
```

## Contributing

We welcome contributions of all kinds:

- **New problems** — add a problem in any domain
- **Bug fixes** — fix a broken testbench or wrong solution
- **Better solutions** — improve an existing reference solution
- **New domains** — propose a new category

See [CONTRIBUTING.md](./CONTRIBUTING.md) to get started.

## Project Structure

```
rtl-problem-bank/
├── problems/                  # Human-readable problems (contribute here)
│   ├── rtl-design/
│   ├── computer-architecture/
│   ├── design-verification/
│   ├── rtl-debug/
│   └── programming/
├── src/                       # JS question bank source
│   ├── index.js
│   ├── domains/               # Question data per domain
│   ├── debug/                 # RTL debug challenges
│   ├── solutions/             # Reference solutions
│   └── templates/             # Starter templates
├── scripts/                   # Validation and index generation
└── docs/                      # Guides and schema documentation
```

## License

MIT — see [LICENSE](./LICENSE).
