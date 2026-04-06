module tb;
  logic        clk;
  logic        rst_n, stall, flush;
  logic [63:0] d, q;
  int          p = 0, f = 0;

  // Clock generation
  initial clk = 0;
  always #5 clk = ~clk;
  // DUT instantiation
  pipe_reg #(.W(64)) dut (.*);

  task automatic check(input string msg, input logic [63:0] exp);
    @(negedge clk);
    if (q === exp) begin
      p++;
      $display("PASS: %s", msg);
    end else begin
      f++;
      $display("FAIL: %s", msg);
    end
  endtask

  initial begin
    // Reset sequence
    rst_n = 0;
    stall = 0;
    flush = 0;
    d     = 0;
    @(posedge clk);
    @(posedge clk);
    rst_n = 1;

    // Normal load
    d = 64'hCAFE;
    @(posedge clk);
    check("load", 64'hCAFE);

    // Stall holds old value
    stall = 1;
    d     = 64'hDEAD;
    @(posedge clk);
    check("stall holds", 64'hCAFE);

    // Unstall propagates new value
    stall = 0;
    @(posedge clk);
    check("unstall", 64'hDEAD);

    // Flush clears register
    flush = 1;
    @(posedge clk);
    check("flush", 0);
    flush = 0;

    // Simultaneous stall+flush: flush should win (insert bubble)
    d = 64'hBEEF;
    @(posedge clk);
    check("reload", 64'hBEEF);
    stall = 1;
    flush = 1;
    d     = 64'h1234;
    @(posedge clk);
    check("stall+flush: flush wins", 0);
    stall = 0;
    flush = 0;

    // Summary
    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule