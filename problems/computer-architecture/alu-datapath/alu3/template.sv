// ============================================================
// TODO: Signed Addition Overflow Detection
// ============================================================
// Overflow for two's complement add/sub depends on operand/result sign relationships; carry is tracked separately.

module overflow_detect #(
  parameter int unsigned W = 32
) (
  input  logic [W-1:0] a,
  input  logic [W-1:0] b,
  input  logic [W-1:0] result,
  input  logic         is_sub,
  output logic         overflow,
  output logic         carry
);

  // TODO: Implement:
  // For add: overflow = (a[MSB] == b[MSB]) && (a[MSB] != result[MSB]). For subtract, use the equivalent signed-subtract condition.
  // TODO: Parameterization: MSB = W-1.
  // TODO: W=1 corner-case: confirm formula still behaves as intended.
  // TODO: Keep combinational (assign or always_comb).

endmodule

