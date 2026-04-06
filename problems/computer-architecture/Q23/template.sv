// ============================================================
// SIMD Execution Unit (Lane-Parallel)
// ============================================================
// One op broadcast to all lanes; each lane has its own operands.
// Lane masking semantics must be defined:
// - Option A: inactive lanes HOLD previous result (write-masking style).
// - Option B: inactive lanes output ZERO.
// TODO: Pick one and document it.

module simd_alu #(
  parameter int unsigned LANES = 4,
  parameter int unsigned W     = 32
) (
  input  logic [W-1:0]     a      [LANES],
  input  logic [W-1:0]     b      [LANES],
  input  logic [LANES-1:0] mask,
  input  logic [2:0]       op,
  output logic [W-1:0]     result [LANES]
);

  // TODO: Define op meanings (ADD/SUB/MUL/AND/OR/etc.).
  // TODO: Decide whether you want to keep this template purely combinational or add a registered wrapper around it.
  // TODO: If registered output:
  // - Inactive lanes can hold their previous value naturally (per-lane enable).
  // TODO: If combinational output:
  // - Inactive lanes must map to 0 or pass-through old value via an input.

  // Optional: internal result per lane
  logic [W-1:0] Y_lane [LANES-1:0];

  // ----------------------------
  // TODO: Shared control decode
  // ----------------------------
  // TODO: Decode op once into control signals shared by all lanes
  // (e.g., do_add, do_sub, do_and...).

  // ----------------------------
  // TODO: Per-lane datapath
  // ----------------------------
  // TODO: Use generate loop to compute Y_lane[i] from a[i], b[i], control.
  // TODO: Masking:
  // - If "hold previous": implement result regs with per-lane write enable = mask[i].
  // - If "zero": result[i] = mask[i] ? Y_lane[i] : '0.

  // ----------------------------
  // TODO: Drive outputs
  // ----------------------------
  // TODO: result[i] = (masked) per-lane output.

endmodule

