module tb;
  logic [2:0] in;
  logic       en;
  logic [7:0] out;
  int         p = 0, f = 0;

  // DUT instantiation
  decoder #(.N(3)) dut (.*);

  task automatic check(input string msg, input logic [7:0] exp);
    #1;
    if (out === exp) begin
      p++;
      $display("PASS: %s", msg);
    end else begin
      f++;
      $display("FAIL: %s  got=%b", msg, out);
    end
  endtask

  initial begin
    en = 1;
    in = 0; check("in=0",     8'b0000_0001);
    in = 3; check("in=3",     8'b0000_1000);
    in = 7; check("in=7",     8'b1000_0000);
    en = 0;
    in = 5; check("disabled", 8'b0000_0000);

    // Full sweep: verify one-hot for all 8 inputs
    en = 1;
    for (int i = 0; i < 8; i++) begin
      in = i[2:0];
      #1;
      if (out === (8'b1 << i)) begin
        p++;
      end else begin
        f++;
        $display("FAIL: sweep in=%0d  exp=%b got=%b", i, (8'b1 << i), out);
      end
    end
    $display("INFO: sweep complete (%0d checked)", 8);

    // Enable toggle: same input, enable transitions
    in = 4;
    en = 1; #1;
    if (out == 8'b0001_0000) begin p++; $display("PASS: en=1 in=4"); end
    else begin f++; $display("FAIL: en=1 in=4"); end
    en = 0; #1;
    if (out == 8'b0000_0000) begin p++; $display("PASS: en=0 in=4"); end
    else begin f++; $display("FAIL: en=0 in=4"); end

    // Summary
    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule