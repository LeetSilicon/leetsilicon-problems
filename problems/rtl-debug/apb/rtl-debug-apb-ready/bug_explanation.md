# Bug Explanation

The original code gates only on PSEL:
    if (PSEL) begin
        PREADY <= 1'b1;   // fires in setup phase too
        ...
    end
APB protocol: PREADY is only sampled when PSEL=1 AND PENABLE=1 (access
phase). Asserting it during the setup phase (PSEL=1, PENABLE=0) is a
protocol violation and can cause the master to complete the transfer
prematurely.
Fix: require both PSEL and PENABLE before asserting PREADY.
