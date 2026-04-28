module tb;

  logic [4:0] rs1, rs2, ex_rd, mem_rd;
  logic       ex_wr, mem_wr;
  logic [1:0] fwd_a, fwd_b;

  int pass = 0, fail = 0;

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

  task automatic check(string msg, logic [1:0] ea, logic [1:0] eb);
    #1;
    if (fwd_a === ea && fwd_b === eb) begin
      pass++;
      $display("PASS: %s", msg);
    end else begin
      fail++;
      $display("FAIL: %s", msg);
    end
  endtask

  initial begin
    // -------------------------
    // TEST 1 - EX/MEM forward rs1
    // -------------------------
    rs1 = 5;
    rs2 = 6;
    ex_rd = 5;
    ex_wr = 1;
    mem_rd = 0;
    mem_wr = 0;
    check("TEST1 EX fwd rs1", 2'b10, 2'b00);

    // -------------------------
    // TEST 2 - EX/MEM forward rs2
    // -------------------------
    ex_rd = 6;
    check("TEST2 EX fwd rs2", 2'b00, 2'b10);

    // -------------------------
    // TEST 3 - MEM/WB forward rs1
    // -------------------------
    ex_rd = 0;
    ex_wr = 0;
    mem_rd = 5;
    mem_wr = 1;
    check("TEST3 MEM fwd rs1", 2'b01, 2'b00);

    // -------------------------
    // TEST 4 - EX wins over MEM for same rs1
    // -------------------------
    ex_rd = 5;
    ex_wr = 1;
    mem_rd = 5;
    mem_wr = 1;
    check("TEST4 EX priority over MEM", 2'b10, 2'b00);

    // -------------------------
    // TEST 5 - No forward
    // -------------------------
    rs1 = 7;
    rs2 = 8;
    ex_rd = 5;
    ex_wr = 1;
    mem_rd = 6;
    mem_wr = 1;
    check("TEST5 No match", 2'b00, 2'b00);

    // -------------------------
    // TEST 6 - x0 never forwards
    // -------------------------
    rs1 = 0;
    ex_rd = 0;
    ex_wr = 1;
    check("TEST6 x0 no forward", 2'b00, 2'b00);

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
