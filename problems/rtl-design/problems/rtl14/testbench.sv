module tb;
  logic clk;
  logic async_rst_n;
  logic rst_n_sync;
  int   p = 0, f = 0;

  initial clk = 0;

  always #5 clk = ~clk;
  reset_sync dut (.*);

  initial begin
    async_rst_n = 0;
    @(posedge clk); @(posedge clk); #1;

    // TC — Assert resets immediately
    if (!rst_n_sync) begin p++; $display("PASS: reset asserts immediately"); end
    else begin f++; $display("FAIL: reset not asserted"); end

    // TC — Deassert occurs only on clock edge(s)
    async_rst_n = 1;
    #2;   // Partway into a clock period
    // rst_n_sync should not yet deassert (not at clock edge)
    if (!rst_n_sync) begin p++; $display("PASS: sync deassert — still held between edges"); end
    else begin f++; $display("FAIL: deasserted too early"); end

    // After 2 clock edges, should deassert
    @(posedge clk); @(posedge clk); #1;
    if (rst_n_sync) begin p++; $display("PASS: deasserted after 2 clock edges"); end
    else begin f++; $display("FAIL: still in reset after 2 edges"); end

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule