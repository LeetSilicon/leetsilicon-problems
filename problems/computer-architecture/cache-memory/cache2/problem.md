# Pseudo-LRU Tree-Based

**Domain:** computer-architecture — Cache & Memory  
**Difficulty:** Hard  
**Topics:** Cache, Replacement Policy, RTL

---

## Problem Statement

Implement Pseudo-LRU Using Binary Tree Structure

Design a pseudo-LRU (PLRU) replacement policy using a binary tree structure for an N-way set-associative cache (N is power of 2).\n\n' +
        'Use `N-1` bits per set for tree node states. On access, update only the tree nodes along the path from root to the accessed way. For victim selection, traverse root to leaf following node bits.\n\n' +
        '**Example (4-way):**\n' +
        '```\nTree has 3 nodes: 1 root, 2 children\nAccess way 0 → flip path bits away from way 0\nVictim selection → follow bits root-to-leaf\n```\n\n' +
        '**Constraints:**\n' +
        '- N must be a power of 2\n' +
        '- Tree uses N-1 bits per set\n' +
        '- Support parameterizable N

---

## Requirements

1. PARAMETERIZATION: Support parameterizable N-way associativity where N must be a power of 2. Calculate tree bits required as N-1.

2. PATH UPDATE: On cache access to way W, update only the log2(N) tree node bits along the path from root to that way. Do not update nodes on other paths.

3. TREE SEMANTICS: Each tree node bit indicates which subtree was less recently used. 0 points to left subtree, 1 points to right subtree (or document your convention clearly).

4. VICTIM SELECTION: To find victim way, start at root and follow tree bits: if bit=0 go left, if bit=1 go right, until reaching a leaf node representing the victim way.

5. EDGE CASES: Handle reset (initialize tree to known state), invalid inputs, and support different N values.

6. Test Case 1 - 4-Way Tree Update: For 4-way cache, access way 0, then way 3. Verify tree bits flip correctly along each path (3 bits total: root, left/right children).

7. Test Case 2 - Victim Selection: Set tree to known state (e.g., bits = 0b101). Perform victim walk from root following bit values. Verify selected victim way matches expected leaf.

8. Test Case 3 - Parameterized 8-Way: Synthesize/simulate with N=8 parameter. Verify tree uses 7 bits per set and victim selection works correctly for all 8 ways.

---

## Hints

<details>
<summary>Hint 1</summary>
For N=4: root points to LRU half, children point to LRU quarter.
</details>

<details>
<summary>Hint 2</summary>
Path update: flip each node bit to point AWAY from accessed subtree.
</details>

<details>
<summary>Hint 3</summary>
Way mapping: way 0 = left-left, way 1 = left-right, way 2 = right-left, way 3 = right-right.
</details>
