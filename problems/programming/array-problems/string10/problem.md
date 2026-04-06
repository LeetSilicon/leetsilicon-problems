# Longest Palindromic Substring

**Domain:** programming — Array Problems  
**Difficulty:** Medium  
**Topics:** String, DP, Expand Around Center

---

## Problem Statement

Longest Palindromic Substring

Given a string `s`, return the longest palindromic substring in `s`.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: s = "babad"\nOutput: "bab"\nExplanation: "aba" is also a valid answer.\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: s = "cbbd"\nOutput: "bb"\n```\n\n' +
        '**Constraints:**\n' +
        '- `1 <= s.length <= 1000`\n' +
        '- `s` consist of only digits and English letters

---

## Requirements

1. Expand around center: O(n²)

2. Handle odd and even length palindromes

---

## Hints

<details>
<summary>Hint 1</summary>
Every palindrome expands from a center (one char or between two chars).
</details>

<details>
<summary>Hint 2</summary>
Try expanding around each center and track the best window.
</details>
