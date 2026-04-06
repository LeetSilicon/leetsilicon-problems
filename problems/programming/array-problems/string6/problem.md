# Remove Duplicate Characters

**Domain:** programming — Array Problems  
**Difficulty:** Medium  
**Topics:** String, Hash Table

---

## Problem Statement

Remove Duplicate Letters (Preserve Order)

Given a string `s`, remove duplicate characters while preserving the original order of first occurrences.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: s = "abracadabra"\nOutput: "abrcd"\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: s = "programming"\nOutput: "progamin"\n```\n\n' +
        '**Constraints:**\n' +
        '- `1 <= s.length <= 10⁵`

---

## Requirements

1. Keep first occurrence of each character

2. Maintain original order

---

## Hints

<details>
<summary>Hint 1</summary>
Use a set of seen characters and build output left to right.
</details>

<details>
<summary>Hint 2</summary>
Only append a character the first time you see it.
</details>
