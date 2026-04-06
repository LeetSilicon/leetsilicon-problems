# Bug Explanation

The always_ff block first correctly pulses ack for one cycle:
    if (req && !busy) begin
        ack  <= 1'b1;
        busy <= 1'b1;
    end else if (busy) begin
        busy <= 1'b0;
        // ack is implicitly 0 here via reset default
    end
But immediately after, an unconditional override fires:
    if (req) ack <= 1'b1;   // BUG — keeps ack high while req is held
This last nonblocking assignment wins every clock that req=1, so ack
never deasserts as long as req is asserted.
Fix: delete the extra if (req) ack assignment entirely.
