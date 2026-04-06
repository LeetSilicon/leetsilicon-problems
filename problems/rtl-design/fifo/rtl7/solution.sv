// FSM: 3 states = remainder mod 3 (MSB-first serial input)
module div_by_3 (
  input  logic clk,
  input  logic rst_n,
  input  logic bit_in,
  output logic div_by_3
);
  // States: R0 (rem=0), R1 (rem=1), R2 (rem=2)
  // Transition: new_rem = (2*rem + bit_in) mod 3
  typedef enum logic [1:0] {
    R0,   // remainder 0
    R1,   // remainder 1
    R2    // remainder 2
  } state_t;

  state_t state;

  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) state <= R0;
    else case (state)
      R0: state <= bit_in ? R1 : R0;
      R1: state <= bit_in ? R0 : R2;
      R2: state <= bit_in ? R2 : R1;
    endcase
  end

  assign div_by_3 = (state == R0);
endmodule