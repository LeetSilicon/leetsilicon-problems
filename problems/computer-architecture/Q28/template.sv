// ============================================================
// Round-Robin Arbiter (one-hot grant)
// ============================================================
// Common method: rotate requests by pointer, apply fixed priority, unrotate grant.
// Pointer updates only on successful grant; holds when no requests.
//
// TODO: Define pointer meaning precisely:
// - last_grant index vs next_priority pointer (two common conventions).
// TODO: Define grant timing: purely combinational grant from req each cycle, pointer updates on clk.

module rr_arbiter #(
  parameter int unsigned N = 4
) (
  input  logic            clk,
  input  logic            rst_n,

  input  logic [N-1:0]    req,

  output logic [N-1:0]    grant
);

  logic [$clog2(N)-1:0] ptr; // TODO: pointer / last_grant register

  // TODO: Helper: rotate left/right by shift amount
  function automatic logic [N-1:0] rotl(input logic [N-1:0] x, input int unsigned sh);
  rotl = x;
  endfunction
  function automatic logic [N-1:0] rotr(input logic [N-1:0] x, input int unsigned sh);
  rotr = x;
  endfunction

  // TODO: Helper: fixed priority grant (one-hot) from a request vector
  function automatic logic [N-1:0] fixed_pri_grant(input logic [N-1:0] r);
  // TODO: Return one-hot grant for the highest-priority requestor
  // (define priority direction: LSB-first or MSB-first).
  fixed_pri_grant = '0;
  endfunction

  // ----------------------------
  // Combinational arbitration
  // ----------------------------
  always_comb begin
  // TODO: Defaults: grant='0; if any request is present, select exactly one requester.
  // TODO: If any req:
  // - Rotate req by ptr so ptr+1 becomes highest priority position.
  // - Apply fixed priority to rotated req.
  // - Unrotate grant back to original positions.
  // TODO: Ensure at most one grant bit set ($onehot0(grant)).
  end

  // ----------------------------
  // Pointer update
  // ----------------------------
  always_ff @(posedge clk or negedge rst_n) begin
  if (!rst_n) begin
  // TODO: Initialize ptr to defined value.
  end else begin
  // TODO: If a grant is issued: update ptr based on the granted index (document convention).
  // TODO: If no grant: ptr holds.
  end
  end

endmodule

