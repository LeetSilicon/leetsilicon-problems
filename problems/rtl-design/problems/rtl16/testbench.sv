module tb;
  logic fast_clk;
  logic fast_rst_n;
  logic slow_clk;
  logic slow_rst_n;
  logic send_req;
  logic fast_busy;
  logic slow_data_valid;
  int   p = 0, f = 0;

  initial fast_clk = 0;
  always #3  fast_clk = ~fast_clk;   // ~167 MHz
  initial slow_clk = 0;
  always #7  slow_clk = ~slow_clk;   // ~71 MHz

  handshake_cdc dut (.*);

  initial begin
    fast_rst_n = 0; slow_rst_n = 0; send_req = 0;
    repeat (4) @(posedge fast_clk);
    repeat (4) @(posedge slow_clk);
    fast_rst_n = 1; slow_rst_n = 1;

    // TC — Single request produces single acknowledge
    @(posedge fast_clk);
    send_req = 1; @(posedge fast_clk); send_req = 0;

    // Wait for slow side to capture
    begin
      int timeout = 0;
      while (!slow_data_valid && timeout < 50) begin
        @(posedge slow_clk); timeout++;
      end
      if (slow_data_valid) begin p++; $display("PASS: slow_data_valid received"); end
      else begin f++; $display("FAIL: no slow_data_valid"); end
    end

    // Wait for fast side to clear busy
    begin
      int timeout = 0;
      while (fast_busy && timeout < 50) begin
        @(posedge fast_clk); timeout++;
      end
      if (!fast_busy) begin p++; $display("PASS: fast_busy cleared after ack"); end
      else begin f++; $display("FAIL: fast_busy not cleared"); end
    end

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule