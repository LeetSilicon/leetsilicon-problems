module edge_detector (
  input  logic clk,
  input  logic rst_n,
  input  logic sig_in,
  output logic rise_pulse,
  output logic fall_pulse
);
  logic sig_prev;

  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      sig_prev   <= 0;
      rise_pulse <= 0;
      fall_pulse <= 0;
    end else begin
      rise_pulse <=  sig_in & ~sig_prev;
      fall_pulse <= ~sig_in &  sig_prev;
      sig_prev   <= sig_in;
    end
  end
endmodule