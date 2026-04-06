// ============================================================
// N-to-2^N Binary Decoder (with enable)
// ============================================================
// When en=1: one-hot output where out[in] = 1, all others 0.
// When en=0: out = 0.
// TODO: Decide whether out should be combinational only (typical) or registered.
// TODO: Add one-hot assertions in testbench (e.g., $countones(out) == (en?1:0)).

module decoder #(
  parameter int unsigned N = 3
) (
  input  logic [N-1:0]       in,
  input  logic               en,
  output logic [(1<<N)-1:0]  out
);

  // TODO: Handle edge cases:
  // - N=1 should produce 2-bit output.
  // - Large N grows output exponentially (synthesis size).
  // TODO: Define what happens if in contains X/Z (simulation): out becomes X? or force 0?

  // TODO: Implement decoding:
  // Option A: for-loop compare each index i and set out[i] = en & (in==i).
  // Option B: out = en ? (1 << in) : 0; (be careful with sizing/casting).
  //
  // TODO: Ensure exactly one bit is 1 when en=1 and input is known.

endmodule

