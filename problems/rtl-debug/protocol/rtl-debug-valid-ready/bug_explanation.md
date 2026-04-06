# Bug Explanation

The original code updates src_data unconditionally whenever load_new=1:
    if (load_new) begin
        src_valid <= 1'b1;
        src_data  <= load_data;   // overwrites held data during backpressure
    end
This corrupts in-flight data while the receiver is not ready.
Fix: gate the acceptance of a new item so it only happens when
the bus is free (not valid) or a successful handshake just occurred.
