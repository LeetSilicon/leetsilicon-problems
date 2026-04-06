// ============================================================
// Functional Unit Busy/Free Tracker
// ============================================================
// Maintain busy vector; free_units = ~busy; any_available = |free_units.
// TODO: Define same-cycle free+allocate ordering (common: free then allocate allows reuse).

module fu_tracker #(
  parameter int unsigned N_FU = 4
) (
  input  logic                    clk,
  input  logic                    rst_n,
  input  logic                    issue_req,
  input  logic                    done_req,
  input  logic [$clog2(N_FU)-1:0] issue_fu,
  input  logic [$clog2(N_FU)-1:0] done_fu,
  output logic [N_FU-1:0]         busy,
  output logic                    any_available
);

  // TODO: Reset => all free (busy=0).
  // TODO: Update busy bits on allocate/done.
  // TODO: Same-cycle allocate+done:
  // - If same unit id, define final busy state (often 1, i.e., immediate reuse).
  // TODO: free_units = ~busy; any_available = |free_units.
  // TODO: next_free_id: priority encode free_units (define LSB-first or MSB-first).

endmodule

