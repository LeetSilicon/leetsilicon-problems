module tb;
  logic clk;
  logic rst_n;
  logic bit_in;
  logic div_by_3;
  int   p = 0, f = 0;

  initial clk = 0;

  always #5 clk = ~clk;
  div_by_3 dut (.*);

  task automatic drive(input logic b);
    @(negedge clk); @(negedge clk); bit_in = b; @(posedge clk); @(negedge clk);
  endtask

  initial begin
    rst_n  = 0; bit_in = 0;
    @(posedge clk); @(posedge clk); rst_n = 1;

    // 0b110 = 6 → div_by_3
    drive(1); drive(1); drive(0); // 6
    if (div_by_3) begin p++; $display("PASS: 6 divisible by 3"); end
    else begin f++; $display("FAIL: 6 should be divisible"); end

    // Reset and test 0b100 = 4 → not div_by_3
    rst_n = 0; @(posedge clk); @(posedge clk); rst_n = 1;
    drive(1); drive(0); drive(0); // 4
    if (!div_by_3) begin p++; $display("PASS: 4 not divisible by 3"); end
    else begin f++; $display("FAIL: 4 should not be divisible"); end

    // Reset and test 0b1001 = 9 → div_by_3
    rst_n = 0; @(posedge clk); @(posedge clk); rst_n = 1;
    drive(1); drive(0); drive(0); drive(1); // 9
    if (div_by_3) begin p++; $display("PASS: 9 divisible by 3"); end
    else begin f++; $display("FAIL: 9 should be divisible"); end

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule