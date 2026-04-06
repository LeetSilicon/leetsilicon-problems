# Problem Schema

Every problem folder must contain a `problem.json` file. This document defines all fields.

## Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier, lowercase with hyphens. e.g. `fifo1`, `rtl-debug-fsm-reset` |
| `shortName` | string | Short display name. e.g. `"Synchronous FIFO with Flags"` |
| `domain` | string | One of: `rtl-design`, `computer-architecture`, `design-verification`, `rtl-debug`, `programming` |
| `category` | string | Sub-category within domain. e.g. `"FIFO / Queue"`, `"FSM"`, `"Cache"` |
| `difficulty` | string | One of: `Easy`, `Medium`, `Hard` |
| `topics` | string[] | Tags for the problem. e.g. `["FIFO", "CDC", "Metastability"]` |
| `question` | string | Full question title (one line) |
| `description` | string | Full markdown description. Include interface, constraints, examples. |
| `requirements` | string[] | Detailed requirements. Each item is one bullet. Test cases go here too. |

## Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `hints` | string[] | 2–4 hints that guide without giving away the solution |
| `signals` | string[] | (RTL Debug only) List of signal names to inspect in waveform |
| `bugType` | string | (RTL Debug only) e.g. `"state/output timing"`, `"off-by-one"` |
| `summary` | string | (RTL Debug only) One-sentence description of the bug |
| `expectedBehavior` | string[] | (RTL Debug only) What the fixed design should do |
| `hiddenChecks` | string[] | (RTL Debug only) Edge cases that the fix must also handle |

## Test Case Naming Convention

Requirements that are test cases should follow this format:

```
"Test Case N - <Short Label>: <full description with inputs and expected outputs>"
```

Example:
```json
"Test Case 1 - Basic FIFO Operation: DEPTH=8, WIDTH=8. Push values [0xAA, 0xBB, 0xCC]. Then pop 3 times. Expected: outputs are [0xAA, 0xBB, 0xCC] in order."
```

## Full Example

```json
{
  "id": "fifo1",
  "shortName": "Synchronous FIFO with Flags",
  "domain": "rtl-design",
  "category": "FIFO / Queue",
  "difficulty": "Hard",
  "topics": ["FIFO", "Design", "Flags"],
  "question": "Design Synchronous FIFO with Full, Empty, Almost-Full, and Almost-Empty Flags",
  "description": "Implement a synchronous FIFO...\n\n**Interface:**\n```\nwrite_en + write_data → push\n```",
  "requirements": [
    "PARAMETERIZATION: Support parameters DEPTH and WIDTH.",
    "RESET BEHAVIOR: On reset, pointers and count initialize to 0.",
    "Test Case 1 - Basic FIFO Operation: Push [0xAA, 0xBB, 0xCC], pop 3 times. Expected: [0xAA, 0xBB, 0xCC] in order."
  ],
  "hints": [
    "Counter method: increment on write, decrement on read.",
    "Almost flags: simple threshold comparison on count."
  ]
}
```

## RTL Debug Example

```json
{
  "id": "rtl-debug-fsm-reset",
  "shortName": "FSM Sequence Detector — Late Detect Pulse",
  "domain": "rtl-debug",
  "category": "FSM",
  "difficulty": "Medium",
  "topics": ["RTL Debug", "Waveform", "FSM", "state/output timing"],
  "bugType": "state/output timing",
  "summary": "Debug a 1011 sequence detector where detect pulse is asserted one cycle late.",
  "signals": ["clk", "rst", "in_bit", "state", "next_state", "detect"],
  "expectedBehavior": [
    "detect should pulse exactly when sequence 1011 completes.",
    "Reset should initialize state machine deterministically."
  ],
  "hints": [
    "Check whether detect is derived from current state or next state."
  ]
}
```
