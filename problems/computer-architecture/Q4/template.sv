// ============================================================
// Cache Tag Compare + Hit/Miss Detection Template
// ============================================================

module cache_tag_cmp #(
  parameter int unsigned N_WAYS = 4,
  parameter int unsigned TAG_W  = 20
) (
  input  logic [TAG_W-1:0]        req_tag,
  input  logic [N_WAYS-1:0]        way_valid,
  input  logic [TAG_W-1:0]         way_tag [N_WAYS],

  output logic [N_WAYS-1:0]        way_match,
  output logic                     hit,
  output logic                     miss,
  output logic [$clog2(N_WAYS)-1:0] hit_way,
  output logic                     multi_hit_error
);

  always_comb begin
  // Per-way match: valid AND tags equal. 
  for (int w=0; w<N_WAYS; w++) begin
  way_match[w] = way_valid[w] & (way_tag[w] == req_tag);
  end

  // Hit/miss
  hit  = |way_match;            // OR-reduction 
  miss = ~hit;

  // TODO: Priority encode hit_way (lowest index match for determinism).
  hit_way = '0;
  for (int w=0; w<N_WAYS; w++) begin
  if (way_match[w]) begin
    hit_way = logic'($unsigned(w));
    break;
  end
  end

  // TODO: Multi-hit detection (cache corruption scenario):
  // - Flag error if more than one bit of way_match is set.
  // - Technique: multi_hit_error = |(way_match & (way_match - 1'b1));
  //   This is nonzero iff way_match has 2+ bits set.
  multi_hit_error = 1'b0;  // TODO: Replace with detection logic
  end

endmodule

