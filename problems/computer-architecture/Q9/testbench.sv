module tb;

  logic [1:0] alu_op;
  logic [2:0] funct3;
  logic       funct7_b5;
  logic [3:0] alu_ctrl;
  logic       and_ok, or_ok;

  int pass = 0, fail = 0;

  alu_control dut (.*);

  task automatic check(string name, logic [3:0] exp);
    #1;
    if (alu_ctrl === exp) begin
      pass++;
      $display("PASS: %s", name);
    end else begin
      fail++;
      $display("FAIL: %s exp=%0d got=%0d", name, exp, alu_ctrl);
    end
  endtask

  task automatic check2(string name, logic ok);
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
    // TEST 1 - Load/store path ADD
    // -------------------------
    alu_op = 2'b00;
    funct3 = 3'b000;
    funct7_b5 = 0;
    check("TEST1 LW path ADD", 4'd0);

    // -------------------------
    // TEST 2 - Branch path SUB
    // -------------------------
    alu_op = 2'b01;
    check("TEST2 Branch SUB", 4'd1);

    // -------------------------
    // TEST 3 - R-type ADD
    // -------------------------
    alu_op = 2'b10;
    funct3 = 3'b000;
    funct7_b5 = 0;
    check("TEST3 R-type ADD", 4'd0);

    // -------------------------
    // TEST 4 - R-type SUB
    // -------------------------
    funct7_b5 = 1;
    check("TEST4 R-type SUB", 4'd1);

    // -------------------------
    // TEST 5 - R-type AND and OR
    // -------------------------
    funct7_b5 = 0;
    funct3 = 3'b111;
    #1;
    and_ok = (alu_ctrl === 4'd2);
    funct3 = 3'b110;
    #1;
    or_ok = (alu_ctrl === 4'd3);
    check2("TEST5 R-type AND OR", and_ok && or_ok);

    // -------------------------
    // TEST 6 - R-type SLT
    // -------------------------
    funct3 = 3'b010;
    check("TEST6 R-type SLT", 4'd5);

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
