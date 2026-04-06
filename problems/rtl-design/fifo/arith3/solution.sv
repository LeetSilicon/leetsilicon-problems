module seq_divider #(
  parameter WIDTH = 16
)(
  input  logic              clk,
  input  logic              rst_n,
  input  logic              start,
  input  logic [WIDTH-1:0]  dividend,
  input  logic [WIDTH-1:0]  divisor,
  output logic [WIDTH-1:0]  quotient,
  output logic [WIDTH-1:0]  remainder,
  output logic              done,
  output logic              busy,
  output logic              div_by_zero
);
  logic [WIDTH-1:0]        q_reg, div_reg;
  logic [WIDTH:0]          r_reg;
  logic [$clog2(WIDTH):0]  cnt;

  typedef enum logic [1:0] { IDLE, CALC, FIN } st_t;
  st_t st;

  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      st          <= IDLE;
      q_reg       <= '0;
      div_reg     <= '0;
      r_reg       <= '0;
      quotient    <= '0;
      remainder   <= '0;
      cnt         <= '0;
      done        <= 0;
      busy        <= 0;
      div_by_zero <= 0;
    end else begin
      done        <= 0;
      div_by_zero <= 0;

      case (st)
        IDLE: begin
          busy <= 0;
          if (start) begin
            if (divisor == 0) begin
              quotient    <= '1;
              remainder   <= dividend;
              div_by_zero <= 1;
              done        <= 1;
            end else begin
              q_reg   <= dividend;
              div_reg <= divisor;
              r_reg   <= '0;
              cnt     <= '0;
              busy    <= 1;
              st      <= CALC;
            end
          end
        end

        CALC: begin
          logic [WIDTH:0]       r_next;
          logic [WIDTH-1:0]     q_next;

          r_next = {r_reg[WIDTH-1:0], q_reg[WIDTH-1]};
          q_next = {q_reg[WIDTH-2:0], 1'b0};

          if (r_next >= {1'b0, div_reg}) begin
            r_next   = r_next - {1'b0, div_reg};
            q_next[0] = 1'b1;
          end

          r_reg <= r_next;
          q_reg <= q_next;
          cnt   <= cnt + 1;

          if (cnt == WIDTH - 1) begin
            st <= FIN;
          end
        end

        FIN: begin
          quotient  <= q_reg;
          remainder <= r_reg[WIDTH-1:0];
          done      <= 1;
          busy      <= 0;
          st        <= IDLE;
        end
      endcase
    end
  end
endmodule