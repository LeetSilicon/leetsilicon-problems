# Majority Element

**Domain:** programming — Array Problems  
**Difficulty:** Easy  
**Topics:** Array, Boyer-Moore

---

## Problem Statement

Majority Element

Given an array `nums` of size `n`, return the majority element.\n\n' +
        'The majority element is the element that appears more than `⌊n / 2⌋` times. You may assume that the majority element always exists in the array.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: nums = [2,2,1,1,1,2,2]\nOutput: 2\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: nums = [3,3,4,3]\nOutput: 3\n```\n\n' +
        '**Constraints:**\n' +
        '- `n == nums.length`\n' +
        '- `1 <= n <= 5 * 10⁴`\n' +
        '- The majority element is **guaranteed** to exist

---

## Requirements

1. Time complexity: O(n)

2. Space complexity: O(1)

3. Use Boyer-Moore Voting Algorithm

---

## Hints

<details>
<summary>Hint 1</summary>
Maintain a candidate and counter (increment for same, decrement for different).
</details>

<details>
<summary>Hint 2</summary>
When counter hits zero, pick the current element as new candidate.
</details>
