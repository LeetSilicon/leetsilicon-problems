module tb;

  logic       clk;
  logic       rst_n, issue_valid, wb_valid;
  logic       rs1_busy, rs2_busy;
  logic [4:0] issue_rd, wb_rd, check_rs1, check_rs2;

  int pass = 0, fail = 0;

  initial clk = 0;
  always #5 clk = ~clk;

  scoreboard #(.REGS(32)) dut (.*);

  task automatic check(string name, logic ok);
    #1;
    if (ok) begin
      pass++;
      $display("PASS: %s", name);
    end else begin
      fail++;
      $display("FAIL: %s", name);
    end
  endtask

  initial begin
    rst_n       = 0;
    issue_valid = 0;
    wb_valid    = 0;
    check_rs1   = 0;
    check_rs2   = 0;
    @(posedge clk);
    @(posedge clk);
    rst_n = 1;

    // -------------------------
    // TEST 1 - Issue marks busy
    // -------------------------
    @(negedge clk);
    issue_valid = 1;
    issue_rd    = 5;
    @(posedge clk);
    @(negedge clk);
    issue_valid = 0;
    check_rs1 = 5;
    @(negedge clk);
    check("TEST1 Issue marks r5 busy", rs1_busy);

    // -------------------------
    // TEST 2 - Writeback clears
    // -------------------------
    @(negedge clk);
    wb_valid = 1;
    wb_rd    = 5;
    @(posedge clk);
    @(negedge clk);
    wb_valid = 0;
    @(negedge clk);
    check("TEST2 Wb clears r5", !rs1_busy);

    // -------------------------
    // TEST 3 - x0 never busy
    // -------------------------
    check_rs1 = 0;
    @(negedge clk);
    issue_valid = 1;
    issue_rd    = 0;
    @(posedge clk);
    @(negedge clk);
    issue_valid = 0;
    @(negedge clk);
    check("TEST3 x0 always ready", !rs1_busy);

    // -------------------------
    // TEST 4 - rs2 busy path
    // -------------------------
    @(negedge clk);
    issue_valid = 1;
    issue_rd    = 10;
    @(posedge clk);
    @(negedge clk);
    issue_valid = 0;
    check_rs2 = 10;
    @(negedge clk);
    check("TEST4 rs2 busy for r10", rs2_busy);

    // -------------------------
    // TEST 5 - Same-cycle wb vs issue
    // -------------------------
    @(negedge clk);
    wb_valid    = 1;
    wb_rd       = 10;
    issue_valid = 1;
    issue_rd    = 10;
    @(posedge clk);
    @(negedge clk);
    wb_valid    = 0;
    issue_valid = 0;
    @(negedge clk);
    check("TEST5 Same-cycle wb wins", !rs2_busy);

    // -------------------------
    // TEST 6 - Second issue busy
    // -------------------------
    @(negedge clk);
    issue_valid = 1;
    issue_rd    = 7;
    @(posedge clk);
    @(negedge clk);
    issue_valid = 0;
    check_rs1 = 7;
    @(negedge clk);
    check("TEST6 Issue r7 busy", rs1_busy);

    $display("=================================");
    $display("TOTAL PASS = %0d", pass);
    $display("TOTAL FAIL = %0d", fail);
    $display("=================================");
    if (fail == 0)
      $display("ALL 6 TESTS PASSED");
    else
      $display("SOME TESTS FAILED");
    $finish;
  end

endmodule
