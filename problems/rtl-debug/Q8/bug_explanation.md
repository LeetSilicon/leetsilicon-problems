# Bug Explanation

Inside the always_ff block there are TWO assignments to pulse:
    pulse <= sig_in & ~prev_in;   // correct: rising-edge detect
    if (sig_in) pulse <= 1'b1;   // BUG: overwrites with level detect
The second (last) nonblocking assignment wins, turning pulse into a
level signal that stays high for the entire duration sig_in is asserted.
Fix: delete the second assignment entirely. The first line alone produces
the correct single-cycle pulse on the rising edge.
