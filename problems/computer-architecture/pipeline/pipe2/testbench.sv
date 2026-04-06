module tb;
  logic [4:0] id_rs1, id_rs2, ex_rd;
  logic       ex_mem_read, id_uses_rs2, stall;
  int         p = 0, f = 0;

  // DUT instantiation
  hazard_detect dut (.*);

  task automatic check(input string msg, input logic exp);
    #1;
    if (stall === exp) begin
      p++;
      $display("PASS: %s", msg);
    end else begin
      f++;
      $display("FAIL: %s stall=%b exp=%b", msg, stall, exp);
    end
  endtask

  initial begin
    id_uses_rs2 = 1; // R-type uses both sources
    ex_mem_read = 1; ex_rd = 5; id_rs1 = 5; id_rs2 = 0; check("load-use rs1", 1);
    id_rs1 = 0; id_rs2 = 5;                              check("load-use rs2", 1);
    ex_mem_read = 0;                                      check("no mem_read",  0);
    ex_mem_read = 1; ex_rd = 0;                          check("rd = x0",      0);

    // I-type: rs2 field is part of immediate, should not trigger stall
    ex_rd = 5; id_rs1 = 0; id_rs2 = 5; id_uses_rs2 = 0;
    check("I-type no rs2 stall", 0);

    // I-type: rs1 still triggers stall
    id_rs1 = 5; id_uses_rs2 = 0;
    check("I-type rs1 stall", 1);

    // No match at all
    ex_rd = 5; id_rs1 = 3; id_rs2 = 4; id_uses_rs2 = 1;
    check("no match", 0);

    // Summary
    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule