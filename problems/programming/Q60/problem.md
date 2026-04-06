# Product of Array Except Self

**Domain:** programming — Array Problems  
**Difficulty:** Medium  
**Topics:** Array, Prefix Product

---

## Problem Statement

Product of Array Except Self

Given an integer array `nums`, return an array `answer` such that `answer[i]` is equal to the product of all the elements of `nums` except `nums[i]`.\n\n' +
        'You must write an algorithm that runs in `O(n)` time and **without using the division operation**.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: nums = [1,2,3,4]\nOutput: [24,12,8,6]\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: nums = [-1,1,0,-3,3]\nOutput: [0,0,9,0,0]\n```\n\n' +
        '**Constraints:**\n' +
        '- `2 <= nums.length <= 10⁵`\n' +
        '- No division allowed

---

## Requirements

1. Time: O(n), Space: O(1) excluding output

2. Use prefix and suffix products

---

## Hints

<details>
<summary>Hint 1</summary>
Compute prefix products left-to-right, then suffix products right-to-left.
</details>

<details>
<summary>Hint 2</summary>
Multiply them together for each index.
</details>
