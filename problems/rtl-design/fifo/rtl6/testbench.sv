module tb;
  logic       clk;
  logic       rst_n;
  logic       enable;
  logic [3:0] bin_count, gray_count;
  int         p = 0, f = 0;

  initial clk = 0;

  always #5 clk = ~clk;
  bin_to_gray_counter #(.W(4)) dut (.*);

  initial begin
    rst_n  = 0; enable = 0;
    @(posedge clk); @(posedge clk); rst_n = 1; @(posedge clk); #1;

    // TC — Reset: bin=0, gray=0
    if (bin_count == 0 && gray_count == 0) begin p++; $display("PASS: reset bin=0 gray=0"); end
    else begin f++; $display("FAIL: reset"); end

    // TC — Verify first few gray outputs
    enable = 1;
    begin
      logic [3:0] expected_gray [4] = '{4'b0001, 4'b0011, 4'b0010, 4'b0110};
      logic ok = 1;
      for (int i = 0; i < 4; i++) begin
        @(posedge clk); #1;
        if (gray_count != expected_gray[i]) ok = 0;
      end
      if (ok) begin p++; $display("PASS: first 4 Gray values correct"); end
      else begin f++; $display("FAIL: Gray sequence"); end
    end

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule