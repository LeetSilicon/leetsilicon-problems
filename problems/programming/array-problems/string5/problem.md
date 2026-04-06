# Subsequence Check

**Domain:** programming — Array Problems  
**Difficulty:** Easy  
**Topics:** String, Two Pointers

---

## Problem Statement

Is Subsequence

Given two strings `s` and `t`, return `true` if `s` is a **subsequence** of `t`, or `false` otherwise.\n\n' +
        'A subsequence is a string that can be derived from another by deleting some or no characters without changing the order of the remaining characters.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: s = "ace", t = "abcde"\nOutput: true\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: s = "aec", t = "abcde"\nOutput: false\n```\n\n' +
        '**Constraints:**\n' +
        '- `0 <= s.length <= 100`\n' +
        '- `0 <= t.length <= 10⁴`

---

## Requirements

1. Use two pointers: one for s, one for t

---

## Hints

<details>
<summary>Hint 1</summary>
Advance pointer on s only when characters match.
</details>

<details>
<summary>Hint 2</summary>
If you consume all of s, it is a subsequence.
</details>
