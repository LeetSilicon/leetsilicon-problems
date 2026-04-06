// 4-way set-associative write-back cache with LRU replacement
module wb_cache #(
  parameter NUM_SETS   = 4,
  parameter NUM_WAYS   = 4,
  parameter TAG_BITS   = 4,
  parameter DATA_WIDTH = 8
)(
  input  logic                   clk,
  input  logic                   rst_n,
  input  logic                   access,
  input  logic                   write_en,
  input  logic [TAG_BITS-1:0]   addr_tag,
  input  logic [$clog2(NUM_SETS)-1:0] addr_set,
  input  logic [DATA_WIDTH-1:0]  write_data,
  output logic [DATA_WIDTH-1:0]  read_data,
  output logic                    hit,
  output logic                    miss,
  // Writeback interface
  output logic                    wb_req,
  output logic [TAG_BITS-1:0]    wb_tag,
  output logic [$clog2(NUM_SETS)-1:0] wb_set,
  output logic [DATA_WIDTH-1:0]  wb_data
);
  logic                  valid [NUM_SETS][NUM_WAYS];
  logic                  dirty [NUM_SETS][NUM_WAYS];
  logic [TAG_BITS-1:0]   tags  [NUM_SETS][NUM_WAYS];
  logic [DATA_WIDTH-1:0] data  [NUM_SETS][NUM_WAYS];
  logic [1:0]            lru   [NUM_SETS][NUM_WAYS]; // LRU rank: 3=MRU, 0=LRU

  logic [$clog2(NUM_WAYS)-1:0] hit_way;
  logic [$clog2(NUM_WAYS)-1:0] victim_way;
  logic                         any_hit;

  // Hit detection
  always_comb begin
    any_hit  = 0;
    hit_way  = '0;
    for (int w = 0; w < NUM_WAYS; w++) begin
      if (valid[addr_set][w] && tags[addr_set][w] == addr_tag) begin
        any_hit = 1;
        hit_way = w[$clog2(NUM_WAYS)-1:0];
      end
    end
  end

  // LRU victim selection
  always_comb begin
    victim_way = '0;
    // First prefer invalid way
    for (int w = NUM_WAYS-1; w >= 0; w--) begin
      if (!valid[addr_set][w]) victim_way = w[$clog2(NUM_WAYS)-1:0];
    end
    // If all valid, pick LRU (rank == 0)
    if (&{valid[addr_set][0], valid[addr_set][1], valid[addr_set][2], valid[addr_set][3]}) begin
      for (int w = 0; w < NUM_WAYS; w++) begin
        if (lru[addr_set][w] == 2'd0) victim_way = w[$clog2(NUM_WAYS)-1:0];
      end
    end
  end

  assign hit      = access && any_hit;
  assign miss     = access && !any_hit;
  assign read_data = data[addr_set][hit_way];
  assign wb_req   = miss && valid[addr_set][victim_way] && dirty[addr_set][victim_way];
  assign wb_tag   = tags[addr_set][victim_way];
  assign wb_set   = addr_set;
  assign wb_data  = data[addr_set][victim_way];

  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      for (int s = 0; s < NUM_SETS; s++) begin
        for (int w = 0; w < NUM_WAYS; w++) begin
          valid[s][w] <= 0;
          dirty[s][w] <= 0;
          lru[s][w]   <= w[1:0];
        end
      end
    end else if (access) begin
      if (any_hit) begin
        // Hit: update data on write, always update LRU
        if (write_en) begin
          data[addr_set][hit_way]  <= write_data;
          dirty[addr_set][hit_way] <= 1;
        end
        begin
          logic [1:0] old_rank;
          old_rank = lru[addr_set][hit_way];
          for (int w = 0; w < NUM_WAYS; w++) begin
            if (w[$clog2(NUM_WAYS)-1:0] == hit_way)
              lru[addr_set][w] <= 2'd3;
            else if (lru[addr_set][w] > old_rank)
              lru[addr_set][w] <= lru[addr_set][w] - 1'b1;
          end
        end
      end else begin
        // Miss: evict victim, fill new line
        valid[addr_set][victim_way] <= 1;
        dirty[addr_set][victim_way] <= write_en;
        tags[addr_set][victim_way]  <= addr_tag;
        data[addr_set][victim_way]  <= write_data;
        begin
          logic [1:0] old_rank;
          old_rank = lru[addr_set][victim_way];
          for (int w = 0; w < NUM_WAYS; w++) begin
            if (w[$clog2(NUM_WAYS)-1:0] == victim_way)
              lru[addr_set][w] <= 2'd3;
            else if (lru[addr_set][w] > old_rank)
              lru[addr_set][w] <= lru[addr_set][w] - 1'b1;
          end
        end
      end
    end
  end
endmodule