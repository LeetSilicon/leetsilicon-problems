module tb;

  logic       clk;
  logic       rst_n, req_valid, hit, refill;
  logic [5:0] req_set;
  logic [1:0] hit_way, refill_way, victim_way;
  logic [3:0] way_valid;

  int pass = 0, fail = 0;

  initial clk = 0;
  always #5 clk = ~clk;

  cache_lfu #(.NUM_SETS(64), .N_WAYS(4), .CNT_W(2)) dut (.*);

  task automatic do_refill(input logic [1:0] way);
    refill     = 1;
    hit        = 0;
    refill_way = way;
    @(posedge clk);
    @(negedge clk);
    refill = 0;
  endtask

  task automatic do_hit(input logic [1:0] way);
    hit     = 1;
    refill  = 0;
    hit_way = way;
    @(posedge clk);
    @(negedge clk);
    hit = 0;
  endtask

  task automatic check_victim(string name, int exp);
    #1;
    if (victim_way == 2'(exp)) begin
      pass++;
      $display("PASS: %s", name);
    end else begin
      fail++;
      $display("FAIL: %s expected=%0d got=%0d", name, exp, victim_way);
    end
  endtask

  task automatic check_freq(string name, int way, int exp);
    automatic int idx;
    #1;
    idx = req_set * 4 + way;
    if (dut.freq[idx] == 2'(exp)) begin
      pass++;
      $display("PASS: %s", name);
    end else begin
      fail++;
      $display("FAIL: %s way%0d exp=%0d got=%0d", name, way, exp, dut.freq[idx]);
    end
  endtask

  task automatic reset_dut();
    rst_n     = 0;
    req_valid = 0;
    hit       = 0;
    refill    = 0;
    req_set   = 0;
    way_valid = 0;
    @(posedge clk);
    @(posedge clk);
    rst_n = 1;
    @(posedge clk);
  endtask

  initial begin
    reset_dut();
    req_valid = 1;

    // -------------------------
    // TEST 1 - Cold / all invalid: lowest way for alloc
    // -------------------------
    @(negedge clk);
    req_set   = 0;
    way_valid = 4'b0000;
    @(posedge clk);
    check_victim("TEST1 Cold all-invalid victim", 0);

    // -------------------------
    // TEST 2 - Counter saturation (2-bit max = 3)
    // -------------------------
    do_refill(0);
    way_valid[0] = 1;
    do_refill(1);
    way_valid[1] = 1;
    do_refill(2);
    way_valid[2] = 1;
    do_refill(3);
    way_valid[3] = 1;
    do_hit(0);
    do_hit(0);
    do_hit(0);
    @(negedge clk);
    check_freq("TEST2 Counter saturation at max", 0, 3);

    // -------------------------
    // TEST 3 - LFU eviction (lowest freq, lowest way on tie)
    // -------------------------
    do_hit(1);
    @(negedge clk);
    check_victim("TEST3 LFU picks min freq way2", 2);

    // -------------------------
    // TEST 4 - Invalid way priority over LFU
    // -------------------------
    @(negedge clk);
    way_valid = 4'b1110;
    @(posedge clk);
    check_victim("TEST4 Invalid way0 priority", 0);

    // -------------------------
    // TEST 5 - Tie-break: equal minimum frequency -> lowest index
    // -------------------------
    reset_dut();
    req_valid = 1;
    req_set   = 0;
    way_valid = 4'b0000;
    do_refill(0);
    way_valid[0] = 1;
    do_refill(1);
    way_valid[1] = 1;
    do_refill(2);
    way_valid[2] = 1;
    do_refill(3);
    way_valid[3] = 1;
    @(negedge clk);
    check_victim("TEST5 Tie all freq=1 lowest way0", 0);

    // -------------------------
    // TEST 6 - Multi-set independence
    // -------------------------
    @(negedge clk);
    req_set   = 1;
    way_valid = 4'b0000;
    @(posedge clk);
    check_victim("TEST6 Set1 cold victim independent", 0);

    req_valid = 0;

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
