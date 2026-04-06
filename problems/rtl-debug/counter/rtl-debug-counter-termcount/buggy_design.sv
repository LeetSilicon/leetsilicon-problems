module mod10_counter_debug (
  input  logic       clk,
  input  logic       rst,
  input  logic       en,
  output logic [3:0] count,
  output logic       tc_pulse
);
  always_ff @(posedge clk or posedge rst) begin
    if (rst) begin
      count     <= 4'd0;
      tc_pulse  <= 1'b0;
    end else if (en) begin
      if (count == 4'd9) count <= 4'd0;
      else               count <= count + 4'd1;

      // BUG
      tc_pulse <= (count == 4'd0);
    end else begin
      tc_pulse <= 1'b0;
    end
  end
endmodule