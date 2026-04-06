module tb;
  logic        clk;
  logic        rst_n;
  logic        flush;
  logic        input_valid;
  logic [3:0]  opcode;
  logic [4:0]  src_a_reg, src_b_reg, dest_reg;
  logic [31:0] src_a_value, src_b_value;
  logic        wb_valid;
  logic [31:0] wb_result;
  logic [4:0]  wb_dest;
  int          p = 0, f = 0;

  initial clk = 0;

  always #5 clk = ~clk;
  pipelined_alu #(.WIDTH(32), .REG_ADDR(5)) dut (.*);

  task automatic issue(
    input logic [3:0]  op,
    input logic [4:0]  sa_reg,
    input logic [4:0]  sb_reg,
    input logic [31:0] sa_val,
    input logic [31:0] sb_val,
    input logic [4:0]  dst
  );
    begin
      input_valid  = 1;
      opcode       = op;
      src_a_reg    = sa_reg;
      src_b_reg    = sb_reg;
      src_a_value  = sa_val;
      src_b_value  = sb_val;
      dest_reg     = dst;
      @(posedge clk);
      #1;
    end
  endtask

  task automatic bubble;
    begin
      input_valid = 0;
      @(posedge clk);
      #1;
    end
  endtask

  initial begin
    rst_n       = 0;
    flush       = 0;
    input_valid = 0;
    opcode      = '0;
    src_a_reg   = '0;
    src_b_reg   = '0;
    src_a_value = '0;
    src_b_value = '0;
    dest_reg    = '0;
    @(posedge clk); @(posedge clk);
    rst_n = 1; @(posedge clk); #1;

    // TC1 — throughput with independent ops
    issue(4'd0, 5'd2, 5'd3, 32'd1, 32'd2, 5'd1);   // R1 = 3
    issue(4'd0, 5'd4, 5'd5, 32'd3, 32'd4, 5'd6);   // R6 = 7
    if (wb_valid && wb_result == 32'd3 && wb_dest == 5'd1) begin p++; $display("PASS: TC1 result1"); end
    else begin f++; $display("FAIL: TC1 result1 valid=%b res=%0d dst=%0d", wb_valid, wb_result, wb_dest); end

    issue(4'd0, 5'd7, 5'd8, 32'd5, 32'd6, 5'd9);   // R9 = 11
    if (wb_valid && wb_result == 32'd7 && wb_dest == 5'd6) begin p++; $display("PASS: TC1 result2"); end
    else begin f++; $display("FAIL: TC1 result2 valid=%b res=%0d dst=%0d", wb_valid, wb_result, wb_dest); end

    bubble;
    if (wb_valid && wb_result == 32'd11 && wb_dest == 5'd9) begin p++; $display("PASS: TC1 result3"); end
    else begin f++; $display("FAIL: TC1 result3 valid=%b res=%0d dst=%0d", wb_valid, wb_result, wb_dest); end

    // TC2 — RAW forwarding: R1=A+B, then R4=R1+C without stall
    issue(4'd0, 5'd2, 5'd3, 32'd10, 32'd3, 5'd1);  // R1 = 13
    issue(4'd0, 5'd1, 5'd5, 32'd0,  32'd5, 5'd4);  // should forward R1 => 18
    if (wb_valid && wb_result == 32'd13 && wb_dest == 5'd1) begin p++; $display("PASS: TC2 producer result"); end
    else begin f++; $display("FAIL: TC2 producer"); end

    bubble;
    if (wb_valid && wb_result == 32'd18 && wb_dest == 5'd4) begin p++; $display("PASS: TC2 forwarded consumer result"); end
    else begin f++; $display("FAIL: TC2 forwarded consumer got res=%0d dst=%0d", wb_result, wb_dest); end

    // TC3 — dependent chain R1 -> R2 -> R3
    issue(4'd0, 5'd2, 5'd3, 32'd4, 32'd6, 5'd1);   // R1 = 10
    issue(4'd0, 5'd1, 5'd4, 32'd0, 32'd1, 5'd2);   // R2 = 11
    if (!(wb_valid && wb_result == 32'd10 && wb_dest == 5'd1)) begin
      f++; $display("FAIL: TC3 stage1");
    end
    issue(4'd0, 5'd2, 5'd5, 32'd0, 32'd2, 5'd3);   // R3 = 13
    if (!(wb_valid && wb_result == 32'd11 && wb_dest == 5'd2)) begin
      f++; $display("FAIL: TC3 stage2");
    end
    bubble;
    if (wb_valid && wb_result == 32'd13 && wb_dest == 5'd3) begin p++; $display("PASS: TC3 dependency chain"); end
    else begin f++; $display("FAIL: TC3 chain got res=%0d dst=%0d", wb_result, wb_dest); end

    // TC4 — flush kills in-flight result
    issue(4'd0, 5'd2, 5'd3, 32'd100, 32'd200, 5'd7);
    flush = 1;
    bubble;
    flush = 0;
    if (!wb_valid) begin p++; $display("PASS: TC4 flush clears pipeline"); end
    else begin f++; $display("FAIL: TC4 wb_valid remained high"); end

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule