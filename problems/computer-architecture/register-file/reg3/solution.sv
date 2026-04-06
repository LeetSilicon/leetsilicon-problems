module scoreboard #(
  parameter REGS = 32
)(
  input  logic       clk,
  input  logic       rst_n,
  input  logic       issue_valid,
  input  logic       wb_valid,
  input  logic [4:0] issue_rd,
  input  logic [4:0] wb_rd,
  input  logic [4:0] check_rs1,
  input  logic [4:0] check_rs2,
  output logic       rs1_busy,
  output logic       rs2_busy
);
  logic [REGS-1:0] busy;

  assign rs1_busy = (check_rs1 != 0) && busy[check_rs1];
  assign rs2_busy = (check_rs2 != 0) && busy[check_rs2];

  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      busy <= '0;
    end else begin
      if (issue_valid && issue_rd != 0) busy[issue_rd] <= 1;
      if (wb_valid    && wb_rd    != 0) busy[wb_rd]    <= 0;
    end
  end
endmodule