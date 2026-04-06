# Find Minimum in Rotated Sorted Array

**Domain:** programming — Array Problems  
**Difficulty:** Medium  
**Topics:** Array, Binary Search

---

## Problem Statement

Find Minimum in Rotated Sorted Array

Given the sorted rotated array `nums` of **unique** elements, return the minimum element of this array.\n\n' +
        'You must write an algorithm that runs in `O(log n)` time.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: nums = [3,4,5,1,2]\nOutput: 1\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: nums = [11,13,15,17]\nOutput: 11\nExplanation: Array was not rotated.\n```\n\n' +
        '**Constraints:**\n' +
        '- `n == nums.length`\n' +
        '- `1 <= n <= 5000`\n' +
        '- All values are **unique**

---

## Requirements

1. Time complexity: O(log n)

2. Binary search approach

---

## Hints

<details>
<summary>Hint 1</summary>
Compare mid with the right boundary to decide which side has the minimum.
</details>
