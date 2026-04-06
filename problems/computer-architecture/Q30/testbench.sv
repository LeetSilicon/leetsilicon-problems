module tb;
  logic       clk;
  logic       rst_n, issue_req, done_req, any_available;
  logic [1:0] issue_fu, done_fu;
  logic [3:0] busy;
  int         p = 0, f = 0;

  // Clock generation
  initial clk = 0;
  always #5 clk = ~clk;
  // DUT instantiation
  fu_tracker #(.N_FU(4)) dut (.*);

  initial begin
    // Reset sequence
    rst_n     = 0;
    issue_req = 0;
    done_req  = 0;
    @(posedge clk);
    @(posedge clk);
    rst_n = 1;

    // Issue FU0
    @(negedge clk); issue_req = 1; issue_fu = 0;
    @(posedge clk); @(negedge clk); issue_req = 0;
    @(negedge clk);
    if (busy[0] && any_available) begin
      p++;
      $display("PASS: FU0 busy");
    end else begin
      f++;
      $display("FAIL");
    end

    // Issue remaining FUs
    @(negedge clk); issue_req = 1; issue_fu = 1;
    @(posedge clk); @(negedge clk); issue_fu = 2;
    @(posedge clk); @(negedge clk); issue_fu = 3;
    @(posedge clk); @(negedge clk); issue_req = 0;
    @(negedge clk);
    if (!any_available) begin
      p++;
      $display("PASS: all busy");
    end else begin
      f++;
      $display("FAIL");
    end

    // Free FU2
    @(negedge clk); done_req = 1; done_fu = 2;
    @(posedge clk); @(negedge clk); done_req = 0;
    @(negedge clk);
    if (any_available && !busy[2]) begin
      p++;
      $display("PASS: freed");
    end else begin
      f++;
      $display("FAIL: free FU2");
    end

    // Same-cycle issue+done on same FU: done clears, issue sets => net busy=1
    // FU2 is currently free, issue and free FU1 at the same time
    @(negedge clk); issue_req = 1; issue_fu = 2; done_req = 1; done_fu = 1;
    @(posedge clk); @(negedge clk); issue_req = 0; done_req = 0;
    @(negedge clk);
    if (busy[2] && !busy[1]) begin
      p++;
      $display("PASS: same-cycle issue2+done1");
    end else begin
      f++;
      $display("FAIL: same-cycle busy=%b", busy);
    end

    // Summary
    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule