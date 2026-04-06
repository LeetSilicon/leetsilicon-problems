module onehot_fsm_debug(
  input  logic clk,
  input  logic rst,
  input  logic start,
  input  logic done,
  output logic [1:0] state
);
  logic [1:0] next_state;
  localparam logic [1:0] IDLE = 2'b01, BUSY = 2'b10;

  always_comb begin
    // BUG
    case (state)
      IDLE: if (start) next_state = BUSY;
      BUSY: if (done)  next_state = IDLE;
    endcase
  end

  always_ff @(posedge clk or posedge rst) begin
    if (rst) state <= IDLE;
    else     state <= next_state;
  end
endmodule