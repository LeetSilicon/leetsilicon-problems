# Search Insert Position

**Domain:** programming — Array Problems  
**Difficulty:** Easy  
**Topics:** Binary Search, Array

---

## Problem Statement

Search Insert Position

Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be inserted in order.\n\n' +
        'You must write an algorithm with `O(log n)` runtime complexity.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: nums = [1,3,5,7,9,11], target = 5\nOutput: 2\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: nums = [1,3,5,7,9,11], target = 8\nOutput: -1\n```\n\n' +
        '**Constraints:**\n' +
        '- `1 <= nums.length <= 10⁴`\n' +
        '- All values are **distinct** and sorted in ascending order

---

## Requirements

1. Time complexity: O(log n)

---

## Hints

<details>
<summary>Hint 1</summary>
Classic binary search; when loop ends, lo is the insertion position.
</details>
