// ============================================================
// ID: alu2 — ALU Control Decoder
// ============================================================
// TODO: Define opcode/funct encodings (ISA-specific) in a table here.
// TODO: Decide split decode style:
// - Option A: One module does full decode (alu_op/funct fields -> final ALU control)
// - Option B: Main decode + separate ALU decode stage
// TODO: Safe defaults for illegal instructions: no writes, no mem ops.

module alu_control (
  input  logic [1:0] alu_op,
  input  logic [2:0] funct3,
  input  logic       funct7_b5,
  output logic [3:0] alu_ctrl
);

  always_comb begin
  // TODO: Assign safe defaults first to avoid inferred latches.
  // TODO: illegal_instruction default = 0, then set to 1 on unknown combinations.

  // TODO: Use unique case / priority case if your style guide prefers.
  // TODO: Decide selector:
  // - case(alu_op)
  // - case({alu_op, funct3, funct7_b5})
  // TODO: For each legal combination, drive alu_ctrl to the encoding expected by your ALU datapath.
  // TODO: Unsupported combinations should fall back to a documented safe alu_ctrl value.
  end

endmodule

