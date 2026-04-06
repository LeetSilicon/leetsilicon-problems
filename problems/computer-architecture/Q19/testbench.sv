module tb;
  logic        clk;
  logic        we;
  logic [4:0]  wa, ra1, ra2;
  logic [31:0] wd, rd1, rd2;
  int          p = 0, f = 0;

  // Clock generation
  initial clk = 0;
  always #5 clk = ~clk;
  // DUT instantiation
  regfile #(.W(32), .DEPTH(32)) dut (.*);

  initial begin
    // Write to r5 then read it back on port 1
    @(negedge clk); we = 1; wa = 5; wd = 32'hCAFE;
    @(posedge clk); @(negedge clk); we = 0;
    ra1 = 5;
    #1;
    if (rd1 === 32'hCAFE) begin p++; $display("PASS: read r5 port1"); end
    else begin f++; $display("FAIL: read r5 port1 got %h", rd1); end

    // Read same register on both ports
    ra2 = 5;
    #1;
    if (rd1 === 32'hCAFE && rd2 === 32'hCAFE) begin p++; $display("PASS: dual-port same reg"); end
    else begin f++; $display("FAIL: dual-port rd1=%h rd2=%h", rd1, rd2); end

    // Write to r10, read different registers on both ports
    @(negedge clk); we = 1; wa = 10; wd = 32'hBEEF;
    @(posedge clk); @(negedge clk); we = 0;
    ra1 = 5; ra2 = 10;
    #1;
    if (rd1 === 32'hCAFE && rd2 === 32'hBEEF) begin p++; $display("PASS: two-reg read"); end
    else begin f++; $display("FAIL: two-reg rd1=%h rd2=%h", rd1, rd2); end

    // Write to x0 — must remain zero
    @(negedge clk); we = 1; wa = 0; wd = 32'hFFFF;
    @(posedge clk); @(negedge clk); we = 0;
    ra1 = 0;
    #1;
    if (rd1 === 0) begin p++; $display("PASS: x0 = 0"); end
    else begin f++; $display("FAIL: x0 got %h", rd1); end

    // Read-during-write (read-first: should see OLD value)
    @(negedge clk); we = 1; wa = 5; wd = 32'h1234;
    ra1 = 5;
    #1;  // before clock edge, read port sees old value
    if (rd1 === 32'hCAFE) begin p++; $display("PASS: read-first semantics"); end
    else begin f++; $display("FAIL: read-during-write rd1=%h", rd1); end
    @(posedge clk); @(negedge clk);
    we = 0;
    #1;
    if (rd1 === 32'h1234) begin p++; $display("PASS: new value after clk"); end
    else begin f++; $display("FAIL: post-write rd1=%h", rd1); end

    // Summary
    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule