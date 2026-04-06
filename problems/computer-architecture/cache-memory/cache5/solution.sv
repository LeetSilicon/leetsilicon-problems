module cache_dirty #(
  parameter NUM_SETS = 64,
  parameter N_WAYS   = 4,
  parameter TAG_W    = 20
)(
  input  logic                         clk,
  input  logic                         rst_n,
  input  logic                         write_hit,
  input  logic                         refill_done,
  input  logic                         write_alloc_fill,
  input  logic                         evict_valid,
  input  logic                         wb_done,
  input  logic [$clog2(NUM_SETS)-1:0]  hit_set,
  input  logic [$clog2(NUM_SETS)-1:0]  refill_set,
  input  logic [$clog2(NUM_SETS)-1:0]  evict_set,
  input  logic [$clog2(N_WAYS)-1:0]    hit_way,
  input  logic [$clog2(N_WAYS)-1:0]    refill_way,
  input  logic [$clog2(N_WAYS)-1:0]    evict_way,
  input  logic [TAG_W-1:0]             evict_tag,
  output logic                         evict_dirty,
  output logic                         writeback_req,
  output logic [TAG_W+$clog2(NUM_SETS)-1:0] writeback_addr
);
  // Packed bit-vector for Verilator sensitivity
  logic [NUM_SETS*N_WAYS-1:0] dirty;

  assign evict_dirty    = dirty[evict_set * N_WAYS + evict_way];
  assign writeback_req  = evict_valid && dirty[evict_set * N_WAYS + evict_way];
  assign writeback_addr = {evict_tag, evict_set};

  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      dirty <= '0;
    end else begin
      if (write_hit)
        dirty[hit_set * N_WAYS + hit_way] <= 1'b1;
      if (refill_done)
        dirty[refill_set * N_WAYS + refill_way] <= write_alloc_fill;
      if (wb_done)
        dirty[evict_set * N_WAYS + evict_way] <= 1'b0;
    end
  end
endmodule