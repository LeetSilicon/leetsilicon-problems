module tb;
  logic [4:0] rs1, rs2, ex_rd, mem_rd;
  logic       ex_wr, mem_wr;
  logic [1:0] fwd_a, fwd_b;
  int         p = 0, f = 0;

  // DUT instantiation
  forwarding_unit dut (
    .id_ex_rs1        (rs1),
    .id_ex_rs2        (rs2),
    .ex_mem_rd        (ex_rd),
    .mem_wb_rd        (mem_rd),
    .ex_mem_reg_write (ex_wr),
    .mem_wb_reg_write (mem_wr),
    .fwd_a            (fwd_a),
    .fwd_b            (fwd_b)
  );

  task automatic check(input string msg, input logic [1:0] ea, input logic [1:0] eb);
    #1;
    if (fwd_a === ea && fwd_b === eb) begin
      p++;
      $display("PASS: %s", msg);
    end else begin
      f++;
      $display("FAIL: %s", msg);
    end
  endtask

  initial begin
    // EX/MEM forwards rs1 => fwd_a=10
    rs1 = 5; rs2 = 6; ex_rd = 5; ex_wr = 1; mem_rd = 0; mem_wr = 0;
    check("EX fwd rs1",  2'b10, 2'b00);

    // EX/MEM forwards rs2 => fwd_b=10
    ex_rd = 6;
    check("EX fwd rs2",  2'b00, 2'b10);

    // MEM/WB forwards rs1 => fwd_a=01
    ex_rd = 0; ex_wr = 0; mem_rd = 5; mem_wr = 1;
    check("MEM fwd rs1", 2'b01, 2'b00);

    // Priority: both EX/MEM and MEM/WB match rs1 => EX/MEM wins (10)
    ex_rd = 5; ex_wr = 1; mem_rd = 5; mem_wr = 1;
    check("EX priority",  2'b10, 2'b00);

    // No match => 00
    rs1 = 7; rs2 = 8; ex_rd = 5; ex_wr = 1; mem_rd = 6; mem_wr = 1;
    check("no match", 2'b00, 2'b00);

    // x0 never forwards
    rs1 = 0; ex_rd = 0; ex_wr = 1;
    check("x0 no fwd", 2'b00, 2'b00);

    // Summary
    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule