module tb;

  logic        clk;
  logic        rst_n, write_hit, refill_done, write_alloc_fill, evict_valid, wb_done;
  logic        evict_dirty, writeback_req;
  logic [5:0]  hit_set, refill_set, evict_set;
  logic [1:0]  hit_way, refill_way, evict_way;
  logic [19:0] evict_tag;
  logic [25:0] writeback_addr;

  int pass = 0, fail = 0;

  initial clk = 0;
  always #5 clk = ~clk;

  cache_dirty #(.NUM_SETS(64), .N_WAYS(4), .TAG_W(20)) dut (.*);

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
    rst_n            = 0;
    write_hit        = 0;
    refill_done      = 0;
    write_alloc_fill = 0;
    evict_valid      = 0;
    wb_done          = 0;
    hit_set = 0;
    refill_set = 0;
    evict_set = 0;
    hit_way = 0;
    refill_way = 0;
    evict_way = 0;
    evict_tag = 0;
    @(posedge clk);
    @(posedge clk);
    rst_n = 1;
    @(posedge clk);
    @(negedge clk);

    // -------------------------
    // TEST 1 - Write hit sets dirty; eviction requests writeback
    // -------------------------
    @(negedge clk);
    refill_set = 0;
    refill_way = 1;
    refill_done = 1;
    write_alloc_fill = 0;
    @(posedge clk);
    @(negedge clk);
    refill_done = 0;
    @(negedge clk);
    hit_set = 0;
    hit_way = 1;
    write_hit = 1;
    @(posedge clk);
    @(negedge clk);
    write_hit = 0;
    evict_set = 0;
    evict_way = 1;
    evict_tag = 20'h10000;
    evict_valid = 1;
    @(posedge clk);
    @(negedge clk);
    check("TEST1 Write hit dirty eviction wb", evict_dirty && writeback_req && (writeback_addr == {20'h10000, 6'd0}));
    @(negedge clk);
    wb_done = 1;
    @(posedge clk);
    @(negedge clk);
    wb_done = 0;
    evict_valid = 0;

    // -------------------------
    // TEST 2 - Clean eviction (read refill only)
    // -------------------------
    @(negedge clk);
    refill_set = 0;
    refill_way = 2;
    refill_done = 1;
    write_alloc_fill = 0;
    @(posedge clk);
    @(negedge clk);
    refill_done = 0;
    evict_set = 0;
    evict_way = 2;
    evict_valid = 1;
    @(posedge clk);
    @(negedge clk);
    check("TEST2 Clean eviction no wb", !evict_dirty && !writeback_req);
    evict_valid = 0;

    // -------------------------
    // TEST 3 - Writeback address tag + set index
    // -------------------------
    @(negedge clk);
    refill_set = 6'd7;
    refill_way = 2;
    refill_done = 1;
    write_alloc_fill = 0;
    @(posedge clk);
    @(negedge clk);
    refill_done = 0;
    hit_set = 6'd7;
    hit_way = 2;
    write_hit = 1;
    @(posedge clk);
    @(negedge clk);
    write_hit = 0;
    evict_set = 6'd7;
    evict_way = 2;
    evict_tag = 20'hABCDE;
    evict_valid = 1;
    @(posedge clk);
    @(negedge clk);
    check("TEST3 Wb addr tag index", writeback_req && (writeback_addr == {20'hABCDE, 6'd7}));
    @(negedge clk);
    wb_done = 1;
    @(posedge clk);
    @(negedge clk);
    wb_done = 0;
    evict_valid = 0;

    // -------------------------
    // TEST 4 - wb_done clears dirty for victim line
    // -------------------------
    @(negedge clk);
    hit_set = 0;
    hit_way = 3;
    write_hit = 1;
    @(posedge clk);
    @(negedge clk);
    write_hit = 0;
    evict_set = 0;
    evict_way = 3;
    evict_valid = 1;
    @(posedge clk);
    @(negedge clk);
    check("TEST4a Line dirty before wb", evict_dirty);
    @(negedge clk);
    wb_done = 1;
    @(posedge clk);
    @(negedge clk);
    wb_done = 0;
    @(posedge clk);
    @(negedge clk);
    check("TEST4b After wb_done not dirty", !evict_dirty);
    evict_valid = 0;

    // -------------------------
    // TEST 5 - Write-allocate refill marks line dirty
    // -------------------------
    @(negedge clk);
    refill_set = 0;
    refill_way = 0;
    write_alloc_fill = 1;
    refill_done = 1;
    @(posedge clk);
    @(negedge clk);
    refill_done = 0;
    write_alloc_fill = 0;
    evict_set = 0;
    evict_way = 0;
    evict_valid = 1;
    @(posedge clk);
    @(negedge clk);
    check("TEST5 Write-alloc dirty", evict_dirty && writeback_req);
    @(negedge clk);
    wb_done = 1;
    @(posedge clk);
    @(negedge clk);
    wb_done = 0;
    evict_valid = 0;

    // -------------------------
    // TEST 6 - Reset clears all dirty bits
    // -------------------------
    @(negedge clk);
    hit_set = 0;
    hit_way = 1;
    write_hit = 1;
    @(posedge clk);
    @(negedge clk);
    write_hit = 0;
    @(posedge clk);
    @(negedge clk);
    rst_n = 0;
    @(posedge clk);
    @(posedge clk);
    rst_n = 1;
    @(posedge clk);
    @(negedge clk);
    evict_set = 0;
    evict_way = 1;
    evict_valid = 1;
    @(posedge clk);
    @(negedge clk);
    check("TEST6 Reset clears dirty", !evict_dirty && !writeback_req);
    evict_valid = 0;

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
