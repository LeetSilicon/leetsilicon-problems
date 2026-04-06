module tb;
  logic clk;
  logic rst_n;
  logic pwm_25, pwm_0, pwm_100;
  int   p = 0, f = 0;

  initial clk = 0;

  always #5 clk = ~clk;
  pwm_gen #(.COUNTER_WIDTH(4), .PERIOD(8), .DUTY(2)) dut25  (.clk(clk), .rst_n(rst_n), .pwm_out(pwm_25));
  pwm_gen #(.COUNTER_WIDTH(4), .PERIOD(8), .DUTY(0)) dut0   (.clk(clk), .rst_n(rst_n), .pwm_out(pwm_0));
  pwm_gen #(.COUNTER_WIDTH(4), .PERIOD(8), .DUTY(8)) dut100 (.clk(clk), .rst_n(rst_n), .pwm_out(pwm_100));

  initial begin
    rst_n = 0;
    @(posedge clk); @(posedge clk);
    rst_n = 1;

    // TC1 — 25% duty over one full period
    begin
      int high_cnt, low_cnt;
      high_cnt = 0;
      low_cnt  = 0;
      repeat (8) begin
        @(posedge clk); #1;
        if (pwm_25) high_cnt++;
        else        low_cnt++;
      end
      if (high_cnt == 2 && low_cnt == 6) begin
        p++; $display("PASS: TC1 25%% duty");
      end else begin
        f++; $display("FAIL: TC1 high=%0d low=%0d", high_cnt, low_cnt);
      end
    end

    // TC2 — 0% duty always low
    begin
      logic ok;
      ok = 1;
      repeat (8) begin
        @(posedge clk); #1;
        if (pwm_0 !== 1'b0) ok = 0;
      end
      if (ok) begin p++; $display("PASS: TC2 0%% duty always low"); end
      else begin f++; $display("FAIL: TC2 pwm_0 not always low"); end
    end

    // TC3 — 100% duty always high
    begin
      logic ok;
      ok = 1;
      repeat (8) begin
        @(posedge clk); #1;
        if (pwm_100 !== 1'b1) ok = 0;
      end
      if (ok) begin p++; $display("PASS: TC3 100%% duty always high"); end
      else begin f++; $display("FAIL: TC3 pwm_100 not always high"); end
    end

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule