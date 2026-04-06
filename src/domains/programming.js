/**
 * Programming Questions
 * Domains: Arrays, Strings, Searching, Sliding Window, Dynamic Programming
 *
 * Descriptions follow LeetCode style:
 *   - Clear problem statement
 *   - Example I/O with explanation
 *   - Constraints
 */

const programming = {
  'Array Problems': [
    {
      id: 'array1',
      shortName: 'Maximum and Minimum in an Array',
      question: 'Maximum and Minimum in an Array',
      description:
        'Given an integer array `nums`, return the maximum and minimum elements.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: nums = [5,2,8,1,9]\nOutput: 9 1\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: nums = [42]\nOutput: 42 42\n```\n\n' +
        '**Constraints:**\n' +
        '- `1 <= nums.length <= 10⁵`\n' +
        '- `-10⁹ <= nums[i] <= 10⁹`',
      difficulty: 'Easy',
      topics: ['Array'],
      requirements: [
        'Return both max and min in a single pass',
        'Time complexity: O(n)',
        'Space complexity: O(1)',
      ],
      hints: [
        'Initialize both max and min with the first element.',
        'Compare each element with current max and min as you iterate.',
        'Only one pass through the array is needed.',
      ],
    },
    {
      id: 'array2',
      shortName: 'Reverse an Array',
      question: 'Reverse an Array',
      description:
        'Given an array `nums`, reverse it **in-place**.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: nums = [1,2,3,4,5]\nOutput: [5,4,3,2,1]\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: nums = [1,2,3,4]\nOutput: [4,3,2,1]\n```\n\n' +
        '**Constraints:**\n' +
        '- `0 <= nums.length <= 10⁵`\n' +
        '- O(1) extra space',
      difficulty: 'Easy',
      topics: ['Array'],
      requirements: [
        'Reverse in-place with O(1) extra space',
        'Use two-pointer technique',
      ],
      hints: [
        'Use two pointers at each end and swap while they haven\'t crossed.',
        'Stop when left >= right.',
      ],
    },
    {
      id: 'array3',
      shortName: 'Kth Largest Element',
      question: 'Kth Largest Element in an Array',
      description:
        'Given an integer array `nums` and an integer `k`, return the **kth largest** element in the array.\n\n' +
        'Note that it is the `k`th largest element in sorted order, not the `k`th distinct element.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: nums = [3,2,1,5,6,4], k = 2\nOutput: 5\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: nums = [3,2,3,1,2,4,5,5,6], k = 4\nOutput: 4\n```\n\n' +
        '**Constraints:**\n' +
        '- `1 <= k <= nums.length <= 10⁵`\n' +
        '- `-10⁴ <= nums[i] <= 10⁴`',
      difficulty: 'Medium',
      topics: ['Array', 'QuickSelect'],
      requirements: [
        'Heap approach: O(n log k)',
        'QuickSelect approach: O(n) average',
      ],
      hints: [
        'A min-heap of size k keeps the kth largest at the root.',
        'QuickSelect partitions like quicksort but only recurses into one side.',
        'kth largest = index n-k in 0-indexed sorted order.',
      ],
    },
    {
      id: 'array4',
      shortName: 'First Duplicate Element',
      question: 'First Duplicate Element',
      description:
        'Given an array `nums`, return the first element that appears more than once. If no duplicate exists, return `-1`.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: nums = [2,5,1,2,3,5,1,2,4]\nOutput: 2\nExplanation: 2 is the first value encountered again.\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: nums = [1,2,3,4]\nOutput: -1\n```\n\n' +
        '**Constraints:**\n' +
        '- `1 <= nums.length <= 10⁵`\n' +
        '- `1 <= nums[i] <= 10⁵`',
      difficulty: 'Easy',
      topics: ['Array', 'Hash Table'],
      requirements: [
        'Time complexity: O(n)',
        'Space complexity: O(n)',
        'Use hash set to track seen elements',
      ],
      hints: [
        'Scan left to right and store seen values in a set.',
        'The first value already in the set is the answer.',
      ],
    },
    {
      id: 'array5',
      shortName: 'Move Zeroes',
      question: 'Move Zeroes',
      description:
        'Given an integer array `nums`, move all `0`s to the end of it while maintaining the relative order of the non-zero elements.\n\n' +
        'You must do this **in-place** without making a copy of the array.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: nums = [0,1,0,3,12]\nOutput: [1,3,12,0,0]\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: nums = [0]\nOutput: [0]\n```\n\n' +
        '**Constraints:**\n' +
        '- `1 <= nums.length <= 10⁴`\n' +
        '- `-2³¹ <= nums[i] <= 2³¹ - 1`',
      difficulty: 'Easy',
      topics: ['Array', 'Two Pointers'],
      requirements: [
        'Must be done in-place with O(1) extra space',
        'Maintain relative order of non-zero elements',
      ],
      hints: [
        'Use a write pointer for the next non-zero position.',
        'When you find a non-zero, swap it to the write position.',
      ],
    },
    {
      id: 'array6',
      shortName: 'Missing Number',
      question: 'Missing Number',
      description:
        'Given an array `nums` containing `n` distinct numbers in the range `[0, n]`, return the only number in the range that is missing from the array.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: nums = [3,0,1]\nOutput: 2\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: nums = [9,6,4,2,3,5,7,0,1]\nOutput: 8\n```\n\n' +
        '**Constraints:**\n' +
        '- `n == nums.length`\n' +
        '- `1 <= n <= 10⁴`\n' +
        '- All numbers are **unique**',
      difficulty: 'Easy',
      topics: ['Array', 'Math', 'Bit Manipulation'],
      requirements: [
        'Time complexity: O(n)',
        'Space complexity: O(1)',
      ],
      hints: [
        'Sum formula: missing = n*(n+1)/2 - sum(nums).',
        'XOR approach: XOR all indices and values; duplicates cancel.',
      ],
    },
    {
      id: 'array7',
      shortName: 'Majority Element',
      question: 'Majority Element',
      description:
        'Given an array `nums` of size `n`, return the majority element.\n\n' +
        'The majority element is the element that appears more than `⌊n / 2⌋` times. You may assume that the majority element always exists in the array.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: nums = [2,2,1,1,1,2,2]\nOutput: 2\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: nums = [3,3,4,3]\nOutput: 3\n```\n\n' +
        '**Constraints:**\n' +
        '- `n == nums.length`\n' +
        '- `1 <= n <= 5 * 10⁴`\n' +
        '- The majority element is **guaranteed** to exist',
      difficulty: 'Easy',
      topics: ['Array', 'Boyer-Moore'],
      requirements: [
        'Time complexity: O(n)',
        'Space complexity: O(1)',
        'Use Boyer-Moore Voting Algorithm',
      ],
      hints: [
        'Maintain a candidate and counter (increment for same, decrement for different).',
        'When counter hits zero, pick the current element as new candidate.',
      ],
    },
    {
      id: 'array8',
      shortName: 'Equilibrium Index',
      question: 'Equilibrium Index',
      description:
        'Given an array `nums`, find an index `i` such that the sum of elements to the left of `i` equals the sum of elements to the right of `i`.\n\n' +
        'Return `-1` if no such index exists. The element at index `i` is not included in either sum.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: nums = [1,3,5,2,2]\nOutput: 2\nExplanation: Left sum = 1+3 = 4, Right sum = 2+2 = 4\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: nums = [1,2,3]\nOutput: -1\n```\n\n' +
        '**Constraints:**\n' +
        '- `1 <= nums.length <= 10⁵`\n' +
        '- `-10⁵ <= nums[i] <= 10⁵`',
      difficulty: 'Medium',
      topics: ['Array', 'Prefix Sum'],
      requirements: [
        'Time complexity: O(n)',
        'Use prefix sum technique',
      ],
      hints: [
        'Compute total sum first, then walk the array maintaining leftSum.',
        'At index i, rightSum = totalSum - leftSum - nums[i].',
      ],
    },
    {
      id: 'array9',
      shortName: 'Rotate Array',
      question: 'Rotate Array',
      description:
        'Given an integer array `nums`, rotate the array to the right by `k` steps.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: nums = [1,2,3,4,5,6,7], k = 3\nOutput: [5,6,7,1,2,3,4]\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: nums = [1,2], k = 3\nOutput: [2,1]\n```\n\n' +
        '**Constraints:**\n' +
        '- `1 <= nums.length <= 10⁵`\n' +
        '- `-2³¹ <= nums[i] <= 2³¹ - 1`\n' +
        '- `0 <= k <= 10⁵`',
      difficulty: 'Medium',
      topics: ['Array', 'Reversal'],
      requirements: [
        'Must rotate in-place with O(1) extra space',
        'Use reversal algorithm: reverse all → reverse first k → reverse rest',
      ],
      hints: [
        'Reduce k using k = k % n to avoid extra rotations.',
        'Three reverses: whole array, first k, remaining n-k.',
      ],
    },
    {
      id: 'array10',
      shortName: 'Pair Sum',
      question: 'Two Sum Exists',
      description:
        'Given an array of integers `nums` and an integer `target`, return `true` if there exist two distinct elements whose sum equals `target`.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: nums = [2,7,11,15], target = 9\nOutput: true\nExplanation: 2 + 7 = 9\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: nums = [1,2,3], target = 7\nOutput: false\n```\n\n' +
        '**Constraints:**\n' +
        '- `2 <= nums.length <= 10⁴`\n' +
        '- `-10⁹ <= nums[i] <= 10⁹`\n' +
        '- Each input has at most one valid answer',
      difficulty: 'Easy',
      topics: ['Array', 'Hash Table', 'Two Pointers'],
      requirements: [
        'Time complexity: O(n)',
        'Cannot use the same element twice',
      ],
      hints: [
        'For each x, check whether target - x has been seen.',
        'Store seen numbers in a set as you iterate.',
      ],
    },
    {
      id: 'array11',
      shortName: 'Common Elements in Three Sorted Arrays',
      question: 'Common Elements in Three Sorted Arrays',
      description:
        'Given three sorted arrays `a`, `b`, and `c`, find all elements that are common in all three.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: a = [1,2,3], b = [2,3,4], c = [2,3,5]\nOutput: [2,3]\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: a = [1,2], b = [3,4], c = [5,6]\nOutput: []\n```\n\n' +
        '**Constraints:**\n' +
        '- Arrays are sorted in non-decreasing order\n' +
        '- `1 <= length <= 10⁵`',
      difficulty: 'Medium',
      topics: ['Array', 'Two Pointers'],
      requirements: [
        'Time complexity: O(n1 + n2 + n3)',
        'Use three pointers',
        'Skip duplicates in output',
      ],
      hints: [
        'If a[i] == b[j] == c[k], record it and advance all three pointers.',
        'Otherwise advance the pointer with the smallest value.',
      ],
    },
    {
      id: 'array12',
      shortName: 'All Pairs With Given Sum',
      question: 'All Pairs With Given Sum',
      description:
        'Given an array `nums` and an integer `target`, return all unique pairs `(a, b)` such that `a + b = target`.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: nums = [2,7,11,15], target = 9\nOutput: [(2,7)]\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: nums = [3,3,3], target = 6\nOutput: [(3,3)]\n```\n\n' +
        '**Constraints:**\n' +
        '- `1 <= nums.length <= 10⁵`\n' +
        '- Return unique value pairs',
      difficulty: 'Easy',
      topics: ['Array', 'Hash Table'],
      requirements: [
        'Time complexity: O(n)',
        'Do not reuse the same element index',
      ],
      hints: [
        'Use a hash map for counts while scanning.',
        'For each x, look for target - x in the map.',
      ],
    },
    {
      id: 'array13',
      shortName: 'Merge Two Sorted Arrays',
      question: 'Merge Two Sorted Arrays',
      description:
        'Given two sorted arrays `a` and `b`, merge them into a single sorted array.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: a = [1,2,3], b = []\nOutput: [1,2,3]\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: a = [1,1,2], b = [1,3]\nOutput: [1,1,1,2,3]\n```\n\n' +
        '**Constraints:**\n' +
        '- Arrays are sorted in non-decreasing order\n' +
        '- `0 <= length <= 10⁵`',
      difficulty: 'Easy',
      topics: ['Array', 'Two Pointers'],
      requirements: [
        'Time complexity: O(n + m)',
        'Use two-pointer merge technique',
      ],
      hints: [
        'Maintain i for a, j for b; append the smaller element.',
        'Append the remaining tail after one array is exhausted.',
      ],
    },
    {
      id: 'array14',
      shortName: 'All Subsets (Power Set)',
      question: 'Subsets',
      description:
        'Given an integer array `nums` of unique elements, return the total number of possible subsets (the power set).\n\n' +
        '**Example 1:**\n' +
        '```\nInput: nums = [1,2,3]\nOutput: 8\nExplanation: [],[1],[2],[3],[1,2],[1,3],[2,3],[1,2,3]\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: nums = [7]\nOutput: 2\n```\n\n' +
        '**Constraints:**\n' +
        '- `0 <= nums.length <= 10`\n' +
        '- All elements are **unique**',
      difficulty: 'Medium',
      topics: ['Array', 'Backtracking', 'Bit Manipulation'],
      requirements: [
        'No duplicate subsets',
        'Backtracking or bitmask approach',
      ],
      hints: [
        'Backtracking: for each element, choose to include or exclude.',
        'Bitmask: iterate 0..(2^n - 1), set bits determine which elements to include.',
      ],
    },
    {
      id: 'array15',
      shortName: 'Array Subset Check',
      question: 'Is Subset',
      description:
        'Given two arrays `a` and `b`, determine if `b` is a subset of `a`. Every element of `b` (including duplicates) must appear in `a` with at least that frequency.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: a = [1,2,2,3], b = [2,2]\nOutput: true\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: a = [1,2,3], b = [2,2]\nOutput: false\nExplanation: a only has one 2\n```\n\n' +
        '**Constraints:**\n' +
        '- `0 <= a.length, b.length <= 10⁵`',
      difficulty: 'Easy',
      topics: ['Array', 'Hash Table'],
      requirements: [
        'Time complexity: O(n + m)',
        'Use frequency map for array a',
      ],
      hints: [
        'Build a frequency map for a.',
        'For each element in b, decrement count; if it goes negative, return false.',
      ],
    },
    {
      id: 'array16',
      shortName: 'Longest Consecutive Sequence',
      question: 'Longest Consecutive Sequence',
      description:
        'Given an unsorted array of integers `nums`, return the length of the longest consecutive elements sequence.\n\n' +
        'You must write an algorithm that runs in `O(n)` time.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: nums = [100,4,200,1,3,2]\nOutput: 4\nExplanation: The longest consecutive sequence is [1,2,3,4].\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: nums = [0,3,7,2,5,8,4,6,0,1]\nOutput: 9\n```\n\n' +
        '**Constraints:**\n' +
        '- `0 <= nums.length <= 10⁵`\n' +
        '- `-10⁹ <= nums[i] <= 10⁹`',
      difficulty: 'Medium',
      topics: ['Array', 'Hash Set'],
      requirements: [
        'Time complexity: O(n)',
        'Handle duplicates',
      ],
      hints: [
        'Put all numbers in a set.',
        'Only start counting from x when x-1 is not in the set.',
        'Increment while x+1 exists.',
      ],
    },
    {
      id: 'array17',
      shortName: 'Contains Nearby Duplicate',
      question: 'Contains Duplicate II',
      description:
        'Given an integer array `nums` and an integer `k`, return `true` if there are two distinct indices `i` and `j` such that `nums[i] == nums[j]` and `|i - j| <= k`.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: nums = [1,2,3,1], k = 3\nOutput: true\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: nums = [1,2,3,1,2,3], k = 2\nOutput: false\n```\n\n' +
        '**Constraints:**\n' +
        '- `1 <= nums.length <= 10⁵`\n' +
        '- `0 <= k <= 10⁵`',
      difficulty: 'Easy',
      topics: ['Array', 'Hash Table', 'Sliding Window'],
      requirements: [
        'Time complexity: O(n)',
      ],
      hints: [
        'Keep a map from value → last index seen.',
        'When you see a value again, check if i - lastIndex <= k.',
      ],
    },
    {
      id: 'array18',
      shortName: 'Maximum Product Subarray',
      question: 'Maximum Product Subarray',
      description:
        'Given an integer array `nums`, find a subarray that has the largest product, and return the product.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: nums = [2,-5,-2,-4,3]\nOutput: 24\nExplanation: [-5,-2,-4,3] or [2,-5,-2] variants\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: nums = [-2]\nOutput: -2\n```\n\n' +
        '**Constraints:**\n' +
        '- `1 <= nums.length <= 2 * 10⁴`\n' +
        '- `-10 <= nums[i] <= 10`',
      difficulty: 'Medium',
      topics: ['Array', 'DP'],
      requirements: [
        'Time complexity: O(n)',
        'Space complexity: O(1)',
        'Track both max and min product (negatives can flip)',
      ],
      hints: [
        'At each index, keep curMax and curMin because a negative flips sign.',
        'When nums[i] is negative, swap curMax and curMin before updating.',
      ],
    },
    {
      id: 'array19',
      shortName: 'Indexes of Subarray Sum',
      question: 'Subarray Sum Equals Target',
      description:
        'Given an array of non-negative integers `arr` and a target sum, find the first contiguous subarray whose sum equals the target. Return 1-based `[left, right]` indices, or `[-1]` if not found.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: arr = [1,2,3,7,5], target = 12\nOutput: [2,4]\nExplanation: arr[2..4] = [2,3,7] sums to 12\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: arr = [5,3,4], target = 2\nOutput: [-1]\n```\n\n' +
        '**Constraints:**\n' +
        '- `1 <= arr.length <= 10⁵`\n' +
        '- `arr[i] >= 0`',
      difficulty: 'Medium',
      topics: ['Array', 'Sliding Window'],
      requirements: [
        'Time complexity: O(n)',
        'Use sliding window for non-negative arrays',
      ],
      hints: [
        'Expand right to increase sum, shrink left while sum > target.',
        'Return as soon as sum == target.',
      ],
    },
    {
      id: 'array20',
      shortName: 'Count the Triplets',
      question: 'Count Triplets with Zero Sum',
      description:
        'Given an array `arr`, count the number of triplets `(i, j, k)` where `i < j < k` and `arr[i] + arr[j] + arr[k] = 0`.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: arr = [-1,0,1]\nOutput: 1\nExplanation: (-1) + 0 + 1 = 0\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: arr = [1,5,3,2]\nOutput: 0\n```\n\n' +
        '**Constraints:**\n' +
        '- `3 <= arr.length <= 10³`\n' +
        '- `-10⁶ <= arr[i] <= 10⁶`',
      difficulty: 'Easy',
      topics: ['Array', 'Two Pointers', 'Sorting'],
      requirements: [
        'Time complexity: O(n²)',
        'Sort and use two-pointer technique',
      ],
      hints: [
        'Sort ascending, then fix one element and use two pointers for the remaining pair.',
      ],
    },
    {
      id: 'array21',
      shortName: '3Sum',
      question: '3Sum',
      description:
        'Given an integer array `nums`, return all the triplets `[nums[i], nums[j], nums[k]]` such that `i != j`, `i != k`, `j != k`, and `nums[i] + nums[j] + nums[k] == 0`.\n\n' +
        'Notice that the solution set must not contain duplicate triplets.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: nums = [-1,0,1,2,-1,-4]\nOutput: [[-1,-1,2],[-1,0,1]]\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: nums = [0,0,0]\nOutput: [[0,0,0]]\n```\n\n' +
        '**Constraints:**\n' +
        '- `3 <= nums.length <= 3000`\n' +
        '- `-10⁵ <= nums[i] <= 10⁵`',
      difficulty: 'Medium',
      topics: ['Array', 'Two Pointers', 'Sorting'],
      requirements: [
        'Time complexity: O(n²)',
        'Must avoid duplicate triplets',
      ],
      hints: [
        'Sort the array first.',
        'Fix one element and use two pointers for the remaining pair.',
        'Skip duplicates by advancing pointers past equal values.',
      ],
    },
    {
      id: 'array22',
      shortName: 'Container With Most Water',
      question: 'Container With Most Water',
      description:
        'You are given an integer array `height` of length `n`. There are `n` vertical lines drawn such that the two endpoints of the `i`th line are `(i, 0)` and `(i, height[i])`.\n\n' +
        'Find two lines that together with the x-axis form a container that holds the most water.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: height = [1,8,6,2,5,4,8,3,7]\nOutput: 49\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: height = [1,1]\nOutput: 1\n```\n\n' +
        '**Constraints:**\n' +
        '- `n == height.length`\n' +
        '- `2 <= n <= 10⁵`\n' +
        '- `0 <= height[i] <= 10⁴`',
      difficulty: 'Medium',
      topics: ['Array', 'Two Pointers'],
      requirements: [
        'Time complexity: O(n)',
        'Use two-pointer technique',
      ],
      hints: [
        'Start with pointers at both ends for maximum width.',
        'Move the pointer with the smaller height inward.',
      ],
    },
    {
      id: 'array23',
      shortName: 'Trapping Rain Water',
      question: 'Trapping Rain Water',
      description:
        'Given `n` non-negative integers representing an elevation map where the width of each bar is `1`, compute how much water it can trap after raining.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: height = [0,1,0,2,1,0,1,3,2,1,2,1]\nOutput: 6\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: height = [4,2,0,3,2,5]\nOutput: 9\n```\n\n' +
        '**Constraints:**\n' +
        '- `n == height.length`\n' +
        '- `1 <= n <= 2 * 10⁴`\n' +
        '- `0 <= height[i] <= 10⁵`',
      difficulty: 'Hard',
      topics: ['Array', 'Two Pointers', 'Stack'],
      requirements: [
        'Time complexity: O(n)',
        'Space complexity: O(1) with two-pointer approach',
      ],
      hints: [
        'Use two pointers tracking leftMax and rightMax.',
        'Water at index = min(leftMax, rightMax) - height[i].',
      ],
    },
    {
      id: 'array24',
      shortName: 'Find Minimum in Rotated Sorted Array',
      question: 'Find Minimum in Rotated Sorted Array',
      description:
        'Given the sorted rotated array `nums` of **unique** elements, return the minimum element of this array.\n\n' +
        'You must write an algorithm that runs in `O(log n)` time.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: nums = [3,4,5,1,2]\nOutput: 1\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: nums = [11,13,15,17]\nOutput: 11\nExplanation: Array was not rotated.\n```\n\n' +
        '**Constraints:**\n' +
        '- `n == nums.length`\n' +
        '- `1 <= n <= 5000`\n' +
        '- All values are **unique**',
      difficulty: 'Medium',
      topics: ['Array', 'Binary Search'],
      requirements: [
        'Time complexity: O(log n)',
        'Binary search approach',
      ],
      hints: [
        'Compare mid with the right boundary to decide which side has the minimum.',
      ],
    },
  ],

  'String Problems': [
    {
      id: 'string1',
      shortName: 'Reverse String',
      question: 'Reverse String',
      description:
        'Write a function that reverses a string. The input string is given as an array of characters `s`.\n\n' +
        'You must do this by modifying the input array **in-place** with `O(1)` extra memory.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: s = "hello"\nOutput: "olleh"\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: s = "a"\nOutput: "a"\n```\n\n' +
        '**Constraints:**\n' +
        '- `1 <= s.length <= 10⁵`',
      difficulty: 'Easy',
      topics: ['String', 'Two Pointers'],
      requirements: [
        'In-place with O(1) extra space',
        'Two-pointer technique',
      ],
      hints: [
        'Use two pointers at each end and swap while i < j.',
      ],
    },
    {
      id: 'string2',
      shortName: 'Valid Palindrome',
      question: 'Valid Palindrome',
      description:
        'A phrase is a **palindrome** if, after converting all uppercase letters into lowercase and removing all non-alphanumeric characters, it reads the same forward and backward.\n\n' +
        'Given a string `s`, return `true` if it is a palindrome, or `false` otherwise.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: s = "racecar"\nOutput: true\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: s = "hello"\nOutput: false\n```\n\n' +
        '**Constraints:**\n' +
        '- `1 <= s.length <= 2 * 10⁵`\n' +
        '- `s` consists only of printable ASCII characters',
      difficulty: 'Easy',
      topics: ['String', 'Two Pointers'],
      requirements: [
        'Ignore non-alphanumeric characters',
        'Case-insensitive comparison',
      ],
      hints: [
        'Use two pointers from both ends, skip non-alphanumeric characters.',
        'Compare lowercase versions.',
      ],
    },
    {
      id: 'string3',
      shortName: 'Anagram Check',
      question: 'Valid Anagram',
      description:
        'Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.\n\n' +
        'An **Anagram** is a word formed by rearranging the letters of a different word, using all the original letters exactly once.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: s = "anagram", t = "nagaram"\nOutput: true\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: s = "rat", t = "car"\nOutput: false\n```\n\n' +
        '**Constraints:**\n' +
        '- `1 <= s.length, t.length <= 5 * 10⁴`\n' +
        '- `s` and `t` consist of lowercase English letters',
      difficulty: 'Easy',
      topics: ['String', 'Hash Table', 'Sorting'],
      requirements: [
        'Sorting: O(n log n)',
        'Hash map: O(n)',
      ],
      hints: [
        'If lengths differ, return false immediately.',
        'Count character frequencies with a hash map or fixed array.',
      ],
    },
    {
      id: 'string4',
      shortName: 'First Repeating Character',
      question: 'First Repeating Character',
      description:
        'Given a string `s`, return the first character that appears more than once. If no such character exists, return `"-"`.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: s = "abcdeab"\nOutput: "a"\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: s = "abcdef"\nOutput: "-"\n```\n\n' +
        '**Constraints:**\n' +
        '- `1 <= s.length <= 10⁵`\n' +
        '- `s` consists of lowercase English letters',
      difficulty: 'Easy',
      topics: ['String', 'Hash Table'],
      requirements: [
        'Time complexity: O(n)',
        'Use hash set to track seen characters',
      ],
      hints: [
        'Walk left to right, storing seen characters in a set.',
        'The first character already in the set is the answer.',
      ],
    },
    {
      id: 'string5',
      shortName: 'Subsequence Check',
      question: 'Is Subsequence',
      description:
        'Given two strings `s` and `t`, return `true` if `s` is a **subsequence** of `t`, or `false` otherwise.\n\n' +
        'A subsequence is a string that can be derived from another by deleting some or no characters without changing the order of the remaining characters.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: s = "ace", t = "abcde"\nOutput: true\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: s = "aec", t = "abcde"\nOutput: false\n```\n\n' +
        '**Constraints:**\n' +
        '- `0 <= s.length <= 100`\n' +
        '- `0 <= t.length <= 10⁴`',
      difficulty: 'Easy',
      topics: ['String', 'Two Pointers'],
      requirements: [
        'Use two pointers: one for s, one for t',
      ],
      hints: [
        'Advance pointer on s only when characters match.',
        'If you consume all of s, it is a subsequence.',
      ],
    },
    {
      id: 'string6',
      shortName: 'Remove Duplicate Characters',
      question: 'Remove Duplicate Letters (Preserve Order)',
      description:
        'Given a string `s`, remove duplicate characters while preserving the original order of first occurrences.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: s = "abracadabra"\nOutput: "abrcd"\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: s = "programming"\nOutput: "progamin"\n```\n\n' +
        '**Constraints:**\n' +
        '- `1 <= s.length <= 10⁵`',
      difficulty: 'Medium',
      topics: ['String', 'Hash Table'],
      requirements: [
        'Keep first occurrence of each character',
        'Maintain original order',
      ],
      hints: [
        'Use a set of seen characters and build output left to right.',
        'Only append a character the first time you see it.',
      ],
    },
    {
      id: 'string7',
      shortName: 'Longest Substring Without Repeating Characters',
      question: 'Longest Substring Without Repeating Characters',
      description:
        'Given a string `s`, find the length of the **longest substring** without repeating characters.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: s = "abcabcbb"\nOutput: 3\nExplanation: The answer is "abc", with length 3.\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: s = "bbbbb"\nOutput: 1\n```\n\n' +
        '**Constraints:**\n' +
        '- `0 <= s.length <= 5 * 10⁴`\n' +
        '- `s` consists of English letters, digits, symbols and spaces',
      difficulty: 'Medium',
      topics: ['String', 'Sliding Window', 'Hash Table'],
      requirements: [
        'Time complexity: O(n)',
        'Sliding window with hash set',
      ],
      hints: [
        'Use a sliding window with left and right pointers.',
        'Track last seen index of each character to jump the left pointer forward.',
      ],
    },
    {
      id: 'string8',
      shortName: 'Longest Common Prefix',
      question: 'Longest Common Prefix',
      description:
        'Write a function to find the longest common prefix string amongst an array of strings.\n\n' +
        'If there is no common prefix, return an empty string `""`.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: strs = ["flower","flow","flight"]\nOutput: "fl"\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: strs = ["dog","racecar","car"]\nOutput: ""\n```\n\n' +
        '**Constraints:**\n' +
        '- `1 <= strs.length <= 200`\n' +
        '- `0 <= strs[i].length <= 200`',
      difficulty: 'Easy',
      topics: ['String', 'Array'],
      requirements: [
        'Compare characters vertically or use horizontal scanning',
      ],
      hints: [
        'Start with the first string as candidate prefix.',
        'Shrink it until every string starts with it.',
      ],
    },
    {
      id: 'string9',
      shortName: 'String Compression',
      question: 'String Compression',
      description:
        'Given a string `s`, compress it using the counts of repeated characters. For example, `"aabbbcccc"` becomes `"a2b3c4"`.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: s = "aabbbcccc"\nOutput: "a2b3c4"\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: s = "abc"\nOutput: "abc"\nExplanation: Compressed is not shorter, return original.\n```\n\n' +
        '**Constraints:**\n' +
        '- `1 <= s.length <= 10⁴`\n' +
        '- `s` consists only of lowercase English letters',
      difficulty: 'Medium',
      topics: ['String', 'Two Pointers'],
      requirements: [
        'Return original if compressed is not shorter',
      ],
      hints: [
        'Count consecutive equal characters.',
        'Append character + count to a builder.',
      ],
    },
    {
      id: 'string10',
      shortName: 'Longest Palindromic Substring',
      question: 'Longest Palindromic Substring',
      description:
        'Given a string `s`, return the longest palindromic substring in `s`.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: s = "babad"\nOutput: "bab"\nExplanation: "aba" is also a valid answer.\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: s = "cbbd"\nOutput: "bb"\n```\n\n' +
        '**Constraints:**\n' +
        '- `1 <= s.length <= 1000`\n' +
        '- `s` consist of only digits and English letters',
      difficulty: 'Medium',
      topics: ['String', 'DP', 'Expand Around Center'],
      requirements: [
        'Expand around center: O(n²)',
        'Handle odd and even length palindromes',
      ],
      hints: [
        'Every palindrome expands from a center (one char or between two chars).',
        'Try expanding around each center and track the best window.',
      ],
    },
    {
      id: 'string11',
      shortName: 'Count Vowels and Consonants',
      question: 'Count Vowels and Consonants',
      description:
        'Given a string `s`, return the count of vowels and consonants as a pair `(vowels, consonants)`.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: s = "Hello"\nOutput: 2 3\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: s = "AEIOU"\nOutput: 5 0\n```\n\n' +
        '**Constraints:**\n' +
        '- Vowels: a, e, i, o, u (case-insensitive)\n' +
        '- Ignore non-alphabetic characters',
      difficulty: 'Easy',
      topics: ['String'],
      requirements: [
        'Case-insensitive comparison',
        'Return both counts',
      ],
      hints: [
        'Convert to lowercase, check membership in {a,e,i,o,u}.',
      ],
    },
    {
      id: 'string12',
      shortName: 'Digits Only String',
      question: 'Is Digits Only',
      description:
        'Given a string `s`, return `true` if every character is a digit (`0`-`9`), otherwise return `false`.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: s = "12345"\nOutput: true\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: s = "12a45"\nOutput: false\n```\n\n' +
        '**Constraints:**\n' +
        '- `0 <= s.length <= 10⁵`\n' +
        '- Empty string returns `true`',
      difficulty: 'Easy',
      topics: ['String'],
      requirements: ['Time complexity: O(n)'],
      hints: [
        'Scan each character and verify isdigit. Return false immediately on a non-digit.',
      ],
    },
    {
      id: 'string13',
      shortName: 'Count Character Occurrence',
      question: 'Count Character Occurrences',
      description:
        'Given a string `s` and a character `ch`, return the number of times `ch` appears in `s`.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: s = "hello", ch = "l"\nOutput: 2\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: s = "banana", ch = "a"\nOutput: 3\n```\n\n' +
        '**Constraints:**\n' +
        '- `0 <= s.length <= 10⁵`\n' +
        '- Case-sensitive comparison',
      difficulty: 'Easy',
      topics: ['String', 'Hash Table'],
      requirements: ['Time complexity: O(n)'],
      hints: ['Simple loop counter or use built-in count function.'],
    },
    {
      id: 'string14',
      shortName: 'Substring Search',
      question: 'Find the Index of the First Occurrence in a String',
      description:
        'Given two strings `text` and `pattern`, return the index of the first occurrence of `pattern` in `text`, or `-1` if `pattern` is not found.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: text = "helloworld", pattern = "world"\nOutput: 5\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: text = "abcdef", pattern = "xyz"\nOutput: -1\n```\n\n' +
        '**Constraints:**\n' +
        '- `1 <= text.length, pattern.length <= 10⁴`\n' +
        '- Naive: O(n*m), KMP: O(n+m)',
      difficulty: 'Medium',
      topics: ['String', 'KMP'],
      requirements: ['Return 0-based index or -1'],
      hints: [
        'KMP builds LPS array for the pattern to avoid re-checking characters on mismatch.',
      ],
    },
    {
      id: 'string15',
      shortName: 'Find All Occurrences of Substring',
      question: 'Find All Occurrences of Pattern',
      description:
        'Given strings `text` and `pattern`, return all starting indices where `pattern` occurs in `text` (including overlapping matches).\n\n' +
        '**Example 1:**\n' +
        '```\nInput: text = "abababab", pattern = "ab"\nOutput: [0,2,4,6]\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: text = "aaaa", pattern = "aa"\nOutput: [0,1,2]\n```\n\n' +
        '**Constraints:**\n' +
        '- Handle overlapping matches\n' +
        '- `1 <= text.length <= 10⁵`',
      difficulty: 'Medium',
      topics: ['String', 'KMP'],
      requirements: ['Return array of 0-based indices'],
      hints: [
        'Use KMP to find all matches in O(n+m).',
      ],
    },
    {
      id: 'string16',
      shortName: 'To Lowercase / Uppercase',
      question: 'To Lower Case / Upper Case',
      description:
        'Given a string `s`, convert it to lowercase and uppercase, and print both results.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: s = "Hello"\nOutput:\nhello\nHELLO\n```\n\n' +
        '**Constraints:**\n' +
        '- `1 <= s.length <= 100`\n' +
        '- Non-alphabetic characters stay unchanged',
      difficulty: 'Easy',
      topics: ['String'],
      requirements: ['Implement both conversions'],
      hints: ['For ASCII: a-z and A-Z are offset by 32.'],
    },
    {
      id: 'string17',
      shortName: 'Count Words in a String',
      question: 'Number of Words in a String',
      description:
        'Given a string `s`, return the number of words separated by spaces. Multiple spaces may appear between words.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: s = "Hello World"\nOutput: 2\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: s = "one two three four five"\nOutput: 5\n```\n\n' +
        '**Constraints:**\n' +
        '- `1 <= s.length <= 10⁴`\n' +
        '- Ignore leading/trailing spaces',
      difficulty: 'Easy',
      topics: ['String'],
      requirements: ['Handle multiple consecutive spaces'],
      hints: ['Split by whitespace and filter empty tokens, or count space→non-space transitions.'],
    },
    {
      id: 'string18',
      shortName: 'Permutation in String',
      question: 'Permutation in String',
      description:
        'Given two strings `s1` and `s2`, return `true` if `s2` contains a permutation of `s1`, or `false` otherwise.\n\n' +
        'In other words, return `true` if one of `s1`\'s permutations is a substring of `s2`.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: s1 = "ab", s2 = "eidbaooo"\nOutput: true\nExplanation: s2 contains "ba" which is a permutation of "ab".\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: s1 = "ab", s2 = "eidboaoo"\nOutput: false\n```\n\n' +
        '**Constraints:**\n' +
        '- `1 <= s1.length, s2.length <= 10⁴`',
      difficulty: 'Medium',
      topics: ['String', 'Sliding Window', 'Hash Table'],
      requirements: [
        'Time complexity: O(n)',
        'Sliding window with frequency comparison',
      ],
      hints: [
        'Maintain a frequency array for s1.',
        'Use a window of size |s1| over s2 and compare counts efficiently.',
      ],
    },
    {
      id: 'string19',
      shortName: 'Run-Length Encoding',
      question: 'Run-Length Encoding',
      description:
        'Given a string `s`, perform run-length encoding: compress consecutive runs into `count + character` format.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: s = "aaaabbbcc"\nOutput: "4a3b2c"\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: s = "abcd"\nOutput: "1a1b1c1d"\n```\n\n' +
        '**Constraints:**\n' +
        '- `0 <= s.length <= 10⁵`',
      difficulty: 'Medium',
      topics: ['String', 'Two Pointers'],
      requirements: ['Append count + character per run'],
      hints: [
        'Use two pointers to mark the start of each run.',
        'Append count and character when the run ends.',
      ],
    },
    {
      id: 'string20',
      shortName: 'Shortest Palindrome by Appending',
      question: 'Shortest Palindrome by Appending',
      description:
        'Given a string `s`, find the shortest palindrome you can form by appending characters to the **end** of `s`.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: s = "abc"\nOutput: "abcba"\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: s = "race"\nOutput: "racecar"\n```\n\n' +
        '**Constraints:**\n' +
        '- `0 <= s.length <= 5 * 10⁴`',
      difficulty: 'Hard',
      topics: ['String', 'KMP'],
      requirements: ['Only append to the end'],
      hints: [
        'Find the longest palindromic suffix; append the reverse of the remaining prefix.',
        'KMP/LPS can compute this efficiently.',
      ],
    },
    {
      id: 'string21',
      shortName: 'Count Vowels',
      question: 'Count Vowels',
      description:
        'Given a string `s`, return the number of vowels (`a, e, i, o, u`, case-insensitive).\n\n' +
        '**Example 1:**\n' +
        '```\nInput: s = "hello"\nOutput: 2\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: s = "aeiou"\nOutput: 5\n```\n\n' +
        '**Constraints:**\n' +
        '- `0 <= s.length <= 10⁵`',
      difficulty: 'Easy',
      topics: ['String'],
      requirements: ['Case-insensitive', 'Ignore non-letter characters'],
      hints: ['Lowercase the character and check membership in {a,e,i,o,u}.'],
    },
    {
      id: 'string22',
      shortName: 'Longest Common Subsequence (String)',
      question: 'Longest Common Subsequence',
      description:
        'Given two strings `a` and `b`, return the length of their **longest common subsequence**. If there is no common subsequence, return `0`.\n\n' +
        'A subsequence is a sequence that can be derived by deleting some or no elements without changing the order.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: a = "abcde", b = "ace"\nOutput: 3\nExplanation: LCS is "ace".\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: a = "abc", b = "def"\nOutput: 0\n```\n\n' +
        '**Constraints:**\n' +
        '- `1 <= a.length, b.length <= 1000`',
      difficulty: 'Hard',
      topics: ['DP', 'String'],
      requirements: [
        'Time complexity: O(m * n)',
        'Use 2D DP table',
      ],
      hints: [
        'If characters match: dp[i][j] = 1 + dp[i-1][j-1].',
        'Otherwise: dp[i][j] = max(dp[i-1][j], dp[i][j-1]).',
      ],
    },
  ],

  'Searching Problems': [
    {
      id: 'search1',
      shortName: 'Binary Search',
      question: 'Binary Search',
      description:
        'Given an array of integers `nums` which is sorted in ascending order, and an integer `target`, write a function to search `target` in `nums`. If `target` exists, return its index. Otherwise, return `-1`.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: nums = [1,3,5,7,9,11], target = 7\nOutput: 3\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: nums = [2,4,6,8,10], target = 5\nOutput: -1\n```\n\n' +
        '**Constraints:**\n' +
        '- `1 <= nums.length <= 10⁴`\n' +
        '- All elements are **unique**\n' +
        '- `nums` is sorted in ascending order',
      difficulty: 'Easy',
      topics: ['Binary Search', 'Array'],
      requirements: ['Time complexity: O(log n)'],
      hints: [
        'Maintain lo and hi for the search range.',
        'Compute mid and compare nums[mid] with target.',
        'Discard half of the range each step.',
      ],
    },
    {
      id: 'search2',
      shortName: 'Search in Rotated Sorted Array',
      question: 'Search in Rotated Sorted Array',
      description:
        'Given the array `nums` after a possible rotation and an integer `target`, return the index of `target` if it is in `nums`, or `-1` if it is not.\n\n' +
        'You must write an algorithm with `O(log n)` runtime complexity.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: nums = [4,5,6,7,0,1,2], target = 0\nOutput: 4\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: nums = [4,5,6,7,0,1,2], target = 3\nOutput: -1\n```\n\n' +
        '**Constraints:**\n' +
        '- `1 <= nums.length <= 5000`\n' +
        '- All values are **unique**',
      difficulty: 'Medium',
      topics: ['Binary Search', 'Array'],
      requirements: ['Time complexity: O(log n)'],
      hints: [
        'At each step, one half of the array is sorted.',
        'Check if target lies in the sorted half; if not, search the other half.',
      ],
    },
    {
      id: 'search3',
      shortName: 'First and Last Position of Element',
      question: 'Find First and Last Position of Element in Sorted Array',
      description:
        'Given an array of integers `nums` sorted in non-decreasing order, find the starting and ending position of a given `target` value.\n\n' +
        'If `target` is not found, return `[-1, -1]`.\n\n' +
        'You must write an algorithm with `O(log n)` runtime complexity.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: nums = [5,7,7,8,8,10], target = 8\nOutput: [3,4]\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: nums = [5,7,7,8,8,10], target = 6\nOutput: [-1,-1]\n```\n\n' +
        '**Constraints:**\n' +
        '- `0 <= nums.length <= 10⁵`',
      difficulty: 'Medium',
      topics: ['Binary Search', 'Array'],
      requirements: [
        'Time complexity: O(log n)',
        'Use two binary searches for left and right boundary',
      ],
      hints: [
        'Binary search for leftmost occurrence, then for rightmost.',
      ],
    },
    {
      id: 'search4',
      shortName: 'Minimum in Rotated Sorted Array',
      question: 'Find Minimum in Rotated Sorted Array',
      description:
        'Given a sorted rotated array of unique elements, return the minimum element.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: nums = [3,4,5,1,2]\nOutput: 1\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: nums = [2,1,2]\nOutput: 1\n```\n\n' +
        '**Constraints:**\n' +
        '- `n == nums.length`\n' +
        '- `1 <= n <= 5000`',
      difficulty: 'Medium',
      topics: ['Binary Search', 'Array'],
      requirements: ['Time complexity: O(log n)'],
      hints: [
        'Compare nums[mid] with nums[hi] to decide which side contains the minimum.',
      ],
    },
    {
      id: 'search5',
      shortName: 'Linear Search',
      question: 'Linear Search',
      description:
        'Given an unsorted array `nums` and a target value, return the index of the target using linear search, or `-1` if not found.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: nums = [4,5,6,7,0,1,2], target = 0\nOutput: 4\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: nums = [4,5,6,7,0,1,2], target = 3\nOutput: -1\n```\n\n' +
        '**Constraints:**\n' +
        '- `0 <= nums.length <= 10⁵`\n' +
        '- No sorting required',
      difficulty: 'Easy',
      topics: ['Array', 'Searching'],
      requirements: ['Time complexity: O(n)'],
      hints: ['Scan from left to right and compare each element.'],
    },
    {
      id: 'search6',
      shortName: 'Search Insert Position',
      question: 'Search Insert Position',
      description:
        'Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be inserted in order.\n\n' +
        'You must write an algorithm with `O(log n)` runtime complexity.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: nums = [1,3,5,7,9,11], target = 5\nOutput: 2\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: nums = [1,3,5,7,9,11], target = 8\nOutput: -1\n```\n\n' +
        '**Constraints:**\n' +
        '- `1 <= nums.length <= 10⁴`\n' +
        '- All values are **distinct** and sorted in ascending order',
      difficulty: 'Easy',
      topics: ['Binary Search', 'Array'],
      requirements: ['Time complexity: O(log n)'],
      hints: ['Classic binary search; when loop ends, lo is the insertion position.'],
    },
    {
      id: 'search7',
      shortName: 'Find Peak Element',
      question: 'Find Peak Element',
      description:
        'A peak element is an element that is strictly greater than its neighbors.\n\n' +
        'Given a 0-indexed integer array `nums`, find a peak element and return its index. If the array contains multiple peaks, return the index to **any** of the peaks.\n\n' +
        'You may imagine that `nums[-1] = nums[n] = -∞`.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: nums = [1,2,3,1]\nOutput: 2\nExplanation: 3 is a peak element.\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: nums = [1,2,1,3,5,6,4]\nOutput: 5\nExplanation: Either index 1 or 5 are valid.\n```\n\n' +
        '**Constraints:**\n' +
        '- `1 <= nums.length <= 1000`\n' +
        '- `nums[i] != nums[i + 1]` for all valid `i`',
      difficulty: 'Medium',
      topics: ['Binary Search', 'Array'],
      requirements: ['Time complexity: O(log n)'],
      hints: [
        'Compare mid with mid+1 to decide which side has a peak.',
        'If nums[mid] < nums[mid+1], peak lies to the right.',
      ],
    },
    {
      id: 'search8',
      shortName: 'Median of Two Sorted Arrays',
      question: 'Median of Two Sorted Arrays',
      description:
        'Given two sorted arrays `a` and `b` of size `m` and `n` respectively, return **the median** of the two sorted arrays.\n\n' +
        'The overall run time complexity should be `O(log(min(m, n)))`.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: a = [1,3], b = [2]\nOutput: 2.0\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: a = [1,2], b = [3,4]\nOutput: 2.5\n```\n\n' +
        '**Constraints:**\n' +
        '- `0 <= m, n <= 1000`\n' +
        '- `m + n >= 1`',
      difficulty: 'Hard',
      topics: ['Binary Search', 'Array'],
      requirements: ['Time complexity: O(log(min(m, n)))'],
      hints: [
        'Binary search the partition in the smaller array.',
        'Ensure left partition max <= right partition min for both arrays.',
      ],
    },
    {
      id: 'search9',
      shortName: 'Search in Infinite Sorted Array',
      question: 'Search in Infinite Sorted Array',
      description:
        'Given an interface `InfiniteArray` where you can only call `get(i)` to access index `i`, and the array is sorted in ascending order, find the index of a given `target`.\n\n' +
        'Return `-1` if the target does not exist.\n\n' +
        '**Example:**\n' +
        '```\nApproach: Exponential expansion to find bounds, then binary search.\n```\n\n' +
        '**Constraints:**\n' +
        '- Array is conceptually infinite and sorted\n' +
        '- Time complexity: O(log position)',
      difficulty: 'Medium',
      topics: ['Binary Search', 'Array'],
      requirements: [
        'Find range by doubling (1,2,4,8...) then binary search',
      ],
      hints: [
        'Expand window by doubling hi until arr[hi] >= target.',
        'Then run standard binary search within [lo, hi].',
      ],
    },
    {
      id: 'search10',
      shortName: 'Count Occurrences in Sorted Array',
      question: 'Count Occurrences in Sorted Array',
      description:
        'Given a sorted array `nums` and a value `target`, return the number of times `target` appears in the array.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: nums = [1,4,9,16,25], target = 9\nOutput: 2\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: nums = [1,4,9,16], target = 15\nOutput: -1\n```\n\n' +
        '**Constraints:**\n' +
        '- `nums` is sorted in non-decreasing order\n' +
        '- Time complexity: O(log n)',
      difficulty: 'Easy',
      topics: ['Binary Search', 'Array'],
      requirements: [
        'Use lower bound and upper bound binary searches',
      ],
      hints: [
        'Count = upperBound(target) - lowerBound(target).',
      ],
    },
  ],

  'Sliding Window': [
    {
      id: 'sw1',
      shortName: 'Minimum Window Substring',
      question: 'Minimum Window Substring',
      description:
        'Given two strings `s` and `t` of lengths `m` and `n` respectively, return the **minimum window substring** of `s` such that every character in `t` (including duplicates) is included in the window.\n\n' +
        'If there is no such substring, return the empty string `""`.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: s = "ADOBECODEBANC", t = "ABC"\nOutput: "BANC"\nExplanation: The minimum window substring is "BANC".\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: s = "a", t = "aa"\nOutput: ""\nExplanation: Both \'a\'s from t must be included.\n```\n\n' +
        '**Constraints:**\n' +
        '- `1 <= m, n <= 10⁵`\n' +
        '- `s` and `t` consist of uppercase and lowercase English letters',
      difficulty: 'Hard',
      topics: ['String', 'Sliding Window', 'Hash Table'],
      requirements: [
        'Time complexity: O(m + n)',
        'Sliding window with frequency map',
      ],
      hints: [
        'Expand right pointer to satisfy all required characters.',
        'Shrink left pointer while window is still valid to minimize length.',
      ],
    },
    {
      id: 'sw2',
      shortName: 'Longest Repeating Character Replacement',
      question: 'Longest Repeating Character Replacement',
      description:
        'You are given a string `s` and an integer `k`. You can choose any character of the string and change it to any other uppercase English character. You can perform this operation at most `k` times.\n\n' +
        'Return the length of the longest substring containing the same letter you can get after performing the above operations.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: s = "ABAB", k = 2\nOutput: 4\nExplanation: Replace the two \'A\'s with \'B\'s or vice versa.\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: s = "AABABBA", k = 1\nOutput: 4\n```\n\n' +
        '**Constraints:**\n' +
        '- `1 <= s.length <= 10⁵`\n' +
        '- `s` consists of only uppercase English letters\n' +
        '- `0 <= k <= s.length`',
      difficulty: 'Medium',
      topics: ['String', 'Sliding Window'],
      requirements: [
        'Time complexity: O(n)',
        'Sliding window with max frequency tracking',
      ],
      hints: [
        'Window size - maxFrequency <= k ensures validity.',
        'Expand right and shrink left when invalid.',
      ],
    },
  ],

  'DP / Classic Interview Problems': [
    {
      id: 'dp1',
      shortName: 'Maximum Subarray',
      question: 'Maximum Subarray',
      description:
        'Given an integer array `nums`, find the subarray with the largest sum, and return its sum.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: nums = [-2,1,-3,4,-1,2,1,-5,4]\nOutput: 6\nExplanation: The subarray [4,-1,2,1] has the largest sum 6.\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: nums = [1]\nOutput: 1\n```\n\n' +
        '**Constraints:**\n' +
        '- `1 <= nums.length <= 10⁵`\n' +
        '- `-10⁴ <= nums[i] <= 10⁴`',
      difficulty: 'Medium',
      topics: ['DP', "Kadane's Algorithm"],
      requirements: [
        "Use Kadane's Algorithm: O(n) time, O(1) space",
        'Handle all-negative arrays',
      ],
      hints: [
        'Either extend the current subarray or start a new one at each element.',
        'Track bestSoFar and currentBest as you iterate.',
      ],
    },
    {
      id: 'dp2',
      shortName: 'Product of Array Except Self',
      question: 'Product of Array Except Self',
      description:
        'Given an integer array `nums`, return an array `answer` such that `answer[i]` is equal to the product of all the elements of `nums` except `nums[i]`.\n\n' +
        'You must write an algorithm that runs in `O(n)` time and **without using the division operation**.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: nums = [1,2,3,4]\nOutput: [24,12,8,6]\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: nums = [-1,1,0,-3,3]\nOutput: [0,0,9,0,0]\n```\n\n' +
        '**Constraints:**\n' +
        '- `2 <= nums.length <= 10⁵`\n' +
        '- No division allowed',
      difficulty: 'Medium',
      topics: ['Array', 'Prefix Product'],
      requirements: [
        'Time: O(n), Space: O(1) excluding output',
        'Use prefix and suffix products',
      ],
      hints: [
        'Compute prefix products left-to-right, then suffix products right-to-left.',
        'Multiply them together for each index.',
      ],
    },
    {
      id: 'dp3',
      shortName: 'Longest Increasing Subsequence',
      question: 'Longest Increasing Subsequence',
      description:
        'Given an integer array `nums`, return the length of the longest **strictly increasing** subsequence.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: nums = [10,9,2,5,3,7,101,18]\nOutput: 4\nExplanation: The LIS is [2,3,7,101].\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: nums = [0,1,0,3,2,3]\nOutput: 4\n```\n\n' +
        '**Constraints:**\n' +
        '- `1 <= nums.length <= 2500`\n' +
        '- `-10⁴ <= nums[i] <= 10⁴`',
      difficulty: 'Medium',
      topics: ['DP', 'Binary Search'],
      requirements: [
        'DP solution: O(n²)',
        'Binary search: O(n log n)',
      ],
      hints: [
        'DP: dp[i] = 1 + max(dp[j]) for all j < i with nums[j] < nums[i].',
        'Binary search: maintain a tails array; replace elements to keep it minimal.',
      ],
    },
    {
      id: 'dp4',
      shortName: 'Longest Common Subsequence',
      question: 'Longest Common Subsequence',
      description:
        'Given two strings `text1` and `text2`, return the length of their **longest common subsequence**. If there is no common subsequence, return `0`.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: text1 = "abcde", text2 = "ace"\nOutput: 3\nExplanation: The LCS is "ace".\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: text1 = "abc", text2 = "def"\nOutput: 0\n```\n\n' +
        '**Constraints:**\n' +
        '- `1 <= text1.length, text2.length <= 1000`\n' +
        '- Strings consist of lowercase English characters only',
      difficulty: 'Medium',
      topics: ['DP', 'String'],
      requirements: [
        'Time: O(m * n)',
        'Use 2D DP table',
      ],
      hints: [
        'If characters match: 1 + dp[i-1][j-1].',
        'Otherwise: max(dp[i-1][j], dp[i][j-1]).',
      ],
    },
    {
      id: 'dp5',
      shortName: 'Count Inversions',
      question: 'Count Inversions',
      description:
        'Given an array `nums`, count the number of inversions. An inversion is a pair `(i, j)` where `i < j` and `nums[i] > nums[j]`.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: nums = [2,4,1,3,5]\nOutput: 3\nExplanation: Inversions: (2,1), (4,1), (4,3)\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: nums = [1,2,3,4]\nOutput: 0\n```\n\n' +
        '**Constraints:**\n' +
        '- `1 <= nums.length <= 10⁵`\n' +
        '- Brute force O(n²) not acceptable for large inputs',
      difficulty: 'Hard',
      topics: ['Array', 'Merge Sort', 'Divide and Conquer'],
      requirements: [
        'Time complexity: O(n log n)',
        'Use modified merge sort',
      ],
      hints: [
        'During merge, if left[i] > right[j], all remaining left elements form inversions with right[j].',
        'Total = inversions(left) + inversions(right) + split inversions.',
      ],
    },
    {
      id: 'dp6',
      shortName: 'Sort Colors',
      question: 'Sort Colors',
      description:
        'Given an array `nums` with `n` objects colored red, white, or blue, sort them **in-place** so that objects of the same color are adjacent, with the colors in the order red, white, and blue.\n\n' +
        'We will use the integers `0`, `1`, and `2` to represent red, white, and blue respectively.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: nums = [2,0,2,1,1,0]\nOutput: [0,0,1,1,2,2]\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: nums = [2,0,1]\nOutput: [0,1,2]\n```\n\n' +
        '**Constraints:**\n' +
        '- `n == nums.length`\n' +
        '- `1 <= n <= 300`\n' +
        '- `nums[i]` is either `0`, `1`, or `2`',
      difficulty: 'Medium',
      topics: ['Array', 'Two Pointers', 'Dutch National Flag'],
      requirements: [
        'In-place with O(1) extra space',
        'Single pass with Dutch National Flag algorithm',
      ],
      hints: [
        'Three pointers: low (next 0), mid (current), high (next 2).',
        'Swap 0s to front and 2s to back.',
      ],
    },
    {
      id: 'dp7',
      shortName: 'Climbing Stairs',
      question: 'Climbing Stairs',
      description:
        'You are climbing a staircase. It takes `n` steps to reach the top.\n\n' +
        'Each time you can either climb `1` or `2` steps. In how many distinct ways can you climb to the top?\n\n' +
        '**Example 1:**\n' +
        '```\nInput: n = 2\nOutput: 2\nExplanation: 1+1 or 2\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: n = 3\nOutput: 3\nExplanation: 1+1+1, 1+2, 2+1\n```\n\n' +
        '**Constraints:**\n' +
        '- `1 <= n <= 45`',
      difficulty: 'Easy',
      topics: ['DP'],
      requirements: [
        'Time: O(n), Space: O(1) optimized',
        'Fibonacci pattern',
      ],
      hints: [
        'ways[i] = ways[i-1] + ways[i-2].',
        'Only keep last two values to optimize space.',
      ],
    },
    {
      id: 'dp8',
      shortName: 'Coin Change',
      question: 'Coin Change',
      description:
        'You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money.\n\n' +
        'Return the fewest number of coins that you need to make up that amount. If that amount cannot be made up, return `-1`.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: coins = [1,2,5], amount = 11\nOutput: 3\nExplanation: 11 = 5 + 5 + 1\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: coins = [2], amount = 3\nOutput: -1\n```\n\n' +
        '**Constraints:**\n' +
        '- `1 <= coins.length <= 12`\n' +
        '- `1 <= coins[i] <= 2³¹ - 1`\n' +
        '- `0 <= amount <= 10⁴`',
      difficulty: 'Medium',
      topics: ['DP'],
      requirements: ['Use bottom-up DP'],
      hints: [
        'dp[i] = min(dp[i], dp[i - coin] + 1) for each coin.',
        'Initialize dp array with a large value (amount + 1).',
      ],
    },
    {
      id: 'dp9',
      shortName: 'House Robber',
      question: 'House Robber',
      description:
        'You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed. Adjacent houses have security systems connected — **if two adjacent houses were broken into on the same night, the police will be alerted**.\n\n' +
        'Given an integer array `nums` representing the amount of money of each house, return the maximum amount of money you can rob without alerting the police.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: nums = [1,2,3,1]\nOutput: 4\nExplanation: Rob house 1 ($1) + house 3 ($3) = $4.\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: nums = [2,7,9,3,1]\nOutput: 12\nExplanation: Rob house 1 ($2) + house 3 ($9) + house 5 ($1) = $12.\n```\n\n' +
        '**Constraints:**\n' +
        '- `1 <= nums.length <= 100`\n' +
        '- `0 <= nums[i] <= 400`',
      difficulty: 'Medium',
      topics: ['DP'],
      requirements: [
        'Time: O(n), Space: O(1)',
      ],
      hints: [
        'dp[i] = max(dp[i-1], dp[i-2] + nums[i]).',
        'Keep only two variables for optimization.',
      ],
    },
    {
      id: 'dp10',
      shortName: 'House Robber II',
      question: 'House Robber II',
      description:
        'All houses are arranged in a **circle**. That means the first house is the neighbor of the last one. Given an integer array `nums` representing the amount of money of each house, return the maximum amount you can rob without robbing adjacent houses.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: nums = [2,3,2]\nOutput: 3\nExplanation: Cannot rob house 1 ($2) and house 3 ($2) since they are adjacent.\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: nums = [1,2,3,1]\nOutput: 4\n```\n\n' +
        '**Constraints:**\n' +
        '- `1 <= nums.length <= 100`\n' +
        '- `0 <= nums[i] <= 1000`',
      difficulty: 'Medium',
      topics: ['DP'],
      requirements: ['Run House Robber twice: exclude first or exclude last'],
      hints: [
        'Return max(rob(0..n-2), rob(1..n-1)).',
      ],
    },
    {
      id: 'dp11',
      shortName: 'Decode Ways',
      question: 'Decode Ways',
      description:
        'A message containing letters from `A-Z` can be encoded as numbers using the mapping: `A → 1, B → 2, ..., Z → 26`.\n\n' +
        'Given a string `s` containing only digits, return the **number of ways** to decode it.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: s = "12"\nOutput: 2\nExplanation: "AB" (1 2) or "L" (12)\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: s = "226"\nOutput: 3\nExplanation: "BZ" (2 26), "VF" (22 6), or "BBF" (2 2 6)\n```\n\n' +
        '**Example 3:**\n' +
        '```\nInput: s = "06"\nOutput: 0\nExplanation: "06" cannot be mapped (leading zero).\n```\n\n' +
        '**Constraints:**\n' +
        '- `1 <= s.length <= 100`\n' +
        '- `s` contains only digits',
      difficulty: 'Medium',
      topics: ['DP', 'String'],
      requirements: ['Handle leading zeros carefully'],
      hints: [
        'dp[i] depends on valid single-digit and two-digit decodes.',
        'Check if the substring forms a valid number between 10 and 26.',
      ],
    },
    {
      id: 'dp12',
      shortName: 'Word Break',
      question: 'Word Break',
      description:
        'Given a string `s` and a dictionary of strings `wordDict`, return `true` if `s` can be segmented into a space-separated sequence of one or more dictionary words.\n\n' +
        'Note that the same word in the dictionary may be reused multiple times.\n\n' +
        '**Example 1:**\n' +
        '```\nInput: s = "leetcode", wordDict = ["leet","code"]\nOutput: true\nExplanation: "leetcode" = "leet" + "code"\n```\n\n' +
        '**Example 2:**\n' +
        '```\nInput: s = "catsandog", wordDict = ["cats","dog","sand","and","cat"]\nOutput: false\n```\n\n' +
        '**Constraints:**\n' +
        '- `1 <= s.length <= 300`\n' +
        '- `1 <= wordDict.length <= 1000`\n' +
        '- `1 <= wordDict[i].length <= 20`',
      difficulty: 'Medium',
      topics: ['DP', 'String'],
      requirements: ['Time complexity: O(n²)'],
      hints: [
        'dp[i] = true if there exists j < i where dp[j] and s[j:i] is in dict.',
      ],
    },
  ],
};

export default programming;
