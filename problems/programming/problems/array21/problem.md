# 3Sum

**Domain:** programming — Array Problems  
**Difficulty:** Medium  
**Topics:** Array, Two Pointers, Sorting

---

## Problem Statement

3Sum

Given an integer array `nums`, return all the triplets `[nums[i], nums[j], nums[k]]` such that `i != j`, `i != k`, `j != k`, and `nums[i] + nums[j] + nums[k] == 0`.\n\n' +
        'Notice that the solution set must not contain duplicate triplets.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: nums = [-1,0,1,2,-1,-4]\nOutput: [[-1,-1,2],[-1,0,1]]\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: nums = [0,0,0]\nOutput: [[0,0,0]]\n```\n\n' +
        '**Constraints:**\n' +
        '- `3 <= nums.length <= 3000`\n' +
        '- `-10⁵ <= nums[i] <= 10⁵`

---

## Requirements

1. Time complexity: O(n²)

2. Must avoid duplicate triplets

---

## Hints

<details>
<summary>Hint 1</summary>
Sort the array first.
</details>

<details>
<summary>Hint 2</summary>
Fix one element and use two pointers for the remaining pair.
</details>

<details>
<summary>Hint 3</summary>
Skip duplicates by advancing pointers past equal values.
</details>
