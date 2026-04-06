module seq_multiplier #(
  parameter WIDTH = 16
)(
  input  logic              clk,
  input  logic              rst_n,
  input  logic              start,
  input  logic [WIDTH-1:0]  a,
  input  logic [WIDTH-1:0]  b,
  output logic [2*WIDTH-1:0] product,
  output logic              done,
  output logic              busy
);
  logic [2*WIDTH-1:0]    acc, b_shifted;
  logic [WIDTH-1:0]      a_reg;
  logic [$clog2(WIDTH):0] cnt;

  typedef enum logic [1:0] {
    IDLE,
    CALC,
    FIN
  } st_t;

  st_t st;

  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      st      <= IDLE;
      done    <= 0;
      busy    <= 0;
      product <= '0;
    end else begin
      done <= 0;
      case (st)
        IDLE: begin
          if (start) begin
            acc       <= '0;
            a_reg     <= a;
            b_shifted <= {{WIDTH{1'b0}}, b};
            cnt       <= '0;
            busy      <= 1;
            st        <= CALC;
          end
        end
        CALC: begin
          if (a_reg[0]) acc <= acc + b_shifted;
          a_reg     <= a_reg     >> 1;
          b_shifted <= b_shifted << 1;
          cnt       <= cnt + 1;
          if (cnt == WIDTH - 1) st <= FIN;
        end
        FIN: begin
          product <= acc;
          done    <= 1;
          busy    <= 0;
          st      <= IDLE;
        end
      endcase
    end
  end
endmodule