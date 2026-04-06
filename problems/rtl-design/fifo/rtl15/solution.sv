module two_ff_sync (
  input  logic dst_clk,
  input  logic dst_rst_n,
  input  logic async_sig_in,
  output logic sig_sync
);
  logic ff1;

  always_ff @(posedge dst_clk or negedge dst_rst_n) begin
    if (!dst_rst_n) begin
      ff1      <= 0;
      sig_sync <= 0;
    end else begin
      ff1      <= async_sig_in;
      sig_sync <= ff1;
    end
  end
endmodule