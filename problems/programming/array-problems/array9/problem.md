# Rotate Array

**Domain:** programming — Array Problems  
**Difficulty:** Medium  
**Topics:** Array, Reversal

---

## Problem Statement

Rotate Array

Given an integer array `nums`, rotate the array to the right by `k` steps.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: nums = [1,2,3,4,5,6,7], k = 3\nOutput: [5,6,7,1,2,3,4]\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: nums = [1,2], k = 3\nOutput: [2,1]\n```\n\n' +
        '**Constraints:**\n' +
        '- `1 <= nums.length <= 10⁵`\n' +
        '- `-2³¹ <= nums[i] <= 2³¹ - 1`\n' +
        '- `0 <= k <= 10⁵`

---

## Requirements

1. Must rotate in-place with O(1) extra space

2. Use reversal algorithm: reverse all → reverse first k → reverse rest

---

## Hints

<details>
<summary>Hint 1</summary>
Reduce k using k = k % n to avoid extra rotations.
</details>

<details>
<summary>Hint 2</summary>
Three reverses: whole array, first k, remaining n-k.
</details>
