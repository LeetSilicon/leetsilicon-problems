module req_ack_debug(
  input  logic clk,
  input  logic rst,
  input  logic req,
  output logic ack
);
  logic busy;

  always_ff @(posedge clk or posedge rst) begin
    if (rst) begin
      ack  <= 1'b0;
      busy <= 1'b0;
    end else begin
      // Default: deassert ack every cycle unless explicitly set below
      ack <= 1'b0;

      if (req && !busy) begin
        // FIX: accept new request — one-cycle ack pulse
        ack  <= 1'b1;
        busy <= 1'b1;
      end else if (busy) begin
        // Service complete — clear busy (ack stays 0 from default)
        busy <= 1'b0;
      end
      // FIX: removed  "if (req) ack <= 1'b1"  that was overriding the deassert
    end
  end
endmodule