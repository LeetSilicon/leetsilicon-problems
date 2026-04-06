# Move Zeroes

**Domain:** programming — Array Problems  
**Difficulty:** Easy  
**Topics:** Array, Two Pointers

---

## Problem Statement

Move Zeroes

Given an integer array `nums`, move all `0`s to the end of it while maintaining the relative order of the non-zero elements.\n\n' +
        'You must do this **in-place** without making a copy of the array.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: nums = [0,1,0,3,12]\nOutput: [1,3,12,0,0]\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: nums = [0]\nOutput: [0]\n```\n\n' +
        '**Constraints:**\n' +
        '- `1 <= nums.length <= 10⁴`\n' +
        '- `-2³¹ <= nums[i] <= 2³¹ - 1`

---

## Requirements

1. Must be done in-place with O(1) extra space

2. Maintain relative order of non-zero elements

---

## Hints

<details>
<summary>Hint 1</summary>
Use a write pointer for the next non-zero position.
</details>

<details>
<summary>Hint 2</summary>
When you find a non-zero, swap it to the write position.
</details>
