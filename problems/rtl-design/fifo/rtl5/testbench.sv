module tb;
  logic clk;
  logic rst_n;
  logic async_in;
  logic debounced_level;
  logic debounced_rise_pulse;
  int   p = 0, f = 0;
  int   rise_count;

  initial clk = 0;

  always #5 clk = ~clk;
  debounce_sync dut (.*);

  initial begin
    rst_n = 0;
    async_in = 0;
    rise_count = 0;
    @(posedge clk); @(posedge clk);
    rst_n = 1;

    // TC1 — one-cycle glitch rejected
    async_in = 1; @(posedge clk);
    async_in = 0; @(posedge clk);
    repeat (3) @(posedge clk);
    #1;
    if (!debounced_level) begin p++; $display("PASS: TC1 glitch rejected"); end
    else begin f++; $display("FAIL: TC1 glitch accepted"); end

    // TC2 — stable high accepted and rise pulse occurs exactly once
    async_in = 1;
    repeat (6) begin
      @(posedge clk); #1;
      if (debounced_rise_pulse) rise_count++;
    end

    if (debounced_level) begin p++; $display("PASS: TC2 stable high accepted"); end
    else begin f++; $display("FAIL: TC2 stable high rejected"); end

    if (rise_count == 1) begin p++; $display("PASS: TC2 rise pulse exactly once"); end
    else begin f++; $display("FAIL: TC2 rise pulse count=%0d", rise_count); end

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule