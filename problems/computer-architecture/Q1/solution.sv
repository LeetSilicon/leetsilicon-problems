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

  // -----------------------------
  // LRU state (0 = LRU, 3 = MRU)
  // -----------------------------
  logic [1:0] rank [NUM_SETS][WAY_COUNT];

  // -----------------------------
  // Register inputs (FIX timing bug)
  // -----------------------------
  logic [WAY_COUNT-1:0] way_valid_q;
  logic [$clog2(WAY_COUNT)-1:0] acc;
  logic [1:0] old_r;

  // Latch inputs to avoid race
  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n)
      way_valid_q <= '1;
    else
      way_valid_q <= way_valid;
  end

  // -----------------------------
  // Access decode
  // -----------------------------
  always_comb begin
    acc = '0;
    if (req_valid && (hit || refill))
      acc = hit ? hit_way : refill_way;
  end

  always_comb begin
    old_r = rank[req_set][acc];
  end

  // -----------------------------
  // Victim selection (FIXED priority)
  // -----------------------------
  always_comb begin
    victim_valid = req_valid;
    victim_way   = '0;

    if (!req_valid) begin
      victim_valid = 0;
    end
    else begin
      logic found;

      found = 0;

      // -------------------------
      // PRIORITY 1: invalid ways
      // -------------------------
      for (int i = 0; i < WAY_COUNT; i++) begin
        if (!found && !way_valid_q[i]) begin
          victim_way = i;
          found = 1;
        end
      end

      // -------------------------
      // PRIORITY 2: true LRU
      // -------------------------
      if (!found) begin
        for (int i = 0; i < WAY_COUNT; i++) begin
          if (!found && rank[req_set][i] == 0) begin
            victim_way = i;
            found = 1;
          end
        end
      end
    end
  end

  // -----------------------------
  // LRU update logic
  // -----------------------------
  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      for (int s = 0; s < NUM_SETS; s++) begin
        for (int w = 0; w < WAY_COUNT; w++) begin
          rank[s][w] <= w; 
        end
      end
    end
    else if (req_valid && (hit || refill)) begin
      for (int w = 0; w < WAY_COUNT; w++) begin
        if (w == acc)
          rank[req_set][w] <= 2'd3; // MRU
        else if (rank[req_set][w] > old_r)
          rank[req_set][w] <= rank[req_set][w] - 1;
      end
    end
  end

endmodule
