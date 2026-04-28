module tb;

  logic       clk;
  logic       rst_n;
  logic [3:0] req, grant;
  logic       seq_ok;

  int pass = 0, fail = 0;

  initial clk = 0;
  always #5 clk = ~clk;

  rr_arbiter #(.N(4)) dut (.*);

  task automatic check(string name, logic [3:0] exp);
    #1;
    if (grant === exp) begin
      pass++;
      $display("PASS: %s", name);
    end else begin
      fail++;
      $display("FAIL: %s exp=%b got=%b", name, exp, grant);
    end
  endtask

  initial begin
    rst_n = 0;
    req   = 0;
    @(posedge clk);
    @(posedge clk);
    rst_n = 1;

    // -------------------------
    // TEST 1 - First grant among 1 and 3
    // -------------------------
    @(negedge clk);
    req = 4'b1010;
    check("TEST1 Grant lowest index", 4'b0010);
    @(posedge clk);

    // -------------------------
    // TEST 2 - RR advances
    // -------------------------
    @(negedge clk);
    check("TEST2 Grant rotates", 4'b1000);
    @(posedge clk);

    // -------------------------
    // TEST 3 - Full request starts at wrap
    // -------------------------
    @(negedge clk);
    req = 4'b1111;
    check("TEST3 All req first grant0", 4'b0001);
    @(posedge clk);

    // -------------------------
    // TEST 4 - Three more RR steps
    // -------------------------
    @(negedge clk);
    #1;
    seq_ok = (grant === 4'b0010);
    @(posedge clk);
    @(negedge clk);
    #1;
    seq_ok = seq_ok && (grant === 4'b0100);
    @(posedge clk);
    @(negedge clk);
    #1;
    seq_ok = seq_ok && (grant === 4'b1000);
    if (seq_ok) begin
      pass++;
      $display("PASS: TEST4 Full RR sequence");
    end else begin
      fail++;
      $display("FAIL: TEST4 Full RR sequence got=%b", grant);
    end
    @(posedge clk);

    // -------------------------
    // TEST 5 - No requests
    // -------------------------
    @(negedge clk);
    req = 4'b0000;
    check("TEST5 No req zero grant", 4'b0000);

    // -------------------------
    // TEST 6 - Single requestor
    // -------------------------
    @(posedge clk);
    @(negedge clk);
    req = 4'b0100;
    check("TEST6 Single lane", 4'b0100);

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
