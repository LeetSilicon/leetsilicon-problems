module alu #(
  parameter W = 32
)(
  input  logic [W-1:0] a,
  input  logic [W-1:0] b,
  input  logic [3:0]   op,
  output logic [W-1:0] result,
  output logic         zero,
  output logic         carry,
  output logic         overflow,
  output logic         negative
);
  logic [W:0] tmp;

  always_comb begin
    tmp      = '0;
    overflow = 1'b0;

    case (op)
      4'd0: tmp = a + b;
      4'd1: tmp = a - b;
      4'd2: tmp = {1'b0, (a & b)};
      4'd3: tmp = {1'b0, (a | b)};
      4'd4: tmp = {1'b0, (a ^ b)};
      4'd5: tmp = {{W{1'b0}}, ($signed(a) < $signed(b))};
      4'd6: tmp = {1'b0, (a << b[$clog2(W)-1:0])};
      4'd7: tmp = {1'b0, (a >> b[$clog2(W)-1:0])};
      4'd8: tmp = {1'b0, ($signed(a) >>> b[$clog2(W)-1:0])};
      default: tmp = '0;
    endcase

    result   = tmp[W-1:0];
    carry    = tmp[W];
    zero     = (result == '0);
    negative = result[W-1];

    if (op == 4'd0) overflow = (a[W-1] == b[W-1]) && (result[W-1] != a[W-1]);
    if (op == 4'd1) overflow = (a[W-1] != b[W-1]) && (result[W-1] != a[W-1]);
  end
endmodule