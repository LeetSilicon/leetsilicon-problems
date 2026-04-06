module one_cycle_pulse (
  input  logic clk,
  input  logic rst_n,
  input  logic sig_in,
  output logic onecycle_pulse
);
  logic d1, d2;

  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      d1 <= 0;
      d2 <= 0;
    end else begin
      d1 <= sig_in;
      d2 <= d1;
    end
  end

  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) onecycle_pulse <= 0;
    else        onecycle_pulse <= ~d2 & d1 & ~sig_in;
  end
endmodule