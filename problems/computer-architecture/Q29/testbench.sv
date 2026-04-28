module tb;
  logic        clk;
  logic        rst_n, dispatch, writeback, commit, flush;
  logic        full, empty, commit_valid;
  logic [2:0]  wb_id, flush_tail, alloc_id;
  logic [4:0]  dest_arch, commit_arch;
  logic [31:0] wb_value, commit_value;
  int          pass = 0, fail = 0;

  initial clk = 0;

  always #5 clk = ~clk;
  rob #(.ENTRIES(8), .W(32)) dut (.*);

  initial begin
    rst_n = 0;
    dispatch = 0;
    writeback = 0;
    commit = 0;
    flush = 0;
    wb_id = 0;
    flush_tail = 0;
    dest_arch = 0;
    wb_value = 0;
    @(posedge clk);
    @(posedge clk);
    rst_n = 1;

    // Allocate one entry.
    @(negedge clk); dest_arch = 5; dispatch = 1;
    @(posedge clk); @(negedge clk); dispatch = 0;
    if (dut.valid[0]) begin pass++; $display("PASS: TEST1 alloc at tail/head0"); end
    else begin fail++; $display("FAIL: allocation missing"); end

    // Not-ready head blocks commit.
    @(negedge clk); commit = 1;
    @(posedge clk); @(negedge clk); commit = 0;
    if (!commit_valid) begin pass++; $display("PASS: TEST2 not-ready blocks commit"); end
    else begin fail++; $display("FAIL: commit should block"); end

    // Writeback then commit in-order.
    @(negedge clk); wb_id = 0; wb_value = 32'hBEEF; writeback = 1;
    @(posedge clk); @(negedge clk); writeback = 0;
    if (commit_valid && commit_arch == 5 && commit_value == 32'hBEEF) begin
      pass++;
      $display("PASS: TEST3 writeback marks ready");
    end else begin
      fail++;
      $display("FAIL: writeback/ready");
    end

    @(negedge clk); commit = 1;
    @(posedge clk); @(negedge clk); commit = 0;
    @(posedge clk); @(negedge clk);
    if (empty) begin pass++; $display("PASS: TEST4 commit frees head"); end
    else begin fail++; $display("FAIL: ROB not empty after commit"); end

    // Flush test: allocate 3 entries, then flush back to 1.
    @(negedge clk); dispatch = 1; dest_arch = 1;
    @(posedge clk); @(negedge clk); dest_arch = 2;
    @(posedge clk); @(negedge clk); dest_arch = 3;
    @(posedge clk); @(negedge clk); dispatch = 0;
    @(posedge clk); @(negedge clk);
    // tail should be at 4 (3 entries: indices 1, 2, 3), head at 1
    // Flush to flush_tail=2 => invalidate entries 2 and 3, keep entry 1
    @(negedge clk); flush_tail = 2; flush = 1;
    @(posedge clk); @(negedge clk); flush = 0;
    @(posedge clk); @(negedge clk);
    if (dut.valid[1] && !dut.valid[2] && !dut.valid[3]) begin
      pass++;
      $display("PASS: TEST5 flush invalidates younger entries");
    end else begin
      fail++;
      $display("FAIL: flush v1=%b v2=%b v3=%b", dut.valid[1], dut.valid[2], dut.valid[3]);
    end

    // -------------------------
    // TEST 6 - Reset clears ROB
    // -------------------------
    rst_n = 0;
    @(posedge clk);
    @(posedge clk);
    rst_n = 1;
    @(posedge clk);
    @(negedge clk);
    if (empty) begin
      pass++;
      $display("PASS: TEST6 reset clears ROB");
    end else begin
      fail++;
      $display("FAIL: reset not empty");
    end

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