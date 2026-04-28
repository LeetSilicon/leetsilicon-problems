module tb;

  logic [7:0] predicate, active_mask;
  logic       clk, rst_n, enter_if, enter_else, exit_if;

  int pass = 0, fail = 0;

  initial clk = 0;
  always #5 clk = ~clk;

  thread_mask #(.THREADS(8), .STACK_D(4)) dut (.*);

  task automatic check(string name, logic ok);
    #1;
    if (ok) begin
      pass++;
      $display("PASS: %s", name);
    end else begin
      fail++;
      $display("FAIL: %s mask=%h", name, active_mask);
    end
  endtask

  initial begin
    rst_n      = 0;
    enter_if   = 0;
    enter_else = 0;
    exit_if    = 0;
    predicate  = 0;
    @(posedge clk);
    @(posedge clk);
    rst_n = 1;
    #1;
    check("TEST1 Reset all active", active_mask == 8'hFF);

    // -------------------------
    // TEST 2 - Enter if
    // -------------------------
    @(negedge clk);
    predicate = 8'hAA;
    enter_if  = 1;
    @(posedge clk);
    @(negedge clk);
    enter_if = 0;
    check("TEST2 Enter if", active_mask == 8'hAA);

    // -------------------------
    // TEST 3 - Nested if
    // -------------------------
    @(negedge clk);
    predicate = 8'hCC;
    enter_if  = 1;
    @(posedge clk);
    @(negedge clk);
    enter_if = 0;
    check("TEST3 Nested if", active_mask == 8'h88);

    // -------------------------
    // TEST 4 - Exit if pop
    // -------------------------
    @(negedge clk);
    exit_if = 1;
    @(posedge clk);
    @(negedge clk);
    exit_if = 0;
    @(posedge clk);
    @(negedge clk);
    check("TEST4 Pop restore", active_mask == 8'hAA);

    // -------------------------
    // TEST 5 - Enter else
    // -------------------------
    @(negedge clk);
    predicate = 8'hAA;
    enter_else = 1;
    @(posedge clk);
    @(negedge clk);
    enter_else = 0;
    @(posedge clk);
    @(negedge clk);
    check("TEST5 Enter else", active_mask == 8'h55);

    // -------------------------
    // TEST 6 - Exit outer
    // -------------------------
    @(negedge clk);
    exit_if = 1;
    @(posedge clk);
    @(negedge clk);
    exit_if = 0;
    @(posedge clk);
    @(negedge clk);
    check("TEST6 Exit to all active", active_mask == 8'hFF);

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
