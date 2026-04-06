# Container With Most Water

**Domain:** programming — Array Problems  
**Difficulty:** Medium  
**Topics:** Array, Two Pointers

---

## Problem Statement

Container With Most Water

You are given an integer array `height` of length `n`. There are `n` vertical lines drawn such that the two endpoints of the `i`th line are `(i, 0)` and `(i, height[i])`.\n\n' +
        'Find two lines that together with the x-axis form a container that holds the most water.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: height = [1,8,6,2,5,4,8,3,7]\nOutput: 49\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: height = [1,1]\nOutput: 1\n```\n\n' +
        '**Constraints:**\n' +
        '- `n == height.length`\n' +
        '- `2 <= n <= 10⁵`\n' +
        '- `0 <= height[i] <= 10⁴`

---

## Requirements

1. Time complexity: O(n)

2. Use two-pointer technique

---

## Hints

<details>
<summary>Hint 1</summary>
Start with pointers at both ends for maximum width.
</details>

<details>
<summary>Hint 2</summary>
Move the pointer with the smaller height inward.
</details>
