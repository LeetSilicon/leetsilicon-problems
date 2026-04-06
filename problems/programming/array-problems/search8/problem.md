# Median of Two Sorted Arrays

**Domain:** programming — Array Problems  
**Difficulty:** Hard  
**Topics:** Binary Search, Array

---

## Problem Statement

Median of Two Sorted Arrays

Given two sorted arrays `a` and `b` of size `m` and `n` respectively, return **the median** of the two sorted arrays.\n\n' +
        'The overall run time complexity should be `O(log(min(m, n)))`.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: a = [1,3], b = [2]\nOutput: 2.0\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: a = [1,2], b = [3,4]\nOutput: 2.5\n```\n\n' +
        '**Constraints:**\n' +
        '- `0 <= m, n <= 1000`\n' +
        '- `m + n >= 1`

---

## Requirements

1. Time complexity: O(log(min(m, n)))

---

## Hints

<details>
<summary>Hint 1</summary>
Binary search the partition in the smaller array.
</details>

<details>
<summary>Hint 2</summary>
Ensure left partition max <= right partition min for both arrays.
</details>
