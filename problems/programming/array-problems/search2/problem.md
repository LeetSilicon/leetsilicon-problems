# Search in Rotated Sorted Array

**Domain:** programming — Array Problems  
**Difficulty:** Medium  
**Topics:** Binary Search, Array

---

## Problem Statement

Search in Rotated Sorted Array

Given the array `nums` after a possible rotation and an integer `target`, return the index of `target` if it is in `nums`, or `-1` if it is not.\n\n' +
        'You must write an algorithm with `O(log n)` runtime complexity.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: nums = [4,5,6,7,0,1,2], target = 0\nOutput: 4\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: nums = [4,5,6,7,0,1,2], target = 3\nOutput: -1\n```\n\n' +
        '**Constraints:**\n' +
        '- `1 <= nums.length <= 5000`\n' +
        '- All values are **unique**

---

## Requirements

1. Time complexity: O(log n)

---

## Hints

<details>
<summary>Hint 1</summary>
At each step, one half of the array is sorted.
</details>

<details>
<summary>Hint 2</summary>
Check if target lies in the sorted half; if not, search the other half.
</details>
