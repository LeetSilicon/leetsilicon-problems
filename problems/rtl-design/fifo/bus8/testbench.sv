module tb;
  logic       clk;
  logic       rst_n;
  logic [3:0] request, grant;
  logic       grant_valid;
  int         p = 0, f = 0;

  initial clk = 0;

  always #5 clk = ~clk;
  bus_arbiter #(.NUM_MASTERS(4)) dut (.*);

  initial begin
    rst_n   = 0;
    request = 0;
    @(posedge clk); @(posedge clk);
    rst_n = 1;
    @(posedge clk); @(negedge clk);

    // TC1 — Fixed contention: masters 1 and 2 requesting
    request = 4'b0110;
    @(posedge clk); @(negedge clk);
    // Starting from last=0, first candidate is 1
    if (grant == 4'b0010) begin p++; $display("PASS: TC1 grant master1"); end
    else begin f++; $display("FAIL: TC1 grant=%b", grant); end

    // TC2 — Round-robin: all requesting
    request = 4'b1111;
    @(posedge clk); @(negedge clk);
    if ($countones(grant) == 1) begin p++; $display("PASS: TC2 one-hot grant"); end
    else begin f++; $display("FAIL: TC2 grant=%b", grant); end

    // Run several more cycles and verify rotation
    begin
      logic [3:0] grants_seen = 0;
      repeat (4) begin
        @(posedge clk); @(negedge clk);
        grants_seen |= grant;
      end
      if (grants_seen == 4'b1111) begin p++; $display("PASS: TC2 all masters served"); end
      else begin f++; $display("FAIL: TC2 not all served seen=%b", grants_seen); end
    end

    // TC4 — Single master
    request = 4'b1000;
    @(posedge clk); @(negedge clk);
    if (grant == 4'b1000) begin p++; $display("PASS: TC4 single master granted"); end
    else begin f++; $display("FAIL: TC4 grant=%b", grant); end

    // TC5 — No requests
    request = 4'b0000;
    @(posedge clk); @(negedge clk);
    if (grant == 4'b0000 && !grant_valid) begin p++; $display("PASS: TC5 no grant when no request"); end
    else begin f++; $display("FAIL: TC5"); end

    // TC6 — One-hot property: verify across several cycles
    request = 4'b1111;
    begin
      logic onehot_ok = 1;
      repeat (8) begin
        @(posedge clk); @(negedge clk);
        if ($countones(grant) > 1) onehot_ok = 0;
      end
      if (onehot_ok) begin p++; $display("PASS: TC6 always one-hot grant"); end
      else begin f++; $display("FAIL: TC6 multi-bit grant"); end
    end

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule