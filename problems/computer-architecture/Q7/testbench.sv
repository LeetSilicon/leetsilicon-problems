module tb;

  logic        clk;
  logic        rst_n, alloc_req, refill_done;
  logic        full, hit, issue_mem_req;
  logic [31:0] alloc_addr;
  logic [1:0]  requester_id, alloc_entry, refill_entry, hit_entry;
  logic [3:0]  merged_waiters;

  int pass = 0, fail = 0;

  initial clk = 0;
  always #5 clk = ~clk;

  mshr #(.ENTRIES(4), .ADDR_W(32), .REQS(4), .OFFSET_W(4)) dut (.*);

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
    rst_n          = 0;
    alloc_req      = 0;
    refill_done    = 0;
    requester_id   = 0;
    alloc_addr     = 0;
    refill_entry   = 0;
    @(posedge clk);
    @(posedge clk);
    rst_n = 1;
    @(posedge clk);
    @(negedge clk);

    // -------------------------
    // TEST 1 - New miss issues memory request
    // -------------------------
    @(negedge clk);
    alloc_req    = 1;
    alloc_addr   = 32'hDEAD_BEF0;
    requester_id = 0;
    #1;
    check("TEST1 New miss allocates", issue_mem_req && !hit);
    @(posedge clk);
    @(negedge clk);
    alloc_req = 0;

    // -------------------------
    // TEST 2 - Same line merge hit
    // -------------------------
    @(negedge clk);
    alloc_addr   = 32'hDEAD_BEF8;
    requester_id = 1;
    alloc_req    = 1;
    #1;
    check("TEST2 Same-line merge hit", hit);
    @(posedge clk);
    @(negedge clk);
    alloc_req    = 0;
    refill_entry = hit_entry;
    @(posedge clk);
    @(negedge clk);

    // -------------------------
    // TEST 3 - Waiter mask merged
    // -------------------------
    check("TEST3 Waiter mask merged", merged_waiters[1:0] == 2'b11);

    // -------------------------
    // TEST 4 - Refill frees entry
    // -------------------------
    @(negedge clk);
    refill_done = 1;
    @(posedge clk);
    @(negedge clk);
    refill_done = 0;
    @(posedge clk);
    @(negedge clk);
    check("TEST4 Entry freed on refill", !dut.valid_vec[refill_entry]);

    // -------------------------
    // TEST 5 - MSHR full backpressure
    // -------------------------
    @(negedge clk);
    alloc_req = 1;
    alloc_addr = 32'h0000_1000;
    requester_id = 0;
    @(posedge clk);
    @(negedge clk);
    alloc_addr = 32'h0000_2000;
    @(posedge clk);
    @(negedge clk);
    alloc_addr = 32'h0000_3000;
    @(posedge clk);
    @(negedge clk);
    alloc_addr = 32'h0000_4000;
    @(posedge clk);
    @(negedge clk);
    alloc_addr = 32'h0000_5000;
    @(posedge clk);
    @(negedge clk);
    check("TEST5 MSHR full backpressure", full && !issue_mem_req);
    alloc_req = 0;

    // -------------------------
    // TEST 6 - Reset clears all entries
    // -------------------------
    @(negedge clk);
    rst_n = 0;
    @(posedge clk);
    @(posedge clk);
    rst_n = 1;
    @(posedge clk);
    @(negedge clk);
    check("TEST6 Reset clears full", (dut.valid_vec == 4'b0000) && !full);

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
