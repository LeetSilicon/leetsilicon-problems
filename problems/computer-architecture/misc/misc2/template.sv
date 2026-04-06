// ============================================================
// Priority Encoder (out + valid)
// ============================================================
// Finds out of highest-priority '1' bit.
// TODO: Choose priority direction: LSB-first or MSB-first and document it.
// When input==0: valid=0 and out held at a defined stable value.

module priority_enc #(
  parameter int unsigned N = 8,
  parameter bit          LSB_FIRST = 1  // TODO: 1 => bit0 highest priority, 0 => MSB highest
) (
  input  logic [N-1:0]             in,
  output logic [$clog2(N)-1:0]     out,
  output logic                     valid
);

  // TODO: Edge cases:
  // - N=1, out width is clog2(1)=0 (tool-dependent); consider guarding with if (N==1).
  // - X/Z handling policy: treat as 0? propagate X? document.

  always_comb begin
  // TODO: Defaults:
  // valid = |in;
  // out = '0 (stable when valid=0)

  // TODO: If valid:
  // - If LSB_FIRST: scan i=0..N-1, first '1' wins.
  // - If MSB_FIRST: scan i=N-1..0, first '1' wins.
  //
  // TODO: Ensure deterministic behavior when multiple bits set.
  end

endmodule

