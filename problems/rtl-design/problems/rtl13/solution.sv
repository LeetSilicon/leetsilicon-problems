module icg_cell (
  input  logic clk_in,
  input  logic enable,
  output logic clk_gated
);
  logic enable_latched;

  // Level-sensitive latch: transparent when clk_in=0, holds when clk_in=1
  always_latch begin
    if (!clk_in) enable_latched <= enable;
  end

  assign clk_gated = clk_in & enable_latched;
endmodule