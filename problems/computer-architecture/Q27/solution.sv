module priority_enc #(
  parameter N = 8
)(
  input  logic [N-1:0]          in,
  output logic [$clog2(N)-1:0] out,
  output logic                   valid
);
  // LSB-first priority: lowest bit index has highest priority
  always_comb begin
    valid = |in;
    out   = '0;
    for (int i = 0; i < N; i++) begin
      if (in[i]) begin
        out = i[$clog2(N)-1:0];
        break;
      end
    end
  end
endmodule