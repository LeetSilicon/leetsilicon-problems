// ============================================================
// ID: rtl4 — Pattern 10110 Anywhere in Last N Samples
// ============================================================
// Goal: shift-register window + decode all alignments. 

module pattern_in_window #(
  parameter int N = 8
) (
  input  logic clk,
  input  logic rst_n,
  input  logic bit_in,
  output logic found
);

  // TODO: Define pattern and length.
  // Why: keeps code maintainable.
  // localparam int K = 5;
  // localparam logic [K-1:0] PATTERN = 5'b10110;

  // TODO: N-bit shift register.
  // Why: stores last N input samples.
  logic [N-1:0] shreg;

  // TODO: Update shreg every clk (always_ff).
  // Why: sliding window capture.

  // TODO: Compare every K-bit slice and OR results.
  // Why: pattern may start at any position in the window.
  // found = '0;

  // TODO: Guard for N<K (optional).
  // Why: avoid invalid part-select/generate.

endmodule
