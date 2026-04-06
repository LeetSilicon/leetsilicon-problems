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
  // Flattened rank storage: rank_flat[set*WAY_COUNT + way]
  logic [1:0] rank_flat [NUM_SETS * WAY_COUNT];

  logic [$clog2(WAY_COUNT)-1:0] acc;
  logic [1:0] old_r;
  logic [$clog2(NUM_SETS * WAY_COUNT)-1:0] base;

  always_comb begin
    acc  = hit ? hit_way : refill_way;
    base = req_set * WAY_COUNT;
    old_r = rank_flat[base + acc];
  end

  always_comb begin
    victim_valid = 1;
    victim_way   = '0;
    if (way_valid != '1) begin
      for (int i = 0; i < WAY_COUNT; i++) begin
        if (!way_valid[i]) begin
          victim_way = i[$clog2(WAY_COUNT)-1:0];
          break;
        end
      end
    end else begin
      for (int i = 0; i < WAY_COUNT; i++) begin
        if (rank_flat[base + i] == 0) begin
          victim_way = i[$clog2(WAY_COUNT)-1:0];
          break;
        end
      end
    end
  end

  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      for (int s = 0; s < NUM_SETS; s++)
        for (int w = 0; w < WAY_COUNT; w++)
          rank_flat[s * WAY_COUNT + w] <= w[1:0];
    end else if (req_valid && (hit || refill)) begin
      for (int w = 0; w < WAY_COUNT; w++) begin
        if (w[$clog2(WAY_COUNT)-1:0] == acc)
          rank_flat[base + w] <= 2'd3;
        else if (rank_flat[base + w] > old_r)
          rank_flat[base + w] <= rank_flat[base + w] - 1;
      end
    end
  end
endmodule