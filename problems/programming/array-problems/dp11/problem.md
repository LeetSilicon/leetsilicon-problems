# Decode Ways

**Domain:** programming — Array Problems  
**Difficulty:** Medium  
**Topics:** DP, String

---

## Problem Statement

Decode Ways

A message containing letters from `A-Z` can be encoded as numbers using the mapping: `A → 1, B → 2, ..., Z → 26`.\n\n' +
        'Given a string `s` containing only digits, return the **number of ways** to decode it.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: s = "12"\nOutput: 2\nExplanation: "AB" (1 2) or "L" (12)\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: s = "226"\nOutput: 3\nExplanation: "BZ" (2 26), "VF" (22 6), or "BBF" (2 2 6)\n```\n\n' +
        '**Example 3:**\n' +
        '```\nInput: s = "06"\nOutput: 0\nExplanation: "06" cannot be mapped (leading zero).\n```\n\n' +
        '**Constraints:**\n' +
        '- `1 <= s.length <= 100`\n' +
        '- `s` contains only digits

---

## Requirements

1. Handle leading zeros carefully

---

## Hints


