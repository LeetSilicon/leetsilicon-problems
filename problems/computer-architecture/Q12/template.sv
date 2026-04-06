// ============================================================
// Multicycle Iterative Multiplier
// ============================================================
// TODO: Choose algorithm: radix-2 shift-and-add or Booth, and document.
// TODO: Expected cycles: typically W cycles for radix-2 (plus optional start/done overhead).

module multiplier #(
  parameter int unsigned W = 16
) (
  input  logic               clk,
  input  logic               rst_n,

  input  logic               start,
  input  logic [W-1:0]       a,
  input  logic [W-1:0]       b,

  output logic [2*W-1:0]     product,
  output logic               busy,
  output logic               done
);

  // TODO: Define FSM states: IDLE, RUN, DONE (or similar).
  // TODO: Latch a/b on start (so inputs may change while busy).
  // TODO: Internal regs:
  // - multiplicand (2*W bits)
  // - multiplier (W bits)
  // - accumulator/product (2*W bits)
  // - iteration counter (0..W-1)
  // TODO: On reset: busy=0, done=0, clear state.
  // TODO: done should be single-cycle pulse; busy deasserts when complete.
  // TODO: Back-to-back operations: allow new start when not busy (or in DONE->IDLE).
  // TODO: Define behavior if start asserted while busy (ignore vs restart vs error flag).

endmodule

