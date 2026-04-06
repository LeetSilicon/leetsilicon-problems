// Handshake CDC: fast → slow domain using req/ack
module handshake_cdc (
  // Fast domain
  input  logic fast_clk,
  input  logic fast_rst_n,
  input  logic send_req,      // One-cycle pulse to send
  output logic fast_busy,
  // Slow domain
  input  logic slow_clk,
  input  logic slow_rst_n,
  output logic slow_data_valid
);
  // Fast domain: hold req until ack received
  logic req_ff;
  logic ack_sync1, ack_sync2;

  // Slow domain: sync req, generate ack
  logic req_sync1, req_sync2, req_prev;
  logic ack_ff;

  // ── Fast domain ──────────────────────────────────────────────────────────
  assign fast_busy = req_ff;

  always_ff @(posedge fast_clk or negedge fast_rst_n) begin
    if (!fast_rst_n) begin
      req_ff <= 0;
    end else begin
      if (send_req && !req_ff) req_ff <= 1;        // Latch request
      if (ack_sync2)           req_ff <= 0;        // Clear on ack
    end
  end

  // Synchronize ack into fast domain
  always_ff @(posedge fast_clk or negedge fast_rst_n) begin
    if (!fast_rst_n) begin
      ack_sync1 <= 0;
      ack_sync2 <= 0;
    end else begin
      ack_sync1 <= ack_ff;
      ack_sync2 <= ack_sync1;
    end
  end

  // ── Slow domain ───────────────────────────────────────────────────────────
  // Synchronize req into slow domain
  always_ff @(posedge slow_clk or negedge slow_rst_n) begin
    if (!slow_rst_n) begin
      req_sync1 <= 0;
      req_sync2 <= 0;
      req_prev  <= 0;
      ack_ff    <= 0;
    end else begin
      req_sync1 <= req_ff;
      req_sync2 <= req_sync1;
      req_prev  <= req_sync2;
      // Rising edge of synchronized req → capture data, send ack
      if (req_sync2 && !req_prev) begin
        ack_ff <= 1;
      end else if (!req_sync2) begin
        ack_ff <= 0;
      end
    end
  end

  assign slow_data_valid = req_sync2 && !req_prev;
endmodule