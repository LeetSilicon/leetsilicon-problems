module cache_plru #(
  parameter NUM_SETS = 64,
  parameter N_WAYS   = 4
)(
  input  logic                         clk,
  input  logic                         rst_n,
  input  logic                         access_valid,
  input  logic [$clog2(NUM_SETS)-1:0] access_set,
  input  logic [$clog2(N_WAYS)-1:0]   access_way,
  output logic [$clog2(N_WAYS)-1:0]   victim_way
);
  localparam LEVELS    = $clog2(N_WAYS);
  localparam TREE_BITS = N_WAYS - 1;

  logic [TREE_BITS-1:0] tree [NUM_SETS];

  // Victim selection: walk tree following bits
  always_comb begin
    int node;
    node = 0;
    victim_way = '0;
    for (int l = 0; l < LEVELS; l++) begin
      if (tree[access_set][node]) begin
        victim_way[(LEVELS-1)-l] = 1;
        node = 2*node + 2;
      end else begin
        victim_way[(LEVELS-1)-l] = 0;
        node = 2*node + 1;
      end
    end
  end

  // Update: flip bits along access path
  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      for (int s = 0; s < NUM_SETS; s++)
        tree[s] <= '0;
    end else if (access_valid) begin
      // Compute updated tree inline to avoid comb feedback
      automatic int node = 0;
      automatic logic dir;
      for (int l = 0; l < LEVELS; l++) begin
        dir = access_way[(LEVELS-1)-l];
        tree[access_set][node] <= !dir;
        node = dir ? (2*node + 2) : (2*node + 1);
      end
    end
  end
endmodule