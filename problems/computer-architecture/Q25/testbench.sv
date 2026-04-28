module tb;

  logic [31:0] addr [4];
  logic [3:0]  active_mask, conflict_mask;
  logic        has_conflict, can_issue;
  logic [1:0]  conflict_bank_id;

  int pass = 0, fail = 0;

  bank_conflict #(.N_BANKS(4), .THREADS(4), .ADDR_W(32), .BANK_OFFSET(2)) dut (.*);

  task automatic check(string name, logic ok);
    #1;
    if (ok) begin
      pass++;
      $display("PASS: %s", name);
    end else begin
      fail++;
      $display("FAIL: %s cc=%b ci=%b bank=%0d", name, has_conflict, can_issue, conflict_bank_id);
    end
  endtask

  initial begin
    // -------------------------
    // TEST 1 - No conflict distinct banks
    // -------------------------
    active_mask = 4'b1111;
    addr[0]     = 32'h0;
    addr[1]     = 32'h4;
    addr[2]     = 32'h8;
    addr[3]     = 32'hC;
    check("TEST1 No conflict", !has_conflict && can_issue);

    // -------------------------
    // TEST 2 - Two threads same bank
    // -------------------------
    addr[0] = 32'h4;
    addr[1] = 32'h14;
    check("TEST2 Conflict bank1", has_conflict && !can_issue && conflict_bank_id == 2'd1);

    // -------------------------
    // TEST 3 - Mask removes conflict
    // -------------------------
    active_mask = 4'b0010;
    check("TEST3 Masked thread", !has_conflict);

    // -------------------------
    // TEST 4 - Single active thread
    // -------------------------
    active_mask = 4'b0001;
    addr[0]     = 32'h0;
    addr[1]     = 32'h4;
    addr[2]     = 32'h4;
    addr[3]     = 32'h4;
    check("TEST4 Single thread no conflict", !has_conflict && can_issue);

    // -------------------------
    // TEST 5 - No active threads
    // -------------------------
    active_mask = 4'b0000;
    check("TEST5 Empty mask no conflict", !has_conflict);

    // -------------------------
    // TEST 6 - Three-way same bank
    // -------------------------
    active_mask = 4'b1111;
    addr[0]     = 32'h8;
    addr[1]     = 32'h18;
    addr[2]     = 32'h28;
    addr[3]     = 32'h0;
    check("TEST6 Triple same bank", has_conflict && !can_issue);

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
