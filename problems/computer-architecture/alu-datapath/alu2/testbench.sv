module tb;
  logic [1:0] alu_op;
  logic [2:0] funct3;
  logic       funct7_b5;
  logic [3:0] alu_ctrl;
  int         p = 0, f = 0;

  // DUT instantiation
  alu_control dut (.*);

  task automatic check(input string msg, input logic [3:0] exp);
    #1;
    if (alu_ctrl === exp) begin
      p++;
      $display("PASS: %s", msg);
    end else begin
      f++;
      $display("FAIL: %s", msg);
    end
  endtask

  initial begin
    alu_op = 2'b00; funct3 = 3'b000; funct7_b5 = 0; check("LW = ADD", 4'd0);
    alu_op = 2'b01;                                  check("BR = SUB", 4'd1);
    alu_op = 2'b10; funct3 = 3'b000; funct7_b5 = 0; check("R-ADD",    4'd0);
    funct7_b5 = 1;                                   check("R-SUB",    4'd1);
    funct3    = 3'b111;                              check("R-AND",    4'd2);

    // Summary
    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule