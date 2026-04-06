# Valid Palindrome

**Domain:** programming — Array Problems  
**Difficulty:** Easy  
**Topics:** String, Two Pointers

---

## Problem Statement

Valid Palindrome

A phrase is a **palindrome** if, after converting all uppercase letters into lowercase and removing all non-alphanumeric characters, it reads the same forward and backward.\n\n' +
        'Given a string `s`, return `true` if it is a palindrome, or `false` otherwise.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: s = "racecar"\nOutput: true\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: s = "hello"\nOutput: false\n```\n\n' +
        '**Constraints:**\n' +
        '- `1 <= s.length <= 2 * 10⁵`\n' +
        '- `s` consists only of printable ASCII characters

---

## Requirements

1. Ignore non-alphanumeric characters

2. Case-insensitive comparison

---

## Hints

<details>
<summary>Hint 1</summary>
Use two pointers from both ends, skip non-alphanumeric characters.
</details>

<details>
<summary>Hint 2</summary>
Compare lowercase versions.
</details>
