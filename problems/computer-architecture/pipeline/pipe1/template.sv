// ============================================================
// Pipeline Registers with Stall and Flush
// ============================================================
// A pipeline stall holds the current stage register (no update), often by disabling
// PC and IF/ID updates and/or using a clock enable; flush injects a bubble/NOP by
// clearing control signals and/or instruction fields.
//
// TODO: Define priority when stall && flush:
// - Option A: flush wins (common: ensure bubble is inserted)
// - Option B: stall wins (hold state)
// TODO: Document NOP encoding choice: all-zero instruction or explicit NOP opcode.
// TODO: Decide whether to include a valid bit (recommended for debug).

module pipe_reg #(
  parameter int unsigned W = 64
) (
  input  logic             clk,
  input  logic             rst_n,
  input  logic             stall,
  input  logic             flush,
  input  logic [W-1:0]     d,
  output logic [W-1:0]     q
);

  // NOP/bubble value: all zeros (clears all control signals).
  // Flush inserts this bubble; stall holds current value.

  always_ff @(posedge clk or negedge rst_n) begin
  if (!rst_n) begin
  // TODO: Reset to safe NOP state (all zeros).
  //   q <= '0;
  end else begin
  // TODO: Implement simultaneous stall+flush priority.
  // Common choice: flush wins over stall.
  // Suggested structure:
  //   if (flush)       q <= '0;       // insert bubble
  //   else if (!stall) q <= d;        // normal update
  //   // else: stall holds current q (implicit — no assignment needed)
  end
  end

endmodule

