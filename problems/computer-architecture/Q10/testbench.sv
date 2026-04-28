module tb;

  logic [31:0] a, b, result;
  logic        is_sub, overflow, carry;

  int pass = 0, fail = 0;

  overflow_detect #(.W(32)) dut (.*);

  task automatic check(string name, logic ok);
    #1;
    if (ok) begin
      pass++;
      $display("PASS: %s", name);
    end else begin
      fail++;
      $display("FAIL: %s", name);
    end
  endtask

  initial begin
    // -------------------------
    // TEST 1 - Signed add positive overflow
    // -------------------------
    is_sub = 0;
    a      = 32'h7FFF_FFFF;
    b      = 1;
    result = a + b;
    check("TEST1 MAX_INT+1 overflow", overflow);

    // -------------------------
    // TEST 2 - Signed add no overflow
    // -------------------------
    a      = 5;
    b      = 3;
    result = 8;
    check("TEST2 Small add no overflow", !overflow);

    // -------------------------
    // TEST 3 - Signed add negative overflow
    // -------------------------
    a      = 32'h8000_0000;
    b      = 32'hFFFF_FFFF;
    result = a + b;
    check("TEST3 MIN_INT+(-1) overflow", overflow);

    // -------------------------
    // TEST 4 - Signed subtract overflow
    // -------------------------
    is_sub = 1;
    a      = 32'h7FFF_FFFF;
    b      = 32'hFFFF_FFFF;
    result = a - b;
    check("TEST4 MAX-(-1) sub overflow", overflow);

    // -------------------------
    // TEST 5 - Subtract no overflow
    // -------------------------
    a = 10;
    b = 3;
    result = 7;
    check("TEST5 10-3 no sub overflow", !overflow);

    // -------------------------
    // TEST 6 - Unsigned carry
    // -------------------------
    is_sub = 0;
    a      = 32'hFFFF_FFFF;
    b      = 1;
    result = a + b;
    check("TEST6 Carry on FFFF+1", carry);

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
