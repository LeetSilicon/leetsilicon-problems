module tb;
  logic [31:0] instr, imm;
  logic [4:0]  rs1, rs2, rd;
  logic [6:0]  opcode, funct7;
  logic [2:0]  funct3;
  logic        reg_write, mem_read, mem_write, branch, alu_src, jump, mem_to_reg, illegal_instruction;
  logic [3:0]  alu_op;
  int          p = 0, f = 0;

  instr_decode dut (.*);

  task automatic check_ctrl(
    input string msg,
    input logic  ew, emr, emw, eb, ej, em2r, eillegal
  );
    #1;
    if (reg_write === ew && mem_read === emr && mem_write === emw &&
        branch === eb && jump === ej && mem_to_reg === em2r && illegal_instruction === eillegal) begin
      p++;
      $display("PASS: %s", msg);
    end else begin
      f++;
      $display("FAIL: %s", msg);
    end
  endtask

  initial begin
    instr = 32'h003100B3; check_ctrl("R-ADD",   1, 0, 0, 0, 0, 0, 0);
    instr = 32'h00412083; check_ctrl("LW",      1, 1, 0, 0, 0, 1, 0);
    instr = 32'h00112423; check_ctrl("SW",      0, 0, 1, 0, 0, 0, 0);
    instr = 32'h00208463; check_ctrl("BEQ",     0, 0, 0, 1, 0, 0, 0);
    instr = 32'h0000006F; check_ctrl("JAL",     1, 0, 0, 0, 1, 0, 0);
    instr = 32'hFFFF_FFFF; check_ctrl("ILLEGAL",0, 0, 0, 0, 0, 0, 1);

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule