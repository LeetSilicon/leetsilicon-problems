module adder_sub #(
  parameter WIDTH = 32
)(
  input  logic [WIDTH-1:0] a,
  input  logic [WIDTH-1:0] b,
  input  logic             sub,
  output logic [WIDTH-1:0] result,
  output logic             carry_out,
  output logic             overflow
);
  logic [WIDTH-1:0] b_eff;
  logic [WIDTH:0]   sum_ext;

  always_comb begin
    b_eff     = sub ? ~b : b;
    sum_ext   = {1'b0, a} + {1'b0, b_eff} + sub;
    result    = sum_ext[WIDTH-1:0];
    carry_out = sum_ext[WIDTH];

    if (!sub) begin
      overflow = (a[WIDTH-1] == b[WIDTH-1]) &&
                 (result[WIDTH-1] != a[WIDTH-1]);
    end else begin
      overflow = (a[WIDTH-1] != b[WIDTH-1]) &&
                 (result[WIDTH-1] != a[WIDTH-1]);
    end
  end
endmodule