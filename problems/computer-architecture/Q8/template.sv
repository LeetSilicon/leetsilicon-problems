// ============================================================
// ID: alu1 — Parameterized ALU
// ============================================================
// TODO: Document alu_op encoding here (example only; user must finalize):
// - TODO: ALU_ADD = 3'b000
// - TODO: ALU_SUB = 3'b001
// - TODO: ALU_AND = 3'b010
// - TODO: ALU_OR  = 3'b011
// - TODO: ALU_XOR = 3'b100
// - TODO: ALU_SLT = 3'b101
//
// TODO: Define invalid-op behavior: output zero vs hold last result (choose one).
// TODO: Define which ops update carry/overflow flags (usually add/sub only).
// TODO: Confirm SLT is signed compare and result is 0...0001 or 0...0000.

module alu #(
  parameter int unsigned W = 32
) (
  input  logic [W-1:0] a,
  input  logic [W-1:0] b,
  input  logic [3:0]   op,
  output logic [W-1:0] result,
  output logic         zero,
  output logic         carry,
  output logic         overflow,
  output logic         negative
);

  // ----------------------------
  // TODO: Localparams for opcodes
  // ----------------------------
  // TODO: localparam logic [2:0] OP_ADD = ...;
  // TODO: localparam logic [2:0] OP_SUB = ...;
  // TODO: localparam logic [2:0] OP_AND = ...;
  // TODO: localparam logic [2:0] OP_OR  = ...;
  // TODO: localparam logic [2:0] OP_XOR = ...;
  // TODO: localparam logic [2:0] OP_SLT = ...;

  // ----------------------------
  // TODO: Internal extended sums for carry/borrow
  // ----------------------------
  // TODO: Create WIDTH+1 intermediates for ADD and SUB to capture carry-out.
  // TODO: Decide SUB carry/borrow convention explicitly:
  // - Option A: carry=1 means "no borrow" (common in some ISAs)
  // - Option B: carry=1 means "borrow occurred"
  // TODO: Add comments so testbench knows expected behavior.

  // ----------------------------
  // Combinational ALU
  // ----------------------------
  always_comb begin
  // TODO: Default assignments for all outputs to avoid latches.
  // TODO: result default, flags default.

  // TODO: Implement case(alu_op) selecting:
  // - ADD: result = A + B
  // - SUB: result = A - B
  // - AND/OR/XOR: bitwise ops
  // - SLT (signed): result = (signed(A) < signed(B)) ? 1 : 0, in LSB only
  // TODO: For SLT: ensure only bit 0 may be 1, other bits 0.

  // TODO: Flags:
  // - zero: result == 0
  // - negative: result[WIDTH-1]
  // - carry: from extended add/sub (per your convention)
  // - overflow: signed overflow for add/sub:
  //   overflow = (A[MSB] == B[MSB]) && (A[MSB] != result[MSB]) for ADD
  //   TODO: Provide SUB overflow rule (document, and implement consistently).

  // TODO: WIDTH=1 edge-case: ensure MSB index works (WIDTH-1 == 0).
  // TODO: Invalid alu_op: return safe value (e.g., result='0, flags=0).
  end

endmodule

