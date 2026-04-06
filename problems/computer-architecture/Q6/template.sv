// ============================================================
// Cache Line Refill FSM Template
// ============================================================

module cache_refill_fsm #(
  parameter int unsigned LINE_WORDS = 4
) (
  input  logic                          clk,
  input  logic                          rst_n,
  input  logic                          miss,
  input  logic                          mem_rvalid,
  input  logic                          mem_rlast,
  output logic                          mem_req,
  output logic                          stall,
  output logic                          refill_done,
  output logic [$clog2(LINE_WORDS)-1:0] beat_count
);

  typedef enum logic [2:0] {IDLE, REQUEST, WAIT, FILL, COMPLETE} state_t;
  state_t st, st_n;

  logic [$clog2(LINE_WORDS)-1:0] beat_q, beat_d;

  // Outputs
  always_comb begin
  mem_req      = 1'b0;
  stall        = (st != IDLE);
  refill_done  = 1'b0;
  beat_count   = beat_q;
  st_n         = st;
  beat_d       = beat_q;

  case (st)
  IDLE: begin
    if (miss) st_n = REQUEST;
  end

  REQUEST: begin
    mem_req = 1'b1;
    st_n = WAIT;
  end

  WAIT: begin
    if (mem_rvalid) begin
      st_n   = FILL;
      beat_d = '0;
    end
  end

  FILL: begin
    if (mem_rvalid) begin
      // TODO: Increment beat counter when a data beat arrives.
      // TODO: Transition to COMPLETE on mem_rlast or when beat_count reaches LINE_WORDS-1.
    end
  end

  COMPLETE: begin
    refill_done = 1'b1;
    st_n = IDLE;
  end
  endcase
  end

  // State regs
  always_ff @(posedge clk or negedge rst_n) begin
  if (!rst_n) begin
  st     <= IDLE;
  beat_q <= '0;
  end else begin
  // TODO: Register next-state values and clear beat counter on a new miss.
  end
  end

endmodule

