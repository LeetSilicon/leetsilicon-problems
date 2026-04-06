# Substring Search

**Domain:** programming — Array Problems  
**Difficulty:** Medium  
**Topics:** String, KMP

---

## Problem Statement

Find the Index of the First Occurrence in a String

Given two strings `text` and `pattern`, return the index of the first occurrence of `pattern` in `text`, or `-1` if `pattern` is not found.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: text = "helloworld", pattern = "world"\nOutput: 5\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: text = "abcdef", pattern = "xyz"\nOutput: -1\n```\n\n' +
        '**Constraints:**\n' +
        '- `1 <= text.length, pattern.length <= 10⁴`\n' +
        '- Naive: O(n*m), KMP: O(n+m)

---

## Requirements

1. Return 0-based index or -1

---

## Hints

<details>
<summary>Hint 1</summary>
KMP builds LPS array for the pattern to avoid re-checking characters on mismatch.
</details>
