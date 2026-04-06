module rr_arbiter #(
  parameter N = 4
)(
  input  logic          clk,
  input  logic          rst_n,
  input  logic [N-1:0] req,
  output logic [N-1:0] grant
);
  logic [$clog2(N)-1:0] last;

  always_comb begin
    logic [$clog2(N)-1:0] idx;

    grant = '0;
    idx   = '0;
    for (int i = 1; i <= N; i++) begin
      idx = (last + i) % N;
      if (req[idx]) begin
        grant[idx] = 1;
        break;
      end
    end
  end

  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      last <= '0;
    end else if (|grant) begin
      for (int i = 0; i < N; i++) begin
        if (grant[i]) last <= i;
      end
    end
  end
endmodule