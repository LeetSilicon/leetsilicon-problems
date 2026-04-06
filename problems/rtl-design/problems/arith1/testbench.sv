module tb;
  logic [31:0] a, b, result;
  logic        sub, carry_out, overflow;
  int          p = 0, f = 0;

  adder_sub #(.WIDTH(32)) dut (.*);

  task automatic check(
    input string       msg,
    input logic [31:0] ia,
    input logic [31:0] ib,
    input logic        is_sub,
    input logic [31:0] exp_result,
    input logic        exp_carry,
    input logic        exp_overflow
  );
    begin
      a = ia; b = ib; sub = is_sub; #1;
      if (result === exp_result && carry_out === exp_carry && overflow === exp_overflow) begin
        p++;
        $display("PASS: %s", msg);
      end else begin
        f++;
        $display("FAIL: %s result=%h carry=%b ovf=%b", msg, result, carry_out, overflow);
      end
    end
  endtask

  initial begin
    check("TC1 add 7 + 5",                32'd7,          32'd5,          1'b0, 32'd12,         1'b0, 1'b0);
    check("TC2 sub 20 - 3",               32'd20,         32'd3,          1'b1, 32'd17,         1'b1, 1'b0);
    check("TC3 add carry-out",            32'hFFFF_FFFF,  32'd1,          1'b0, 32'h0000_0000,  1'b1, 1'b0);
    check("TC4 signed add overflow",      32'h7FFF_FFFF,  32'd1,          1'b0, 32'h8000_0000,  1'b0, 1'b1);
    check("TC5 signed sub overflow",      32'h8000_0000,  32'd1,          1'b1, 32'h7FFF_FFFF,  1'b1, 1'b1);
    check("TC6 sub borrow example",       32'd3,          32'd5,          1'b1, 32'hFFFF_FFFE,  1'b0, 1'b0);

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule