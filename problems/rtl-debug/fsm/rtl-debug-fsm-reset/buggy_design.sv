module seq1011_debug (
  input  logic clk,
  input  logic rst,
  input  logic in_bit,
  output logic detect
);
  typedef enum logic [1:0] {S0, S1, S10, S101} state_t;
  state_t state, next_state;

  always_comb begin
  next_state = state;
  case (state)
    S0: begin
      if (in_bit) next_state = S1;
      else        next_state = S0;
    end
    S1: begin
      if (in_bit) next_state = S1;
      else        next_state = S10;
    end
    S10: begin
      if (in_bit) next_state = S101;
      else        next_state = S0;
    end
    S101: begin
      if (in_bit) next_state = S1;
      else        next_state = S10;
    end
    default: next_state = S0;
  endcase
end

  // BUG
  always_ff @(posedge clk or posedge rst) begin
    if (rst) begin
      state  <= S0;
      detect <= 1'b0;
    end else begin
      state  <= next_state;
      detect <= (state == S101 && in_bit == 1'b1); // intended sequence 1011
    end
  end
endmodule