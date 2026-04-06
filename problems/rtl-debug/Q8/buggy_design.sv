module edge_detector_debug(
  input  logic clk,
  input  logic rst,
  input  logic sig_in,
  output logic pulse
);
  logic prev_in;

  always_ff @(posedge clk or posedge rst) begin
    if (rst) begin
      prev_in <= 1'b0;
      pulse   <= 1'b0;
    end else begin
      prev_in <= sig_in;
      pulse   <= sig_in & ~prev_in;
      if (sig_in) pulse <= 1'b1; // BUG
    end
  end
endmodule