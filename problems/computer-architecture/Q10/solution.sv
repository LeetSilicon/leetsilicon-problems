module overflow_detect #(
  parameter W = 32
)(
  input  logic [W-1:0] a,
  input  logic [W-1:0] b,
  input  logic [W-1:0] result,
  input  logic         is_sub,
  output logic         overflow,
  output logic         carry
);
  logic [W:0] ext;

  assign ext      = is_sub ? ({1'b0, a} - {1'b0, b}) : ({1'b0, a} + {1'b0, b});
  assign carry    = ext[W];
  assign overflow = is_sub
    ? (a[W-1] != b[W-1]) && (result[W-1] != a[W-1])
    : (a[W-1] == b[W-1]) && (result[W-1] != a[W-1]);
endmodule