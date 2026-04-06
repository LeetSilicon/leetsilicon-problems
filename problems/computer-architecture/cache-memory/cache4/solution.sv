module cache_tag_cmp #(
  parameter TAG_W  = 20,
  parameter N_WAYS = 4
)(
  input  logic [TAG_W-1:0]           req_tag,
  input  logic [TAG_W-1:0]           way_tag [N_WAYS],
  input  logic [N_WAYS-1:0]          way_valid,
  output logic [N_WAYS-1:0]          way_match,
  output logic                       hit,
  output logic                       miss,
  output logic [$clog2(N_WAYS)-1:0]  hit_way,
  output logic                       multi_hit_error
);
  always_comb begin
    for (int w = 0; w < N_WAYS; w++) begin
      way_match[w] = way_valid[w] && (way_tag[w] == req_tag);
    end

    hit             = |way_match;
    miss            = !hit;
    multi_hit_error = |(way_match & (way_match - 1'b1));
    hit_way         = '0;

    // Lowest-index match wins.
    for (int w = 0; w < N_WAYS; w++) begin
      if (way_match[w]) begin
        hit_way = w[$clog2(N_WAYS)-1:0];
        break;
      end
    end
  end
endmodule