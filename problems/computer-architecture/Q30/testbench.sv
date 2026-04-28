module tb;

  logic       clk;
  logic       rst_n, issue_req, done_req, any_available;
  logic [1:0] issue_fu, done_fu;
  logic [3:0] busy;

  int pass = 0, fail = 0;

  initial clk = 0;
  always #5 clk = ~clk;

  fu_tracker #(.N_FU(4)) dut (.*);

  task automatic check(string name, logic ok);
    #1;
    if (ok) begin
      pass++;
      $display("PASS: %s", name);
    end else begin
      fail++;
      $display("FAIL: %s busy=%b", name, busy);
    end
  endtask

  initial begin
    rst_n     = 0;
    issue_req = 0;
    done_req  = 0;
    @(posedge clk);
    @(posedge clk);
    rst_n = 1;

    // -------------------------
    // TEST 1 - Issue FU0 busy
    // -------------------------
    @(negedge clk);
    issue_req = 1;
    issue_fu  = 0;
    @(posedge clk);
    @(negedge clk);
    issue_req = 0;
    @(negedge clk);
    check("TEST1 FU0 busy", busy[0] && any_available);

    // -------------------------
    // TEST 2 - All FUs busy
    // -------------------------
    @(negedge clk);
    issue_req = 1;
    issue_fu  = 1;
    @(posedge clk);
    @(negedge clk);
    issue_fu = 2;
    @(posedge clk);
    @(negedge clk);
    issue_fu = 3;
    @(posedge clk);
    @(negedge clk);
    issue_req = 0;
    @(negedge clk);
    check("TEST2 All busy", !any_available);

    // -------------------------
    // TEST 3 - Free FU2
    // -------------------------
    @(negedge clk);
    done_req = 1;
    done_fu  = 2;
    @(posedge clk);
    @(negedge clk);
    done_req = 0;
    @(negedge clk);
    check("TEST3 Free FU2", any_available && !busy[2]);

    // -------------------------
    // TEST 4 - Same-cycle issue and done
    // -------------------------
    @(negedge clk);
    issue_req = 1;
    issue_fu  = 2;
    done_req  = 1;
    done_fu   = 1;
    @(posedge clk);
    @(negedge clk);
    issue_req = 0;
    done_req  = 0;
    @(negedge clk);
    check("TEST4 Same-cycle issue and done", busy[2] && !busy[1]);

    // -------------------------
    // TEST 5 - Issue only FU1 after partial reset path
    // -------------------------
    rst_n = 0;
    @(posedge clk);
    @(posedge clk);
    rst_n = 1;
    @(posedge clk);
    @(negedge clk);
    issue_req = 1;
    issue_fu  = 1;
    @(posedge clk);
    @(negedge clk);
    issue_req = 0;
    @(negedge clk);
    check("TEST5 Post-reset issue FU1", busy[1] && any_available);

    // -------------------------
    // TEST 6 - Done clears FU1
    // -------------------------
    @(negedge clk);
    done_req = 1;
    done_fu  = 1;
    @(posedge clk);
    @(negedge clk);
    done_req = 0;
    @(negedge clk);
    check("TEST6 Done clears FU1", !busy[1]);

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
