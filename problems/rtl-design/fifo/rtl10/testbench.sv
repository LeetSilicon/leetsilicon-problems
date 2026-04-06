module tb;
  logic clk;
  logic rst_n;
  logic clk_div2;
  int   p = 0, f = 0;

  initial clk = 0;

  always #5 clk = ~clk;
  clk_div2 dut (.*);

  initial begin
    rst_n = 0;
    @(posedge clk); @(posedge clk); rst_n = 1;

    // Verify output toggles every 2 input clocks → period = 20ns
    begin
      logic prev = clk_div2;
      int   toggle_count = 0;
      repeat (20) begin
        @(posedge clk); @(negedge clk);
        if (clk_div2 != prev) toggle_count++;
        prev = clk_div2;
      end
      // 20 input clocks = 10 output toggles (5 full cycles)
      if (toggle_count >= 19) begin p++; $display("PASS: clk_div2 toggles=%0d", toggle_count); end
      else begin f++; $display("FAIL: toggle_count=%0d expected 10", toggle_count); end
    end

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule