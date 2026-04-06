module apb_slave_debug (
  input  logic       PCLK,
  input  logic       PRESETn,
  input  logic       PSEL,
  input  logic       PENABLE,
  input  logic       PWRITE,
  input  logic [7:0] PWDATA,
  output logic       PREADY,
  output logic [7:0] PRDATA
);
  logic [7:0] reg0;

  always_ff @(posedge PCLK or negedge PRESETn) begin
    if (!PRESETn) begin
      reg0   <= 8'h00;
      PRDATA <= 8'h00;
      PREADY <= 1'b0;
    end else begin
      PREADY <= 1'b0;
      // FIX: only assert PREADY (and transfer data) in the ACCESS phase
      if (PSEL && PENABLE) begin
        PREADY <= 1'b1;
        if (PWRITE) reg0   <= PWDATA;
        else        PRDATA <= reg0;
      end
    end
  end
endmodule