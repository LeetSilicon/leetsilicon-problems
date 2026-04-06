# Bug Explanation

BUG 1 — Off-by-one in full flag:
  assign full = (count == DEPTH-1) fires when there is still one slot
  free, blocking the last legal write.
  Fix: assign full = (count == DEPTH).

BUG 2 — Simultaneous read + write clobbers count:
  The two sequential statements
      count <= count + 1;   // write path
      count <= count - 1;   // read path
  both targeting count in the same always_ff block mean only the
  LAST nonblocking assignment wins (the decrement).
  Fix: compute the net delta in a single conditional expression.
