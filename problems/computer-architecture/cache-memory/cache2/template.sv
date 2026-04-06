// ============================================================
// Tree-Based Pseudo-LRU (PLRU) Replacement Policy Template
// ============================================================
// Semantics (documented convention):
// - Internal nodes store 1 bit each.
// - Victim selection walk: bit==0 => go LEFT, bit==1 => go RIGHT.
// - Update on access: set each node bit on the path so it points AWAY from
//   the accessed leaf (i.e., makes the *other* subtree look "less-recent").
//
// For an N-way set, where N is power-of-2:
// - There are N leaves (ways) and N-1 internal nodes => N-1 bits per set.
// - Updating touches log2(N) nodes along one root-to-leaf path.

module cache_plru #(
  parameter int unsigned NUM_SETS = 64,
  parameter int unsigned N_WAYS   = 4   // must be power of 2
) (
  input  logic                         clk,
  input  logic                         rst_n,
  input  logic                         access_valid,
  input  logic [$clog2(NUM_SETS)-1:0]  access_set,
  input  logic [$clog2(N_WAYS)-1:0]    access_way,
  output logic [$clog2(N_WAYS)-1:0]    victim_way
);

  // ----------------------------
  // Compile-time checks
  // ----------------------------
  localparam int unsigned LEVELS    = $clog2(N_WAYS);   // tree depth to leaf
  localparam int unsigned TREE_BITS = (N_WAYS - 1);     // internal nodes

  // TODO: Enforce N_WAYS is power-of-2 and >=2 (tool-dependent).
  // initial begin
  //   if (N_WAYS < 2) $fatal;
  //   if ((N_WAYS & (N_WAYS-1)) != 0) $fatal; // power-of-2 check
  // end

  // ----------------------------
  // PLRU state: N-1 bits per set
  // ----------------------------
  // We store internal-node bits in an array indexed like a binary heap:
  // node 0 = root
  // left child of i => 2*i + 1
  // right child of i => 2*i + 2
  //
  // Leaves (ways) are not stored; traversal ends after LEVELS decisions.
  logic [TREE_BITS-1:0] plru_bits [NUM_SETS-1:0];

  // ----------------------------
  // Helper: compute path directions
  // ----------------------------
  // We need, for each level from root->leaf, whether access_way is in left(0)/right(1) subtree.
  // A common mapping: treat access_way as a LEVELS-bit index; MSB decides at root, next bit at next level, etc.
  function automatic logic get_dir(input logic [$clog2(N_WAYS)-1:0] way, input int unsigned level);
  // TODO:
  // Return direction bit at "level":
  // - level=0 corresponds to root decision (use MSB of way index).
  // - level increases going down; use descending bits.
  // Example for N_WAYS=8 (LEVELS=3): way[2] is root dir, way[1] next, way[0] last.
  get_dir = 1'b0;
  endfunction

  // ----------------------------
  // Victim selection (combinational)
  // ----------------------------
  always_comb begin
  int unsigned node;
  logic [$clog2(N_WAYS)-1:0] way_accum;
  logic b;

  victim_way = '0;
  node       = 0;
  way_accum  = '0;
  b          = 1'b0;

  if (access_valid) begin

  // Walk from root for LEVELS steps following bits:
  // bit==0 => left, bit==1 => right, until reaching a leaf.
  for (int unsigned level = 0; level < LEVELS; level++) begin
    b = plru_bits[access_set][node];

    // TODO:
    // - Append b into way_accum (so we end with the leaf/way index).
    // - Move node to its child based on b: node = (b==0) ? (2*node+1) : (2*node+2).
    //
    // Hint: building the way index is like shifting in bits:
    // way_accum = (way_accum << 1) | b;
  end

  victim_way = way_accum;
  end
  end

  // ----------------------------
  // Update on access (sequential)
  // ----------------------------
  always_ff @(posedge clk or negedge rst_n) begin
  if (!rst_n) begin
  // Reset to known state (deterministic).
  // TODO: Choose convention; common is all zeros (bias victim to way 0) or any fixed pattern.
  for (int s = 0; s < NUM_SETS; s++) begin
    plru_bits[s] <= '0;
  end
  end else begin
  if (access_valid) begin
    // Update only the nodes along the root->leaf path for access_way.
    int unsigned node;
    node = 0;

    for (int unsigned level = 0; level < LEVELS; level++) begin
      logic dir;
      dir = get_dir(access_way, level); // 0=left subtree, 1=right subtree

      // TODO (tree semantics):
      // Set bit at current node to point AWAY from the accessed subtree.
      // If accessed went left (dir=0), set node bit to 1 (so victim walk would go right next time).
      // If accessed went right (dir=1), set node bit to 0.
      // plru_bits[access_set][node] <= ~dir;

      // TODO: Advance node down the accessed direction:
      // node = (dir==0) ? (2*node+1) : (2*node+2);
    end
  end
  end
  end
endmodule
