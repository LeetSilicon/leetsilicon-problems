# Longest Repeating Character Replacement

**Domain:** programming — Array Problems  
**Difficulty:** Medium  
**Topics:** String, Sliding Window

---

## Problem Statement

Longest Repeating Character Replacement

You are given a string `s` and an integer `k`. You can choose any character of the string and change it to any other uppercase English character. You can perform this operation at most `k` times.\n\n' +
        'Return the length of the longest substring containing the same letter you can get after performing the above operations.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: s = "ABAB", k = 2\nOutput: 4\nExplanation: Replace the two \'A\'s with \'B\'s or vice versa.\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: s = "AABABBA", k = 1\nOutput: 4\n```\n\n' +
        '**Constraints:**\n' +
        '- `1 <= s.length <= 10⁵`\n' +
        '- `s` consists of only uppercase English letters\n' +
        '- `0 <= k <= s.length`

---

## Requirements

1. Time complexity: O(n)

2. Sliding window with max frequency tracking

---

## Hints

<details>
<summary>Hint 1</summary>
Window size - maxFrequency <= k ensures validity.
</details>

<details>
<summary>Hint 2</summary>
Expand right and shrink left when invalid.
</details>
