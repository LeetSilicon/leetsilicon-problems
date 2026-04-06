module tb;
  logic [31:0] a[4], b[4], result[4];
  logic [3:0]  mask;
  logic [2:0]  op;
  int          p = 0, f = 0;

  // DUT instantiation
  simd_alu #(.LANES(4), .W(32)) dut (.*);

  initial begin
    // Initialise inputs: a = [1,2,3,4], b = [10,10,10,10]
    for (int i = 0; i < 4; i++) begin
      a[i] = i + 1;
      b[i] = 10;
    end

    // All lanes active — ADD
    mask = 4'b1111;
    op   = 3'd0;
    #1;
    if (result[0] == 11 && result[3] == 14) begin
      p++;
      $display("PASS: SIMD ADD");
    end else begin
      f++;
      $display("FAIL");
    end

    // Mask lanes 1 and 3 — they should output 0
    mask = 4'b0101;
    #1;
    if (result[1] == 0 && result[3] == 0) begin
      p++;
      $display("PASS: masked lanes = 0");
    end else begin
      f++;
      $display("FAIL: masked lanes r1=%0d r3=%0d", result[1], result[3]);
    end

    // SUB operation: a - b
    mask = 4'b1111;
    op   = 3'd1;
    #1;
    // a[3]=4, b[3]=10, result should be 4-10 (unsigned wrap)
    if (result[0] == 32'hFFFFFFF7) begin
      p++;
      $display("PASS: SIMD SUB");
    end else begin
      f++;
      $display("FAIL: SIMD SUB r0=%h", result[0]);
    end

    // AND operation
    a[0] = 32'hFF00; b[0] = 32'h0F0F;
    op   = 3'd2;
    #1;
    if (result[0] == 32'h0F00) begin
      p++;
      $display("PASS: SIMD AND");
    end else begin
      f++;
      $display("FAIL: SIMD AND r0=%h", result[0]);
    end

    // XOR operation
    op = 3'd4;
    #1;
    if (result[0] == 32'hF00F) begin
      p++;
      $display("PASS: SIMD XOR");
    end else begin
      f++;
      $display("FAIL: SIMD XOR r0=%h", result[0]);
    end

    // Summary
    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule