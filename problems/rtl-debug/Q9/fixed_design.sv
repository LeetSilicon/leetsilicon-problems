module ram_sp_debug(
  input  logic       clk,
  input  logic       we,
  input  logic [1:0] addr,
  input  logic [7:0] wdata,
  output logic [7:0] rdata
);
  logic [7:0] mem [0:3];

  always_ff @(posedge clk) begin
    if (we) begin
      mem[addr] <= wdata;
      // FIX: write-first — return the new data being written
      rdata     <= wdata;
    end else begin
      rdata <= mem[addr];
    end
  end
endmodule