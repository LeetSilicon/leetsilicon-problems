module pipe_stage_reg #(
  parameter DATA_WIDTH = 32,
  parameter CTRL_WIDTH = 8
)(
  input  logic                  clk,
  input  logic                  rst_n,
  input  logic                  stall,
  input  logic                  flush,
  input  logic [DATA_WIDTH-1:0] data_in,
  input  logic [CTRL_WIDTH-1:0] ctrl_in,
  input  logic                  valid_in,
  output logic [DATA_WIDTH-1:0] data_out,
  output logic [CTRL_WIDTH-1:0] ctrl_out,
  output logic                  valid_out
);
  // Flush takes priority over stall
  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      data_out  <= '0;
      ctrl_out  <= '0;
      valid_out <= 0;
    end else if (flush) begin
      // Inject bubble (NOP)
      data_out  <= '0;
      ctrl_out  <= '0;
      valid_out <= 0;
    end else if (!stall) begin
      // Normal propagation
      data_out  <= data_in;
      ctrl_out  <= ctrl_in;
      valid_out <= valid_in;
    end
    // Stall: hold all values (no else needed — registers retain value)
  end
endmodule