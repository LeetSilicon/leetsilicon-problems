module tb;
  logic       clk;
  logic       rst_n, alloc_req, refill_done;
  logic       full, hit, issue_mem_req;
  logic [31:0] alloc_addr;
  logic [1:0] requester_id, alloc_entry, refill_entry, hit_entry;
  logic [3:0] merged_waiters;
  int         p = 0, f = 0;

  initial clk = 0;

  always #5 clk = ~clk;
  mshr #(.ENTRIES(4), .ADDR_W(32), .REQS(4), .OFFSET_W(4)) dut (.*);

  initial begin
    rst_n       = 0;
    alloc_req   = 0;
    refill_done = 0;
    requester_id = 0;
    alloc_addr  = 0;
    refill_entry = 0;
    @(posedge clk);
    @(posedge clk);
    rst_n = 1;
    @(posedge clk); @(negedge clk);  // settle after reset

    // First miss: drive at negedge, check comb before posedge commits
    @(negedge clk);
    alloc_req    = 1;
    alloc_addr   = 32'hDEAD_BEF0;
    requester_id = 0;
    #1;  // let comb settle (valid_vec still 0 from reset)
    if (issue_mem_req && !hit) begin
      p++;
      $display("PASS: new miss allocates");
    end else begin
      f++;
      $display("FAIL: allocate issue=%b hit=%b full=%b", issue_mem_req, hit, full);
    end
    @(posedge clk); @(negedge clk);  // posedge commits allocation
    alloc_req = 0;

    // Same cache line, different byte offset: should merge
    @(negedge clk);
    alloc_addr   = 32'hDEAD_BEF8;
    requester_id = 1;
    alloc_req    = 1;
    #1;  // comb settle: valid_vec[0]=1, line[0] matches → hit=1
    if (hit) begin
      p++;
      $display("PASS: same-line merge hit");
    end else begin
      f++;
      $display("FAIL: merge hit=%b", hit);
    end
    @(posedge clk); @(negedge clk);  // commit merge
    alloc_req    = 0;
    refill_entry = hit_entry;
    @(posedge clk); @(negedge clk);
    if (merged_waiters[1:0] == 2'b11) begin
      p++;
      $display("PASS: waiter mask merged");
    end else begin
      f++;
      $display("FAIL: waiters=%b", merged_waiters);
    end

    // Refill frees the entry.
    @(negedge clk); refill_done = 1;
    @(posedge clk); @(negedge clk); refill_done = 0;
    @(posedge clk); @(negedge clk);
    if (!dut.valid_vec[refill_entry]) begin
      p++;
      $display("PASS: entry freed on refill");
    end else begin
      f++;
      $display("FAIL: entry not freed");
    end

    // Backpressure: fill all 4 entries
    @(negedge clk); alloc_req = 1;
    alloc_addr = 32'h0000_1000; requester_id = 0;
    @(posedge clk); @(negedge clk);
    alloc_addr = 32'h0000_2000;
    @(posedge clk); @(negedge clk);
    alloc_addr = 32'h0000_3000;
    @(posedge clk); @(negedge clk);
    alloc_addr = 32'h0000_4000;
    @(posedge clk); @(negedge clk);
    // 5th line should be blocked
    alloc_addr = 32'h0000_5000;
    @(posedge clk); @(negedge clk);
    if (full && !issue_mem_req) begin
      p++;
      $display("PASS: MSHR full backpressure");
    end else begin
      f++;
      $display("FAIL: backpressure full=%b issue=%b", full, issue_mem_req);
    end
    alloc_req = 0;

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule