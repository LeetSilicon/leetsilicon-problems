# Kth Largest Element

**Domain:** programming — Array Problems  
**Difficulty:** Medium  
**Topics:** Array, QuickSelect

---

## Problem Statement

Kth Largest Element in an Array

Given an integer array `nums` and an integer `k`, return the **kth largest** element in the array.\n\n' +
        'Note that it is the `k`th largest element in sorted order, not the `k`th distinct element.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: nums = [3,2,1,5,6,4], k = 2\nOutput: 5\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: nums = [3,2,3,1,2,4,5,5,6], k = 4\nOutput: 4\n```\n\n' +
        '**Constraints:**\n' +
        '- `1 <= k <= nums.length <= 10⁵`\n' +
        '- `-10⁴ <= nums[i] <= 10⁴`

---

## Requirements

1. Heap approach: O(n log k)

2. QuickSelect approach: O(n) average

---

## Hints

<details>
<summary>Hint 1</summary>
A min-heap of size k keeps the kth largest at the root.
</details>

<details>
<summary>Hint 2</summary>
QuickSelect partitions like quicksort but only recurses into one side.
</details>

<details>
<summary>Hint 3</summary>
kth largest = index n-k in 0-indexed sorted order.
</details>
