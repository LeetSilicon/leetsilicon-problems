module divider #(
  parameter W = 16
)(
  input  logic          clk,
  input  logic          rst_n,
  input  logic          start,
  input  logic [W-1:0]  dividend,
  input  logic [W-1:0]  divisor,
  output logic [W-1:0]  quotient,
  output logic [W-1:0]  remainder,
  output logic          busy,
  output logic          done,
  output logic          div_by_zero
);
  logic [W-1:0]       q, d;
  logic [W:0]         r;
  logic [$clog2(W):0] cnt;

  typedef enum logic [1:0] { IDLE, CALC, FIN } st_t;
  st_t st;

  assign busy = (st == CALC);

  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      st          <= IDLE;
      q           <= '0;
      d           <= '0;
      r           <= '0;
      cnt         <= '0;
      quotient    <= '0;
      remainder   <= '0;
      done        <= 1'b0;
      div_by_zero <= 1'b0;
    end else begin
      done        <= 1'b0;
      div_by_zero <= 1'b0;
      case (st)
        IDLE: begin
          if (start) begin
            if (divisor == '0) begin
              quotient    <= '0;
              remainder   <= dividend;
              div_by_zero <= 1'b1;
              done        <= 1'b1;
            end else begin
              q   <= dividend;
              d   <= divisor;
              r   <= '0;
              cnt <= '0;
              st  <= CALC;
            end
          end
        end
        CALC: begin
          logic [W:0]   r_shift;
          logic [W:0]   r_next;
          logic [W-1:0] q_next;
          r_shift = {r[W-1:0], q[W-1]};
          q_next  = {q[W-2:0], 1'b0};
          r_next  = r_shift;
          if (r_shift >= {1'b0, d}) begin
            r_next    = r_shift - {1'b0, d};
            q_next[0] = 1'b1;
          end
          r   <= r_next;
          q   <= q_next;
          cnt <= cnt + 1'b1;
          if (cnt == W-1) st <= FIN;
        end
        FIN: begin
          quotient  <= q;
          remainder <= r[W-1:0];
          done      <= 1'b1;
          st        <= IDLE;
        end
      endcase
    end
  end
endmodule