// Shift register with parallel load, serial shift right, serial_in
module shift_reg #(
  parameter WIDTH = 8
)(
  input  logic              clk,
  input  logic              rst_n,
  input  logic              load,
  input  logic              shift,
  input  logic [WIDTH-1:0]  data_in,
  input  logic              serial_in,
  output logic [WIDTH-1:0]  parallel_out,
  output logic              serial_out
);
  logic [WIDTH-1:0] reg_val;

  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      reg_val <= '0;
    end else if (load) begin
      reg_val <= data_in;         // Load has priority
    end else if (shift) begin
      reg_val <= {serial_in, reg_val[WIDTH-1:1]};  // Shift right
    end
  end

  assign parallel_out = reg_val;

  // Register serial_out so it's stable after posedge
  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) serial_out <= 0;
    else if (shift && !load) serial_out <= reg_val[0];
  end
endmodule