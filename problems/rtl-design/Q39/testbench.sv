module tb;
  logic clk;
  logic rst_n;
  logic clk_div3_50;
  int   p = 0, f = 0;

  initial clk = 0;
  always #5 clk = ~clk;   // 10ns period

  clk_div3_50 dut (.*);

  initial begin
    rst_n = 0;
    @(posedge clk); @(posedge clk); rst_n = 1;

    // TC — Output period should be 3 input cycles = 30ns
    // Count transitions over 30 cycles = 10 output periods
    begin
      realtime t_rise1, t_rise2;
      real period;
      @(posedge clk_div3_50); t_rise1 = $realtime;
      @(posedge clk_div3_50); t_rise2 = $realtime;
      period = t_rise2 - t_rise1;
      if (period == 30.0) begin p++; $display("PASS: clk_div3 period=30ns"); end
      else begin f++; $display("FAIL: period=%.1fns expected 30", period); end
    end

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule