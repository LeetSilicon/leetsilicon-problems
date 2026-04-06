module cache_lfu #(
  parameter NUM_SETS = 64,
  parameter N_WAYS   = 4,
  parameter CNT_W    = 4
)(
  input  logic                         clk,
  input  logic                         rst_n,
  input  logic                         req_valid,
  input  logic                         hit,
  input  logic                         refill,
  input  logic [$clog2(NUM_SETS)-1:0]  req_set,
  input  logic [$clog2(N_WAYS)-1:0]    hit_way,
  input  logic [$clog2(N_WAYS)-1:0]    refill_way,
  input  logic [N_WAYS-1:0]            way_valid,
  output logic [$clog2(N_WAYS)-1:0]    victim_way
);
  logic [CNT_W-1:0] freq [NUM_SETS * N_WAYS];
  localparam logic [CNT_W-1:0] MAX_CNT = {CNT_W{1'b1}};

  logic [$clog2(NUM_SETS * N_WAYS)-1:0] base;
  assign base = req_set * N_WAYS;

  always_comb begin
    logic found_invalid;
    logic [CNT_W-1:0] min_freq;
    victim_way    = '0;
    found_invalid = 1'b0;
    min_freq      = MAX_CNT;

    for (int w = 0; w < N_WAYS; w++) begin
      if (!way_valid[w] && !found_invalid) begin
        victim_way    = w[$clog2(N_WAYS)-1:0];
        found_invalid = 1'b1;
      end
    end

    if (!found_invalid) begin
      for (int w = 0; w < N_WAYS; w++) begin
        if (freq[base + w] < min_freq) begin
          min_freq   = freq[base + w];
          victim_way = w[$clog2(N_WAYS)-1:0];
        end
      end
    end
  end

  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      for (int i = 0; i < NUM_SETS * N_WAYS; i++)
        freq[i] = '0;
    end else if (req_valid) begin
      if (hit && (freq[base + hit_way] < MAX_CNT))
        freq[base + hit_way] <= freq[base + hit_way] + 1'b1;
      if (refill)
        freq[base + refill_way] <= {{(CNT_W-1){1'b0}}, 1'b1};
    end
  end
endmodule