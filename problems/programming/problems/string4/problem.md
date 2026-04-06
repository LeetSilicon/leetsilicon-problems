# First Repeating Character

**Domain:** programming — Array Problems  
**Difficulty:** Easy  
**Topics:** String, Hash Table

---

## Problem Statement

First Repeating Character

Given a string `s`, return the first character that appears more than once. If no such character exists, return `"-"`.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: s = "abcdeab"\nOutput: "a"\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: s = "abcdef"\nOutput: "-"\n```\n\n' +
        '**Constraints:**\n' +
        '- `1 <= s.length <= 10⁵`\n' +
        '- `s` consists of lowercase English letters

---

## Requirements

1. Time complexity: O(n)

2. Use hash set to track seen characters

---

## Hints

<details>
<summary>Hint 1</summary>
Walk left to right, storing seen characters in a set.
</details>

<details>
<summary>Hint 2</summary>
The first character already in the set is the answer.
</details>
