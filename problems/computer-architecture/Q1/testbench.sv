module tb;
  logic        clk;
  logic        rst_n, req_valid, hit, refill;
  logic [5:0]  req_set;
  logic [1:0]  hit_way, refill_way, victim_way;
  logic [3:0]  way_valid;
  logic        victim_valid;
  int          p = 0, f = 0;

  initial clk = 0;
  always #5 clk = ~clk;
  cache_lru4 #(.NUM_SETS(64)) dut (.*);
  initial begin #100_000; $display("FATAL: timeout"); $fatal; end

  initial begin
    rst_n=0; req_valid=0; hit=0; refill=0; way_valid=0; req_set=0;
    hit_way=0; refill_way=0;
    @(posedge clk); @(posedge clk); rst_n=1;
    @(posedge clk); @(negedge clk);

    // Cold miss — no valid ways
    req_valid=1; req_set=0; way_valid=4'b0000;
    @(posedge clk); @(negedge clk);
    if (victim_way == 0) begin p++; $display("PASS: cold miss way0"); end
    else begin f++; $display("FAIL: cold miss got %0d", victim_way); end

    // Fill 4 ways: drive refill_way at negedge, posedge latches it
    @(negedge clk); refill=1; refill_way=0;
    @(posedge clk); @(negedge clk); way_valid=4'b0001;
    refill_way=1;
    @(posedge clk); @(negedge clk); way_valid=4'b0011;
    refill_way=2;
    @(posedge clk); @(negedge clk); way_valid=4'b0111;
    refill_way=3;
    @(posedge clk); @(negedge clk); way_valid=4'b1111;
    refill=0;

    @(posedge clk); @(negedge clk);
    if (victim_way == 0) begin p++; $display("PASS: LRU=way0 after fill"); end
    else begin f++; $display("FAIL: expected way0 got %0d", victim_way); end

    // Hit way 0 → way 1 becomes LRU
    @(negedge clk); hit=1; hit_way=0;
    @(posedge clk); @(negedge clk); hit=0;
    @(posedge clk); @(negedge clk);
    if (victim_way == 1) begin p++; $display("PASS: LRU=way1 after hit0"); end
    else begin f++; $display("FAIL: expected way1 got %0d", victim_way); end

    // Hit way 1 → way 2 becomes LRU
    @(negedge clk); hit=1; hit_way=1;
    @(posedge clk); @(negedge clk); hit=0;
    @(posedge clk); @(negedge clk);
    if (victim_way == 2) begin p++; $display("PASS: LRU=way2 after hit1"); end
    else begin f++; $display("FAIL: expected way2 got %0d", victim_way); end

    // Independent set test
    req_set=1; way_valid=4'b0000;
    @(posedge clk); @(negedge clk);
    if (victim_way == 0) begin p++; $display("PASS: set1 independent"); end
    else begin f++; $display("FAIL: set1 got %0d", victim_way); end

    req_valid=0; @(posedge clk);
    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule