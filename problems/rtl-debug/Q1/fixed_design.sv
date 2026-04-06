module seq1011_debug (
  input  logic clk,
  input  logic rst,
  input  logic in_bit,
  output logic detect
);
  typedef enum logic [1:0] {S0, S1, S10, S101} state_t;
  state_t state, next_state;

  // Next-state logic (unchanged)
  always_comb begin
    next_state = state;
    case (state)
      S0:   next_state = in_bit ? S1   : S0;
      S1:   next_state = in_bit ? S1   : S10;
      S10:  next_state = in_bit ? S101 : S0;
      S101: next_state = in_bit ? S1   : S10;
      default: next_state = S0;
    endcase
  end

  // FIX: detect is now combinational — asserts the same cycle
  //      the final '1' of "1011" is sampled.
  assign detect = (state == S101) && in_bit;

  // State register (detect removed from here)
  always_ff @(posedge clk or posedge rst) begin
    if (rst) state <= S0;
    else     state <= next_state;
  end
endmodule