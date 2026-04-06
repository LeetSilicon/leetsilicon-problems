// ============================================================
// ID: rtl10 — Clock Divide-by-2
// ============================================================
// Goal: toggle output every rising edge -> clk/2. 

module clk_div2 (
  input  logic clk,
  input  logic rst_n,
  output logic clk_div2
);

  // TODO: Toggle flop for clk_div2.
  // Why: simplest divide-by-2 is a T-flop behavior.
  // always_ff @(posedge clk or negedge rst_n) ...

  // TODO: Reset init value.
  // Why: deterministic phase after reset.

endmodule
