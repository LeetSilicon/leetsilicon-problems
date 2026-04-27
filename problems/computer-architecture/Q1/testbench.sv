module tb;

  logic clk;
  logic rst_n, req_valid, hit, refill;
  logic [5:0] req_set;
  logic [1:0] hit_way, refill_way, victim_way;
  logic [3:0] way_valid;
  logic victim_valid;

  int pass = 0, fail = 0;

  cache_lru4 dut (.*);

  initial clk = 0;
  always #5 clk = ~clk;

  task check(string name, int expected);
    if (victim_way == expected) begin
      pass++;
      $display("PASS: %s", name);
    end else begin
      fail++;
      $display("FAIL: %s expected=%0d got=%0d", name, expected, victim_way);
    end
  endtask

  task reset_dut();
    rst_n = 0;
    req_valid = 0;
    hit = 0;
    refill = 0;
    way_valid = 0;
    req_set = 0;

    @(posedge clk);
    @(posedge clk);
    rst_n = 1;
  endtask

  initial begin
    reset_dut();

    // -------------------------
    // TEST 1 - Cold Miss
    // -------------------------
    @(negedge clk);
    req_valid = 1;
    way_valid = 4'b0000;

    @(posedge clk);
    check("TEST1 Cold Miss", 0);
    req_valid = 0;

    // -------------------------
    // TEST 2 - LRU Update on Hit
    // -------------------------
    @(negedge clk);
    way_valid = 4'b0001; refill = 1; refill_way = 0;
    @(posedge clk);
    way_valid = 4'b0011; refill_way = 1;
    @(posedge clk);
    way_valid = 4'b0111; refill_way = 2;
    @(posedge clk);
    way_valid = 4'b1111; refill_way = 3;
    refill = 0;

    @(negedge clk);
    hit = 1; hit_way = 1;
    @(posedge clk);
    hit = 0;

    @(negedge clk);
    req_valid = 1; way_valid = 4'b1111;

    @(posedge clk);
    check("TEST2 LRU eviction after hit", 0);
    req_valid = 0;

    // -------------------------
    // TEST 3 - Write Hit Updates
    // -------------------------
    @(negedge clk);
    hit = 1; hit_way = 2;
    way_valid = 4'b1111;

    @(posedge clk);
    hit = 0;

    req_valid = 1;
    @(posedge clk);
    check("TEST3 Write hit MRU update", 0);
    req_valid = 0;

    // -------------------------
    // TEST 4 - Invalid Way Priority
    // -------------------------
    @(negedge clk);
    req_valid = 1;
    way_valid = 4'b0111; // way0 invalid

    @(posedge clk);

    check("TEST4 Invalid priority", 0);

    req_valid = 0;

    // -------------------------
    // TEST 5 - Repeated Hit Stability
    // -------------------------
    @(negedge clk);
    way_valid = 4'b1111;

    hit = 1; hit_way = 3;
    @(posedge clk);
    hit = 0;

    req_valid = 1;
    @(posedge clk);
    check("TEST5 Repeated hit stability", 0);
    req_valid = 0;

    // -------------------------
    // TEST 6 - Multi-Set Independence
    // -------------------------
    @(negedge clk);
    req_set = 1;
    way_valid = 4'b0000;
    req_valid = 1;

    @(posedge clk);
    check("TEST6 Multi-set independence", 0);
    req_valid = 0;

    // -------------------------
    // REPORT
    // -------------------------
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
