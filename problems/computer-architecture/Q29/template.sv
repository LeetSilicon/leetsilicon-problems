// ============================================================
// Reorder Buffer (ROB) Entry Management
// ============================================================
// Circular buffer with head/tail pointers; allocate at tail, commit at head in-order.
// Full/empty typically derived from pointer relationship.
//
// TODO: Decide if you want "ptr + wrap bit" scheme (simpler full/empty) vs count-based.
// TODO: Define flush semantics precisely: tail reset vs invalidate loop.

module rob #(
  parameter int unsigned ENTRIES = 8,
  parameter int unsigned W       = 32
) (
  input  logic                        clk,
  input  logic                        rst_n,
  input  logic                        dispatch,
  input  logic                        writeback,
  input  logic                        commit,
  input  logic                        flush,
  input  logic [$clog2(ENTRIES)-1:0]  wb_id,
  input  logic [$clog2(ENTRIES)-1:0]  flush_tail,
  input  logic [4:0]                  dest_arch,
  input  logic [W-1:0]                wb_value,
  output logic                        full,
  output logic                        empty,
  output logic                        commit_valid,
  output logic [4:0]                  commit_arch,
  output logic [W-1:0]                commit_value,
  output logic [$clog2(ENTRIES)-1:0]  alloc_id
);

  typedef struct packed {
  logic             valid;
  logic             ready;
  logic             has_dest;
  logic [5-1:0] dest_tag;
  logic [W-1:0] value;
  // TODO: optional fields: exception, PC, branch tag, etc.
  } rob_entry_t;

  rob_entry_t rob_mem [0:ENTRIES-1];

  logic [$clog2(ENTRIES)-1:0] head, tail;

  // TODO: Full/empty logic:
  // - Empty when head==tail (if using wrap-bit scheme, include wrap)
  // - Full when (tail+1)==head (again, depends on scheme)
  // TODO: If you keep an internal dispatch_ready helper, define it as ~full.

  // TODO: Allocation:
  // - If dispatch && !full: write rob_mem[tail].valid=1, ready=0, store fields, tail++.
  // - Output alloc_id = tail (the allocated id).

  // TODO: Writeback:
  // - If writeback: rob_mem[wb_id].ready=1; rob_mem[wb_id].value=wb_value.

  // TODO: Commit:
  // - If rob_mem[head].valid && rob_mem[head].ready: commit_valid=1 with fields from head.
  // - If commit_valid && commit: free entry (valid=0) and head++.

  // TODO: Flush:
  // - If flush: invalidate younger entries and set tail appropriately (tail=flush_tail),
  //   or loop invalidate entries between flush point and old tail.
  // - Ensure commit/dispatch interactions are well-defined during flush.

endmodule

