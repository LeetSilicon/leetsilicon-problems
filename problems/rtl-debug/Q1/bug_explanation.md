# Bug Explanation

detect was registered inside always_ff using (state == S101 && in_bit).
Because state only updates on the NEXT posedge, the assignment
"detect <= (state == S101 && in_bit)" becomes visible one clock after
the matching bit arrives — one cycle late.
Fix: derive detect combinationally from next_state so it is visible
in the same cycle that the sequence completes.
