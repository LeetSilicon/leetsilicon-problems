module reset_sync (
  input  logic clk,
  input  logic async_rst_n,
  output logic rst_n_sync
);
  logic ff1, ff2;

  // 2-flop synchronizer with async assert, sync deassert
  always_ff @(posedge clk or negedge async_rst_n) begin
    if (!async_rst_n) begin
      ff1 <= 0;
      ff2 <= 0;
    end else begin
      ff1 <= 1;
      ff2 <= ff1;
    end
  end

  assign rst_n_sync = ff2;
endmodule