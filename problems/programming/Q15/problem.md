# Array Subset Check

**Domain:** programming — Array Problems  
**Difficulty:** Easy  
**Topics:** Array, Hash Table

---

## Problem Statement

Is Subset

Given two arrays `a` and `b`, determine if `b` is a subset of `a`. Every element of `b` (including duplicates) must appear in `a` with at least that frequency.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: a = [1,2,2,3], b = [2,2]\nOutput: true\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: a = [1,2,3], b = [2,2]\nOutput: false\nExplanation: a only has one 2\n```\n\n' +
        '**Constraints:**\n' +
        '- `0 <= a.length, b.length <= 10⁵`

---

## Requirements

1. Time complexity: O(n + m)

2. Use frequency map for array a

---

## Hints

<details>
<summary>Hint 1</summary>
Build a frequency map for a.
</details>

<details>
<summary>Hint 2</summary>
For each element in b, decrement count; if it goes negative, return false.
</details>
