# Run-Length Encoding

**Domain:** programming — Array Problems  
**Difficulty:** Medium  
**Topics:** String, Two Pointers

---

## Problem Statement

Run-Length Encoding

Given a string `s`, perform run-length encoding: compress consecutive runs into `count + character` format.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: s = "aaaabbbcc"\nOutput: "4a3b2c"\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: s = "abcd"\nOutput: "1a1b1c1d"\n```\n\n' +
        '**Constraints:**\n' +
        '- `0 <= s.length <= 10⁵`

---

## Requirements

1. Append count + character per run

---

## Hints

<details>
<summary>Hint 1</summary>
Use two pointers to mark the start of each run.
</details>

<details>
<summary>Hint 2</summary>
Append count and character when the run ends.
</details>
