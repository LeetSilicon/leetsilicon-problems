# Trapping Rain Water

**Domain:** programming — Array Problems  
**Difficulty:** Hard  
**Topics:** Array, Two Pointers, Stack

---

## Problem Statement

Trapping Rain Water

Given `n` non-negative integers representing an elevation map where the width of each bar is `1`, compute how much water it can trap after raining.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: height = [0,1,0,2,1,0,1,3,2,1,2,1]\nOutput: 6\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: height = [4,2,0,3,2,5]\nOutput: 9\n```\n\n' +
        '**Constraints:**\n' +
        '- `n == height.length`\n' +
        '- `1 <= n <= 2 * 10⁴`\n' +
        '- `0 <= height[i] <= 10⁵`

---

## Requirements

1. Time complexity: O(n)

2. Space complexity: O(1) with two-pointer approach

---

## Hints

<details>
<summary>Hint 1</summary>
Use two pointers tracking leftMax and rightMax.
</details>
