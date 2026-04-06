# First Duplicate Element

**Domain:** programming — Array Problems  
**Difficulty:** Easy  
**Topics:** Array, Hash Table

---

## Problem Statement

First Duplicate Element

Given an array `nums`, return the first element that appears more than once. If no duplicate exists, return `-1`.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: nums = [2,5,1,2,3,5,1,2,4]\nOutput: 2\nExplanation: 2 is the first value encountered again.\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: nums = [1,2,3,4]\nOutput: -1\n```\n\n' +
        '**Constraints:**\n' +
        '- `1 <= nums.length <= 10⁵`\n' +
        '- `1 <= nums[i] <= 10⁵`

---

## Requirements

1. Time complexity: O(n)

2. Space complexity: O(n)

3. Use hash set to track seen elements

---

## Hints

<details>
<summary>Hint 1</summary>
Scan left to right and store seen values in a set.
</details>

<details>
<summary>Hint 2</summary>
The first value already in the set is the answer.
</details>
