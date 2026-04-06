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
      if (req && !busy) begin
        ack  <= 1'b1;
        busy <= 1'b1;
      end else if (busy) begin
        busy <= 1'b0;
      end
      if (req) ack <= 1'b1; // BUG
    end
  end
endmodule