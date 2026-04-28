module tb;

  logic [31:0] a[4], b[4], result[4];
  logic [3:0]  mask;
  logic [2:0]  op;

  int pass = 0, fail = 0;

  simd_alu #(.LANES(4), .W(32)) dut (.*);

  task automatic check(string name, logic ok);
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
    for (int i = 0; i < 4; i++) begin
      a[i] = i + 1;
      b[i] = 10;
    end

    // -------------------------
    // TEST 1 - SIMD ADD all lanes
    // -------------------------
    mask = 4'b1111;
    op   = 3'd0;
    check("TEST1 SIMD ADD", result[0] == 11 && result[3] == 14);

    // -------------------------
    // TEST 2 - Masked lanes zero
    // -------------------------
    mask = 4'b0101;
    check("TEST2 Mask inactive lanes", result[1] == 0 && result[3] == 0);

    // -------------------------
    // TEST 3 - SIMD SUB wrap
    // -------------------------
    mask = 4'b1111;
    op   = 3'd1;
    check("TEST3 SIMD SUB lane0", result[0] == 32'hFFFFFFF7);

    // -------------------------
    // TEST 4 - SIMD AND
    // -------------------------
    a[0] = 32'hFF00;
    b[0] = 32'h0F0F;
    op   = 3'd2;
    mask = 4'b1111;
    check("TEST4 SIMD AND", result[0] == 32'h0F00);

    // -------------------------
    // TEST 5 - SIMD XOR
    // -------------------------
    op = 3'd4;
    check("TEST5 SIMD XOR", result[0] == 32'hF00F);

    // -------------------------
    // TEST 6 - Lane0 unsigned add wrap
    // -------------------------
    a[0] = 32'hFFFFFFFF;
    b[0] = 1;
    a[1] = 0;
    b[1] = 0;
    a[2] = 0;
    b[2] = 0;
    a[3] = 0;
    b[3] = 0;
    op   = 3'd0;
    mask = 4'b0001;
    check("TEST6 Lane0 add wrap", result[0] == 32'h0);

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
