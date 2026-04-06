module tb;
  logic       clk;
  logic       rst_n, miss, mem_rvalid, mem_rlast;
  logic       mem_req, stall, refill_done;
  logic [1:0] beat_count;
  int         p = 0, f = 0;

  initial clk = 0;
  always #5 clk = ~clk;
  cache_refill_fsm #(.LINE_WORDS(4)) dut (.*);
  initial begin #100_000; $display("FATAL: timeout"); $fatal; end

  initial begin
    rst_n=0; miss=0; mem_rvalid=0; mem_rlast=0;
    @(posedge clk); @(posedge clk); rst_n=1;
    @(posedge clk); @(negedge clk);

    // Drive miss at negedge, stable through posedge
    @(negedge clk); miss = 1;
    @(posedge clk); @(negedge clk); miss = 0;
    // Now in REQUEST state: mem_req=1 (registered from IDLE transition)
    if (stall && mem_req) begin p++; $display("PASS: mem_req asserted"); end
    else begin f++; $display("FAIL: mem_req stall=%b mr=%b", stall, mem_req); end

    @(posedge clk); @(negedge clk);
    // Now in WAIT state
    if (stall && !mem_req) begin p++; $display("PASS: WAIT state"); end
    else begin f++; $display("FAIL: WAIT stall=%b mr=%b", stall, mem_req); end

    // Drive 4 beats of data: hold mem_rvalid=1 continuously
    @(negedge clk); mem_rvalid = 1; mem_rlast = 0;
    @(posedge clk); @(negedge clk);  // WAIT → FILL, bc<=0
    if (beat_count == 0) begin p++; $display("PASS: beat0 bc=0"); end
    else begin f++; $display("FAIL: beat0 bc=%0d", beat_count); end

    @(posedge clk); @(negedge clk);  // FILL: bc<=1
    if (beat_count == 1) begin p++; $display("PASS: beat1 bc=1"); end
    else begin f++; $display("FAIL: beat1 bc=%0d", beat_count); end

    @(negedge clk); mem_rlast = 1;
    @(posedge clk); @(negedge clk);  // FILL: last beat, bc<=3, refill_done<=1
    if (beat_count == 3 && refill_done) begin p++; $display("PASS: last beat bc=3 done=1"); end
    else begin f++; $display("FAIL: last bc=%0d done=%b", beat_count, refill_done); end

    @(negedge clk); mem_rvalid = 0; mem_rlast = 0;
    @(posedge clk); @(negedge clk);  // COMPLETE → IDLE
    if (!stall && !refill_done) begin p++; $display("PASS: back to IDLE"); end
    else begin f++; $display("FAIL: not IDLE stall=%b done=%b", stall, refill_done); end

    // Reset mid-refill
    @(negedge clk); miss = 1;
    @(posedge clk); @(negedge clk); miss = 0;  // REQUEST
    @(posedge clk); @(negedge clk);            // WAIT
    @(negedge clk); mem_rvalid = 1;
    @(posedge clk); @(negedge clk);            // FILL
    rst_n = 0;
    @(posedge clk); @(posedge clk);
    rst_n = 1; mem_rvalid = 0;
    @(posedge clk); @(negedge clk);
    if (!stall) begin p++; $display("PASS: reset mid-refill"); end
    else begin f++; $display("FAIL: reset mid-refill"); end

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule