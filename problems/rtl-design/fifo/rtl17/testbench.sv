module tb;
  logic       clk;
  logic       rst_n;
  logic       inc;
  logic [3:0] bin_ptr, gray_ptr;
  int         p = 0, f = 0;

  initial clk = 0;

  always #5 clk = ~clk;
  gray_ptr #(.W(4)) dut (.*);

  function automatic int hamming4(logic [3:0] a, logic [3:0] b);
    return $countones(a ^ b);
  endfunction

  initial begin
    rst_n = 0; inc = 0;
    @(posedge clk); @(posedge clk); rst_n = 1; @(posedge clk); #1;

    // Validate gray = bin ^ (bin >> 1) across increments
    inc = 1;
    begin
      logic ok = 1;
      logic [3:0] prev_gray = gray_ptr;
      repeat (16) begin
        @(posedge clk); #1;
        // Check formula
        if (gray_ptr != (bin_ptr ^ (bin_ptr >> 1))) ok = 0;
        // Check Hamming distance 1
        if (hamming4(prev_gray, gray_ptr) != 1) ok = 0;
        prev_gray = gray_ptr;
      end
      if (ok) begin p++; $display("PASS: gray = bin^(bin>>1) and Hamming=1 always"); end
      else begin f++; $display("FAIL: Gray pointer validation"); end
    end

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule