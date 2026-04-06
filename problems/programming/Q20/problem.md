# Count the Triplets

**Domain:** programming — Array Problems  
**Difficulty:** Easy  
**Topics:** Array, Two Pointers, Sorting

---

## Problem Statement

Count Triplets with Zero Sum

Given an array `arr`, count the number of triplets `(i, j, k)` where `i < j < k` and `arr[i] + arr[j] + arr[k] = 0`.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: arr = [-1,0,1]\nOutput: 1\nExplanation: (-1) + 0 + 1 = 0\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: arr = [1,5,3,2]\nOutput: 0\n```\n\n' +
        '**Constraints:**\n' +
        '- `3 <= arr.length <= 10³`\n' +
        '- `-10⁶ <= arr[i] <= 10⁶`

---

## Requirements

1. Time complexity: O(n²)

2. Sort and use two-pointer technique

---

## Hints

<details>
<summary>Hint 1</summary>
Sort ascending, then fix one element and use two pointers for the remaining pair.
</details>
