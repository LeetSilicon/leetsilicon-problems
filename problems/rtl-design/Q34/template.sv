// ============================================================
// ID: rtl6 — Binary Counter + Gray Output
// ============================================================
// Goal: binary counter increments; gray = bin ^ (bin >> 1). 

module bin_to_gray_counter #(
  parameter int W = 4
) (
  input  logic         clk,
  input  logic         rst_n,
  input  logic         enable,
  output logic [W-1:0] bin_count,
  output logic [W-1:0] gray_count
);

  // TODO: bin_count register increments when enable=1.
  // Why: gray coding is derived from stable binary count.
  // always_ff @(posedge clk or negedge rst_n) ...

  // TODO: gray_count generation.
  // Why: standard conversion ensures only 1 bit changes between successive gray codes.

  // TODO: Decide whether gray_count is registered or combinational.

endmodule
