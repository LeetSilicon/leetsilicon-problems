module tb;
  logic clk;
  logic rst_n;
  logic bit_in;
  logic match_pulse;
  int   p = 0, f = 0;

  initial clk = 0;

  always #5 clk = ~clk;
  seq_det_10110 dut (.*);

  task automatic drive_bit(input logic b, output logic pulse_sample);
    bit_in = b;
    #1;                 // Mealy output is valid before state update
    pulse_sample = match_pulse;
    @(posedge clk);
    #1;
  endtask

  logic pulse;

  initial begin
    rst_n = 0; bit_in = 0;
    @(posedge clk); @(posedge clk);
    rst_n = 1;

    // TC1 — exact match 10110
    drive_bit(1, pulse);
    drive_bit(0, pulse);
    drive_bit(1, pulse);
    drive_bit(1, pulse);
    drive_bit(0, pulse);
    if (pulse) begin p++; $display("PASS: TC1 match on 10110"); end
    else begin f++; $display("FAIL: TC1 no match"); end

    // TC2 — wrong pattern should never pulse
    rst_n = 0; @(posedge clk); @(posedge clk); rst_n = 1;
    begin
      logic any_pulse;
      any_pulse = 0;
      drive_bit(1, pulse); any_pulse |= pulse;
      drive_bit(1, pulse); any_pulse |= pulse;
      drive_bit(0, pulse); any_pulse |= pulse;
      drive_bit(0, pulse); any_pulse |= pulse;
      drive_bit(1, pulse); any_pulse |= pulse;
      if (!any_pulse) begin p++; $display("PASS: TC2 no spurious match"); end
      else begin f++; $display("FAIL: TC2 spurious match"); end
    end

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule