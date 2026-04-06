module fib_gen #(
  parameter W = 16
)(
  input  logic          clk,
  input  logic          rst_n,
  input  logic          enable,
  output logic [W-1:0]  fib_out
);
  logic [W-1:0] a, b;

  // a=0, b=1 on reset → outputs: 0, 1, 1, 2, 3, 5, ...
  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      a <= '0;
      b <= 1;
    end else if (enable) begin
      a <= b;
      b <= a + b;
    end
  end

  assign fib_out = a;
endmodule