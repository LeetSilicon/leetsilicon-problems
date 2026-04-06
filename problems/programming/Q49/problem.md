# First and Last Position of Element

**Domain:** programming — Array Problems  
**Difficulty:** Medium  
**Topics:** Binary Search, Array

---

## Problem Statement

Find First and Last Position of Element in Sorted Array

Given an array of integers `nums` sorted in non-decreasing order, find the starting and ending position of a given `target` value.\n\n' +
        'If `target` is not found, return `[-1, -1]`.\n\n' +
        'You must write an algorithm with `O(log n)` runtime complexity.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: nums = [5,7,7,8,8,10], target = 8\nOutput: [3,4]\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: nums = [5,7,7,8,8,10], target = 6\nOutput: [-1,-1]\n```\n\n' +
        '**Constraints:**\n' +
        '- `0 <= nums.length <= 10⁵`

---

## Requirements

1. Time complexity: O(log n)

2. Use two binary searches for left and right boundary

---

## Hints

<details>
<summary>Hint 1</summary>
Binary search for leftmost occurrence, then for rightmost.
</details>
