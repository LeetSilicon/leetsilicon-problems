module tb;
  logic       clk;
  logic       rst_n, access_valid;
  logic [5:0] access_set;
  logic [1:0] access_way, victim_way;
  int         p = 0, f = 0;

  // Clock generation
  initial clk = 0;
  always #5 clk = ~clk;
  // DUT instantiation
  cache_plru #(.NUM_SETS(64), .N_WAYS(4)) dut (.*);

  initial begin
    // Reset sequence
    rst_n        = 0;
    access_valid = 0;
    access_set   = 0;
    @(posedge clk);
    @(posedge clk);
    rst_n = 1;

    // Reset state should deterministically pick way 0.
    @(negedge clk);
    if (victim_way == 0 && dut.tree[0] == 3'b000) begin
      p++;
      $display("PASS: reset victim way0");
    end else begin
      f++;
      $display("FAIL: reset victim=%0d tree=%b", victim_way, dut.tree[0]);
    end

    // Access way 0 and verify tree flips
    @(negedge clk); access_valid = 1; access_way = 0;
    @(posedge clk); @(negedge clk); access_valid = 0;
    @(posedge clk); @(negedge clk);
    if (victim_way == 2 && dut.tree[0] == 3'b011) begin
      p++;
      $display("PASS: access way0 updates victim to way2");
    end else begin
      f++;
      $display("FAIL: after way0 victim=%0d tree=%b", victim_way, dut.tree[0]);
    end

    // Access way 3 and verify
    @(negedge clk); access_valid = 1; access_way = 3;
    @(posedge clk); @(negedge clk); access_valid = 0;
    @(posedge clk); @(negedge clk);
    if (victim_way == 1 && dut.tree[0] == 3'b010) begin
      p++;
      $display("PASS: access way3 updates victim to way1");
    end else begin
      f++;
      $display("FAIL: after way3 victim=%0d tree=%b", victim_way, dut.tree[0]);
    end

    // Access all 4 ways in sequence and verify rotation
    @(negedge clk); access_valid = 1; access_way = 1;
    @(posedge clk); @(negedge clk); access_valid = 0;
    @(posedge clk); @(negedge clk);
    if (victim_way != 1) begin
      p++;
      $display("PASS: after way1 access victim=%0d (not 1)", victim_way);
    end else begin
      f++;
      $display("FAIL: victim should not be 1");
    end

    @(posedge clk);

    // Summary
    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule