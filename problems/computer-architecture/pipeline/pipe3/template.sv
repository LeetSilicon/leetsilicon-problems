// ============================================================
// Data Forwarding Unit (EX/MEM and MEM/WB to EX stage)
// ============================================================
// Forwarding selects ALU inputs from:
// - regfile (no forward)
// - EX/MEM (most recent)
// - MEM/WB (older)
// Priority: EX/MEM over MEM/WB when both match.
//
// Outputs ForwardA/ForwardB encoding required:
// 00 = regfile, 01 = MEM/WB, 10 = EX/MEM.

module forwarding_unit (
  input  logic [4:0] id_ex_rs1,
  input  logic [4:0] id_ex_rs2,
  input  logic [4:0] ex_mem_rd,
  input  logic [4:0] mem_wb_rd,
  input  logic       ex_mem_reg_write,
  input  logic       mem_wb_reg_write,
  output logic [1:0] fwd_a,
  output logic [1:0] fwd_b
);

  always_comb begin
  // TODO: Defaults: fwd_a=00, fwd_b=00.
  // TODO: Compute ForwardA:
  // - If EX/MEM writes and ex_mem_rd matches id_ex_rs1 (and not x0), fwd_a=10.
  // - Else if MEM/WB writes and mem_wb_rd matches id_ex_rs1 (and not x0), fwd_a=01,
  //   but only if EX/MEM is not already forwarding that operand (priority).
  //
  // TODO: Compute ForwardB similarly for id_ex_rs2.
  //
  // TODO: Decide whether to gate forwarding when id_ex_rs*==0 (x0 reads constant), if HAS_X0.
  end

endmodule

