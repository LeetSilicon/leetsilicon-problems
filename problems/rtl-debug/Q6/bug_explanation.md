# Bug Explanation

grant is updated with a nonblocking assignment earlier in the block:
    grant <= 2'b00;
    ...
    if (req[0]) grant <= 2'b01;
Then the pointer check reads the SAME registered signal:
    if (grant[1]) rr_ptr <= ~rr_ptr;
Because nonblocking assignments do not take effect until end-of-timeslot,
grant[1] is still 2'b00 (cleared by the default at the top), so
rr_ptr never toggles and req[0] is always favoured.
Fix: compute grant combinationally in an always_comb block and
update rr_ptr from the combinational signal in the always_ff block.
