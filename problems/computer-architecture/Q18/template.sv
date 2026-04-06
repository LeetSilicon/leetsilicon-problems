// ============================================================
// Instruction Decode (Main Decoder)
// ============================================================
// Decoder extracts fields and generates control signals, with safe defaults for illegal ops.
// Important: assign defaults before case to avoid inferred latches.

module instr_decode (
  input  logic [31:0] instr,
  output logic [4:0]  rs1,
  output logic [4:0]  rs2,
  output logic [4:0]  rd,
  output logic [31:0] imm,
  output logic [6:0]  opcode,
  output logic [6:0]  funct7,
  output logic [2:0]  funct3,
  output logic        reg_write,
  output logic        mem_read,
  output logic        mem_write,
  output logic        branch,
  output logic        alu_src,
  output logic        jump,
  output logic        mem_to_reg,
  output logic        illegal_instruction,
  output logic [3:0]  alu_op
);

  // ----------------------------
  // TODO: Field extraction
  // ----------------------------
  // TODO: opcode = instr[6:0], rd/rs1/rs2, funct3/funct7 per ISA.
  // TODO: Immediate extraction per format (R/I/S/B/U/J):
  // - I-type sign-extend instr[31:20]
  // - S-type combine instr[31:25] and instr[11:7]
  // - B-type assemble branch immediate bits
  // - etc.
  //
  // TODO: Define imm for non-imm instructions (0 or don't care).

  // ----------------------------
  // TODO: Control generation
  // ----------------------------
  always_comb begin
  // TODO: Set safe defaults first: all write-enables 0, branch/jump 0, alu_op default, illegal=0.
  
  // TODO: case(opcode)
  // - R-type: reg_write=1, alu_src=0, mem_read/write=0, mem_to_reg=0, uses_rs1=1, uses_rs2=1
  // - Load: mem_read=1, reg_write=1, alu_src=1, mem_to_reg=1, uses_rs1=1, uses_rs2=0
  // - Store: mem_write=1, reg_write=0, alu_src=1, uses_rs1=1, uses_rs2=1
  // - Branch: branch=1, uses_rs1=1, uses_rs2=1
  // - Jump: jump=1, etc.
  // default: illegal_instruction=1, keep safe defaults.
  end

endmodule

