module tb;

  logic [31:0] instr, imm;
  logic [4:0]  rs1, rs2, rd;
  logic [6:0]  opcode, funct7;
  logic [2:0]  funct3;
  logic        reg_write, mem_read, mem_write, branch, alu_src, jump, mem_to_reg, illegal_instruction;
  logic [3:0]  alu_op;

  int pass = 0, fail = 0;

  instr_decode dut (.*);

  task automatic check_ctrl(
    input string msg,
    input logic  ew, emr, emw, eb, ej, em2r, eillegal
  );
    #1;
    if (reg_write === ew && mem_read === emr && mem_write === emw &&
        branch === eb && jump === ej && mem_to_reg === em2r && illegal_instruction === eillegal) begin
      pass++;
      $display("PASS: %s", msg);
    end else begin
      fail++;
      $display("FAIL: %s", msg);
    end
  endtask

  initial begin
    // -------------------------
    // TEST 1 - R-type ADD
    // -------------------------
    instr = 32'h003100B3;
    check_ctrl("TEST1 R-ADD", 1, 0, 0, 0, 0, 0, 0);

    // -------------------------
    // TEST 2 - LW
    // -------------------------
    instr = 32'h00412083;
    check_ctrl("TEST2 LW", 1, 1, 0, 0, 0, 1, 0);

    // -------------------------
    // TEST 3 - SW
    // -------------------------
    instr = 32'h00112423;
    check_ctrl("TEST3 SW", 0, 0, 1, 0, 0, 0, 0);

    // -------------------------
    // TEST 4 - BEQ
    // -------------------------
    instr = 32'h00208463;
    check_ctrl("TEST4 BEQ", 0, 0, 0, 1, 0, 0, 0);

    // -------------------------
    // TEST 5 - JAL
    // -------------------------
    instr = 32'h0000006F;
    check_ctrl("TEST5 JAL", 1, 0, 0, 0, 1, 0, 0);

    // -------------------------
    // TEST 6 - Illegal instruction
    // -------------------------
    instr = 32'hFFFF_FFFF;
    check_ctrl("TEST6 ILLEGAL", 0, 0, 0, 0, 0, 0, 1);

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
