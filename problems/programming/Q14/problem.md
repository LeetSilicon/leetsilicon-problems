# All Subsets (Power Set)

**Domain:** programming — Array Problems  
**Difficulty:** Medium  
**Topics:** Array, Backtracking, Bit Manipulation

---

## Problem Statement

Subsets

Given an integer array `nums` of unique elements, return the total number of possible subsets (the power set).\n\n' +
        '**Example 1:**\n' +
        '```\nInput: nums = [1,2,3]\nOutput: 8\nExplanation: [],[1],[2],[3],[1,2],[1,3],[2,3],[1,2,3]\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: nums = [7]\nOutput: 2\n```\n\n' +
        '**Constraints:**\n' +
        '- `0 <= nums.length <= 10`\n' +
        '- All elements are **unique**

---

## Requirements

1. No duplicate subsets

2. Backtracking or bitmask approach

---

## Hints

<details>
<summary>Hint 1</summary>
Backtracking: for each element, choose to include or exclude.
</details>

<details>
<summary>Hint 2</summary>
Bitmask: iterate 0..(2^n - 1), set bits determine which elements to include.
</details>
