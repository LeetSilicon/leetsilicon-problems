module tb;
  logic dst_clk;
  logic dst_rst_n;
  logic async_sig_in;
  logic sig_sync;
  int   p = 0, f = 0;

  initial dst_clk = 0;

  always #5 dst_clk = ~dst_clk;
  two_ff_sync dut (.*);

  initial begin
    dst_rst_n   = 0;
    async_sig_in = 0;
    @(posedge dst_clk); @(posedge dst_clk);
    dst_rst_n = 1;

    // TC — Signal propagates after 2 flop latency
    @(negedge dst_clk); async_sig_in = 1;
    @(posedge dst_clk); @(negedge dst_clk);
    // After 1 cycle: ff1 captures the input
    if (!sig_sync) begin p++; $display("PASS: not yet through after 1 cycle"); end
    else begin f++; $display("FAIL: output propagated too fast"); end

    @(posedge dst_clk); @(negedge dst_clk);
    if (sig_sync) begin p++; $display("PASS: signal through after 2 cycles"); end
    else begin f++; $display("FAIL: signal not synchronized"); end

    // TC — De-assert propagates with same latency
    async_sig_in = 0;
    @(posedge dst_clk); @(posedge dst_clk); @(negedge dst_clk);
    if (!sig_sync) begin p++; $display("PASS: de-assert synchronized"); end
    else begin f++; $display("FAIL: still high after de-assert"); end

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule