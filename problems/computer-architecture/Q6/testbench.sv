module tb;

  logic       clk;
  logic       rst_n, miss, mem_rvalid, mem_rlast;
  logic       mem_req, stall, refill_done;
  logic [1:0] beat_count;

  int pass = 0, fail = 0;

  initial clk = 0;
  always #5 clk = ~clk;

  cache_refill_fsm #(.LINE_WORDS(4)) dut (.*);

  initial begin #100_000; $display("FATAL: timeout"); $fatal; end

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
    rst_n = 0;
    miss = 0;
    mem_rvalid = 0;
    mem_rlast = 0;
    @(posedge clk);
    @(posedge clk);
    rst_n = 1;
    @(posedge clk);
    @(negedge clk);

    // -------------------------
    // TEST 1 - Miss asserts mem_req and stall
    // -------------------------
    @(negedge clk);
    miss = 1;
    @(posedge clk);
    @(negedge clk);
    miss = 0;
    check("TEST1 Miss mem_req stall", stall && mem_req);

    // -------------------------
    // TEST 2 - WAIT holds stall clears mem_req
    // -------------------------
    @(posedge clk);
    @(negedge clk);
    check("TEST2 WAIT no mem_req", stall && !mem_req);

    // -------------------------
    // TEST 3 - First data beat beat_count
    // -------------------------
    @(negedge clk);
    mem_rvalid = 1;
    mem_rlast = 0;
    @(posedge clk);
    @(negedge clk);
    check("TEST3 First beat bc0", beat_count == 0);

    // -------------------------
    // TEST 4 - Mid fill beat_count
    // -------------------------
    @(posedge clk);
    @(negedge clk);
    check("TEST4 Second beat bc1", beat_count == 1);

    // -------------------------
    // TEST 5 - Last beat completes refill
    // -------------------------
    @(negedge clk);
    mem_rlast = 1;
    @(posedge clk);
    @(negedge clk);
    check("TEST5 Last beat done", (beat_count == 3) && refill_done);

    // -------------------------
    // TEST 6 - After first refill completes, second miss issues mem_req again
    // -------------------------
    @(negedge clk);
    mem_rvalid = 0;
    mem_rlast = 0;
    @(posedge clk);
    @(negedge clk);
    @(posedge clk);
    @(negedge clk);
    @(negedge clk);
    miss = 1;
    @(posedge clk);
    @(negedge clk);
    miss = 0;
    check("TEST6 Second miss mem_req", stall && mem_req);

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
