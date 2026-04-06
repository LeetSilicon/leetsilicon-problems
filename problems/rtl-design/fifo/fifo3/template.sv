// ============================================================
// FIFO with Asymmetric Read/Write Widths (Width Conversion)
// ============================================================
// Goal: support WRITE_WIDTH != READ_WIDTH with integer ratio.
// Common approach: choose smallest unit as storage granularity (e.g., bytes) and
// pack/unpack across the boundary.
//
// TODO: Document packing order with an explicit example (LSB-first vs MSB-first).
// TODO: Define full/empty based on whether you can accept an entire write beat
//       or produce an entire read beat.

module fifo_width_conv #(
  parameter int unsigned DEPTH_BYTES  = 64,  // capacity expressed in bytes (recommended)
  parameter int unsigned WRITE_WIDTH  = 32,
  parameter int unsigned READ_WIDTH   = 8,

  // TODO: Optional almost thresholds in bytes
  parameter int unsigned AFULL_BYTES  = DEPTH_BYTES-1,
  parameter int unsigned AEMPTY_BYTES = 1
) (
  input  logic                      clk,
  input  logic                      rst_n,

  // Write side
  input  logic                      write_en,
  input  logic [WRITE_WIDTH-1:0]    write_data,
  output logic                      full,

  // Read side
  input  logic                      read_en,
  output logic [READ_WIDTH-1:0]     read_data,
  output logic                      empty
);

  // ----------------------------
  // TODO: Compile-time checks
  // ----------------------------
  // TODO: Enforce integer ratio:
  // - Either WRITE_WIDTH % READ_WIDTH == 0 OR READ_WIDTH % WRITE_WIDTH == 0.
  // TODO: Define UNIT_BYTES = min(WRITE_WIDTH, READ_WIDTH)/8 (require byte multiple).
  // TODO: Decide if non-multiple-of-8 widths are allowed (usually disallow).

  // ----------------------------
  // TODO: Storage granularity
  // ----------------------------
  // TODO: Choose smallest unit storage (e.g., 8-bit byte memory) to simplify conversion.
  // Example: mem_byte[0:DEPTH_BYTES-1].
  // TODO: Maintain byte-level read/write pointers and occupancy_bytes.

  // ----------------------------
  // TODO: Write path behavior
  // ----------------------------
  // Case A: WRITE_WIDTH > READ_WIDTH
  // - One write_en writes multiple units (e.g., 32b -> 4 bytes) into FIFO sequentially.
  // TODO: Implement "sub-write" counter 0..(WRITE_BYTES-1) or unrolled loop.
  //
  // Case B: WRITE_WIDTH < READ_WIDTH
  // - Need to accumulate multiple writes into a wider word before allowing one read.
  // TODO: Implement assembly register + counter (collected_bytes).
  // TODO: Define when assembled word is committed to storage.

  // ----------------------------
  // TODO: Read path behavior
  // ----------------------------
  // Case A: READ_WIDTH < WRITE_WIDTH
  // - Reads pop smaller units sequentially (bytes) following documented order.
  //
  // Case B: READ_WIDTH > WRITE_WIDTH
  // - Reads should block until enough units accumulated (empty=1 until enough).
  // TODO: Ensure empty is based on availability of READ_BYTES, not just >0.

  // ----------------------------
  // TODO: Full/empty computation
  // ----------------------------
  // TODO: Express in bytes:
  // - full when remaining_capacity_bytes < WRITE_BYTES
  // - empty when available_bytes < READ_BYTES
  // TODO: Define behavior for simultaneous rd+wr (count changes by +WRITE_BYTES-READ_BYTES).

  // ----------------------------
  // TODO: Packing order
  // ----------------------------
  // TODO: LSB-first example (must document):
  // - For 32->8: first read returns write_data[7:0], then [15:8], etc.
  // - For 8->32: assemble as {byte3,byte2,byte1,byte0} or vice versa (document).

endmodule


