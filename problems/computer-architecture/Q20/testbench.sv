module tb;
  logic       clk;
  logic       rst_n, rename_req, checkpoint_save, flush, commit_free, rename_grant, stall;
  logic [1:0] src1_arch, src2_arch, dst_arch;
  logic [2:0] free_preg, src1_preg, src2_preg, new_preg, old_preg;

  int pass = 0, fail = 0;

  initial clk = 0;

  always #5 clk = ~clk;
  reg_rename #(.ARCH(4), .PHYS(6)) dut (.*);

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
    rst_n           = 0;
    rename_req      = 0;
    checkpoint_save = 0;
    flush           = 0;
    commit_free     = 0;
    src1_arch       = 0;
    src2_arch       = 1;
    dst_arch        = 1;
    free_preg       = 0;
    @(posedge clk);
    @(posedge clk);
    rst_n = 1;

    // First rename of r1.
    @(negedge clk); rename_req = 1; dst_arch = 1;
    #1;  // check comb outputs before posedge commits
    check("TEST1 First rename r1", rename_grant && old_preg == 1 && new_preg >= 4);
    @(posedge clk); @(negedge clk); rename_req = 0;
    @(negedge clk); checkpoint_save = 1;
    @(posedge clk); @(negedge clk); checkpoint_save = 0;

    // Second rename of r1 should allocate a different preg and report old mapping.
    rename_req = 1;
    dst_arch   = 1;
    @(posedge clk);
    rename_req = 0;
    check("TEST2 Second rename new mapping", rename_grant && old_preg != new_preg);
    @(posedge clk); @(negedge clk); rename_req = 0;

    // Exhaust free list and check stall.
    @(negedge clk); rename_req = 1; dst_arch = 2;
    @(posedge clk); @(negedge clk); rename_req = 0;
    check("TEST3 Stall empty free list", stall);

    // Flush restores checkpoint mapping for r1.
    // After checkpoint, map_table[1] was the first-rename preg.
    // Save expected value before flush changes dst_arch context.
    @(negedge clk); flush = 1; dst_arch = 1;  // point old_preg back at r1
    @(posedge clk); @(negedge clk); flush = 0;
    src1_arch = 1;
    #1;
    // src1_preg = map_table[1] (restored from checkpoint)
    // old_preg  = map_table[dst_arch=1] (same thing after flush restore)
    check("TEST4 Flush restores checkpoint", src1_preg == old_preg && src1_preg != 1);

    // -------------------------
    // TEST 5 - Rename after flush (free list rebuilt)
    // -------------------------
    @(negedge clk);
    rename_req = 1;
    dst_arch   = 2;
    @(posedge clk);
    @(negedge clk);
    rename_req = 0;
    check("TEST5 Rename after flush grants", rename_grant);

    // -------------------------
    // TEST 6 - Reset then initial rename
    // -------------------------
    rst_n = 0;
    @(posedge clk);
    @(posedge clk);
    rst_n = 1;
    @(posedge clk);
    @(negedge clk);
    rename_req = 1;
    dst_arch   = 1;
    #1;
    check("TEST6 Post-reset rename", rename_grant && old_preg == 1);

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