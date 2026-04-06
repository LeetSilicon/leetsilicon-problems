# Pair Sum

**Domain:** programming — Array Problems  
**Difficulty:** Easy  
**Topics:** Array, Hash Table, Two Pointers

---

## Problem Statement

Two Sum Exists

Given an array of integers `nums` and an integer `target`, return `true` if there exist two distinct elements whose sum equals `target`.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: nums = [2,7,11,15], target = 9\nOutput: true\nExplanation: 2 + 7 = 9\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: nums = [1,2,3], target = 7\nOutput: false\n```\n\n' +
        '**Constraints:**\n' +
        '- `2 <= nums.length <= 10⁴`\n' +
        '- `-10⁹ <= nums[i] <= 10⁹`\n' +
        '- Each input has at most one valid answer

---

## Requirements

1. Time complexity: O(n)

2. Cannot use the same element twice

---

## Hints

<details>
<summary>Hint 1</summary>
For each x, check whether target - x has been seen.
</details>

<details>
<summary>Hint 2</summary>
Store seen numbers in a set as you iterate.
</details>
