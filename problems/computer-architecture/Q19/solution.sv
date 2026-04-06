module regfile #(
  parameter W     = 32,
  parameter DEPTH = 32
)(
  input  logic                      clk,
  input  logic                      we,
  input  logic [$clog2(DEPTH)-1:0] wa,
  input  logic [$clog2(DEPTH)-1:0] ra1,
  input  logic [$clog2(DEPTH)-1:0] ra2,
  input  logic [W-1:0]              wd,
  output logic [W-1:0]              rd1,
  output logic [W-1:0]              rd2
);
  logic [W-1:0] regs [DEPTH];

  // x0 always reads zero
  assign rd1 = (ra1 == 0) ? '0 : regs[ra1];
  assign rd2 = (ra2 == 0) ? '0 : regs[ra2];

  always_ff @(posedge clk) begin
    if (we && wa != 0) regs[wa] <= wd;
  end
endmodule