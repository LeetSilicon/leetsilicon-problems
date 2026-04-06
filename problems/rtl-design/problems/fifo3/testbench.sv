module tb;
  logic clk;
  logic rst_n;

  // DUT A: 32 -> 8
  logic        w_en_a, r_en_a, full_a, empty_a;
  logic [31:0] w_data_a;
  logic [7:0]  r_data_a;

  // DUT B: 8 -> 32
  logic        w_en_b, r_en_b, full_b, empty_b;
  logic [7:0]  w_data_b;
  logic [31:0] r_data_b;

  int p = 0, f = 0;

  initial clk = 0;

  always #5 clk = ~clk;
  fifo_width_conv #(.WRITE_WIDTH(32), .READ_WIDTH(8), .DEPTH_UNITS(8)) dut_wide_to_narrow (
    .clk(clk), .rst_n(rst_n),
    .write_en(w_en_a), .write_data(w_data_a), .full(full_a),
    .read_en(r_en_a),  .read_data(r_data_a),  .empty(empty_a)
  );

  fifo_width_conv #(.WRITE_WIDTH(8), .READ_WIDTH(32), .DEPTH_UNITS(8)) dut_narrow_to_wide (
    .clk(clk), .rst_n(rst_n),
    .write_en(w_en_b), .write_data(w_data_b), .full(full_b),
    .read_en(r_en_b),  .read_data(r_data_b),  .empty(empty_b)
  );

  task automatic push32(input logic [31:0] d);
    @(negedge clk); w_en_a = 1; w_data_a = d;
    @(posedge clk); @(negedge clk); w_en_a = 0;
  endtask

  task automatic pop8(output logic [7:0] d);
    r_en_a = 1;
    @(posedge clk);
    r_en_a = 0;
    @(negedge clk);
    d = r_data_a;
  endtask

  task automatic push8(input logic [7:0] d);
    @(negedge clk); w_en_b = 1; w_data_b = d;
    @(posedge clk); @(negedge clk); w_en_b = 0;
  endtask

  task automatic pop32(output logic [31:0] d);
    r_en_b = 1;
    @(posedge clk);
    r_en_b = 0;
    @(negedge clk);
    d = r_data_b;
  endtask

  logic [7:0]  b0, b1, b2, b3;
  logic [31:0] w;

  initial begin
    rst_n    = 0;
    w_en_a   = 0; r_en_a = 0; w_data_a = '0;
    w_en_b   = 0; r_en_b = 0; w_data_b = '0;
    @(posedge clk); @(posedge clk);
    rst_n = 1; @(posedge clk);

    // TC1 — 32 -> 8, LSB-first order
    push32(32'hA1B2C3D4);
    pop8(b0); pop8(b1); pop8(b2); pop8(b3);
    if ({b3,b2,b1,b0} == 32'hA1B2C3D4) begin
      p++; $display("PASS: TC1 wide->narrow LSB-first order");
    end else begin
      f++; $display("FAIL: TC1 got bytes %h %h %h %h", b3, b2, b1, b0);
    end

    // TC2 — 8 -> 32 assembly
    push8(8'h11); push8(8'h22); push8(8'h33); push8(8'h44);
    pop32(w);
    if (w == 32'h44332211) begin
      p++; $display("PASS: TC2 narrow->wide assembly");
    end else begin
      f++; $display("FAIL: TC2 got %h", w);
    end

    // TC3 — partial blocking for 8 -> 32
    push8(8'hAA); push8(8'hBB); push8(8'hCC);
    @(negedge clk);
    if (empty_b) begin
      p++; $display("PASS: TC3 empty stays high until full 32b word available");
    end else begin
      f++; $display("FAIL: TC3 empty_b deasserted too early");
    end
    push8(8'hDD);
    @(negedge clk);
    if (!empty_b) begin
      p++; $display("PASS: TC3 empty clears after 4th byte");
    end else begin
      f++; $display("FAIL: TC3 empty_b still high after 4 bytes");
    end
    pop32(w);
    if (w == 32'hDDCCBBAA) begin
      p++; $display("PASS: TC3 read after full assembly");
    end else begin
      f++; $display("FAIL: TC3 got %h", w);
    end

    // TC4 — full condition with width conversion
    push32(32'h01020304);
    push32(32'h05060708); // DEPTH_UNITS=8 filled
    @(negedge clk);
    if (full_a) begin
      p++; $display("PASS: TC4 full asserted at capacity");
    end else begin
      f++; $display("FAIL: TC4 full not asserted");
    end

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule