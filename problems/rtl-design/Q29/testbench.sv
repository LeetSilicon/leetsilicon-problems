module tb;
  logic clk;
  logic rst_n;
  logic sig_in;
  logic rise_pulse, fall_pulse, toggle_pulse;
  int p = 0, f = 0;

  initial clk = 0;
  always #5 clk = ~clk;

  edge_toggle_detect dut (.*);

  initial begin
    // Initial setup
    rst_n  = 0;
    sig_in = 0;

    // Let reset settle for a couple cycles
    @(posedge clk);
    @(posedge clk);

    // =========================================================
    // TC1 — Reset behavior
    // =========================================================
    sig_in = 1;
    @(posedge clk);
    @(negedge clk);
    $display("TESTCASE 1");
    if (!rise_pulse && !fall_pulse && !toggle_pulse) begin
      p++;
      $display("PASS: all outputs 0 during reset");
    end else begin
      f++;
      $display("FAIL: spurious pulse during reset rise=%b fall=%b toggle=%b",
               rise_pulse, fall_pulse, toggle_pulse);
    end

    // Release reset and return to clean baseline
    @(negedge clk);
    rst_n  = 1;
    sig_in = 0;
    @(posedge clk);
    @(negedge clk);

    // =========================================================
    // TC2 — Rising edge 0→1
    // =========================================================
    @(negedge clk);
    sig_in = 1;
    @(posedge clk);
    @(negedge clk);
    $display("TESTCASE 2");
    if (rise_pulse && !fall_pulse && toggle_pulse) begin
      p++;
      $display("PASS: rising edge detected");
    end else begin
      f++;
      $display("FAIL: rise=%b fall=%b toggle=%b",
               rise_pulse, fall_pulse, toggle_pulse);
    end

    // Held high — no more pulses
    @(posedge clk);
    @(negedge clk);
    if (!rise_pulse && !fall_pulse && !toggle_pulse) begin
      p++;
      $display("PASS: no pulse while steady high");
    end else begin
      f++;
      $display("FAIL: spurious pulse while steady");
    end

    // =========================================================
    // TC3 — Falling edge 1→0
    // =========================================================
    @(negedge clk);
    sig_in = 0;
    @(posedge clk);
    @(negedge clk);
    $display("TESTCASE 3");
    if (!rise_pulse && fall_pulse && toggle_pulse) begin
      p++;
      $display("PASS: falling edge detected");
    end else begin
      f++;
      $display("FAIL: fall edge");
    end

    // =========================================================
    // TC4 — No toggle: constant low
    // =========================================================
    @(posedge clk);
    @(negedge clk);
    $display("TESTCASE 4");
    if (!rise_pulse && !fall_pulse && !toggle_pulse) begin
      p++;
      $display("PASS: no pulse on constant input");
    end else begin
      f++;
      $display("FAIL: spurious pulse on constant");
    end

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule