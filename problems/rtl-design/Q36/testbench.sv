module tb;
  logic        clk;
  logic        rst_n;
  logic        enable;
  logic [15:0] fib_out;
  int          p = 0, f = 0;

  initial clk = 0;

  always #5 clk = ~clk;
  fib_gen #(.W(16)) dut (.*);

  initial begin
    rst_n  = 0; enable = 0;
    @(posedge clk); @(posedge clk); rst_n = 1;
    @(posedge clk); @(negedge clk);

    // TC — Check fib sequence: a=0,1,1,2,3,5,8
    begin
      logic ok = 1;
      @(negedge clk); enable = 1;
      if (fib_out != 0) ok = 0;
      @(posedge clk); @(negedge clk);
      if (fib_out != 1) ok = 0;
      @(posedge clk); @(negedge clk);
      if (fib_out != 1) ok = 0;
      @(posedge clk); @(negedge clk);
      if (fib_out != 2) ok = 0;
      @(posedge clk); @(negedge clk);
      if (fib_out != 3) ok = 0;
      @(posedge clk); @(negedge clk);
      if (fib_out != 5) ok = 0;
      @(posedge clk); @(negedge clk);
      if (fib_out != 8) ok = 0;
      if (ok) begin p++; $display("PASS: Fibonacci sequence"); end
      else begin f++; $display("FAIL: Fibonacci fib=%0d", fib_out); end
    end

    // TC — Hold: enable=0 freezes output
    enable = 0;
    begin
      logic [15:0] held = fib_out;
      @(posedge clk); @(posedge clk); @(negedge clk);
      if (fib_out == held) begin p++; $display("PASS: hold when disabled"); end
      else begin f++; $display("FAIL: hold"); end
    end

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule