module tb;

  logic        clk;
  logic        rst_n, stall, flush;
  logic [63:0] d, q;

  int pass = 0, fail = 0;

  initial clk = 0;
  always #5 clk = ~clk;

  pipe_reg #(.W(64)) dut (.*);

  task automatic check(string name, logic [63:0] exp);
    @(negedge clk);
    if (q === exp) begin
      pass++;
      $display("PASS: %s", name);
    end else begin
      fail++;
      $display("FAIL: %s exp=%h got=%h", name, exp, q);
    end
  endtask

  initial begin
    rst_n  = 0;
    stall  = 0;
    flush  = 0;
    d      = 0;
    @(posedge clk);
    @(posedge clk);
    rst_n = 1;

    // -------------------------
    // TEST 1 - Normal load
    // -------------------------
    d = 64'hCAFE;
    @(posedge clk);
    check("TEST1 Normal load", 64'hCAFE);

    // -------------------------
    // TEST 2 - Stall holds
    // -------------------------
    stall = 1;
    d     = 64'hDEAD;
    @(posedge clk);
    check("TEST2 Stall holds", 64'hCAFE);

    // -------------------------
    // TEST 3 - Unstall propagates
    // -------------------------
    stall = 0;
    @(posedge clk);
    check("TEST3 Unstall propagate", 64'hDEAD);

    // -------------------------
    // TEST 4 - Flush clears
    // -------------------------
    flush = 1;
    @(posedge clk);
    check("TEST4 Flush zero", 64'h0);
    flush = 0;

    // -------------------------
    // TEST 5 - Reload after flush
    // -------------------------
    d = 64'hBEEF;
    @(posedge clk);
    check("TEST5 Reload after flush", 64'hBEEF);

    // -------------------------
    // TEST 6 - Stall+flush priority (flush wins)
    // -------------------------
    stall = 1;
    flush = 1;
    d     = 64'h1234;
    @(posedge clk);
    check("TEST6 Stall+flush flush wins", 64'h0);
    stall = 0;
    flush = 0;

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
