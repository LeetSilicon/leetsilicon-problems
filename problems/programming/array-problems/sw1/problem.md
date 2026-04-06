# Minimum Window Substring

**Domain:** programming — Array Problems  
**Difficulty:** Hard  
**Topics:** String, Sliding Window, Hash Table

---

## Problem Statement

Minimum Window Substring

Given two strings `s` and `t` of lengths `m` and `n` respectively, return the **minimum window substring** of `s` such that every character in `t` (including duplicates) is included in the window.\n\n' +
        'If there is no such substring, return the empty string `""`.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: s = "ADOBECODEBANC", t = "ABC"\nOutput: "BANC"\nExplanation: The minimum window substring is "BANC".\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: s = "a", t = "aa"\nOutput: ""\nExplanation: Both \'a\'s from t must be included.\n```\n\n' +
        '**Constraints:**\n' +
        '- `1 <= m, n <= 10⁵`\n' +
        '- `s` and `t` consist of uppercase and lowercase English letters

---

## Requirements

1. Time complexity: O(m + n)

2. Sliding window with frequency map

---

## Hints

<details>
<summary>Hint 1</summary>
Expand right pointer to satisfy all required characters.
</details>

<details>
<summary>Hint 2</summary>
Shrink left pointer while window is still valid to minimize length.
</details>
