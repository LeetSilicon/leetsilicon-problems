module tb;
  logic clk;
  logic rst_n;
  logic sig_in;
  logic onecycle_pulse;
  int   p = 0, f = 0;

  initial clk = 0;

  always #5 clk = ~clk;
  one_cycle_pulse dut (.*);

  initial begin
    rst_n  = 0; sig_in = 0;
    @(posedge clk); @(posedge clk);
    rst_n = 1;

    // TC — Valid: 0,1,0 → should trigger
    @(negedge clk); sig_in = 0;
    @(posedge clk); @(negedge clk); sig_in = 1;
    @(posedge clk); @(negedge clk); sig_in = 0;
    @(posedge clk); @(negedge clk);  // registered: pulse appears here
    if (onecycle_pulse) begin p++; $display("PASS: one-cycle pulse detected"); end
    else begin f++; $display("FAIL: one-cycle pulse not detected"); end

    // TC — Two-cycle high: 0,1,1,0 → should NOT trigger
    sig_in = 0; @(posedge clk);
    sig_in = 1; @(posedge clk);
    sig_in = 1; @(posedge clk);
    sig_in = 0; @(posedge clk); @(negedge clk);
    if (!onecycle_pulse) begin p++; $display("PASS: two-cycle high does not trigger"); end
    else begin f++; $display("FAIL: two-cycle high triggered"); end

    // TC — Stuck high: no trigger
    @(negedge clk); sig_in = 1;
    repeat (4) @(posedge clk);
    @(posedge clk); @(negedge clk);
    if (!onecycle_pulse) begin p++; $display("PASS: stuck high no trigger"); end
    else begin f++; $display("FAIL: stuck high triggered"); end

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule