# Longest Common Prefix

**Domain:** programming — Array Problems  
**Difficulty:** Easy  
**Topics:** String, Array

---

## Problem Statement

Longest Common Prefix

Write a function to find the longest common prefix string amongst an array of strings.\n\n' +
        'If there is no common prefix, return an empty string `""`.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: strs = ["flower","flow","flight"]\nOutput: "fl"\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: strs = ["dog","racecar","car"]\nOutput: ""\n```\n\n' +
        '**Constraints:**\n' +
        '- `1 <= strs.length <= 200`\n' +
        '- `0 <= strs[i].length <= 200`

---

## Requirements

1. Compare characters vertically or use horizontal scanning

---

## Hints

<details>
<summary>Hint 1</summary>
Start with the first string as candidate prefix.
</details>

<details>
<summary>Hint 2</summary>
Shrink it until every string starts with it.
</details>
