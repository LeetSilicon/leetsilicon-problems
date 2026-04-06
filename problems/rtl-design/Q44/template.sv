// ============================================================
// ID: rtl16 — CDC Handshake (fast->slow) (req/ack)
// ============================================================
// Goal: reliable event transfer; req held until ack observed; both directions synced. 

module handshake_cdc (
  // Fast domain
  input  logic fast_clk,
  input  logic fast_rst_n,
  input  logic send_req,
  output logic fast_busy,

  // Slow domain
  input  logic slow_clk,
  input  logic slow_rst_n,
  output logic slow_data_valid
);

  // TODO: Define protocol (level-based recommended).

  // TODO: Fast domain: generate/hold req_level until ack returns.

  // TODO: Slow domain: synchronize req_level, detect a new request, then pulse slow_data_valid and raise ack_level.

  // TODO: Synchronizers for req and ack.

  // TODO: Clear conditions.

endmodule
