# Anagram Check

**Domain:** programming — Array Problems  
**Difficulty:** Easy  
**Topics:** String, Hash Table, Sorting

---

## Problem Statement

Valid Anagram

Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.\n\n' +
        'An **Anagram** is a word formed by rearranging the letters of a different word, using all the original letters exactly once.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: s = "anagram", t = "nagaram"\nOutput: true\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: s = "rat", t = "car"\nOutput: false\n```\n\n' +
        '**Constraints:**\n' +
        '- `1 <= s.length, t.length <= 5 * 10⁴`\n' +
        '- `s` and `t` consist of lowercase English letters

---

## Requirements

1. Sorting: O(n log n)

2. Hash map: O(n)

---

## Hints

<details>
<summary>Hint 1</summary>
If lengths differ, return false immediately.
</details>

<details>
<summary>Hint 2</summary>
Count character frequencies with a hash map or fixed array.
</details>
