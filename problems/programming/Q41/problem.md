# Count Words in a String

**Domain:** programming — Array Problems  
**Difficulty:** Easy  
**Topics:** String

---

## Problem Statement

Number of Words in a String

Given a string `s`, return the number of words separated by spaces. Multiple spaces may appear between words.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: s = "Hello World"\nOutput: 2\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: s = "one two three four five"\nOutput: 5\n```\n\n' +
        '**Constraints:**\n' +
        '- `1 <= s.length <= 10⁴`\n' +
        '- Ignore leading/trailing spaces

---

## Requirements

1. Handle multiple consecutive spaces

---

## Hints

<details>
<summary>Hint 1</summary>
Split by whitespace and filter empty tokens, or count space→non-space transitions.
</details>
