// LSB-first priority encoder: index 0 = highest priority
module priority_encoder #(
  parameter N = 8
)(
  input  logic [N-1:0]           request,
  output logic [$clog2(N)-1:0]   index,
  output logic                    valid
);
  always_comb begin
    index = '0;
    valid = 0;
    for (int i = 0; i < N; i++) begin
      if (request[i]) begin
        index = i[$clog2(N)-1:0];
        valid = 1;
        break;
      end
    end
  end
endmodule