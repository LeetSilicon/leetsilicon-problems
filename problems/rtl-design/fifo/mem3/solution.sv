// Direct-mapped write-through cache with write-allocate
module direct_mapped_cache #(
  parameter ADDR_WIDTH  = 8,
  parameter DATA_WIDTH  = 8,
  parameter NUM_LINES   = 4,    // Number of cache lines
  parameter OFFSET_BITS = 0     // Words per line = 1 (single-word lines)
)(
  input  logic                    clk,
  input  logic                    rst_n,
  input  logic                    access,
  input  logic                    write_en,
  input  logic [ADDR_WIDTH-1:0]  address,
  input  logic [DATA_WIDTH-1:0]  write_data,
  // Simulated memory interface
  input  logic [DATA_WIDTH-1:0]  mem_read_data,   // Data from main memory
  output logic [ADDR_WIDTH-1:0]  mem_address,
  output logic [DATA_WIDTH-1:0]  mem_write_data,
  output logic                    mem_write_en,
  output logic                    mem_read_req,
  // Cache status
  output logic [DATA_WIDTH-1:0]  read_data,
  output logic                    hit,
  output logic                    miss
);
  localparam INDEX_BITS = $clog2(NUM_LINES);
  localparam TAG_BITS   = ADDR_WIDTH - INDEX_BITS - OFFSET_BITS;

  logic                  valid     [NUM_LINES];
  logic [TAG_BITS-1:0]   tag_array [NUM_LINES];
  logic [DATA_WIDTH-1:0] data_array[NUM_LINES];

  // Address decomposition
  logic [TAG_BITS-1:0]   addr_tag;
  logic [INDEX_BITS-1:0] addr_idx;

  assign addr_tag = address[ADDR_WIDTH-1 : ADDR_WIDTH-TAG_BITS];
  assign addr_idx = address[INDEX_BITS-1 : 0];

  // Hit detection (combinational)
  assign hit  = access && valid[addr_idx] && (tag_array[addr_idx] == addr_tag);
  assign miss = access && !hit;

  // Read data
  assign read_data = data_array[addr_idx];

  // Memory interface
  assign mem_address    = address;
  assign mem_write_data = write_data;
  assign mem_write_en   = access && write_en;   // Write-through: always write to memory
  assign mem_read_req   = miss && !write_en;    // Fetch on read miss

  // Cache update
  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      for (int i = 0; i < NUM_LINES; i++) begin
        valid[i] <= 0;
      end
    end else if (access) begin
      if (hit && write_en) begin
        // Write hit — update cache (write-through also writes to memory)
        data_array[addr_idx] <= write_data;
      end else if (miss && !write_en) begin
        // Read miss — fill from memory
        valid[addr_idx]      <= 1;
        tag_array[addr_idx]  <= addr_tag;
        data_array[addr_idx] <= mem_read_data;
      end else if (miss && write_en) begin
        // Write miss — write-allocate: fill then update
        valid[addr_idx]      <= 1;
        tag_array[addr_idx]  <= addr_tag;
        data_array[addr_idx] <= write_data;
      end
    end
  end
endmodule