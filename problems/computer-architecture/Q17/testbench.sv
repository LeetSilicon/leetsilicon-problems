module tb;

  logic [31:0] a, b;
  logic [2:0]  funct3;
  logic        take_branch;

  int pass = 0, fail = 0;

  branch_cmp #(.W(32)) dut (.*);

  task automatic check(string msg, logic exp);
    #1;
    if (take_branch === exp) begin
      pass++;
      $display("PASS: %s", msg);
    end else begin
      fail++;
      $display("FAIL: %s", msg);
    end
  endtask

  initial begin
    // -------------------------
    // TEST 1 - BEQ taken
    // -------------------------
    a = 5;
    b = 5;
    funct3 = 3'b000;
    check("TEST1 BEQ taken", 1);

    // -------------------------
    // TEST 2 - BEQ not taken
    // -------------------------
    a = 5;
    b = 6;
    funct3 = 3'b000;
    check("TEST2 BEQ not taken", 0);

    // -------------------------
    // TEST 3 - BNE taken
    // -------------------------
    funct3 = 3'b001;
    check("TEST3 BNE taken", 1);

    // -------------------------
    // TEST 4 - BLT signed
    // -------------------------
    a = 32'hFFFF_FFFF;
    b = 1;
    funct3 = 3'b100;
    check("TEST4 BLT signed", 1);

    // -------------------------
    // TEST 5 - BLTU unsigned
    // -------------------------
    funct3 = 3'b110;
    check("TEST5 BLTU unsigned", 0);

    // -------------------------
    // TEST 6 - BNE not taken (equal operands)
    // -------------------------
    a = 3;
    b = 3;
    funct3 = 3'b001;
    check("TEST6 BNE equal not taken", 0);

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
