# Longest Consecutive Sequence

**Domain:** programming — Array Problems  
**Difficulty:** Medium  
**Topics:** Array, Hash Set

---

## Problem Statement

Longest Consecutive Sequence

Given an unsorted array of integers `nums`, return the length of the longest consecutive elements sequence.\n\n' +
        'You must write an algorithm that runs in `O(n)` time.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: nums = [100,4,200,1,3,2]\nOutput: 4\nExplanation: The longest consecutive sequence is [1,2,3,4].\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: nums = [0,3,7,2,5,8,4,6,0,1]\nOutput: 9\n```\n\n' +
        '**Constraints:**\n' +
        '- `0 <= nums.length <= 10⁵`\n' +
        '- `-10⁹ <= nums[i] <= 10⁹`

---

## Requirements

1. Time complexity: O(n)

2. Handle duplicates

---

## Hints

<details>
<summary>Hint 1</summary>
Put all numbers in a set.
</details>

<details>
<summary>Hint 2</summary>
Only start counting from x when x-1 is not in the set.
</details>

<details>
<summary>Hint 3</summary>
Increment while x+1 exists.
</details>
