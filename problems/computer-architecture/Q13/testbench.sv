module tb;

  logic        clk;
  logic        rst_n, start, busy, done, div_by_zero;
  logic [15:0] dividend, divisor, quotient, remainder;

  int pass = 0, fail = 0;

  initial clk = 0;
  always #5 clk = ~clk;

  divider #(.W(16)) dut (.*);

  initial begin #500_000; $display("FATAL: timeout"); $fatal; end

  task automatic run_div(
    string name,
    logic [15:0] dd,
    logic [15:0] dv,
    logic [15:0] eq,
    logic [15:0] er,
    logic exp_dz
  );
    @(negedge clk);
    dividend = dd;
    divisor  = dv;
    start    = 1;
    @(posedge clk);
    if (dv == 0) begin
      if (done && div_by_zero && (quotient === eq) && (remainder === er)) begin
        pass++;
        $display("PASS: %s", name);
      end else begin
        fail++;
        $display("FAIL: %s dz path", name);
      end
      @(negedge clk);
      start = 0;
      @(posedge clk);
    end else begin
      @(negedge clk);
      start = 0;
      if (!busy) begin
        fail++;
        $display("FAIL: %s busy", name);
        return;
      end
      wait (done);
      @(negedge clk);
      if (quotient === eq && remainder === er && (div_by_zero === exp_dz)) begin
        pass++;
        $display("PASS: %s", name);
      end else begin
        fail++;
        $display("FAIL: %s q=%0d r=%0d dz=%b", name, quotient, remainder, div_by_zero);
      end
    end
  endtask

  initial begin
    rst_n = 0;
    start = 0;
    @(posedge clk);
    @(posedge clk);
    rst_n = 1;
    @(posedge clk);

    // -------------------------
    // TEST 1 - Exact division
    // -------------------------
    run_div("TEST1 42/6", 16'd42, 16'd6, 16'd7, 16'd0, 1'b0);

    // -------------------------
    // TEST 2 - Non-exact division
    // -------------------------
    run_div("TEST2 43/6", 16'd43, 16'd6, 16'd7, 16'd1, 1'b0);

    // -------------------------
    // TEST 3 - Divisor greater than dividend
    // -------------------------
    run_div("TEST3 3/10", 16'd3, 16'd10, 16'd0, 16'd3, 1'b0);

    // -------------------------
    // TEST 4 - Divide by zero
    // -------------------------
    run_div("TEST4 7/0", 16'd7, 16'd0, 16'd0, 16'd7, 1'b1);

    // -------------------------
    // TEST 5 - Another exact division
    // -------------------------
    run_div("TEST5 100/4", 16'd100, 16'd4, 16'd25, 16'd0, 1'b0);

    // -------------------------
    // TEST 6 - Reset then divide
    // -------------------------
    @(negedge clk);
    rst_n = 0;
    @(posedge clk);
    @(posedge clk);
    rst_n = 1;
    @(posedge clk);
    run_div("TEST6 post-reset 20/5", 16'd20, 16'd5, 16'd4, 16'd0, 1'b0);

    $display("=================================");
    $display("TOTAL PASS = %0d", pass);
    $display("TOTAL FAIL = %0d", fail);
    $display("=================================");
    if (fail == 0)
      $display("ALL 6 TESTS PASSED");
    else
      $display("SOME TESTS FAILED");
    $finish;
  end

endmodule
