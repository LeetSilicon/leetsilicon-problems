module bin_to_gray_counter #(
  parameter W = 4
)(
  input  logic        clk,
  input  logic        rst_n,
  input  logic        enable,
  output logic [W-1:0] bin_count,
  output logic [W-1:0] gray_count
);
  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) bin_count <= '0;
    else if (enable) bin_count <= bin_count + 1;
  end

  assign gray_count = bin_count ^ (bin_count >> 1);
endmodule