module tb;
  logic        clk;
  logic        rst_n;
  logic        start, done, busy;
  logic [15:0] a, b;
  logic [31:0] product;
  int          p = 0, f = 0;

  initial clk = 0;

  always #5 clk = ~clk;
  seq_multiplier #(.WIDTH(16)) dut (.*);

  task automatic check(input string msg, input logic [31:0] exp);
    start = 1; @(posedge clk); start = 0;
    wait (done);
    @(negedge clk);
    if (product === exp) begin
      p++;
      $display("PASS: %s", msg);
    end else begin
      f++;
      $display("FAIL: %s  exp=%0d  got=%0d", msg, exp, product);
    end
  endtask

  initial begin
    rst_n = 0; start = 0;
    @(posedge clk); @(posedge clk);
    rst_n = 1; @(posedge clk);

    a = 3;   b = 7;   check("3 * 7 = 21",          21);
    a = 0;   b = 255; check("0 * 255 = 0",           0);
    a = 255; b = 255; check("255 * 255 = 65025",  65025);
    a = 16;  b = 4;   check("16 * 4 = 64",           64);

    // TC4 — Back-to-back
    a = 5; b = 4;
    start = 1; @(posedge clk); start = 0;
    wait (done); @(posedge clk);
    a = 6; b = 3;
    start = 1; @(posedge clk); start = 0;
    wait (done);
    @(negedge clk);
    if (product == 18) begin p++; $display("PASS: TC4 back-to-back second result"); end
    else begin f++; $display("FAIL: TC4 got %0d", product); end

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule