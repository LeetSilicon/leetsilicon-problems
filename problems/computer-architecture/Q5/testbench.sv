module tb;
  logic       clk;
  logic       rst_n, write_hit, refill_done, write_alloc_fill, evict_valid, wb_done;
  logic       evict_dirty, writeback_req;
  logic [5:0] hit_set, refill_set, evict_set;
  logic [1:0] hit_way, refill_way, evict_way;
  logic [19:0] evict_tag;
  logic [25:0] writeback_addr;
  int         p = 0, f = 0;

  initial clk = 0;

  always #5 clk = ~clk;
  cache_dirty #(.NUM_SETS(64), .N_WAYS(4), .TAG_W(20)) dut (.*);

  initial begin
    rst_n            = 0;
    write_hit        = 0;
    refill_done      = 0;
    write_alloc_fill = 0;
    evict_valid      = 0;
    wb_done          = 0;
    hit_set = 0; refill_set = 0; evict_set = 0;
    hit_way = 0; refill_way = 0; evict_way = 0;
    evict_tag = 0;
    @(posedge clk);
    @(posedge clk);
    rst_n = 1;
    @(posedge clk); @(negedge clk);

    // Read refill creates a clean line (way 1, set 0).
    @(negedge clk);
    refill_set = 0; refill_way = 1; refill_done = 1; write_alloc_fill = 0;
    @(posedge clk); @(negedge clk);
    refill_done = 0;
    // Check: evicting this clean line should NOT generate writeback
    evict_set = 0; evict_way = 1; evict_valid = 1;
    @(posedge clk); @(negedge clk);
    if (!writeback_req) begin p++; $display("PASS: clean eviction no writeback"); end
    else begin f++; $display("FAIL: unexpected writeback"); end
    evict_valid = 0;

    // Write hit marks dirty, then eviction requests writeback.
    @(negedge clk);
    hit_set = 0; hit_way = 1; write_hit = 1;
    @(posedge clk); @(negedge clk);
    write_hit = 0;
    // Now check dirty status
    evict_set = 0; evict_way = 1; evict_tag = 20'hABCDE; evict_valid = 1;
    @(posedge clk); @(negedge clk);
    if (evict_dirty && writeback_req && writeback_addr == {20'hABCDE, 6'd0}) begin
      p++;
      $display("PASS: dirty eviction writeback");
    end else begin
      f++;
      $display("FAIL: dirty eviction d=%b wb=%b addr=%h", evict_dirty, writeback_req, writeback_addr);
    end

    // Ack clears dirty bit.
    @(negedge clk);
    wb_done = 1;
    @(posedge clk); @(negedge clk);
    wb_done = 0;
    @(posedge clk); @(negedge clk);
    if (!evict_dirty) begin p++; $display("PASS: dirty cleared after writeback"); end
    else begin f++; $display("FAIL: dirty not cleared"); end
    evict_valid = 0;

    // Write-allocate fill: should be dirty immediately
    @(negedge clk);
    refill_set = 0; refill_way = 2; write_alloc_fill = 1; refill_done = 1;
    @(posedge clk); @(negedge clk);
    refill_done = 0; write_alloc_fill = 0;
    evict_set = 0; evict_way = 2; evict_valid = 1;
    @(posedge clk); @(negedge clk);
    if (evict_dirty && writeback_req) begin
      p++;
      $display("PASS: write-alloc fill is dirty");
    end else begin
      f++;
      $display("FAIL: write-alloc dirty=%b wb_req=%b", evict_dirty, writeback_req);
    end
    evict_valid = 0;

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule