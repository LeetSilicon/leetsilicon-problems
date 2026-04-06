# Find Peak Element

**Domain:** programming — Array Problems  
**Difficulty:** Medium  
**Topics:** Binary Search, Array

---

## Problem Statement

Find Peak Element

A peak element is an element that is strictly greater than its neighbors.\n\n' +
        'Given a 0-indexed integer array `nums`, find a peak element and return its index. If the array contains multiple peaks, return the index to **any** of the peaks.\n\n' +
        'You may imagine that `nums[-1] = nums[n] = -∞`.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: nums = [1,2,3,1]\nOutput: 2\nExplanation: 3 is a peak element.\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: nums = [1,2,1,3,5,6,4]\nOutput: 5\nExplanation: Either index 1 or 5 are valid.\n```\n\n' +
        '**Constraints:**\n' +
        '- `1 <= nums.length <= 1000`\n' +
        '- `nums[i] != nums[i + 1]` for all valid `i`

---

## Requirements

1. Time complexity: O(log n)

---

## Hints

<details>
<summary>Hint 1</summary>
Compare mid with mid+1 to decide which side has a peak.
</details>
