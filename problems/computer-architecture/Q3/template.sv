// ============================================================
// LFU Replacement (Counter-Based) Template
// ============================================================
// Behavior:
// - Per-line counter increments on hit (saturating). 
// - On refill, initialize counter to INIT (commonly 1).
// - On eviction, choose min counter; ties resolved deterministically.

module cache_lfu #(
  parameter int unsigned NUM_SETS    = 64,
  parameter int unsigned N_WAYS      = 4,
  parameter int unsigned CNT_W       = 4,   // counter width
  parameter logic [CNT_W-1:0] INIT   = 'd1  // init on fill (1 or 0; document choice)
) (
  input  logic                        clk,
  input  logic                        rst_n,

  // Access (hit updates)
  input  logic                        req_valid,
  input  logic                        hit,
  input  logic                        refill,
  input  logic [$clog2(NUM_SETS)-1:0] req_set,
  input  logic [$clog2(N_WAYS)-1:0]    hit_way,
  input  logic [$clog2(N_WAYS)-1:0]    refill_way,

  // Valid bits for eviction choice
  input  logic [N_WAYS-1:0]           way_valid,
  output logic [$clog2(N_WAYS)-1:0]    victim_way
);

  localparam logic [CNT_W-1:0] CNT_MAX = {CNT_W{1'b1}};

  logic [CNT_W-1:0] freq [NUM_SETS-1:0][N_WAYS-1:0];

  function automatic logic [CNT_W-1:0] sat_inc(input logic [CNT_W-1:0] x);
  // TODO: Saturating increment: if x<CNT_MAX => x+1 else hold. (No wrap.) 
  sat_inc = x;
  endfunction

  function automatic logic [$clog2(N_WAYS)-1:0]
  pick_lfu_victim(
  input logic [CNT_W-1:0] f [N_WAYS-1:0],
  input logic [N_WAYS-1:0] v
  );
  // TODO:
  // - Consider only valid ways for eviction (or define behavior when all invalid).
  // - Find minimum frequency among candidates.
  // - If tie: apply deterministic rule, such as lowest way index.
  pick_lfu_victim = '0;
  endfunction

  // Victim selection
  always_comb begin
  logic [CNT_W-1:0] f_local [N_WAYS-1:0];

  victim_way = '0;

  if (req_valid) begin

  for (int w=0; w<N_WAYS; w++) begin
    // TODO: Copy the current counters for req_set into f_local.
    //f_local[w] = freq[req_set][w];
  end

  // TODO: If any invalid way exists, you may prefer it (allocation-priority),
  // otherwise choose LFU victim from valid ways.
  //victim_way = pick_lfu_victim(f_local, way_valid);
  end
  end

  // Counter updates
  always_ff @(posedge clk or negedge rst_n) begin
  if (!rst_n) begin
  // TODO: Reset counters to 0 (or INIT) for all sets/ways.
  for (int s=0; s<NUM_SETS; s++)
    for (int w=0; w<N_WAYS; w++)
      freq[s][w] <= '0;
  end else begin
  if (req_valid && hit) begin
    // TODO: Increment hit counter with saturation. 
    freq[req_set][hit_way] <= sat_inc(freq[req_set][hit_way]);
  end

  if (refill) begin
    // TODO: Initialize on fill and/or reset on replacement.
    freq[req_set][refill_way] <= INIT;
  end
  end
  end

endmodule

