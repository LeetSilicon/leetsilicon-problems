// ============================================================
// Sequential Divider (Shift-Subtract)
// ============================================================
// TODO: Choose restoring or non-restoring division and document.
// TODO: Cycle count expectation: often W (or W+1) iterations.

module divider #(
  parameter int unsigned W = 16
) (
  input  logic             clk,
  input  logic             rst_n,

  input  logic             start,
  input  logic [W-1:0]     dividend,
  input  logic [W-1:0]     divisor,

  output logic [W-1:0]     quotient,
  output logic [W-1:0]     remainder,
  output logic             busy,
  output logic             done,
  output logic             div_by_zero
);

  // TODO: Define unsigned vs signed (unsigned recommended unless required).
  // TODO: Divide-by-zero behavior:
  // - On start if divisor==0: set div_by_zero=1, define quotient/remainder outputs, done pulse quickly.
  // TODO: Internal regs:
  // - remainder register (W+1 maybe for subtract/restore)
  // - quotient register
  // - divisor reg
  // - dividend shift reg (or direct bit extraction)
  // - iteration counter
  // TODO: FSM: IDLE, CHECK0, RUN, DONE (or similar).
  // TODO: Back-to-back operations: permit new start after done.
  // TODO: Define start while busy behavior (ignore/reject/restart).

endmodule

