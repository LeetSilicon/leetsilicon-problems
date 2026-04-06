// ============================================================
// Barrel Shifter (SLL, SRL, SRA) One-Cycle Combinational
// ============================================================
// TODO: Define shift_type encoding, e.g. 00=SLL, 01=SRL, 10=SRA.
// TODO: Shift amount width should be clog2(W).
// TODO: Define behavior for shamt >= W (common: SLL/SRL => 0; SRA => all sign bits).

module barrel_shifter #(
  parameter int unsigned W = 32
) (
  input  logic [W-1:0]                 data_in,
  input  logic [$clog2(W)-1:0]         shamt,
  input  logic [1:0]                   shift_type,
  output logic [W-1:0]                 data_out
);

  // TODO: Decide implementation approach:
  // - Option A: synthesizable shift operators (<<, >>, >>>)
  // - Option B: classic barrel shifter with log2(W) stages of muxing
  // TODO: Ensure SRA uses sign extension (replicate data_in[W-1]).
  // TODO: Handle W not power-of-2 (still works, but define any constraints).
  // TODO: shamt==0 should pass data_in unchanged.

  always_comb begin
  // TODO: defaults, then case(shift_type)
  end

endmodule

