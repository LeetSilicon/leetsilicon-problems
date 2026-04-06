module pipe_reg #(
  parameter W = 64
)(
  input  logic          clk,
  input  logic          rst_n,
  input  logic          stall,
  input  logic          flush,
  input  logic [W-1:0] d,
  output logic [W-1:0] q
);
  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n)      q <= '0;
    else if (flush)  q <= '0;
    else if (!stall) q <= d;
  end
endmodule