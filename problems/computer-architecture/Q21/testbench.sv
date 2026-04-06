module tb;
  logic       clk;
  logic       rst_n, issue_valid, wb_valid;
  logic       rs1_busy, rs2_busy;
  logic [4:0] issue_rd, wb_rd, check_rs1, check_rs2;
  int         p = 0, f = 0;

  // Clock generation
  initial clk = 0;
  always #5 clk = ~clk;
  // DUT instantiation
  scoreboard #(.REGS(32)) dut (.*);

  initial begin
    // Reset sequence
    rst_n       = 0;
    issue_valid = 0;
    wb_valid    = 0;
    check_rs1   = 0;
    check_rs2   = 0;
    @(posedge clk);
    @(posedge clk);
    rst_n = 1;

    // Issue instruction to r5 — marks it busy
    @(negedge clk); issue_valid = 1; issue_rd = 5;
    @(posedge clk); @(negedge clk); issue_valid = 0;
    check_rs1   = 5;
    @(negedge clk);
    if (rs1_busy) begin
      p++;
      $display("PASS: r5 busy");
    end else begin
      f++;
      $display("FAIL");
    end

    // Writeback to r5 — clears busy
    @(negedge clk); wb_valid = 1; wb_rd = 5;
    @(posedge clk); @(negedge clk); wb_valid = 0;
    @(negedge clk);
    if (!rs1_busy) begin p++; $display("PASS: r5 free after wb"); end
    else begin f++; $display("FAIL: r5 still busy after wb"); end

    // x0 always reads as ready
    check_rs1 = 0;
    @(negedge clk); issue_valid = 1; issue_rd = 0;
    @(posedge clk); @(negedge clk); issue_valid = 0;
    @(negedge clk);
    if (!rs1_busy) begin p++; $display("PASS: x0 always ready"); end
    else begin f++; $display("FAIL: x0 busy"); end

    // Check rs2: issue r10, check rs2=10
    @(negedge clk); issue_valid = 1; issue_rd = 10;
    @(posedge clk); @(negedge clk); issue_valid = 0;
    check_rs2 = 10;
    @(negedge clk);
    if (rs2_busy) begin p++; $display("PASS: rs2 busy for r10"); end
    else begin f++; $display("FAIL: rs2 not busy for r10"); end

    // Same-cycle issue+wb to same register: wb clears first, issue sets
    // (in solution: if both match, issue after wb => net busy=1)
    @(negedge clk); wb_valid = 1; wb_rd = 10; issue_valid = 1; issue_rd = 10;
    @(posedge clk); @(negedge clk); wb_valid = 0; issue_valid = 0;
    @(negedge clk);
    // In the solution, wb is after issue in always_ff,
    // so last NBA wins: wb clears busy[10]=0
    if (!rs2_busy) begin p++; $display("PASS: same-cycle wb wins over issue"); end
    else begin f++; $display("FAIL: same-cycle wb should win busy=%b", dut.busy[10]); end

    // Summary
    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule