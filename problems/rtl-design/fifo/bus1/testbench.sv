module tb;
  logic       clk;
  logic       rst_n;
  logic [3:0] address;
  logic [7:0] write_data;
  logic       write_en;
  logic       read_en;
  logic [7:0] read_data;
  wire  [7:0] gpio_pins;
  logic [7:0] pin_drive;
  logic       pin_en;
  int         p = 0, f = 0;

  initial clk = 0;

  always #5 clk = ~clk;
  gpio_mm #(.GPIO_WIDTH(8)) dut (.*);

  // Testbench drives gpio_pins only when input mode
  assign gpio_pins = pin_en ? pin_drive : 8'hzz;

  initial begin
    rst_n      = 0;
    write_en   = 0;
    read_en    = 0;
    address    = 0;
    write_data = 0;
    pin_drive  = 0;
    pin_en     = 0;
    @(posedge clk); @(posedge clk);
    rst_n = 1; @(posedge clk);

    // TC1 — Write then readback GPIO_OUT
    address = 4'h0; write_data = 8'h5A; write_en = 1;
    @(posedge clk); write_en = 0;
    read_en = 1; @(negedge clk);
    if (read_data == 8'h5A) begin p++; $display("PASS: TC1 readback GPIO_OUT"); end
    else begin f++; $display("FAIL: TC1 got %h", read_data); end
    read_en = 0;

    // TC2 — Direction control: set all outputs
    address = 4'h8; write_data = 8'hFF; write_en = 1;
    @(posedge clk); write_en = 0;
    address = 4'h0; write_data = 8'hAA; write_en = 1;
    @(posedge clk); write_en = 0; @(negedge clk);
    if (dut.gpio_out_reg == 8'hAA) begin p++; $display("PASS: TC2 output driven 0xAA"); end
    else begin f++; $display("FAIL: TC2 gpio_pins=%h", gpio_pins); end

    // TC3 — Input sampling
    address = 4'h8; write_data = 8'h00; write_en = 1;
    @(posedge clk); write_en = 0;
    pin_drive = 8'h33; pin_en = 1;
    address  = 4'h4; read_en = 1; @(negedge clk);
    if (read_data == 8'h33) begin p++; $display("PASS: TC3 input sampling"); end
    else begin f++; $display("FAIL: TC3 GPIO_IN got %h", read_data); end
    pin_en  = 0;
    read_en = 0;

    // TC5 — Invalid address returns 0
    address = 4'hC; read_en = 1; @(negedge clk);
    if (read_data == 0) begin p++; $display("PASS: TC5 invalid address returns 0"); end
    else begin f++; $display("FAIL: TC5 got %h", read_data); end
    read_en = 0;

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule