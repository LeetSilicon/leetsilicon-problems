// ============================================================
// ID: rtl1 — Edge / Toggle Detector
// ============================================================
// Goal: detect rising, falling, and any toggle using previous-sample compare. 

module edge_toggle_detect (
  input  logic clk,
  input  logic rst_n,
  input  logic sig_in,
  output logic rise_pulse,
  output logic fall_pulse,
  output logic toggle_pulse
);

  // TODO: Create 1-cycle delayed sample (sig_prev).
  // Why: edges are detected by comparing current sample with previous sample.
  logic sig_prev;

  // TODO: Sequential sample of sig_in into sig_prev (always_ff).
  // Why: makes comparison synchronous and stable.
  // always_ff @(posedge clk or negedge rst_n) ...

  // TODO: Combinational pulse equations.
  // Why: each pulse is a pure function of (sig_in, sig_prev).

  // TODO: Decide reset init for sig_prev.
  // Why: prevents spurious pulse after reset release.

endmodule
