module decoder #(
  parameter N = 3
)(
  input  logic [N-1:0]       in,
  input  logic                en,
  output logic [(1<<N)-1:0]  out
);
  assign out = en ? ({{((1<<N)-1){1'b0}}, 1'b1} << in) : '0;
endmodule