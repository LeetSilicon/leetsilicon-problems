# Bug Explanation

tc_pulse <= (count == 4'd0) samples count at the clock edge.
At the wrap clock edge, count is still 9 (the new value 0 is the
nonblocking update not yet visible), so the condition is false.
On the NEXT cycle count == 0, so tc_pulse fires one cycle late
and stays high for the entire time count remains 0 (i.e. one full cycle).
Fix: assert tc_pulse when count == 9 AND en is high — that is exactly
the cycle the counter wraps — so tc_pulse rises one cycle earlier
and reflects the transition, not the arrived state.
