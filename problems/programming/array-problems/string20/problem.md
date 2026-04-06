# Shortest Palindrome by Appending

**Domain:** programming — Array Problems  
**Difficulty:** Hard  
**Topics:** String, KMP

---

## Problem Statement

Shortest Palindrome by Appending

Given a string `s`, find the shortest palindrome you can form by appending characters to the **end** of `s`.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: s = "abc"\nOutput: "abcba"\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: s = "race"\nOutput: "racecar"\n```\n\n' +
        '**Constraints:**\n' +
        '- `0 <= s.length <= 5 * 10⁴`

---

## Requirements

1. Only append to the end

---

## Hints

<details>
<summary>Hint 1</summary>
Find the longest palindromic suffix; append the reverse of the remaining prefix.
</details>

<details>
<summary>Hint 2</summary>
KMP/LPS can compute this efficiently.
</details>
