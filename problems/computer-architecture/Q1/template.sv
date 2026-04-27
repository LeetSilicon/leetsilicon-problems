// ============================================================
// 4-Way Set-Associative Cache LRU Controller (TEMPLATE)
// ============================================================
//
// PURPOSE:
// Provides victim selection and LRU state tracking interface.
// Implementation of LRU policy is left open for design choice.
//
// ============================================================

module cache_lru4 #(
  parameter NUM_SETS  = 64,
  parameter WAY_COUNT = 4
)(
  input  logic                          clk,
  input  logic                          rst_n,
  input  logic                          req_valid,
  input  logic                          hit,
  input  logic                          refill,

  input  logic [$clog2(NUM_SETS)-1:0]  req_set,
  input  logic [$clog2(WAY_COUNT)-1:0] hit_way,
  input  logic [$clog2(WAY_COUNT)-1:0] refill_way,
  input  logic [WAY_COUNT-1:0]         way_valid,

  output logic                          victim_valid,
  output logic [$clog2(WAY_COUNT)-1:0] victim_way
);

  // =========================================================
  // LRU STATE STORAGE (PER SET)
  // =========================================================
  //
  // OPEN DESIGN SPACE:
  // Choose ANY valid LRU representation:
  // - ranking system
  // - counters / timestamps
  // - shift-based ordering
  // - tree/pseudo-LRU
  //
  logic [1:0] lru_state [NUM_SETS][WAY_COUNT];

  // =========================================================
  // OPTIONAL INPUT REGISTRATION (DESIGN CHOICE)
  // =========================================================
  logic [WAY_COUNT-1:0] way_valid_q;

  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n)
      way_valid_q <= '1;
    else
      way_valid_q <= way_valid;
  end

  // =========================================================
  // ACCESS SELECTION (OPEN POLICY)
  // =========================================================
  //
  // Define how "accessed way" is chosen:
  // - hit → hit_way
  // - refill → refill_way
  // - define priority if both asserted
  //
  logic [$clog2(WAY_COUNT)-1:0] acc_way;

  always_comb begin
    acc_way = '0;

    if (req_valid) begin
      if (hit)
        acc_way = hit_way;
      else if (refill)
        acc_way = refill_way;
    end
  end

  // =========================================================
  // VICTIM SELECTION LOGIC (OPEN IMPLEMENTATION)
  // =========================================================
  //
  // REQUIRED BEHAVIOR:
  // 1. Prefer invalid way if available
  // 2. Else select LRU way from chosen state model
  //
  always_comb begin
    victim_valid = req_valid;
    victim_way   = '0;

    if (!req_valid) begin
      victim_valid = 0;
    end
    else begin
      //
      // IMPLEMENTATION CHOICE LEFT OPEN:
      // - invalid way selection policy
      // - LRU selection method
      // - tie-breaking rules
      //

    end
  end

  // =========================================================
  // LRU STATE UPDATE (OPEN POLICY)
  // =========================================================
  //
  // REQUIRED BEHAVIOR:
  // - Update LRU state on EVERY access:
  //     hit OR refill
  //
  // DESIGN CHOICE LEFT OPEN:
  // - how state is encoded
  // - how ranks are updated
  // - how aging/ordering is maintained
  //
  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      //
      // Initialization policy is design choice:
      // - deterministic ordering
      // - or all-zero state
      //
      for (int s = 0; s < NUM_SETS; s++) begin
        for (int w = 0; w < WAY_COUNT; w++) begin
          lru_state[s][w] <= '0;
        end
      end
    end
    else if (req_valid && (hit || refill)) begin
      //
      // IMPLEMENTATION LEFT OPEN:
      // Update LRU state for acc_way here
      //
    end
  end

endmodule
