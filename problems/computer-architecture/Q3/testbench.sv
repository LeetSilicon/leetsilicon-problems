module tb;
  logic       clk;
  logic       rst_n, req_valid, hit, refill;
  logic [5:0] req_set;
  logic [1:0] hit_way, refill_way, victim_way;
  logic [3:0] way_valid;
  int         p = 0, f = 0;

  initial clk = 0;

  always #5 clk = ~clk;
  cache_lfu #(.NUM_SETS(64), .N_WAYS(4), .CNT_W(2)) dut (.*);

  // Hold req_valid=1 throughout test, toggle hit/refill
  task automatic do_refill(input logic [1:0] way);
    refill     = 1;
    hit        = 0;
    refill_way = way;
    @(posedge clk);
    @(negedge clk);
    refill     = 0;
  endtask

  task automatic do_hit(input logic [1:0] way);
    hit     = 1;
    refill  = 0;
    hit_way = way;
    @(posedge clk);
    @(negedge clk);
    hit     = 0;
  endtask

  initial begin
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

    req_valid = 1;

    // Fill all ways with initial frequency=1.
    do_refill(0); way_valid[0] = 1;
    do_refill(1); way_valid[1] = 1;
    do_refill(2); way_valid[2] = 1;
    do_refill(3); way_valid[3] = 1;

    // Raise freq of way0 to saturation (2-bit counter => max 3).
    do_hit(0);
    do_hit(0);
    do_hit(0);
    @(negedge clk);
    if (dut.freq[0] == 2'b11) begin
      p++;
      $display("PASS: saturation");
    end else begin
      f++;
      $display("FAIL: saturation freq=%0d", dut.freq[0]);
    end

    // Boost way1 once more so way2/way3 remain LFU; tie-break => way2.
    do_hit(1);
    @(negedge clk);
    if (victim_way == 2) begin
      p++;
      $display("PASS: LFU victim way2");
    end else begin
      f++;
      $display("FAIL: victim=%0d", victim_way);
    end

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule