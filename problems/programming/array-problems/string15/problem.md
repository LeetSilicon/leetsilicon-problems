# Find All Occurrences of Substring

**Domain:** programming — Array Problems  
**Difficulty:** Medium  
**Topics:** String, KMP

---

## Problem Statement

Find All Occurrences of Pattern

Given strings `text` and `pattern`, return all starting indices where `pattern` occurs in `text` (including overlapping matches).\n\n' +
        '**Example 1:**\n' +
        '```\nInput: text = "abababab", pattern = "ab"\nOutput: [0,2,4,6]\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: text = "aaaa", pattern = "aa"\nOutput: [0,1,2]\n```\n\n' +
        '**Constraints:**\n' +
        '- Handle overlapping matches\n' +
        '- `1 <= text.length <= 10⁵`

---

## Requirements

1. Return array of 0-based indices

---

## Hints

<details>
<summary>Hint 1</summary>
Use KMP to find all matches in O(n+m).
</details>
