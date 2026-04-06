module tb;
  logic        clk;
  logic        rst_n, dispatch, writeback, commit, flush;
  logic        full, empty, commit_valid;
  logic [2:0]  wb_id, flush_tail, alloc_id;
  logic [4:0]  dest_arch, commit_arch;
  logic [31:0] wb_value, commit_value;
  int          p = 0, f = 0;

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
    if (dut.valid[0]) begin p++; $display("PASS: alloc at tail/head0"); end
    else begin f++; $display("FAIL: allocation missing"); end

    // Not-ready head blocks commit.
    @(negedge clk); commit = 1;
    @(posedge clk); @(negedge clk); commit = 0;
    if (!commit_valid) begin p++; $display("PASS: not-ready blocks commit"); end
    else begin f++; $display("FAIL: commit should block"); end

    // Writeback then commit in-order.
    @(negedge clk); wb_id = 0; wb_value = 32'hBEEF; writeback = 1;
    @(posedge clk); @(negedge clk); writeback = 0;
    if (commit_valid && commit_arch == 5 && commit_value == 32'hBEEF) begin
      p++;
      $display("PASS: writeback marks ready");
    end else begin
      f++;
      $display("FAIL: writeback/ready");
    end

    @(negedge clk); commit = 1;
    @(posedge clk); @(negedge clk); commit = 0;
    @(posedge clk); @(negedge clk);
    if (empty) begin p++; $display("PASS: commit frees head"); end
    else begin f++; $display("FAIL: ROB not empty after commit"); end

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
      p++;
      $display("PASS: flush invalidates younger entries");
    end else begin
      f++;
      $display("FAIL: flush v1=%b v2=%b v3=%b", dut.valid[1], dut.valid[2], dut.valid[3]);
    end

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule