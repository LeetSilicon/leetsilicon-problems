module tb;
  logic       clk;
  logic       rst_n, valid;
  logic [7:0] warp_ready;
  logic [2:0] selected_warp;
  int         p = 0, f = 0;

  // Clock generation
  initial clk = 0;
  always #5 clk = ~clk;
  // DUT instantiation
  warp_scheduler #(.N_WARPS(8)) dut (.*);

  initial begin
    // Reset sequence
    rst_n      = 0;
    warp_ready = 0;
    @(posedge clk);
    @(posedge clk);
    rst_n = 1;

    // Warps 2 and 5 ready — expect round-robin to pick warp 2 first
    warp_ready = 8'b0010_0100;
    @(posedge clk); @(negedge clk);
    if (valid && selected_warp == 2) begin p++; $display("PASS: selected warp 2"); end
    else begin f++; $display("FAIL: got %0d valid=%b", selected_warp, valid); end

    // After one scheduling update, next choice should advance to warp 5
    @(posedge clk);
    @(negedge clk);
    if (selected_warp == 5) begin p++; $display("PASS: RR advanced to warp 5"); end
    else begin f++; $display("FAIL: expected 5 got %0d", selected_warp); end

    // No warps ready
    warp_ready = 8'b0000_0000;
    @(posedge clk);
    @(negedge clk);
    if (!valid) begin p++; $display("PASS: no warps ready"); end
    else begin f++; $display("FAIL: valid should be 0"); end

    // Single warp ready: always picks it
    warp_ready = 8'b0000_1000; // warp 3
    @(posedge clk);
    @(negedge clk);
    if (valid && selected_warp == 3) begin p++; $display("PASS: single warp 3"); end
    else begin f++; $display("FAIL: single warp got %0d", selected_warp); end

    // Wrap-around: last=3, warps 0 and 1 ready -> picks 0 (wraps)
    @(posedge clk); // last updates to 3
    warp_ready = 8'b0000_0011; // warps 0 and 1
    @(posedge clk);
    @(negedge clk);
    if (valid && selected_warp == 0) begin p++; $display("PASS: wrap-around to 0"); end
    else begin f++; $display("FAIL: wrap got %0d", selected_warp); end

    // Summary
    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule