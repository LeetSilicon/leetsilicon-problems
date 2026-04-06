# House Robber II

**Domain:** programming — Array Problems  
**Difficulty:** Medium  
**Topics:** DP

---

## Problem Statement

House Robber II

All houses are arranged in a **circle**. That means the first house is the neighbor of the last one. Given an integer array `nums` representing the amount of money of each house, return the maximum amount you can rob without robbing adjacent houses.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: nums = [2,3,2]\nOutput: 3\nExplanation: Cannot rob house 1 ($2) and house 3 ($2) since they are adjacent.\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: nums = [1,2,3,1]\nOutput: 4\n```\n\n' +
        '**Constraints:**\n' +
        '- `1 <= nums.length <= 100`\n' +
        '- `0 <= nums[i] <= 1000`

---

## Requirements

1. Run House Robber twice: exclude first or exclude last

---

## Hints

<details>
<summary>Hint 1</summary>
Return max(rob(0..n-2), rob(1..n-1)).
</details>
