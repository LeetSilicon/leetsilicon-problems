module shiftreg_debug (
  input  logic       clk,
  input  logic       rst,
  input  logic       load,
  input  logic       shift_en,
  input  logic       ser_in,
  input  logic [7:0] par_in,
  output logic [7:0] q
);
  always_ff @(posedge clk or posedge rst) begin
    if (rst) begin
      q <= 8'h00;
    // FIX: load has priority over shift_en
    end else if (load) begin
      q <= par_in;
    end else if (shift_en) begin
      q <= {q[6:0], ser_in};
    end
  end
endmodule