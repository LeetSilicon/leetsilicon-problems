# Contributing to RTL Problem Bank

Thank you for contributing! There are three ways to contribute, each with its own workflow.

---

## 1. Adding a New Problem

### Step 1 — Choose a domain and create a folder

```
problems/<domain>/<problem-id>/
```

Examples:
- `problems/rtl-design/<que-no>/`
- `problems/computer-architecture/<que-no>/`
- `problems/rtl-debug<que-no>/`

### Step 2 — Create the required files

Every problem folder needs these four files:

#### `problem.json` (required)
```json
{
  "id": "fifo4",
  "shortName": "Credit-Based Flow Control FIFO",
  "domain": "rtl-design",
  "category": "FIFO / Queue",
  "difficulty": "Hard",
  "topics": ["FIFO", "Flow Control", "Credits"],
  "question": "Full question title here",
  "description": "Full markdown description...",
  "requirements": [
    "PARAMETERIZATION: ...",
    "Test Case 1 - ...: ..."
  ],
  "hints": [
    "Hint 1...",
    "Hint 2..."
  ]
}
```

See [docs/problem-schema.md](./docs/problem-schema.md) for all fields.

#### `problem.md` (required)
Human-readable problem statement. Copy from `problem.json` description and format nicely with markdown. Include requirements and test cases.

#### `template.sv` (required)
Starter code. Include module signature and TODO comments. Do **not** include the solution logic.

#### `solution.sv` (required)
Your reference solution. Must pass all test cases in `testbench.sv`.

#### `testbench.sv` (required for design problems)
A self-checking testbench that prints `PASS` or `FAIL` for each test case. See existing testbenches for the pattern.

For **RTL Debug** problems, replace `solution.sv` + `testbench.sv` with:
- `buggy_design.sv` — the broken RTL that contributors must fix
- `fixed_design.sv` — the corrected reference
- `testbench.sv` — testbench that reveals the bug

### Step 3 — Validate

```bash
node scripts/validate_problem.js problems/rtl-design/<problem-id>/problem.json
```

### Step 4 — Open a Pull Request

Use the **New Problem** PR template. Fill in all sections.

---

## 2. Fixing a Bug

If a reference solution is incorrect, a testbench has a mistake, or a problem description is misleading:

1. Open an issue using the **Bug Report** template first.
2. Fork the repo and fix the file in place.
3. PR title format: `fix(<que-no>): correct almost-full flag boundary condition`

---

## 3. Improving a Solution

If you have a more elegant, more efficient, or better-documented solution:

1. Open an issue using the **Fix/Improve Solution** template.
2. Submit your solution as `solution_alt.sv` alongside the original `solution.sv`.
3. Maintainers will review and may promote it to `solution.sv`.

---

## Code Style

- **SystemVerilog**: use `always_ff`, `always_comb`, `logic` (not `reg`/`wire`).
- **Verilog fallback**: accepted for basic problems, but SV preferred.
- **Testbenches**: use `$display("PASS: ...")` / `$display("FAIL: ...")` format so CI can parse results.
- **Comments**: explain *why*, not *what*.

---

## Commit Message Format

```
<type>(<scope>): <short description>

type: feat | fix | docs | refactor | test
scope: problem id or domain name

Examples:
feat(fifo4): add credit-based flow control FIFO problem
fix(fifo2): correct Gray code full detection formula
docs(rtl-debug): add waveform interpretation guide
```

---

## Questions?

Open a [Discussion](../../discussions) or tag an issue with `question`.
