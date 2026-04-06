# Digits Only String

**Domain:** programming — Array Problems  
**Difficulty:** Easy  
**Topics:** String

---

## Problem Statement

Is Digits Only

Given a string `s`, return `true` if every character is a digit (`0`-`9`), otherwise return `false`.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: s = "12345"\nOutput: true\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: s = "12a45"\nOutput: false\n```\n\n' +
        '**Constraints:**\n' +
        '- `0 <= s.length <= 10⁵`\n' +
        '- Empty string returns `true`

---

## Requirements

1. Time complexity: O(n)

---

## Hints

<details>
<summary>Hint 1</summary>
Scan each character and verify isdigit. Return false immediately on a non-digit.
</details>
