module sync_fifo #(
  parameter DEPTH               = 8,
  parameter WIDTH               = 8,
  parameter ALMOST_FULL_THRESH  = DEPTH - 1,
  parameter ALMOST_EMPTY_THRESH = 1
)(
  input  logic              clk,
  input  logic              rst_n,
  input  logic              write_en,
  input  logic [WIDTH-1:0]  write_data,
  input  logic              read_en,
  output logic [WIDTH-1:0]  read_data,
  output logic              full,
  output logic              empty,
  output logic              almost_full,
  output logic              almost_empty
);
  localparam PTR_W = $clog2(DEPTH);

  logic [WIDTH-1:0]   mem   [DEPTH];
  logic [PTR_W-1:0]   wr_ptr;
  logic [PTR_W-1:0]   rd_ptr;
  logic [PTR_W:0]     count;

  // Status flags
  assign full         = (count == DEPTH);
  assign empty        = (count == 0);
  assign almost_full  = (count >= ALMOST_FULL_THRESH);
  assign almost_empty = (count <= ALMOST_EMPTY_THRESH);

  // Read data — combinational (zero-cycle latency)
  assign read_data = mem[rd_ptr];

  // Write pointer and memory write
  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      wr_ptr <= '0;
    end else if (write_en && !full) begin
      mem[wr_ptr] <= write_data;
      wr_ptr      <= wr_ptr + 1;
    end
  end

  // Read pointer
  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      rd_ptr <= '0;
    end else if (read_en && !empty) begin
      rd_ptr <= rd_ptr + 1;
    end
  end

  // Occupancy counter
  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      count <= '0;
    end else begin
      unique case ({write_en && !full, read_en && !empty})
        2'b10:   count <= count + 1;
        2'b01:   count <= count - 1;
        default: count <= count;  
      endcase
    end
  end
endmodule