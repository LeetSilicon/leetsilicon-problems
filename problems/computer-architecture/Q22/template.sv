// ============================================================
// Warp Scheduler (Round-Robin or Fixed Priority)
// ============================================================
// Inputs: warp_ready mask (N_WARPS bits).
// Outputs: valid + granted warp id.
//
// TODO: Pick policy and document it clearly:
// - Round-robin: start search at last_grant+1 and wrap (fairness).
// - Fixed priority: lowest warp id wins (simple priority encode).
//
// TODO: Define "grant stability" when no warp is ready (hold last id or drive 0).
// TODO: Define how last_grant initializes on reset and what first grant should be.
// TODO: Define behavior if N_WARPS is not power-of-2 (should still work, but be explicit).

module warp_scheduler #(
  parameter int unsigned N_WARPS = 8
) (
  input  logic                        clk,
  input  logic                        rst_n,
  input  logic [N_WARPS-1:0]          warp_ready,
  output logic [$clog2(N_WARPS)-1:0]  selected_warp,
  output logic                        valid
);

  // Track last granted warp for round-robin fairness.
  logic [$clog2(N_WARPS)-1:0] last_grant;

  // ----------------------------
  // TODO: Helper functions
  // ----------------------------
  function automatic logic [$clog2(N_WARPS)-1:0]
  prio_encode_low(input logic [N_WARPS-1:0] req);
  // TODO: Return lowest index i where req[i]==1.
  // TODO: Define return value when req is all zeros.
  prio_encode_low = '0;
  endfunction

  function automatic logic [N_WARPS-1:0]
  rotate_right(input logic [N_WARPS-1:0] x, input int unsigned sh);
  // TODO: Implement rotate-right by sh (0..N_WARPS-1).
  // TODO: Be careful with sh width and modulo behavior.
  rotate_right = x;
  endfunction

  function automatic logic [N_WARPS-1:0]
  rotate_left(input logic [N_WARPS-1:0] x, input int unsigned sh);
  // TODO: Implement rotate-left by sh.
  rotate_left = x;
  endfunction

  // ----------------------------
  // Combinational grant logic
  // ----------------------------
  always_comb begin
  // TODO: Defaults (no latches)
  // TODO: valid = (|warp_ready)
  // TODO: If no warp_ready: valid=0; selected_warp stable per spec.

  // TODO: If USE_RR:
  // - Compute start = last_grant + 1 (wrap-around).
  // - Rotate warp_ready so that "start" maps to bit 0.
  // - Priority-encode rotated warp_ready to find first warp_ready.
  // - Unrotate resulting index to get actual warp id.
  //
  // TODO: Else fixed priority:
  // - selected_warp = prio_encode_low(warp_ready).
  end

  // ----------------------------
  // Sequential state update
  // ----------------------------
  always_ff @(posedge clk or negedge rst_n) begin
  if (!rst_n) begin
  // TODO: Initialize last_grant to a defined value (e.g., 0 or N_WARPS-1).
  // TODO: Decide whether this biases first RR grant; document it.
  end else begin
  // TODO: Update last_grant only when valid==1.
  // last_grant <= selected_warp;
  end
  end

endmodule

