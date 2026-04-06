// ============================================================
// ID: rtl3 — Sequence Detector FSM (10110)
// ============================================================
// Goal: FSM asserts 1-cycle match when serial pattern 10110 completes. 

module seq_det_10110 (
  input  logic clk,
  input  logic rst_n,
  input  logic bit_in,
  output logic match_pulse
);

  // TODO: Define states for partial matches.
  // Why: each state encodes "how many prefix bits matched so far".
  // Example: IDLE, GOT1, GOT10, GOT101, GOT1011.
  // typedef enum logic [2:0] ...

  // TODO: Implement state register (always_ff).
  // Why: FSM must be synchronous.

  // TODO: Implement next-state logic (always_comb).
  // Why: transitions depend on bit_in and overlap policy.

  // TODO: Define overlap behavior.
  // Why: on mismatch you may go to a non-IDLE state if suffix is a prefix.

  // TODO: Generate match_pulse.
  // Why: usually asserted on the cycle the last bit '0' is accepted.

endmodule
