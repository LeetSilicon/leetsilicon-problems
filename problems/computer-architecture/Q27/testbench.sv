module tb;
  logic [7:0] in;
  logic [2:0] out;
  logic       valid;
  int         p = 0, f = 0;

  // DUT instantiation
  priority_enc #(.N(8)) dut (.*);

  task automatic check(input string msg, input logic [2:0] eo, input logic ev);
    #1;
    if (out === eo && valid === ev) begin
      p++;
      $display("PASS: %s", msg);
    end else begin
      f++;
      $display("FAIL: %s", msg);
    end
  endtask

  initial begin
    in = 8'b1010_0000; check("bit5(lsb-first)", 3'd5, 1);
    in = 8'b0000_0001; check("bit0",            3'd0, 1);
    in = 8'b0000_0000; check("none",            3'd0, 0);
    in = 8'b0010_1100; check("lowest=2",        3'd2, 1);
    in = 8'b0000_1000; check("bit3",            3'd3, 1);

    // Summary
    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule