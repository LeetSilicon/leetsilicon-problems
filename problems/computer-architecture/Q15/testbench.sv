module tb;

  logic [4:0] id_rs1, id_rs2, ex_rd;
  logic       ex_mem_read, id_uses_rs2, stall;
  logic       s1, s2;

  int pass = 0, fail = 0;

  hazard_detect dut (.*);

  task automatic check(string name, logic exp);
    #1;
    if (stall === exp) begin
      pass++;
      $display("PASS: %s", name);
    end else begin
      fail++;
      $display("FAIL: %s stall=%b exp=%b", name, stall, exp);
    end
  endtask

  initial begin
    id_uses_rs2 = 1;

    // -------------------------
    // TEST 1 - Load-use on rs1 and rs2
    // -------------------------
    ex_mem_read = 1;
    ex_rd       = 5;
    id_rs1      = 5;
    id_rs2      = 0;
    #1;
    s1 = stall;
    id_rs1 = 0;
    id_rs2 = 5;
    #1;
    s2 = stall;
    if (s1 === 1 && s2 === 1) begin
      pass++;
      $display("PASS: TEST1 Load-use rs1 and rs2");
    end else begin
      fail++;
      $display("FAIL: TEST1 s1=%b s2=%b", s1, s2);
    end

    // -------------------------
    // TEST 2 - No hazard without mem_read
    // -------------------------
    ex_mem_read = 0;
    check("TEST2 No mem_read no stall", 0);

    // -------------------------
    // TEST 3 - Destination x0 never stalls
    // -------------------------
    ex_mem_read = 1;
    ex_rd       = 0;
    check("TEST3 Rd is x0 no stall", 0);

    // -------------------------
    // TEST 4 - I-type rs2 unused no stall on rs2 match
    // -------------------------
    ex_rd       = 5;
    id_rs1      = 0;
    id_rs2      = 5;
    id_uses_rs2 = 0;
    check("TEST4 I-type ignore rs2", 0);

    // -------------------------
    // TEST 5 - I-type rs1 still stalls
    // -------------------------
    id_rs1 = 5;
    check("TEST5 I-type rs1 stall", 1);

    // -------------------------
    // TEST 6 - No register match
    // -------------------------
    id_uses_rs2 = 1;
    ex_rd  = 5;
    id_rs1 = 3;
    id_rs2 = 4;
    check("TEST6 No register match", 0);

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
