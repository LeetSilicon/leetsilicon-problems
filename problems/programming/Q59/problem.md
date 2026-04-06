# Maximum Subarray

**Domain:** programming — Array Problems  
**Difficulty:** Medium  
**Topics:** DP, Kadane

---

## Problem Statement

Maximum Subarray

Given an integer array `nums`, find the subarray with the largest sum, and return its sum.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: nums = [-2,1,-3,4,-1,2,1,-5,4]\nOutput: 6\nExplanation: The subarray [4,-1,2,1] has the largest sum 6.\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: nums = [1]\nOutput: 1\n```\n\n' +
        '**Constraints:**\n' +
        '- `1 <= nums.length <= 10⁵`\n' +
        '- `-10⁴ <= nums[i] <= 10⁴`

---

## Requirements

1. Use Kadane

2. ,
        

---

## Hints

<details>
<summary>Hint 1</summary>
Either extend the current subarray or start a new one at each element.
</details>

<details>
<summary>Hint 2</summary>
Track bestSoFar and currentBest as you iterate.
</details>
