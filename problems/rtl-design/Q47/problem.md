# Top-K or Max-Value Tracker

**Domain:** rtl-design — FIFO / Queue  
**Difficulty:** Hard  
**Topics:** Tracking, Design, Optimization

---

## Problem Statement

Implement Top-K or Maximum Value Tracker Module

Design a hardware module tracking the top K maximum values from a streaming input.\n\n' +
        '**Example (K=3):**\n' +
        '```\nStream: [5, 8, 3, 9, 2]\nAfter 5: top=[5,0,0]\nAfter 8: top=[8,5,0]\nAfter 9: top=[9,8,5] (3 evicted)\nAfter 2: top=[9,8,5] (2 not in top 3)\n```\n\n' +
        '**Constraints:**\n' +
        '- Parameterizable DATA_WIDTH and K\n' +
        '- Maintain sorted descending order\n' +
        '- Compare-and-swap insertion for small K

---

## Requirements

1. PARAMETERIZATION: (1) DATA_WIDTH (bits per value), (2) K (number of top values to track, e.g., K=1 for max only, K=3 for top-3).

2. STREAMING INPUT: Input 

3.  (DATA_WIDTH bits) and 

4.  (1 bit). When in_valid=1, new data sample arrives.

5. TOP-K STORAGE: Maintain K registers storing current top K values. For K=1: single max register. For K>1: array of K registers sorted in descending order (top[0]=largest, top[K-1]=smallest of top K).

6. UPDATE LOGIC: On new input (in_valid=1): Compare in_data with stored top K values. If in_data > any of top K, insert in_data at appropriate position, evict smallest of top K.

7. INSERTION SORT: For small K (e.g., K≤4), use compare-and-swap network to insert new value and maintain sorted order. For large K, more complex logic needed.

8. OUTPUT: Continuously output top K values 

9.  (array of K values). Or provide output_valid signal when top K updated.

10. DUPLICATE HANDLING: Define policy for duplicate values. Options: (1) Keep all duplicates (top K can have repeated values), (2) Keep unique only (skip duplicates). Document choice.

11. RESET: On reset, initialize top K values to minimum possible (e.g., 0 or -infinity for signed) so any input will update.

12. SIGNED/UNSIGNED: Define whether comparisons are signed or unsigned. Document.

13. Test Case 1 - Max Only (K=1): Stream: [3, 1, 5, 2, 4]. Expected: max = 3 after first, 3 after second, 5 after third, 5 after fourth, 5 after fifth.

14. Test Case 2 - Top-2: Stream: [4, 9, 1, 7, 3]. Expected: After stream, top[0]=9, top[1]=7.

15. Test Case 3 - Sorted Insertion: K=3, stream: [5, 8, 3, 9, 2]. Expected: After 5: top=[5,0,0] (assuming init to 0). After 8: top=[8,5,0]. After 3: top=[8,5,3]. After 9: top=[9,8,5] (3 evicted). After 2: top=[9,8,5] (2 not in top 3).

16. Test Case 4 - Duplicate Values: K=2, stream: [5, 5, 2, 5]. If keeping duplicates: top=[5,5]. If unique only: top=[5,2].

17. Test Case 5 - All Same Value: K=3, stream: [7, 7, 7, 7]. Expected: top=[7,7,7] (if keeping duplicates).

---

## Hints

<details>
<summary>Hint 1</summary>
K=1: simple max register.
</details>
