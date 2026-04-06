// ============================================================
// Synchronous FIFO with Full/Empty/Almost flags
// ============================================================
// Single clock domain FIFO; typical implementation uses memory + rd/wr pointers and/or
// an occupancy counter to generate full/empty and threshold flags.
//
// TODO: Choose reset type (sync vs async) and document it.
// TODO: Decide read data semantics:
// - Option A: registered read (rd_data updates only on successful read)
// - Option B: combinational read (rd_data reflects mem at rd_ptr)
// TODO: Define overflow/underflow behavior (ignore operation vs optional internal bookkeeping).

module sync_fifo #(
  parameter int unsigned DEPTH = 8,    // TODO: power-of-2 recommended
  parameter int unsigned WIDTH = 8,

  // Thresholds in "entries" (0..DEPTH)
  parameter int unsigned ALMOST_FULL_THRESHOLD  = DEPTH-1,
  parameter int unsigned ALMOST_EMPTY_THRESHOLD = 1
) (
  input  logic               clk,
  input  logic               rst_n,

  input  logic               write_en,
  input  logic [WIDTH-1:0]   write_data,

  input  logic               read_en,
  output logic [WIDTH-1:0]   read_data,

  output logic               full,
  output logic               empty,
  output logic               almost_full,
  output logic               almost_empty
);

  localparam int unsigned ADDR_W = $clog2(DEPTH);

  // Storage
  logic [WIDTH-1:0] mem [0:DEPTH-1];

  // Pointers and occupancy
  logic [ADDR_W-1:0] rd_ptr, wr_ptr;
  logic [ADDR_W:0]   count; // extra bit to represent DEPTH

  // ----------------------------
  // TODO: Parameter/legal checks
  // ----------------------------
  // TODO: Ensure thresholds satisfy:
  // 0 <= ALMOST_EMPTY_THRESHOLD < ALMOST_FULL_THRESHOLD <= DEPTH
  // TODO: Decide behavior if DEPTH is not power-of-2 (pointer wrap logic still must work).
  // TODO: Decide what to do if DEPTH==1 (ADDR_W may be 0 tool-dependent).

  // ----------------------------
  // TODO: Derived handshakes
  // ----------------------------
  // TODO: write_fire = write_en && !full
  // TODO: read_fire  = read_en  && !empty
  // TODO: simultaneous read+write allowed when both fire (count unchanged).

  // ----------------------------
  // TODO: Flag generation from count
  // ----------------------------
  // full  = (count == DEPTH)
  // empty = (count == 0)
  // almost_full  = (count >= ALMOST_FULL_THRESHOLD)
  // almost_empty = (count <= ALMOST_EMPTY_THRESHOLD)

  // ----------------------------
  // Sequential logic
  // ----------------------------
  always_ff @(posedge clk or negedge rst_n) begin
  if (!rst_n) begin
  // TODO: Reset:
  // rd_ptr=0; wr_ptr=0; count=0; empty=1; full=0; read_data defined.
  // almost flags depend on thresholds.
  // Optional internal error bookkeeping, if added, would reset here.
  end else begin
  // TODO: Write operation:
  // - If write_fire: mem[wr_ptr] <= write_data; wr_ptr++ (wrap); count++ if no read_fire.
  // - If write_en && full: ignore write (optionally record an overflow event internally).

  // TODO: Read operation:
  // - If read_fire: read_data <= mem[rd_ptr] (if registered); rd_ptr++ (wrap); count-- if no write_fire.
  // - If read_en && empty: ignore read (optionally record an underflow event internally).

  // TODO: Simultaneous read+write:
  // - If both fire: do both pointer updates; count unchanged.
  // - TODO: Define if reading and writing same address can occur (depends on full/empty boundaries).
  end
  end

endmodule


