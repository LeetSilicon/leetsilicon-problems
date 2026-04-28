module tb;

  logic [2:0] in;
  logic       en;
  logic [7:0] out;
  logic       en_hi_ok, en_lo_ok;

  int pass = 0, fail = 0;

  decoder #(.N(3)) dut (.*);

  task automatic check(string name, logic [7:0] exp);
    #1;
    if (out === exp) begin
      pass++;
      $display("PASS: %s", name);
    end else begin
      fail++;
      $display("FAIL: %s got=%b", name, out);
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
    // TEST 1 - Decode input 0
    // -------------------------
    en = 1;
    in = 0;
    check("TEST1 in=0", 8'b0000_0001);

    // -------------------------
    // TEST 2 - Decode input 3
    // -------------------------
    in = 3;
    check("TEST2 in=3", 8'b0000_1000);

    // -------------------------
    // TEST 3 - Decode input 7
    // -------------------------
    in = 7;
    check("TEST3 in=7", 8'b1000_0000);

    // -------------------------
    // TEST 4 - Disabled output zero
    // -------------------------
    en = 0;
    in = 5;
    check("TEST4 disabled", 8'b0000_0000);

    // -------------------------
    // TEST 5 - Full one-hot sweep
    // -------------------------
    begin
      logic ok;
      ok = 1;
      en = 1;
      for (int i = 0; i < 8; i++) begin
        in = i[2:0];
        #1;
        ok = ok && (out === (8'b1 << i));
      end
      check2("TEST5 Sweep one-hot", ok);
    end

    // -------------------------
    // TEST 6 - Enable toggles same input
    // -------------------------
    in = 4;
    en = 1;
    #1;
    en_hi_ok = (out == 8'b0001_0000);
    en = 0;
    #1;
    en_lo_ok = (out == 8'b0000_0000);
    check2("TEST6 Enable toggle", en_hi_ok && en_lo_ok);

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
