module pwm_gen #(
  parameter COUNTER_WIDTH = 8,
  parameter PERIOD        = 100,
  parameter DUTY          = 50
)(
  input  logic clk,
  input  logic rst_n,
  output logic pwm_out
);
  logic [COUNTER_WIDTH-1:0] counter;

  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      counter <= '0;
    end else begin
      if (counter == PERIOD - 1) counter <= '0;
      else                       counter <= counter + 1;
    end
  end

  assign pwm_out = (counter < DUTY);
endmodule