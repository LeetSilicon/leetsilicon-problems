# Permutation in String

**Domain:** programming — Array Problems  
**Difficulty:** Medium  
**Topics:** String, Sliding Window, Hash Table

---

## Problem Statement

Permutation in String

Given two strings `s1` and `s2`, return `true` if `s2` contains a permutation of `s1`, or `false` otherwise.\n\n' +
        'In other words, return `true` if one of `s1`\'s permutations is a substring of `s2`.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: s1 = "ab", s2 = "eidbaooo"\nOutput: true\nExplanation: s2 contains "ba" which is a permutation of "ab".\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: s1 = "ab", s2 = "eidboaoo"\nOutput: false\n```\n\n' +
        '**Constraints:**\n' +
        '- `1 <= s1.length, s2.length <= 10⁴`

---

## Requirements

1. Time complexity: O(n)

2. Sliding window with frequency comparison

---

## Hints

<details>
<summary>Hint 1</summary>
Maintain a frequency array for s1.
</details>

<details>
<summary>Hint 2</summary>
Use a window of size |s1| over s2 and compare counts efficiently.
</details>
