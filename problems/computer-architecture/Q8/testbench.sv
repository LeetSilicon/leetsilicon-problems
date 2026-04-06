module tb;
  logic [31:0] a, b, result;
  logic [3:0]  op;
  logic        zero, carry, overflow, negative;
  int          p = 0, f = 0;

  // DUT instantiation
  alu #(.W(32)) dut (.*);

  task automatic check(input string msg, input logic [31:0] exp);
    #1;
    if (result === exp) begin
      p++;
      $display("PASS: %s", msg);
    end else begin
      f++;
      $display("FAIL: %s  exp=%h  got=%h", msg, exp, result);
    end
  endtask

  initial begin
    op = 4'd0; a = 5;            b = 3;         check("ADD",        8);
    op = 4'd1; a = 10;           b = 3;         check("SUB",        7);
    op = 4'd2; a = 32'hFF00;     b = 32'h0F0F;  check("AND",        32'h0F00);
    op = 4'd3; a = 32'hFF00;     b = 32'h0F0F;  check("OR",         32'hFF0F);
    op = 4'd4; a = 32'hFF00;     b = 32'h0F0F;  check("XOR",        32'hF00F);
    op = 4'd5; a = 32'hFFFFFFFF; b = 1;         check("SLT(-1<1)",  1);
    op = 4'd5; a = 1;            b = 32'hFFFFFFFF; check("SLT(1>-1)", 0);

    // Zero flag
    op = 4'd1; a = 5; b = 5; #1;
    if (zero === 1) begin p++; $display("PASS: zero flag"); end
    else begin f++; $display("FAIL: zero flag"); end

    // Overflow: MAX_INT + 1
    op = 4'd0; a = 32'h7FFF_FFFF; b = 1; #1;
    if (overflow === 1) begin p++; $display("PASS: add overflow"); end
    else begin f++; $display("FAIL: add overflow"); end

    // No overflow: 5 + 3
    op = 4'd0; a = 5; b = 3; #1;
    if (overflow === 0) begin p++; $display("PASS: no overflow"); end
    else begin f++; $display("FAIL: no overflow"); end

    // Negative flag
    op = 4'd1; a = 3; b = 10; #1;
    if (negative === 1) begin p++; $display("PASS: negative flag"); end
    else begin f++; $display("FAIL: negative flag"); end

    // Summary
    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule