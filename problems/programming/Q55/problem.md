# Search in Infinite Sorted Array

**Domain:** programming — Array Problems  
**Difficulty:** Medium  
**Topics:** Binary Search, Array

---

## Problem Statement

Search in Infinite Sorted Array

Given an interface `InfiniteArray` where you can only call `get(i)` to access index `i`, and the array is sorted in ascending order, find the index of a given `target`.\n\n' +
        'Return `-1` if the target does not exist.\n\n' +
        '**Example:**\n' +
        '```\nApproach: Exponential expansion to find bounds, then binary search.\n```\n\n' +
        '**Constraints:**\n' +
        '- Array is conceptually infinite and sorted\n' +
        '- Time complexity: O(log position)

---

## Requirements

1. Find range by doubling (1,2,4,8...) then binary search

---

## Hints


