module sync_counter #(
  parameter N           = 4,
  parameter RESET_VALUE = 0
)(
  input  logic         clk,
  input  logic         rst_n,
  input  logic         enable,
  output logic [N-1:0] count
);
  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      count <= N'(RESET_VALUE);
    end else if (enable) begin
      count <= count + 1;
    end
  end
endmodule