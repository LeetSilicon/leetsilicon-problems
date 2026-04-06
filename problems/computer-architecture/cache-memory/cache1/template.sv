// ============================================================
// True LRU Replacement Policy (4-Way Set-Associative) Template
// ============================================================
// Notes:
// - True LRU means: on replacement, evict the line least recently accessed.
// - Update LRU state on every access (read hit, write hit, and refill).
// - Prefer allocating invalid ways before evicting a valid way.
//
// Reference intuition/example of LRU behavior: A,B,C,D filled; access B;
// next miss evicts A (the least recently used). 

module cache_lru4 #(
  parameter int unsigned NUM_SETS  = 64,
  parameter int unsigned WAY_COUNT = 4
) (
  input  logic                         clk,
  input  logic                         rst_n,
  input  logic                         req_valid,
  input  logic                         hit,
  input  logic                         refill,
  input  logic [$clog2(NUM_SETS)-1:0]  req_set,
  input  logic [$clog2(WAY_COUNT)-1:0] hit_way,
  input  logic [$clog2(WAY_COUNT)-1:0] refill_way,
  input  logic [WAY_COUNT-1:0]         way_valid,
  output logic                         victim_valid,
  output logic [$clog2(WAY_COUNT)-1:0] victim_way
);

  // ----------------------------
  // LRU State (per set)
  // ----------------------------
  // Option A (recommended for true LRU): store a rank/age 0..3 for each way.
  // - rank==3 => MRU, rank==0 => LRU (victim)
  // - Must remain a permutation of {0,1,2,3} for valid ways.
  //
  // (This is a straightforward exact LRU representation; it’s fine if you choose
  // a different exact encoding.)
  logic [1:0] lru_rank   [NUM_SETS-1:0][WAY_COUNT-1:0];

  // ----------------------------
  // Helper function stubs
  // ----------------------------


  // TODO: Return index of any invalid way if exists.
  // Policy can be lowest-index invalid way for determinism.
  // If no invalid ways, return 0 (caller should ignore in that case).


  // TODO: Return 1 if any invalid way exists.

  // TODO: Return the way with the *smallest* rank among valid ways.
  // If multiple ways tie for smallest rank, return lowest index among them for determinism.

  );
  // TODO: True LRU update rule:
  // - The accessed way becomes MRU (rank=3).
  // - Any valid way that had rank > old_rank_of_accessed is decremented by 1.
  // - Ways with rank < old_rank_of_accessed stay the same.
  //
  // This preserves a total order (permutation) and yields exact LRU.

  // ----------------------------
  // Victim selection (combinational)
  // ----------------------------
  always_comb begin
  victim_valid = 1'b0;
  victim_way   = '0;

  if (req_valid) begin
  victim_valid = 1'b1;

  // TODO: Allocation priority:
  // 1) If any invalid way in this set => pick that invalid way.
  // 2) Else => pick true LRU way (oldest / smallest rank).
  if (has_invalid(way_valid)) begin
    victim_way = pick_invalid_way(way_valid);
  end else begin
    logic [1:0] ranks_local [WAY_COUNT-1:0];
    for (int w = 0; w < WAY_COUNT; w++) ranks_local[w] = lru_rank[req_set][w];
    victim_way = pick_lru_way(ranks_local, way_valid);
  end
  end
  end

  // ----------------------------
  // LRU state update (sequential)
  // ----------------------------
  always_ff @(posedge clk or negedge rst_n) begin
  if (!rst_n) begin
  // TODO: Reset behavior
  // - Initialize cache ways invalid elsewhere (tag/valid arrays).
  // - Initialize LRU state to a known permutation (e.g., 0,1,2,3) per set,
  //   or to any deterministic scheme.
  for (int s = 0; s < NUM_SETS; s++) begin
    for (int w = 0; w < WAY_COUNT; w++) begin
      lru_rank[s][w] <= logic'(w[1:0]);
    end
  end
  end else begin
  // TODO: Update rule on every access that *touches* a line:
  // - On hit: update_on_access(..., hit_way, way_valid)
  // - On refill: update_on_access(..., refill_way, updated-valids)
  //
  // If both hit and refill could occur same cycle, define priority/order.
  if (req_valid && hit) begin
    logic [1:0] ranks_tmp [WAY_COUNT-1:0];
    for (int w = 0; w < WAY_COUNT; w++) ranks_tmp[w] = lru_rank[req_set][w];
    update_on_access(ranks_tmp, hit_way, way_valid);
    for (int w = 0; w < WAY_COUNT; w++) lru_rank[req_set][w] <= ranks_tmp[w];
  end

  if (refill) begin
    // NOTE: refill_set is assumed to be req_set in this simplified template.
    // TODO: If refill can target a different set, add refill_set input.
    logic [1:0] ranks_tmp [WAY_COUNT-1:0];
    logic [WAY_COUNT-1:0] v_after;

    for (int w = 0; w < WAY_COUNT; w++) ranks_tmp[w] = lru_rank[req_set][w];

    // TODO: Define v_after = way_valid with refill_way forced valid.
    v_after = way_valid;

    update_on_access(ranks_tmp, refill_way, v_after);
    for (int w = 0; w < WAY_COUNT; w++) lru_rank[req_set][w] <= ranks_tmp[w];
  end
  end
  end

endmodule
