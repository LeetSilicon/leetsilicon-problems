module tb;
  logic [31:0] a, b;
  logic [2:0]  funct3;
  logic        take_branch;
  int          p = 0, f = 0;

  // DUT instantiation
  branch_cmp #(.W(32)) dut (.*);

  task automatic check(input string msg, input logic exp);
    #1;
    if (take_branch === exp) begin
      p++;
      $display("PASS: %s", msg);
    end else begin
      f++;
      $display("FAIL: %s", msg);
    end
  endtask

  initial begin
    a = 5;            b = 5; funct3 = 3'b000; check("BEQ taken",     1);
    a = 5;            b = 6; funct3 = 3'b000; check("BEQ not taken", 0);
                             funct3 = 3'b001; check("BNE taken",     1);
    a = 32'hFFFF_FFFF; b = 1; funct3 = 3'b100; check("BLT signed",   1);
                              funct3 = 3'b110; check("BLTU unsigned", 0);

    // Summary
    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule