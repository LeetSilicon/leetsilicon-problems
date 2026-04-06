# All Pairs With Given Sum

**Domain:** programming — Array Problems  
**Difficulty:** Easy  
**Topics:** Array, Hash Table

---

## Problem Statement

All Pairs With Given Sum

Given an array `nums` and an integer `target`, return all unique pairs `(a, b)` such that `a + b = target`.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: nums = [2,7,11,15], target = 9\nOutput: [(2,7)]\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: nums = [3,3,3], target = 6\nOutput: [(3,3)]\n```\n\n' +
        '**Constraints:**\n' +
        '- `1 <= nums.length <= 10⁵`\n' +
        '- Return unique value pairs

---

## Requirements

1. Time complexity: O(n)

2. Do not reuse the same element index

---

## Hints

<details>
<summary>Hint 1</summary>
Use a hash map for counts while scanning.
</details>

<details>
<summary>Hint 2</summary>
For each x, look for target - x in the map.
</details>
