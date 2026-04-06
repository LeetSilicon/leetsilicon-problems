module handshake_debug (
  input  logic       clk,
  input  logic       rst,
  input  logic       load_new,
  input  logic [7:0] load_data,
  input  logic       src_ready,
  output logic       src_valid,
  output logic [7:0] src_data
);
  always_ff @(posedge clk or posedge rst) begin
    if (rst) begin
      src_valid <= 1'b0;
      src_data  <= 8'h00;
    end else begin
      if (load_new) begin
        src_valid <= 1'b1;
        src_data  <= load_data; // BUG
      end else if (src_valid && src_ready) begin
        src_valid <= 1'b0;
      end
    end
  end
endmodule