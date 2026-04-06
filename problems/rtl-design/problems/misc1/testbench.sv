module tb;
  logic clk, rst_n, sig_in, rise_pulse, fall_pulse;
  int p=0, f=0;
  initial clk=0; always #5 clk=~clk;
  edge_detector dut(.*);
  initial begin
    rst_n=0; sig_in=0;
    @(posedge clk); @(posedge clk); rst_n=1;
    @(posedge clk); @(negedge clk);

    // TC1: Rising edge 0→1
    @(negedge clk); sig_in=0;
    @(posedge clk); @(negedge clk); sig_in=1;
    @(posedge clk); @(negedge clk);
    if (rise_pulse && !fall_pulse) begin p++; $display("PASS: TC1 rise"); end
    else begin f++; $display("FAIL: TC1 rise=%b fall=%b", rise_pulse, fall_pulse); end

    // TC2: Falling edge 1→0
    @(negedge clk); sig_in=0;
    @(posedge clk); @(negedge clk);
    if (!rise_pulse && fall_pulse) begin p++; $display("PASS: TC2 fall"); end
    else begin f++; $display("FAIL: TC2 rise=%b fall=%b", rise_pulse, fall_pulse); end

    // TC3: Count edges in sequence 0,1,0,1,0
    begin
      int rises=0, falls=0;
      @(negedge clk); sig_in=0;
      @(posedge clk); @(negedge clk); sig_in=1;
      @(posedge clk); @(negedge clk); if (rise_pulse) rises++;
      sig_in=0;
      @(posedge clk); @(negedge clk); if (fall_pulse) falls++;
      sig_in=1;
      @(posedge clk); @(negedge clk); if (rise_pulse) rises++;
      sig_in=0;
      @(posedge clk); @(negedge clk); if (fall_pulse) falls++;
      if (rises==2 && falls==2) begin p++; $display("PASS: TC3 rises=%0d falls=%0d", rises, falls); end
      else begin f++; $display("FAIL: TC3 rises=%0d falls=%0d", rises, falls); end
    end

    // TC4: No edge on constant high
    @(negedge clk); sig_in=1;
    @(posedge clk); @(posedge clk); @(negedge clk);
    if (!rise_pulse && !fall_pulse) begin p++; $display("PASS: TC4 steady"); end
    else begin f++; $display("FAIL: TC4"); end

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule
