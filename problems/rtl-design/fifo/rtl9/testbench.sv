module tb;
  logic clk;
  logic rst_n;
  logic tick_1ms;
  logic sec_pulse, min_pulse, hour_pulse;
  int   p = 0, f = 0;
  int   sec_count;

  initial clk = 0;

  always #5 clk = ~clk;
  timebase dut (.*);

  initial begin
    rst_n    = 0; tick_1ms = 0;
    @(posedge clk); @(posedge clk); rst_n = 1;

    // TC — 1000 ticks produce one sec_pulse
    sec_count = 0;
    repeat (1000) begin
      @(negedge clk); tick_1ms = 1; @(posedge clk);
      @(negedge clk); tick_1ms = 0; @(posedge clk);
      if (sec_pulse) sec_count++;
    end
    if (sec_count == 1) begin p++; $display("PASS: exactly 1 sec_pulse per 1000 ticks"); end
    else begin f++; $display("FAIL: sec_count=%0d", sec_count); end

    // TC — 60 sec_pulses produce one min_pulse
    begin
      int mc = 0;
      repeat (60 * 1000) begin
        tick_1ms = 1; @(posedge clk);
        tick_1ms = 0; @(posedge clk);
        if (min_pulse) mc++;
      end
      if (mc == 1) begin p++; $display("PASS: 1 min_pulse after 60 seconds"); end
      else begin f++; $display("FAIL: min_count=%0d", mc); end
    end

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule