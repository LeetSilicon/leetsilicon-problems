module tb;
  logic clk_in;
  logic enable;
  logic clk_gated;
  int   p = 0, f = 0;

  // Generate 10ns period clock
  initial clk_in = 0;
  initial clk_in = 0;
  always #5 clk_in = ~clk_in;
  icg_cell dut (.*);

  initial begin
    enable = 0;
    #3;   // Start in the middle of a low phase

    // TC — Enable=1: gate should pass clock
    enable = 1;
    @(posedge clk_in); @(posedge clk_in); #1;
    if (clk_gated) begin p++; $display("PASS: clock passes when enabled"); end
    else begin f++; $display("FAIL: clock gated when it should pass"); end

    // TC — Enable=0: gate should stop clock
    @(negedge clk_in);   // Change enable during low phase (safe)
    enable = 0;
    @(posedge clk_in); #1;
    if (!clk_gated) begin p++; $display("PASS: clock gated when disabled"); end
    else begin f++; $display("FAIL: clock passes when disabled"); end

    // TC — Enable toggle while clk_in high must not glitch
    @(posedge clk_in);   // clk is now high
    #2;
    enable = 1;   // Toggle during high — latch holds, no glitch
    #1;
    if (!clk_gated) begin p++; $display("PASS: no glitch on enable during high"); end
    else begin f++; $display("FAIL: glitch detected"); end

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule