# Sort Colors

**Domain:** programming — Array Problems  
**Difficulty:** Medium  
**Topics:** Array, Two Pointers, Dutch National Flag

---

## Problem Statement

Sort Colors

Given an array `nums` with `n` objects colored red, white, or blue, sort them **in-place** so that objects of the same color are adjacent, with the colors in the order red, white, and blue.\n\n' +
        'We will use the integers `0`, `1`, and `2` to represent red, white, and blue respectively.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: nums = [2,0,2,1,1,0]\nOutput: [0,0,1,1,2,2]\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: nums = [2,0,1]\nOutput: [0,1,2]\n```\n\n' +
        '**Constraints:**\n' +
        '- `n == nums.length`\n' +
        '- `1 <= n <= 300`\n' +
        '- `nums[i]` is either `0`, `1`, or `2`

---

## Requirements

1. In-place with O(1) extra space

2. Single pass with Dutch National Flag algorithm

---

## Hints

<details>
<summary>Hint 1</summary>
Three pointers: low (next 0), mid (current), high (next 2).
</details>

<details>
<summary>Hint 2</summary>
Swap 0s to front and 2s to back.
</details>
