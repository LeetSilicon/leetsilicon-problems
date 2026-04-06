# String Compression

**Domain:** programming — Array Problems  
**Difficulty:** Medium  
**Topics:** String, Two Pointers

---

## Problem Statement

String Compression

Given a string `s`, compress it using the counts of repeated characters. For example, `"aabbbcccc"` becomes `"a2b3c4"`.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: s = "aabbbcccc"\nOutput: "a2b3c4"\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: s = "abc"\nOutput: "abc"\nExplanation: Compressed is not shorter, return original.\n```\n\n' +
        '**Constraints:**\n' +
        '- `1 <= s.length <= 10⁴`\n' +
        '- `s` consists only of lowercase English letters

---

## Requirements

1. Return original if compressed is not shorter

---

## Hints

<details>
<summary>Hint 1</summary>
Count consecutive equal characters.
</details>

<details>
<summary>Hint 2</summary>
Append character + count to a builder.
</details>
