// ============================================================
// Simple MSHR Template (Allocate + Merge + Complete)
// ============================================================

module mshr #(
  parameter int unsigned ENTRIES  = 4,
  parameter int unsigned ADDR_W   = 32,
  parameter int unsigned REQS     = 4,
  parameter int unsigned OFFSET_W = 4
) (
  input  logic                          clk,
  input  logic                          rst_n,
  input  logic                          alloc_req,
  input  logic                          refill_done,
  input  logic [ADDR_W-1:0]             alloc_addr,
  input  logic [$clog2(REQS)-1:0]       requester_id,
  input  logic [$clog2(ENTRIES)-1:0]    refill_entry,
  output logic                          full,
  output logic                          hit,
  output logic                          issue_mem_req,
  output logic [$clog2(ENTRIES)-1:0]    alloc_entry,
  output logic [$clog2(ENTRIES)-1:0]    hit_entry,
  output logic [REQS-1:0]               merged_waiters
);

  typedef struct packed {
  logic              valid;
  logic [ADDR_W-OFFSET_W-1:0] line_addr;
  logic [REQS-1:0]   waiters;
  } mshr_entry_t;

  mshr_entry_t mshr [ENTRIES-1:0];

  // TODO: Matching across all valid entries for same line_addr (merge).
  // TODO: Allocation of a free entry if no match. 
  // TODO: Deallocation on refill_done (clear valid), and wake all waiters. 

  // Placeholders
  always_comb begin
  full           = 1'b0;
  hit            = 1'b0;
  issue_mem_req  = 1'b0;
  alloc_entry    = '0;
  hit_entry      = '0;
  merged_waiters = '0;
  end

  always_ff @(posedge clk or negedge rst_n) begin
  if (!rst_n) begin
  for (int i=0; i<ENTRIES; i++) begin
    mshr[i].valid <= 1'b0;
    mshr[i].line_addr <= '0;
    mshr[i].waiters <= '0;
  end
  end else begin
  if (refill_done) begin
    // TODO: Clear refill_entry and expose its waiter mask on merged_waiters.
  end

  if (alloc_req) begin
    // TODO: (1) search for match to merge, else (2) allocate free entry,
    // else assert full/backpressure.
  end
  end
  end

endmodule

