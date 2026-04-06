// Mealy FSM — detect overlapping sequence 1011
module seq_det_1011 (
  input  logic clk,
  input  logic rst_n,
  input  logic in,
  output logic detect
);
  typedef enum logic [2:0] {
    IDLE,    // No progress
    S1,      // Seen "1"
    S10,     // Seen "10"
    S101,    // Seen "101"
    S1011    // Seen "1011" (complete)
  } state_t;

  state_t state, next_state;

  // State register
  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) state <= IDLE;
    else        state <= next_state;
  end

  // Next-state logic
  always_comb begin
    next_state = IDLE;
    case (state)
      IDLE:  next_state = in ? S1    : IDLE;
      S1:    next_state = in ? S1    : S10;
      S10:   next_state = in ? S101  : IDLE;
      S101:  next_state = in ? S1011 : S10;
      S1011: next_state = in ? S1    : S10;   // Overlapping: last "1" starts new match
    endcase
  end

  // Mealy output — detect when transition into S1011
  assign detect = (state == S101) && in;
endmodule