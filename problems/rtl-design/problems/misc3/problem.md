# Sliding Window Min/Max

**Domain:** rtl-design — FIFO / Queue  
**Difficulty:** Hard  
**Topics:** Sliding Window, Stream Processing, Design

---

## Problem Statement

Design Sliding Window Min/Max Module for Stream Processing

Compute minimum and maximum over a sliding window of the last W samples from an input stream.\n\n' +
        '**Example (W=3):**\n' +
        '```\nStream: [4, 2, 12, 3, 1]\nAfter [4,2,12]: min=2, max=12\nAfter [2,12,3]: min=2, max=12\nAfter [12,3,1]: min=1, max=12\n```\n\n' +
        '**Constraints:**\n' +
        '- Parameterizable WINDOW_SIZE and DATA_WIDTH\n' +
        '- Warm-up period: output valid after W samples\n' +
        '- Naive: comparator tree each cycle

---

## Requirements

1. PARAMETERIZATION: (1) DATA_WIDTH (bits per sample), (2) WINDOW_SIZE (W, number of samples in window).

2. STREAMING INPUT: Input 

3.  (DATA_WIDTH bits) and 

4.  (1 bit pulse indicating new sample).

5. WINDOW BUFFER: Maintain buffer storing last W samples. Implement as circular buffer (FIFO) or shift register.

6. MIN/MAX COMPUTATION: Each cycle, compute minimum and maximum across all samples currently in window.

7. WARM-UP PERIOD: Window initially empty. First W-1 samples fill window. Output valid only after W samples received (window full).

8. OUTPUT: (1) min_out (minimum value in current window), (2) max_out (maximum value in current window), (3) out_valid (1 when output valid, i.e., window has W samples).

9. WINDOW UPDATE: On each new sample (in_valid=1): Add new sample to window, evict oldest sample (if window full). Recompute min/max.

10. COMPUTATION METHOD: (1) Naive: Compare all W samples each cycle (W-1 comparators for min, W-1 for max). (2) Optimized: Use monotonic deque or incremental update (complex).

11. RESET: On reset, clear window buffer and set out_valid=0.

12. Test Case 1 - Warm-Up: W=4, stream: [4, 2, 12]. After 3 samples, out_valid=0 (window not full). After 4th sample, out_valid=1.

13. Test Case 2 - Moving Window: W=3, stream: [4, 2, 12, 3, 1]. After 3 samples: min=2, max=12. After 4th (window=[2,12,3]): min=2, max=12. After 5th (window=[12,3,1]): min=1, max=12.

14. Test Case 3 - Constant Input: W=4, stream: [7, 7, 7, 7, 7]. Expected: min=7, max=7 after warm-up and continuously.

15. Test Case 4 - Descending Input: W=3, stream: [9, 8, 7, 6, 5]. Expected: After [9,8,7]: min=7, max=9. After [8,7,6]: min=6, max=8. After [7,6,5]: min=5, max=7.

16. Test Case 5 - Reset Mid-Stream: Stream 5 samples, then reset. Continue with new stream. Expected: Window clears, out_valid=0 until W new samples received.

---

## Hints

<details>
<summary>Hint 1</summary>
Naive: W-1 comparators for min, W-1 for max (tree structure).
</details>

<details>
<summary>Hint 2</summary>
Shift register: shift all samples, new sample enters at position 0.
</details>

<details>
<summary>Hint 3</summary>
Start with small WINDOW_SIZE (2-3) for verification.
</details>
