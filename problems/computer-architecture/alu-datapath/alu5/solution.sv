module multiplier #(
  parameter W = 16
)(
  input  logic            clk,
  input  logic            rst_n,
  input  logic            start,
  input  logic [W-1:0]    a,
  input  logic [W-1:0]    b,
  output logic [2*W-1:0]  product,
  output logic            busy,
  output logic            done
);
  logic [2*W-1:0] acc, b_sh;
  logic [W-1:0]   a_r;
  logic [$clog2(W):0] cnt;

  typedef enum logic [1:0] { IDLE, CALC, FIN } st_t;
  st_t st;

  assign busy = (st == CALC);

  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      st      <= IDLE;
      done    <= 1'b0;
      product <= '0;
      acc     <= '0;
      b_sh    <= '0;
      a_r     <= '0;
      cnt     <= '0;
    end else begin
      done <= 1'b0;
      case (st)
        IDLE: begin
          if (start) begin
            acc  <= '0;
            a_r  <= a;
            b_sh <= {{W{1'b0}}, b};
            cnt  <= '0;
            st   <= CALC;
          end
        end
        CALC: begin
          if (a_r[0]) acc <= acc + b_sh;
          a_r  <= a_r >> 1;
          b_sh <= b_sh << 1;
          cnt  <= cnt + 1'b1;
          if (cnt == W-1) st <= FIN;
        end
        FIN: begin
          product <= acc;
          done    <= 1'b1;
          st      <= IDLE;
        end
      endcase
    end
  end
endmodule