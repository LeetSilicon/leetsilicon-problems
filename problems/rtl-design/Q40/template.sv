// ============================================================
// ID: rtl12 — Clock Divide-by-N (~50% duty)
// ============================================================
// Goal: support even/odd N; keep output glitch-free. 

module clk_divN #(
  parameter int N = 4
) (
  input  logic clk,
  input  logic rst_n,
  output logic clk_divN
);

  // TODO: Validate N >= 2 (optional assert).
  // Why: divider must have a meaningful period.

  // TODO: Even N strategy.

  // TODO: Odd N strategy.
  // Why: ~50% duty for odd N generally needs dual-edge or more complex FSM.


endmodule
