module tb;

  logic        clk;
  logic        we;
  logic [4:0]  wa, ra1, ra2;
  logic [31:0] wd, rd1, rd2;

  int pass = 0, fail = 0;

  initial clk = 0;
  always #5 clk = ~clk;

  regfile #(.W(32), .DEPTH(32)) dut (.*);

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
    // -------------------------
    // TEST 1 - Write and read port1
    // -------------------------
    @(negedge clk);
    we  = 1;
    wa  = 5;
    wd  = 32'hCAFE;
    @(posedge clk);
    @(negedge clk);
    we  = 0;
    ra1 = 5;
    check("TEST1 Read r5 port1", rd1 === 32'hCAFE);

    // -------------------------
    // TEST 2 - Dual read same register
    // -------------------------
    ra2 = 5;
    check("TEST2 Dual port same reg", rd1 === 32'hCAFE && rd2 === 32'hCAFE);

    // -------------------------
    // TEST 3 - Two different registers
    // -------------------------
    @(negedge clk);
    we = 1;
    wa = 10;
    wd = 32'hBEEF;
    @(posedge clk);
    @(negedge clk);
    we  = 0;
    ra1 = 5;
    ra2 = 10;
    check("TEST3 Two different regs", rd1 === 32'hCAFE && rd2 === 32'hBEEF);

    // -------------------------
    // TEST 4 - x0 hardwired zero
    // -------------------------
    @(negedge clk);
    we  = 1;
    wa  = 0;
    wd  = 32'hFFFF;
    @(posedge clk);
    @(negedge clk);
    we  = 0;
    ra1 = 0;
    check("TEST4 x0 read zero", rd1 === 32'h0);

    // -------------------------
    // TEST 5 - Read during write (read-first)
    // -------------------------
    @(negedge clk);
    we  = 1;
    wa  = 5;
    wd  = 32'h1234;
    ra1 = 5;
    #1;
    check("TEST5 Read-first sees old", rd1 === 32'hCAFE);

    // -------------------------
    // TEST 6 - Value after write clock
    // -------------------------
    @(posedge clk);
    @(negedge clk);
    we = 0;
    #1;
    check("TEST6 Post-edge new value", rd1 === 32'h1234);

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
