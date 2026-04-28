module tb;

  logic [31:0] a, b, result;
  logic [3:0]  op;
  logic        zero, carry, overflow, negative;
  logic        or_ok, xor_ok, slt1, slt2;

  int pass = 0, fail = 0;

  alu #(.W(32)) dut (.*);

  task automatic check_res(string name, logic [31:0] exp);
    #1;
    if (result === exp) begin
      pass++;
      $display("PASS: %s", name);
    end else begin
      fail++;
      $display("FAIL: %s exp=%h got=%h", name, exp, result);
    end
  endtask

  task automatic check_flag(string name, logic ok);
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
    // TEST 1 - ADD
    // -------------------------
    op = 4'd0;
    a  = 5;
    b  = 3;
    check_res("TEST1 ADD", 32'd8);

    // -------------------------
    // TEST 2 - SUB
    // -------------------------
    op = 4'd1;
    a  = 10;
    b  = 3;
    check_res("TEST2 SUB", 32'd7);

    // -------------------------
    // TEST 3 - Bitwise AND
    // -------------------------
    op = 4'd2;
    a  = 32'hFF00;
    b  = 32'h0F0F;
    check_res("TEST3 AND", 32'h0F00);

    // -------------------------
    // TEST 4 - Bitwise OR and XOR
    // -------------------------
    op = 4'd3;
    a  = 32'hFF00;
    b  = 32'h0F0F;
    #1;
    or_ok = (result === 32'hFF0F);
    op = 4'd4;
    #1;
    xor_ok = (result === 32'hF00F);
    check_flag("TEST4 OR and XOR", or_ok && xor_ok);

    // -------------------------
    // TEST 5 - SLT signed
    // -------------------------
    op = 4'd5;
    a  = 32'hFFFFFFFF;
    b  = 1;
    #1;
    slt1 = (result === 1);
    a   = 1;
    b   = 32'hFFFFFFFF;
    #1;
    slt2 = (result === 0);
    check_flag("TEST5 SLT signed", slt1 && slt2);

    // -------------------------
    // TEST 6 - Status flags sample
    // -------------------------
    op = 4'd1;
    a  = 5;
    b  = 5;
    #1;
    if (!zero) begin
      fail++;
      $display("FAIL: TEST6 zero");
    end
    op = 4'd0;
    a  = 32'h7FFF_FFFF;
    b  = 1;
    #1;
    if (!overflow) begin
      fail++;
      $display("FAIL: TEST6 overflow");
    end
    op = 4'd1;
    a  = 3;
    b  = 10;
    #1;
    if (negative) begin
      pass++;
      $display("PASS: TEST6 flags zero ovf neg");
    end else begin
      fail++;
      $display("FAIL: TEST6 negative");
    end

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
