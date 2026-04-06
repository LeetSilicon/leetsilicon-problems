# Contains Nearby Duplicate

**Domain:** programming — Array Problems  
**Difficulty:** Easy  
**Topics:** Array, Hash Table, Sliding Window

---

## Problem Statement

Contains Duplicate II

Given an integer array `nums` and an integer `k`, return `true` if there are two distinct indices `i` and `j` such that `nums[i] == nums[j]` and `|i - j| <= k`.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: nums = [1,2,3,1], k = 3\nOutput: true\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: nums = [1,2,3,1,2,3], k = 2\nOutput: false\n```\n\n' +
        '**Constraints:**\n' +
        '- `1 <= nums.length <= 10⁵`\n' +
        '- `0 <= k <= 10⁵`

---

## Requirements

1. Time complexity: O(n)

---

## Hints

<details>
<summary>Hint 1</summary>
Keep a map from value → last index seen.
</details>

<details>
<summary>Hint 2</summary>
When you see a value again, check if i - lastIndex <= k.
</details>
