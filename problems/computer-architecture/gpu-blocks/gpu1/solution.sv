module warp_scheduler #(
  parameter N_WARPS = 8
)(
  input  logic                        clk,
  input  logic                        rst_n,
  input  logic [N_WARPS-1:0]         warp_ready,
  output logic [$clog2(N_WARPS)-1:0] selected_warp,
  output logic                        valid
);
  logic [$clog2(N_WARPS)-1:0] last;

  always_comb begin
    logic [$clog2(N_WARPS)-1:0] idx;

    valid         = 0;
    selected_warp = '0;
    idx           = '0;
    for (int i = 1; i <= N_WARPS; i++) begin
      idx = (last + i) % N_WARPS;
      if (warp_ready[idx]) begin
        selected_warp = idx;
        valid         = 1;
        break;
      end
    end
  end

  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n)     last <= '0;
    else if (valid) last <= selected_warp;
  end
endmodule