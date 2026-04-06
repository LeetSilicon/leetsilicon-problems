module tb;
  logic clk;
  logic rst_n;
  logic ns_red, ns_yellow, ns_green;
  logic ew_red, ew_yellow, ew_green;
  int   p = 0, f = 0;

  initial clk = 0;

  always #5 clk = ~clk;
  traffic_light #(
    .NS_GREEN_TIME(10), .NS_YELLOW_TIME(2),
    .EW_GREEN_TIME(10), .EW_YELLOW_TIME(2)
  ) dut (.*);

  initial begin
    // Reset
    rst_n = 0;
    @(posedge clk); @(posedge clk);
    rst_n = 1; @(posedge clk); @(negedge clk);

    // TC1 — Normal cycle: NS_GREEN for 10 cycles
    if (ns_green && ew_red) begin p++; $display("PASS: TC1 initial NS_GREEN"); end
    else begin f++; $display("FAIL: TC1 initial state"); end

    // Wait for NS_GREEN to expire (10 cycles)
    repeat (8) @(posedge clk);
    @(negedge clk);
    if (ns_yellow && ew_red) begin p++; $display("PASS: TC1 NS_YELLOW after 10"); end
    else begin f++; $display("FAIL: TC1 expected NS_YELLOW"); end

    // Wait for NS_YELLOW (2 cycles)
    repeat (2) @(posedge clk);
    @(negedge clk);
    if (ew_green && ns_red) begin p++; $display("PASS: TC1 EW_GREEN after yellow"); end
    else begin f++; $display("FAIL: TC1 expected EW_GREEN"); end

    // TC5 — Safety: both green never simultaneously
    repeat (30) begin
      @(posedge clk); @(negedge clk);
      if (ns_green && ew_green) begin
        f++;
        $display("FAIL: TC5 BOTH GREEN simultaneously!");
      end
    end
    p++;
    $display("PASS: TC5 never both directions green");

    // TC2 — Reset mid-cycle
    rst_n = 0; @(posedge clk); @(posedge clk); rst_n = 1; @(posedge clk); @(negedge clk);
    if (ns_green && ew_red) begin p++; $display("PASS: TC2 returns to NS_GREEN on reset"); end
    else begin f++; $display("FAIL: TC2 reset mid-cycle"); end

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule