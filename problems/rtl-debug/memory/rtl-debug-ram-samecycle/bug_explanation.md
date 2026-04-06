# Bug Explanation

The buggy code:
    if (we) begin
        mem[addr] <= wdata;
        rdata     <= mem[addr];   // reads OLD value (nonblocking not yet applied)
    end
Because nonblocking assignments take effect at end-of-timeslot, mem[addr]
still holds its old value when rdata is assigned — giving stale read data
on write cycles.
Fix (write-first): when we=1, return wdata directly as rdata so the
read reflects the value being written in the same cycle.
