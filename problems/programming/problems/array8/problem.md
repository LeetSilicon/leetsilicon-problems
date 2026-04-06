# Equilibrium Index

**Domain:** programming — Array Problems  
**Difficulty:** Medium  
**Topics:** Array, Prefix Sum

---

## Problem Statement

Equilibrium Index

Given an array `nums`, find an index `i` such that the sum of elements to the left of `i` equals the sum of elements to the right of `i`.\n\n' +
        'Return `-1` if no such index exists. The element at index `i` is not included in either sum.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: nums = [1,3,5,2,2]\nOutput: 2\nExplanation: Left sum = 1+3 = 4, Right sum = 2+2 = 4\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: nums = [1,2,3]\nOutput: -1\n```\n\n' +
        '**Constraints:**\n' +
        '- `1 <= nums.length <= 10⁵`\n' +
        '- `-10⁵ <= nums[i] <= 10⁵`

---

## Requirements

1. Time complexity: O(n)

2. Use prefix sum technique

---

## Hints

<details>
<summary>Hint 1</summary>
Compute total sum first, then walk the array maintaining leftSum.
</details>
