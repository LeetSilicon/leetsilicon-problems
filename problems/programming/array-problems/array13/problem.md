# Merge Two Sorted Arrays

**Domain:** programming — Array Problems  
**Difficulty:** Easy  
**Topics:** Array, Two Pointers

---

## Problem Statement

Merge Two Sorted Arrays

Given two sorted arrays `a` and `b`, merge them into a single sorted array.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: a = [1,2,3], b = []\nOutput: [1,2,3]\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: a = [1,1,2], b = [1,3]\nOutput: [1,1,1,2,3]\n```\n\n' +
        '**Constraints:**\n' +
        '- Arrays are sorted in non-decreasing order\n' +
        '- `0 <= length <= 10⁵`

---

## Requirements

1. Time complexity: O(n + m)

2. Use two-pointer merge technique

---

## Hints

<details>
<summary>Hint 1</summary>
Maintain i for a, j for b; append the smaller element.
</details>

<details>
<summary>Hint 2</summary>
Append the remaining tail after one array is exhausted.
</details>
