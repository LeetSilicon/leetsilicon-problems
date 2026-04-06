// ============================================================
// Branch Comparator and Control
// ============================================================
// Branch decision uses comparison flags (eq, signed/unsigned lt) and a funct3 select.
// TODO: Decide where branch resolves (ID vs EX). If in ID, consider operand forwarding.

module branch_cmp #(
  parameter int unsigned W = 32
) (
  input  logic [W-1:0] a,
  input  logic [W-1:0] b,
  input  logic [2:0]   funct3,
  output logic         take_branch
);

  // TODO: Compute comparison flags once:
  // - eq = (a == b)
  // - lt_signed = ($signed(a) < $signed(b))
  // - lt_unsigned = (a < b)
  //
  // TODO: Implement take_branch by funct3:
  // - BEQ: eq
  // - BNE: !eq
  // - BLT/BGE, BLTU/BGEU as desired
  //
  // TODO: Gate with 1'b1 (non-branch => not taken).
  // TODO: next_pc_is_branch definition: next_pc_is_branch = 1'b1 && take_branch (or separate next_pc_select).

  // TODO: If branch resolved in ID, add forwarding muxes into a/b:
  // - From EX/MEM, MEM/WB, etc. Similar to pipe3.
endmodule

