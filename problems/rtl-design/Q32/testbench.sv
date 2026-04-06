module tb;
  logic clk;
  logic rst_n;
  logic bit_in;
  logic found;
  int   p = 0, f = 0;

  initial clk = 0;

  always #5 clk = ~clk;
  pattern_in_window #(.N(8), .K(5), .PATTERN(5'b10110)) dut (.*);

  task automatic drive(input logic b);
    bit_in = b;
    @(posedge clk);
    #1;
  endtask

  initial begin
    rst_n  = 0; bit_in = 0;
    @(posedge clk); @(posedge clk);
    rst_n = 1;

    // TC — Found: shift in 10110 and verify found=1
    drive(0); drive(1); drive(1); drive(0); drive(1);  // 10110 MSB-first into window
    // Window now has 10110 somewhere — may need more bits
    drive(0); drive(0); drive(0);
    // By now window = 00010110 — pattern at [4:0]
    if (found) begin p++; $display("PASS: pattern found in window"); end
    else begin f++; $display("FAIL: pattern not found"); end

    // TC — Shift out: shift in 8 more zeros to push pattern out
    repeat (8) drive(0);
    if (!found) begin p++; $display("PASS: pattern shifted out, found=0"); end
    else begin f++; $display("FAIL: found still set after shift-out"); end

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule