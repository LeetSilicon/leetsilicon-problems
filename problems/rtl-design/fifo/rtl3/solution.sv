// Mealy FSM detecting serial pattern 1,0,1,1,0 (non-overlapping)
module seq_det_10110 (
  input  logic clk,
  input  logic rst_n,
  input  logic bit_in,
  output logic match_pulse
);
  typedef enum logic [2:0] {
    S0,    // No match progress
    S1,    // Seen "1"
    S10,   // Seen "10"
    S101,  // Seen "101"
    S1011  // Seen "1011"
  } state_t;

  state_t state;

  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) state <= S0;
    else case (state)
      S0:    state <= bit_in ? S1    : S0;
      S1:    state <= bit_in ? S1    : S10;
      S10:   state <= bit_in ? S101  : S0;
      S101:  state <= bit_in ? S1011 : S10;
      S1011: state <= bit_in ? S1    : S0;   // "10110" complete on 0
    endcase
  end

  // match on transition S1011 → S0 (received final 0)
  assign match_pulse = (state == S1011) && !bit_in;
endmodule