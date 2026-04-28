module tb;

  logic        clk;
  logic        rst_n, start, busy, done;
  logic [15:0] a, b;
  logic [31:0] product;

  int pass = 0, fail = 0;

  initial clk = 0;
  always #5 clk = ~clk;

  multiplier #(.W(16)) dut (.*);

  initial begin #500_000; $display("FATAL: timeout"); $fatal; end

  task automatic run_mult(string name, logic [15:0] aa, logic [15:0] bb, logic [31:0] exp);
    @(negedge clk);
    a     = aa;
    b     = bb;
    start = 1;
    @(posedge clk);
    @(negedge clk);
    start = 0;
    if (!busy) begin
      fail++;
      $display("FAIL: %s busy not asserted", name);
      return;
    end
    wait (done);
    @(negedge clk);
    if (product === exp) begin
      pass++;
      $display("PASS: %s", name);
    end else begin
      fail++;
      $display("FAIL: %s got=%0d", name, product);
    end
  endtask

  initial begin
    rst_n = 0;
    start = 0;
    @(posedge clk);
    @(posedge clk);
    rst_n = 1;
    @(posedge clk);

    // -------------------------
    // TEST 1 - Simple multiply
    // -------------------------
    run_mult("TEST1 7*6", 16'd7, 16'd6, 32'd42);

    // -------------------------
    // TEST 2 - Zero operand
    // -------------------------
    run_mult("TEST2 0*99", 16'd0, 16'd99, 32'd0);

    // -------------------------
    // TEST 3 - Max product
    // -------------------------
    run_mult("TEST3 255*255", 16'd255, 16'd255, 32'd65025);

    // -------------------------
    // TEST 4 - Back-to-back first
    // -------------------------
    run_mult("TEST4 5*4", 16'd5, 16'd4, 32'd20);

    // -------------------------
    // TEST 5 - Back-to-back second
    // -------------------------
    run_mult("TEST5 6*3", 16'd6, 16'd3, 32'd18);

    // -------------------------
    // TEST 6 - After reset still correct
    // -------------------------
    @(negedge clk);
    rst_n = 0;
    @(posedge clk);
    @(posedge clk);
    rst_n = 1;
    @(posedge clk);
    run_mult("TEST6 post-reset 11*2", 16'd11, 16'd2, 32'd22);

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
