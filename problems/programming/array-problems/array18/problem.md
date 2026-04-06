# Maximum Product Subarray

**Domain:** programming — Array Problems  
**Difficulty:** Medium  
**Topics:** Array, DP

---

## Problem Statement

Maximum Product Subarray

Given an integer array `nums`, find a subarray that has the largest product, and return the product.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: nums = [2,-5,-2,-4,3]\nOutput: 24\nExplanation: [-5,-2,-4,3] or [2,-5,-2] variants\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: nums = [-2]\nOutput: -2\n```\n\n' +
        '**Constraints:**\n' +
        '- `1 <= nums.length <= 2 * 10⁴`\n' +
        '- `-10 <= nums[i] <= 10`

---

## Requirements

1. Time complexity: O(n)

2. Space complexity: O(1)

3. Track both max and min product (negatives can flip)

---

## Hints

<details>
<summary>Hint 1</summary>
At each index, keep curMax and curMin because a negative flips sign.
</details>
