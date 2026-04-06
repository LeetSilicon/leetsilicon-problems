module async_fifo #(
  parameter DEPTH = 8,
  parameter WIDTH = 8
)(
  // Write domain
  input  logic              write_clk,
  input  logic              write_rst_n,
  input  logic              write_en,
  input  logic [WIDTH-1:0]  write_data,
  output logic              full,
  // Read domain
  input  logic              read_clk,
  input  logic              read_rst_n,
  input  logic              read_en,
  output logic [WIDTH-1:0]  read_data,
  output logic              empty
);
  localparam PTR_W = $clog2(DEPTH) + 1;  // Extra bit for full/empty

  // Shared memory
  logic [WIDTH-1:0] mem [DEPTH];

  // Write domain pointers
  logic [PTR_W-1:0] wr_ptr_bin,  wr_ptr_gray;
  logic [PTR_W-1:0] rd_gray_sync1, rd_gray_sync2;  // 2-stage sync into write domain

  // Read domain pointers
  logic [PTR_W-1:0] rd_ptr_bin,  rd_ptr_gray;
  logic [PTR_W-1:0] wr_gray_sync1, wr_gray_sync2;  // 2-stage sync into read domain

  // Binary-to-Gray conversion
  function automatic logic [PTR_W-1:0] bin2gray(input logic [PTR_W-1:0] b);
    return (b >> 1) ^ b;
  endfunction

  // ── Write domain ──────────────────────────────────────────────────────────
  assign wr_ptr_gray = bin2gray(wr_ptr_bin);

  always_ff @(posedge write_clk or negedge write_rst_n) begin
    if (!write_rst_n) begin
      wr_ptr_bin <= '0;
    end else if (write_en && !full) begin
      mem[wr_ptr_bin[$clog2(DEPTH)-1:0]] <= write_data;
      wr_ptr_bin                          <= wr_ptr_bin + 1;
    end
  end

  // Synchronize rd_ptr_gray into write domain
  always_ff @(posedge write_clk or negedge write_rst_n) begin
    if (!write_rst_n) begin
      rd_gray_sync1 <= '0;
      rd_gray_sync2 <= '0;
    end else begin
      rd_gray_sync1 <= rd_ptr_gray;
      rd_gray_sync2 <= rd_gray_sync1;
    end
  end

  // Full: next write pointer equals synchronized read pointer with MSBs inverted
  logic [PTR_W-1:0] wr_gray_next;
  assign wr_gray_next = bin2gray(wr_ptr_bin + 1);
  assign full = (wr_gray_next[PTR_W-1:PTR_W-2] == {~rd_gray_sync2[PTR_W-1], rd_gray_sync2[PTR_W-2]})
             && (wr_gray_next[PTR_W-3:0] == rd_gray_sync2[PTR_W-3:0]);

  // ── Read domain ───────────────────────────────────────────────────────────
  assign rd_ptr_gray = bin2gray(rd_ptr_bin);

  always_ff @(posedge read_clk or negedge read_rst_n) begin
    if (!read_rst_n) begin
      rd_ptr_bin <= '0;
    end else if (read_en && !empty) begin
      rd_ptr_bin <= rd_ptr_bin + 1;
    end
  end

  assign read_data = mem[rd_ptr_bin[$clog2(DEPTH)-1:0]];

  // Synchronize wr_ptr_gray into read domain
  always_ff @(posedge read_clk or negedge read_rst_n) begin
    if (!read_rst_n) begin
      wr_gray_sync1 <= '0;
      wr_gray_sync2 <= '0;
    end else begin
      wr_gray_sync1 <= wr_ptr_gray;
      wr_gray_sync2 <= wr_gray_sync1;
    end
  end

  // Empty: read Gray pointer equals synchronized write Gray pointer
  assign empty = (rd_ptr_gray == wr_gray_sync2);
endmodule