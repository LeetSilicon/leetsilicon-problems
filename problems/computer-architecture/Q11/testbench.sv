module tb;

  logic [31:0] data_in, data_out;
  logic [4:0]  shamt;
  logic [1:0]  shift_type;

  int pass = 0, fail = 0;

  barrel_shifter #(.W(32)) dut (.*);

  task automatic check(string name, logic [31:0] exp);
    #1;
    if (data_out === exp) begin
      pass++;
      $display("PASS: %s", name);
    end else begin
      fail++;
      $display("FAIL: %s got=%h", name, data_out);
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
    // TEST 1 - SLL
    // -------------------------
    data_in    = 32'h0000_0001;
    shamt      = 4;
    shift_type = 2'b00;
    check("TEST1 SLL", 32'h0000_0010);

    // -------------------------
    // TEST 2 - SRL
    // -------------------------
    data_in    = 32'h0000_0080;
    shamt      = 3;
    shift_type = 2'b01;
    check("TEST2 SRL", 32'h0000_0010);

    // -------------------------
    // TEST 3 - SRA arithmetic
    // -------------------------
    data_in    = 32'hF000_0000;
    shamt      = 4;
    shift_type = 2'b10;
    check("TEST3 SRA", 32'hFF00_0000);

    // -------------------------
    // TEST 4 - Zero shift all modes
    // -------------------------
    begin
      logic z0, z1, z2;
      data_in    = 32'hDEAD_BEEF;
      shamt      = 0;
      shift_type = 2'b00;
      #1;
      z0 = (data_out === 32'hDEAD_BEEF);
      shift_type = 2'b01;
      #1;
      z1 = (data_out === 32'hDEAD_BEEF);
      shift_type = 2'b10;
      #1;
      z2 = (data_out === 32'hDEAD_BEEF);
      check2("TEST4 Zero shift SLL SRL SRA", z0 && z1 && z2);
    end

    // -------------------------
    // TEST 5 - Maximum shift amount
    // -------------------------
    begin
      logic m0, m1, m2;
      data_in    = 32'h0000_0001;
      shamt      = 31;
      shift_type = 2'b00;
      #1;
      m0 = (data_out === 32'h8000_0000);
      data_in    = 32'h8000_0000;
      shift_type = 2'b01;
      #1;
      m1 = (data_out === 32'h0000_0001);
      shift_type = 2'b10;
      #1;
      m2 = (data_out === 32'hFFFF_FFFF);
      check2("TEST5 Max shift SLL SRL SRA", m0 && m1 && m2);
    end

    // -------------------------
    // TEST 6 - SRA positive operand
    // -------------------------
    data_in    = 32'h7000_0000;
    shamt      = 4;
    shift_type = 2'b10;
    check("TEST6 SRA positive", 32'h0700_0000);

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
