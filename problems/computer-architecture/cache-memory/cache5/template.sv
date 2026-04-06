// ============================================================
// Write-Back Dirty Bit Management Template
// ============================================================

module cache_dirty #(
  parameter int unsigned NUM_SETS = 64,
  parameter int unsigned N_WAYS   = 4,
  parameter int unsigned TAG_W    = 20
) (
  input  logic                        clk,
  input  logic                        rst_n,

  // Events
  input  logic                        write_hit,
  input  logic                        refill_done,
  input  logic                        write_alloc_fill,
  input  logic                        evict_valid,
  input  logic                        wb_done,
  input  logic [$clog2(NUM_SETS)-1:0] hit_set,
  input  logic [$clog2(NUM_SETS)-1:0] refill_set,
  input  logic [$clog2(NUM_SETS)-1:0] evict_set,
  input  logic [$clog2(N_WAYS)-1:0]   hit_way,
  input  logic [$clog2(N_WAYS)-1:0]   refill_way,
  input  logic [$clog2(N_WAYS)-1:0]   evict_way,
  input  logic [TAG_W-1:0]            evict_tag,

  output logic                        evict_dirty,
  output logic                        writeback_req,
  output logic [TAG_W+$clog2(NUM_SETS)-1:0] writeback_addr
);

  logic dirty [NUM_SETS-1:0][N_WAYS-1:0];

  // Combinational: check victim dirty
  always_comb begin
  // TODO: Drive the current victim status.
  //evict_dirty    = dirty[evict_set][evict_way];
  //writeback_req  = evict_valid & evict_dirty;
  //writeback_addr = {evict_tag, evict_set};
  end

  always_ff @(posedge clk or negedge rst_n) begin
  if (!rst_n) begin
  // Reset: all dirty bits cleared. 
  for (int s=0; s<NUM_SETS; s++)
    for (int w=0; w<N_WAYS; w++)
      dirty[s][w] <= 1'b0;
  end else begin
  if (write_hit) begin
    // TODO: On write hit, set dirty. 
  end

  if (refill_done) begin
    // TODO:
    // - On read refill: dirty=0
    // - On write-allocate refill (line filled due to write miss): dirty=1
    dirty[refill_set][refill_way] <= write_alloc_fill;
  end

  if (wb_done) begin
    // TODO: Clear dirty for the line that was written back.
    // Need to know which set/way was in-flight; store evict_set/evict_way in regs.
  end
  end
  end

endmodule

