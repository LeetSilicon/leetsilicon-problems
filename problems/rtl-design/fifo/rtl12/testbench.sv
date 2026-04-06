module tb;
  logic clk;
  logic rst_n;
  logic clk_div4, clk_div5;
  int   p = 0, f = 0;

  initial clk = 0;

  always #5 clk = ~clk;
  clk_divN #(.N(4)) dut4 (.clk(clk), .rst_n(rst_n), .clk_divN(clk_div4));
  clk_divN #(.N(5)) dut5 (.clk(clk), .rst_n(rst_n), .clk_divN(clk_div5));

  initial begin
    rst_n = 0;
    @(posedge clk); @(posedge clk);
    rst_n = 1;

    // TC1 — N=4 even divide
    begin
      realtime t1, t2;
      @(posedge clk_div4); t1 = $realtime;
      @(posedge clk_div4); t2 = $realtime;
      if ((t2 - t1) == 40.0) begin p++; $display("PASS: TC1 N=4 period=40ns"); end
      else begin f++; $display("FAIL: TC1 N=4 period=%.1fns", t2 - t1); end
    end

    // TC2 — N=5 odd divide
    begin
      realtime t1, t2;
      @(posedge clk_div5); t1 = $realtime;
      @(posedge clk_div5); t2 = $realtime;
      if ((t2 - t1) == 50.0) begin p++; $display("PASS: TC2 N=5 period=50ns"); end
      else begin f++; $display("FAIL: TC2 N=5 period=%.1fns", t2 - t1); end
    end

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule