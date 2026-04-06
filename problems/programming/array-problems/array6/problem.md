# Missing Number

**Domain:** programming — Array Problems  
**Difficulty:** Easy  
**Topics:** Array, Math, Bit Manipulation

---

## Problem Statement

Missing Number

Given an array `nums` containing `n` distinct numbers in the range `[0, n]`, return the only number in the range that is missing from the array.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: nums = [3,0,1]\nOutput: 2\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: nums = [9,6,4,2,3,5,7,0,1]\nOutput: 8\n```\n\n' +
        '**Constraints:**\n' +
        '- `n == nums.length`\n' +
        '- `1 <= n <= 10⁴`\n' +
        '- All numbers are **unique**

---

## Requirements

1. Time complexity: O(n)

2. Space complexity: O(1)

---

## Hints

<details>
<summary>Hint 1</summary>
Sum formula: missing = n*(n+1)/2 - sum(nums).
</details>

<details>
<summary>Hint 2</summary>
XOR approach: XOR all indices and values; duplicates cancel.
</details>
