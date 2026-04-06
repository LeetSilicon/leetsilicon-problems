module tb;
  logic       clk;
  logic       rst_n;
  logic [3:0] req, grant;
  int         p = 0, f = 0;

  // Clock generation
  initial clk = 0;
  always #5 clk = ~clk;
  // DUT instantiation
  rr_arbiter #(.N(4)) dut (.*);

  initial begin
    // Reset sequence
    rst_n = 0;
    req   = 0;
    @(posedge clk);
    @(posedge clk);
    rst_n = 1;

    // Requests on channels 1 and 3 — lowest round-robin index from 0 is 1
    @(negedge clk); req = 4'b1010;
    #1;  // comb settle: last=0, search from 1 → grant[1]
    if (grant == 4'b0010) begin p++; $display("PASS: grant1"); end
    else begin f++; $display("FAIL: got %b", grant); end
    @(posedge clk);  // last updates to 1

    // After one grant update, round-robin advances past 1 and picks 3
    @(negedge clk);
    #1;
    if (grant == 4'b1000) begin p++; $display("PASS: RR advanced to 3"); end
    else begin f++; $display("FAIL: got %b", grant); end
    @(posedge clk);  // last updates to 3

    // Full rotation: all 4 requestors active
    @(negedge clk); req = 4'b1111;
    #1;  // last=3, search from 0 → grant[0]
    if (grant == 4'b0001) begin p++; $display("PASS: RR 0"); end
    else begin f++; $display("FAIL: full RR expected 0001 got %b", grant); end
    @(posedge clk);  // last updates to 0

    @(negedge clk); #1;  // last=0, search from 1 → grant[1]
    if (grant == 4'b0010) begin p++; $display("PASS: RR 1"); end
    else begin f++; $display("FAIL: full RR expected 0010 got %b", grant); end
    @(posedge clk);

    @(negedge clk); #1;  // last=1, search from 2 → grant[2]
    if (grant == 4'b0100) begin p++; $display("PASS: RR 2"); end
    else begin f++; $display("FAIL: full RR expected 0100 got %b", grant); end
    @(posedge clk);

    @(negedge clk); #1;  // last=2, search from 3 → grant[3]
    if (grant == 4'b1000) begin p++; $display("PASS: RR 3"); end
    else begin f++; $display("FAIL: full RR expected 1000 got %b", grant); end
    @(posedge clk);

    // No requests: grant should be 0
    @(negedge clk); req = 4'b0000;
    #1;
    if (grant == 4'b0000) begin p++; $display("PASS: no requests"); end
    else begin f++; $display("FAIL: no req got %b", grant); end

    // Single requestor: always gets grant
    @(posedge clk); @(negedge clk); req = 4'b0100;
    #1;
    if (grant == 4'b0100) begin p++; $display("PASS: single req"); end
    else begin f++; $display("FAIL: single req got %b", grant); end

    // Summary
    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule