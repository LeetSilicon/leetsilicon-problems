module gray_ptr #(
  parameter W = 4
)(
  input  logic         clk,
  input  logic         rst_n,
  input  logic         inc,
  output logic [W-1:0] bin_ptr,
  output logic [W-1:0] gray_ptr
);
  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) bin_ptr <= '0;
    else if (inc) bin_ptr <= bin_ptr + 1;
  end

  assign gray_ptr = bin_ptr ^ (bin_ptr >> 1);
endmodule