module cache_refill_fsm #(
  parameter LINE_WORDS = 4
)(
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
  state_t state;

  assign stall = (state != IDLE);

  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      state       <= IDLE;
      mem_req     <= 0;
      refill_done <= 0;
      beat_count  <= '0;
    end else begin
      mem_req     <= 0;
      refill_done <= 0;
      case (state)
        IDLE: begin
          beat_count <= '0;
          if (miss) begin
            state   <= REQUEST;
            mem_req <= 1;
          end
        end
        REQUEST: begin
          state <= WAIT;
        end
        WAIT: begin
          if (mem_rvalid) begin
            beat_count <= '0;
            if (mem_rlast || LINE_WORDS == 1) begin
              state       <= COMPLETE;
              refill_done <= 1;
            end else
              state <= FILL;
          end
        end
        FILL: begin
          if (mem_rvalid) begin
            beat_count <= beat_count + 1'b1;
            if (mem_rlast || beat_count == LINE_WORDS[$clog2(LINE_WORDS)-1:0] - 2) begin
              state       <= COMPLETE;
              refill_done <= 1;
            end
          end
        end
        COMPLETE: begin
          state <= IDLE;
        end
        default: state <= IDLE;
      endcase
    end
  end
endmodule