module gray_counter #(
  parameter N = 4
)(
  input  logic         clk,
  input  logic         rst_n,
  input  logic         enable,
  output logic [N-1:0] gray_count
);
  logic [N-1:0] bin_count;

  // Binary counter
  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      bin_count <= '0;
    end else if (enable) begin
      bin_count <= bin_count + 1;
    end
  end

  // Combinational Gray conversion: gray = bin ^ (bin >> 1)
  assign gray_count = bin_count ^ (bin_count >> 1);
endmodule