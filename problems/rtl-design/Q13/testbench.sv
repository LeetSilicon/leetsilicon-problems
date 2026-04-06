module tb;
  localparam WIDTH = 4;

  logic              clk;
  logic              rst_n;
  logic              load;
  logic              shift;
  logic [WIDTH-1:0]  data_in;
  logic              serial_in;
  logic [WIDTH-1:0]  parallel_out;
  logic              serial_out;
  int                p = 0, f = 0;

  initial clk = 0;

  always #5 clk = ~clk;
  shift_reg #(.WIDTH(WIDTH)) dut (.*);

  initial begin
    rst_n     = 0;
    load      = 0;
    shift     = 0;
    data_in   = 0;
    serial_in = 0;
    @(posedge clk); @(posedge clk);
    rst_n = 1;
    @(posedge clk); @(negedge clk);

    // TC1 — Parallel load
    @(negedge clk); load = 1; data_in = 4'b1011;
    @(posedge clk); @(negedge clk); load = 0;
    if (parallel_out == 4'b1011) begin p++; $display("PASS: TC1 parallel load"); end
    else begin f++; $display("FAIL: TC1 load got %b", parallel_out); end

    // TC2 — Shift right 4 times with serial_in=0
    // serial_out sequence from 4'b1011: 1, 1, 0, 1
    begin
      logic [3:0] expected_serial = 4'b1011;   // LSB first
      logic ok = 1;
      @(negedge clk); serial_in = 0; shift = 1;
      for (int i = 0; i < 4; i++) begin
        @(posedge clk); @(negedge clk);
        if (serial_out != expected_serial[i]) ok = 0;
      end
      @(negedge clk); shift = 0;
      if (ok) begin p++; $display("PASS: TC2 serial out sequence"); end
      else begin f++; $display("FAIL: TC2 serial out"); end
    end

    // TC3 — Load priority over shift
    @(negedge clk); load = 1; shift = 1; data_in = 4'b1100;
    @(posedge clk); @(negedge clk); load = 0; shift = 0;
    if (parallel_out == 4'b1100) begin p++; $display("PASS: TC3 load priority"); end
    else begin f++; $display("FAIL: TC3 load priority got %b", parallel_out); end

    // TC4 — Shift with serial_in=1 fills MSB
    @(negedge clk); load = 1; data_in = 4'b0011;
    @(posedge clk); @(negedge clk); load = 0;
    @(negedge clk); serial_in = 1; shift = 1;
    @(posedge clk); @(negedge clk); shift = 0;
    if (parallel_out == 4'b1001) begin p++; $display("PASS: TC4 shift with serial_in=1"); end
    else begin f++; $display("FAIL: TC4 got %b", parallel_out); end

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule