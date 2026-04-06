// ============================================================
// Shared Memory Bank Conflict Detector
// ============================================================
// Given per-thread addresses and active mask, detect if any bank has multiple active accesses.
// TODO: Decide what to output if multiple banks conflict: first-conflicting bank, OR a vector of conflicts.
//
// Bank mapping is typically like bank_id = (address / word_bytes) % N_BANKS.
// TODO: Define BANK_OFFSET based on word size (e.g., 2 for 4B words).

module bank_conflict #(
  parameter int unsigned N_BANKS    = 32,
  parameter int unsigned THREADS    = 32,
  parameter int unsigned ADDR_W     = 32,
  parameter int unsigned BANK_OFFSET = 2
) (
  input  logic [ADDR_W-1:0]                  addr [THREADS],
  input  logic [THREADS-1:0]                 active_mask,
  output logic                               has_conflict,
  output logic [$clog2(N_BANKS)-1:0]         conflict_bank_id,
  output logic                               can_issue,
  output logic [THREADS-1:0]                 conflict_mask
);

  localparam int unsigned BANK_W = $clog2(N_BANKS);

  // Per-thread bank index
  logic [BANK_W-1:0] bank [THREADS-1:0];

  // Per-bank counts (or bitmasks)
  // TODO: Choose histogram counters vs per-bank thread bitmask + popcount.
  // For simplicity, counts can be sized to clog2(THREADS+1).
  logic [$clog2(THREADS+1)-1:0] bank_count [N_BANKS-1:0];

  // ----------------------------
  // TODO: Compute bank index per thread
  // ----------------------------
  // TODO: bank[i] = (addr[i] >> BANK_OFFSET) & (N_BANKS-1);

  // ----------------------------
  // TODO: Build per-bank counts ignoring inactive threads
  // ----------------------------
  // TODO: Initialize all bank_count[b]=0.
  // TODO: For each thread i:
  //   if active_mask[i]: bank_count[bank[i]]++

  // ----------------------------
  // TODO: Conflict detect + choose conflict_bank_id
  // ----------------------------
  // TODO: has_conflict = any bank_count[b] > 1.
  // TODO: conflict_bank_id selection if multiple banks conflict:
  // - lowest bank id, or first found, or output vector (document).
  // TODO: can_issue = ~has_conflict (or allow issue with serialization if implemented).

  // ----------------------------
  // TODO: Optional serialization decision
  // ----------------------------
  // TODO: If has_conflict:
  // - Choose one thread to service first (lowest thread id, or round-robin).
  // - conflict_mask sets exactly one active thread within that conflicting bank.

endmodule

