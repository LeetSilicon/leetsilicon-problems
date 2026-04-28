module tb;

  logic [7:0] in;
  logic [2:0] out;
  logic       valid;

  int pass = 0, fail = 0;

  priority_enc #(.N(8)) dut (.*);

  task automatic check(string name, logic [2:0] eo, logic ev);
    #1;
    if (out === eo && valid === ev) begin
      pass++;
      $display("PASS: %s", name);
    end else begin
      fail++;
      $display("FAIL: %s", name);
    end
  endtask

  initial begin
    // -------------------------
    // TEST 1 - Highest set bit in upper nibble
    // -------------------------
    in = 8'b1010_0000;
    check("TEST1 Priority bit5", 3'd5, 1'b1);

    // -------------------------
    // TEST 2 - Lowest set bit
    // -------------------------
    in = 8'b0000_0001;
    check("TEST2 Priority bit0", 3'd0, 1'b1);

    // -------------------------
    // TEST 3 - No bits set
    // -------------------------
    in = 8'b0000_0000;
    check("TEST3 No valid", 3'd0, 1'b0);

    // -------------------------
    // TEST 4 - Lowest among several
    // -------------------------
    in = 8'b0010_1100;
    check("TEST4 Lowest set bit2", 3'd2, 1'b1);

    // -------------------------
    // TEST 5 - Isolated high bit
    // -------------------------
    in = 8'b0000_1000;
    check("TEST5 Bit3 only", 3'd3, 1'b1);

    // -------------------------
    // TEST 6 - MSB side priority
    // -------------------------
    in = 8'b1000_0001;
    check("TEST6 LSB wins over MSB", 3'd0, 1'b1);

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
