module tb;
  logic        clk;
  logic        rst_n;
  logic        start, done, busy, div_by_zero;
  logic [15:0] dividend, divisor, quotient, remainder;
  int          p = 0, f = 0;

  initial clk = 0;

  always #5 clk = ~clk;
  seq_divider #(.WIDTH(16)) dut (.*);

  task automatic check(input string msg, input logic [15:0] eq, input logic [15:0] er);
    start = 1; @(posedge clk); start = 0;
    wait (done);
    @(negedge clk);
    if (quotient === eq && remainder === er) begin
      p++;
      $display("PASS: %s", msg);
    end else begin
      f++;
      $display("FAIL: %s  q=%0d r=%0d", msg, quotient, remainder);
    end
  endtask

  initial begin
    rst_n = 0; start = 0;
    @(posedge clk); @(posedge clk);
    rst_n = 1; @(posedge clk);

    dividend = 20;  divisor = 5;  check("20 / 5  = q=4, r=0",    4, 0);
    dividend = 22;  divisor = 5;  check("22 / 5  = q=4, r=2",    4, 2);
    dividend = 3;   divisor = 10; check("3 / 10  = q=0, r=3",    0, 3);
    dividend = 255; divisor = 1;  check("255 / 1 = q=255, r=0", 255, 0);

    // TC3 — Divide by zero
    dividend = 7; divisor = 0;
    start = 1; @(posedge clk); start = 0;
    wait (done); @(negedge clk);
    if (div_by_zero) begin p++; $display("PASS: TC3 div_by_zero flag"); end
    else begin f++; $display("FAIL: TC3 div_by_zero"); end

    // TC6 — Back-to-back
    dividend = 20; divisor = 5;
    start = 1; @(posedge clk); start = 0; wait(done); @(posedge clk);
    dividend = 22; divisor = 5;
    start = 1; @(posedge clk); start = 0; wait(done); @(negedge clk);
    if (quotient == 4 && remainder == 2) begin p++; $display("PASS: TC6 back-to-back"); end
    else begin f++; $display("FAIL: TC6"); end

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule