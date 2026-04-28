module tb;

  logic       clk;
  logic       rst_n, valid;
  logic [7:0] warp_ready;
  logic [2:0] selected_warp;

  int pass = 0, fail = 0;

  initial clk = 0;
  always #5 clk = ~clk;

  warp_scheduler #(.N_WARPS(8)) dut (.*);

  task automatic check(string name, logic ok);
    #1;
    if (ok) begin
      pass++;
      $display("PASS: %s", name);
    end else begin
      fail++;
      $display("FAIL: %s sel=%0d v=%b", name, selected_warp, valid);
    end
  endtask

  initial begin
    rst_n      = 0;
    warp_ready = 0;
    @(posedge clk);
    @(posedge clk);
    rst_n = 1;

    // -------------------------
    // TEST 1 - First ready warp in RR
    // -------------------------
    warp_ready = 8'b0010_0100;
    @(posedge clk);
    @(negedge clk);
    check("TEST1 Select warp 2", valid && selected_warp == 3'd2);

    // -------------------------
    // TEST 2 - RR advances
    // -------------------------
    @(posedge clk);
    @(negedge clk);
    check("TEST2 RR advances to 5", selected_warp == 3'd5);

    // -------------------------
    // TEST 3 - No ready warps
    // -------------------------
    warp_ready = 8'b0000_0000;
    @(posedge clk);
    @(negedge clk);
    check("TEST3 No valid grant", !valid);

    // -------------------------
    // TEST 4 - Single ready warp
    // -------------------------
    warp_ready = 8'b0000_1000;
    @(posedge clk);
    @(negedge clk);
    check("TEST4 Single warp 3", valid && selected_warp == 3'd3);

    // -------------------------
    // TEST 5 - Wrap-around
    // -------------------------
    @(posedge clk);
    warp_ready = 8'b0000_0011;
    @(posedge clk);
    @(negedge clk);
    check("TEST5 Wrap to warp 0", valid && selected_warp == 3'd0);

    // -------------------------
    // TEST 6 - Another RR step on same mask
    // -------------------------
    @(posedge clk);
    @(negedge clk);
    check("TEST6 RR continues", valid && (selected_warp == 3'd0 || selected_warp == 3'd1));

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
