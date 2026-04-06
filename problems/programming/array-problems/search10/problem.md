# Count Occurrences in Sorted Array

**Domain:** programming — Array Problems  
**Difficulty:** Easy  
**Topics:** Binary Search, Array

---

## Problem Statement

Count Occurrences in Sorted Array

Given a sorted array `nums` and a value `target`, return the number of times `target` appears in the array.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: nums = [1,4,9,16,25], target = 9\nOutput: 2\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: nums = [1,4,9,16], target = 15\nOutput: -1\n```\n\n' +
        '**Constraints:**\n' +
        '- `nums` is sorted in non-decreasing order\n' +
        '- Time complexity: O(log n)

---

## Requirements

1. Use lower bound and upper bound binary searches

---

## Hints

<details>
<summary>Hint 1</summary>
Count = upperBound(target) - lowerBound(target).
</details>
