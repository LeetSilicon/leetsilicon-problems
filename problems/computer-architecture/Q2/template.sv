// Tree-based PLRU template
// - Internal nodes: N_WAYS-1 bits per set
// - Victim walk: bit==0 -> LEFT, bit==1 -> RIGHT
// - Update: along path to access_way, set bit to point AWAY from accessed subtree

module cache_plru #(
  parameter int unsigned NUM_SETS = 64,
  parameter int unsigned N_WAYS   = 4
)(
  input  logic                         clk,
  input  logic                         rst_n,
  input  logic                         access_valid,
  input  logic [$clog2(NUM_SETS)-1:0]  access_set,
  input  logic [$clog2(N_WAYS)-1:0]    access_way,
  output logic [$clog2(N_WAYS)-1:0]    victim_way
);

  localparam int unsigned LEVELS    = $clog2(N_WAYS);
  localparam int unsigned TREE_BITS = N_WAYS - 1;

  logic [TREE_BITS-1:0] tree [NUM_SETS];

  // -------------------------
  // VICTIM SELECTION (TODO)
  // -------------------------
  always_comb begin
    int node;
    node       = 0;
    victim_way = '0;

    for (int lvl = 0; lvl < LEVELS; lvl++) begin
      // TODO:
      // logic b = tree[access_set][node];
      // victim_way[LEVELS-1-lvl] = b;
      // node = (b == 1'b0) ? (2*node + 1) : (2*node + 2);
    end
  end

  // -------------------------
  // UPDATE LOGIC (TODO)
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
        // TODO: dir = access_way[LEVELS-1-lvl];

        // TODO: tree[access_set][node] <= ~dir;

        // TODO:
        // if (dir == 1'b0)
        //   node = 2*node + 1;
        // else
        //   node = 2*node + 2;
      end
    end
  end

endmodule
