# Indexes of Subarray Sum

**Domain:** programming — Array Problems  
**Difficulty:** Medium  
**Topics:** Array, Sliding Window

---

## Problem Statement

Subarray Sum Equals Target

Given an array of non-negative integers `arr` and a target sum, find the first contiguous subarray whose sum equals the target. Return 1-based `[left, right]` indices, or `[-1]` if not found.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: arr = [1,2,3,7,5], target = 12\nOutput: [2,4]\nExplanation: arr[2..4] = [2,3,7] sums to 12\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: arr = [5,3,4], target = 2\nOutput: [-1]\n```\n\n' +
        '**Constraints:**\n' +
        '- `1 <= arr.length <= 10⁵`\n' +
        '- `arr[i] >= 0`

---

## Requirements

1. Time complexity: O(n)

2. Use sliding window for non-negative arrays

---

## Hints

<details>
<summary>Hint 1</summary>
Expand right to increase sum, shrink left while sum > target.
</details>

<details>
<summary>Hint 2</summary>
Return as soon as sum == target.
</details>
