module tb;
  logic        clk;
  logic        rst_n, start, busy, done, div_by_zero;
  logic [15:0] dividend, divisor, quotient, remainder;
  int          p = 0, f = 0;

  initial clk = 0;

  always #5 clk = ~clk;
  divider #(.W(16)) dut (.*);

  // Timeout watchdog
  initial begin #500_000; $display("FATAL: timeout"); $fatal; end

  task automatic check(input string msg, input logic [15:0] eq, input logic [15:0] er);
    @(negedge clk); start = 1;
    @(posedge clk); @(negedge clk); start = 0;
    if (busy) p++; else begin f++; $display("FAIL: busy not asserted"); end
    wait (done);
    @(negedge clk);
    if (quotient === eq && remainder === er) begin
      p++;
      $display("PASS: %s", msg);
    end else begin
      f++;
      $display("FAIL: %s q=%0d r=%0d", msg, quotient, remainder);
    end
  endtask

  initial begin
    rst_n = 0;
    start = 0;
    @(posedge clk);
    @(posedge clk);
    rst_n = 1;
    @(posedge clk);

    dividend = 42; divisor = 6;  check("42/6", 7, 0);
    dividend = 43; divisor = 6;  check("43/6", 7, 1);
    dividend = 3;  divisor = 10; check("3/10", 0, 3);

    // Divide-by-zero behavior: quotient=0, remainder=dividend.
    @(negedge clk); dividend = 7; divisor = 0; start = 1;
    @(posedge clk); @(negedge clk); start = 0;
    if (done && div_by_zero && quotient == 0 && remainder == 7) begin
      p++;
      $display("PASS: div-by-zero");
    end else begin
      f++;
      $display("FAIL: div-by-zero handling");
    end

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule