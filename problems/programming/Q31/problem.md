# Longest Substring Without Repeating Characters

**Domain:** programming — Array Problems  
**Difficulty:** Medium  
**Topics:** String, Sliding Window, Hash Table

---

## Problem Statement

Longest Substring Without Repeating Characters

Given a string `s`, find the length of the **longest substring** without repeating characters.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: s = "abcabcbb"\nOutput: 3\nExplanation: The answer is "abc", with length 3.\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: s = "bbbbb"\nOutput: 1\n```\n\n' +
        '**Constraints:**\n' +
        '- `0 <= s.length <= 5 * 10⁴`\n' +
        '- `s` consists of English letters, digits, symbols and spaces

---

## Requirements

1. Time complexity: O(n)

2. Sliding window with hash set

---

## Hints

<details>
<summary>Hint 1</summary>
Use a sliding window with left and right pointers.
</details>

<details>
<summary>Hint 2</summary>
Track last seen index of each character to jump the left pointer forward.
</details>
