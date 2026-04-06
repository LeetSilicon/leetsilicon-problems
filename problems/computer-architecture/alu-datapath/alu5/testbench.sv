module tb;
  logic        clk;
  logic        rst_n, start, busy, done;
  logic [15:0] a, b;
  logic [31:0] product;
  int          p = 0, f = 0;

  initial clk = 0;

  always #5 clk = ~clk;
  multiplier #(.W(16)) dut (.*);

  // Timeout watchdog
  initial begin #500_000; $display("FATAL: timeout"); $fatal; end

  task automatic check(input string msg, input logic [31:0] exp);
    @(negedge clk); start = 1;
    @(posedge clk); @(negedge clk); start = 0;
    if (busy) p++; else begin f++; $display("FAIL: busy not asserted"); end
    wait (done);
    @(negedge clk);
    if (product === exp) begin
      p++;
      $display("PASS: %s", msg);
    end else begin
      f++;
      $display("FAIL: %s got=%0d", msg, product);
    end
  endtask

  initial begin
    rst_n = 0;
    start = 0;
    @(posedge clk);
    @(posedge clk);
    rst_n = 1;
    @(posedge clk);

    a = 7;   b = 6;   check("7*6", 42);
    a = 0;   b = 99;  check("0*99", 0);
    a = 255; b = 255; check("255*255", 65025);

    // Back-to-back: start second multiply immediately after first done
    a = 5; b = 4;
    check("5*4", 20);
    // Immediately start next — check task already returns after done
    a = 6; b = 3;
    check("6*3 b2b", 18);

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule