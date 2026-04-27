module cache_plru #(
  parameter NUM_SETS = 64,
  parameter N_WAYS   = 4
)(
  input  logic clk,
  input  logic rst_n,
  input  logic access_valid,
  input  logic [$clog2(NUM_SETS)-1:0] access_set,
  input  logic [$clog2(N_WAYS)-1:0] access_way,
  output logic [$clog2(N_WAYS)-1:0] victim_way
);

  localparam LEVELS    = $clog2(N_WAYS);
  localparam TREE_BITS = N_WAYS - 1;

  logic [TREE_BITS-1:0] tree [NUM_SETS];

  // -------------------------
  // VICTIM SELECTION
  // -------------------------
  always_comb begin
    int node;
    node = 0;
    victim_way = '0;

    for (int lvl = 0; lvl < LEVELS; lvl++) begin
      if (tree[access_set][node] == 1'b0) begin
        victim_way[LEVELS-1-lvl] = 1'b0;
        node = 2*node + 1;
      end
      else begin
        victim_way[LEVELS-1-lvl] = 1'b1;
        node = 2*node + 2;
      end
    end
  end

  // -------------------------
  // UPDATE LOGIC
  // -------------------------
  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      for (int s = 0; s < NUM_SETS; s++)
        tree[s] <= '0;
    end
    else if (access_valid) begin
      int node;
      node = 0;

      for (int lvl = 0; lvl < LEVELS; lvl++) begin
        logic dir;
        dir = access_way[LEVELS-1-lvl];

        // Mark opposite direction as LRU
        tree[access_set][node] <= ~dir;

        if (dir == 1'b0)
          node = 2*node + 1;
        else
          node = 2*node + 2;
      end
    end
  end

endmodule
