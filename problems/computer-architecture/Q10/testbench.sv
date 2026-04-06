module tb;
  logic [31:0] a, b, result;
  logic        is_sub, overflow, carry;
  int          p = 0, f = 0;

  // DUT instantiation
  overflow_detect #(.W(32)) dut (.*);

  initial begin
    // Signed overflow: MAX_INT + 1
    is_sub = 0;
    a      = 32'h7FFF_FFFF;
    b      = 1;
    result = a + b;
    #1;
    if (overflow) begin p++; $display("PASS: MAX+1 overflow"); end
    else begin f++; $display("FAIL: MAX+1 overflow"); end

    // No overflow: 5 + 3
    a      = 5;
    b      = 3;
    result = 8;
    #1;
    if (!overflow) begin p++; $display("PASS: 5+3 no overflow"); end
    else begin f++; $display("FAIL: 5+3 no overflow"); end

    // Negative overflow: MIN_INT + (-1)
    a      = 32'h8000_0000; // -2147483648
    b      = 32'hFFFF_FFFF; // -1
    result = a + b;          // wraps to 0x7FFFFFFF = +2147483647
    #1;
    if (overflow) begin p++; $display("PASS: MIN+(-1) overflow"); end
    else begin f++; $display("FAIL: MIN+(-1) overflow"); end

    // Subtraction overflow: MAX_INT - (-1) = MAX_INT + 1
    is_sub = 1;
    a      = 32'h7FFF_FFFF;
    b      = 32'hFFFF_FFFF; // -1
    result = a - b;          // wraps to 0x80000000
    #1;
    if (overflow) begin p++; $display("PASS: MAX-(-1) sub overflow"); end
    else begin f++; $display("FAIL: MAX-(-1) sub overflow"); end

    // No sub overflow: 10 - 3
    a = 10; b = 3; result = 7; is_sub = 1;
    #1;
    if (!overflow) begin p++; $display("PASS: 10-3 no sub overflow"); end
    else begin f++; $display("FAIL: 10-3 no sub overflow"); end

    // Carry: unsigned overflow 0xFFFFFFFF + 1
    is_sub = 0;
    a      = 32'hFFFF_FFFF;
    b      = 1;
    result = a + b;
    #1;
    if (carry) begin p++; $display("PASS: carry on FFFF+1"); end
    else begin f++; $display("FAIL: carry on FFFF+1"); end

    // Summary
    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule