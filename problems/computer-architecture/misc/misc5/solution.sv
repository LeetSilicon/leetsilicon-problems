module fu_tracker #(
  parameter N_FU = 4
)(
  input  logic                      clk,
  input  logic                      rst_n,
  input  logic                      issue_req,
  input  logic                      done_req,
  input  logic [$clog2(N_FU)-1:0] issue_fu,
  input  logic [$clog2(N_FU)-1:0] done_fu,
  output logic [N_FU-1:0]         busy,
  output logic                      any_available
);
  assign any_available = ~(&busy);

  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      busy <= '0;
    end else begin
      if (issue_req) busy[issue_fu] <= 1;
      if (done_req)  busy[done_fu]  <= 0;
    end
  end
endmodule