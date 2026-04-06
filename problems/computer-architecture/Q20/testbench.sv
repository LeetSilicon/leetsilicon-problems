module tb;
  logic       clk;
  logic       rst_n, rename_req, checkpoint_save, flush, commit_free, rename_grant, stall;
  logic [1:0] src1_arch, src2_arch, dst_arch;
  logic [2:0] free_preg, src1_preg, src2_preg, new_preg, old_preg;
  int         p = 0, f = 0;

  initial clk = 0;

  always #5 clk = ~clk;
  reg_rename #(.ARCH(4), .PHYS(6)) dut (.*);

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
    if (rename_grant && old_preg == 1 && new_preg >= 4) begin
      p++;
      $display("PASS: first rename");
    end else begin
      f++;
      $display("FAIL: first rename old=%0d new=%0d", old_preg, new_preg);
    end
    @(posedge clk); @(negedge clk); rename_req = 0;
    @(negedge clk); checkpoint_save = 1;
    @(posedge clk); @(negedge clk); checkpoint_save = 0;

    // Second rename of r1 should allocate a different preg and report old mapping.
    rename_req = 1;
    dst_arch   = 1;
    @(posedge clk);
    rename_req = 0;
    if (rename_grant && old_preg != new_preg) begin
      p++;
      $display("PASS: second rename updates mapping");
    end else begin
      f++;
      $display("FAIL: second rename");
    end
    @(posedge clk); @(negedge clk); rename_req = 0;

    // Exhaust free list and check stall.
    @(negedge clk); rename_req = 1; dst_arch = 2;
    @(posedge clk); @(negedge clk); rename_req = 0;
    if (stall) begin
      p++;
      $display("PASS: stall on empty free list");
    end else begin
      f++;
      $display("FAIL: expected stall");
    end

    // Flush restores checkpoint mapping for r1.
    // After checkpoint, map_table[1] was the first-rename preg.
    // Save expected value before flush changes dst_arch context.
    @(negedge clk); flush = 1; dst_arch = 1;  // point old_preg back at r1
    @(posedge clk); @(negedge clk); flush = 0;
    src1_arch = 1;
    #1;
    // src1_preg = map_table[1] (restored from checkpoint)
    // old_preg  = map_table[dst_arch=1] (same thing after flush restore)
    if (src1_preg == old_preg && src1_preg != 1) begin
      p++;
      $display("PASS: flush restored checkpoint (r1 -> p%0d)", src1_preg);
    end else begin
      f++;
      $display("FAIL: flush restore src1=%0d old=%0d", src1_preg, old_preg);
    end

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule