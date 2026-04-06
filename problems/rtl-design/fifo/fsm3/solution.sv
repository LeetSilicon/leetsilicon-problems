module vending_machine #(
  parameter ITEM_PRICE = 25
)(
  input  logic        clk,
  input  logic        rst_n,
  input  logic        coin_valid,
  input  logic [4:0]  coin_value,   // 5, 10, or 25 cents
  output logic        dispense,
  output logic        change_valid,
  output logic [4:0]  change_amount
);
  localparam CREDIT_BITS = 7;

  logic [CREDIT_BITS-1:0] credit;

  typedef enum logic [1:0] {
    IDLE,
    DISPENSE_STATE,
    CHANGE_STATE
  } state_t;

  state_t state;

  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      credit        <= '0;
      state         <= IDLE;
      dispense      <= 0;
      change_valid  <= 0;
      change_amount <= 0;
    end else begin
      dispense      <= 0;
      change_valid  <= 0;
      change_amount <= 0;

      case (state)
        IDLE: begin
          // Accumulate valid coins (5c, 10c, 25c only)
          if (coin_valid && (coin_value == 5 || coin_value == 10 || coin_value == 25)) begin
            credit <= credit + coin_value;
          end
          // Dispense when sufficient credit
          if ((credit + (coin_valid && (coin_value == 5 || coin_value == 10 || coin_value == 25)
                         ? coin_value : 0)) >= ITEM_PRICE) begin
            state <= DISPENSE_STATE;
          end
        end
        DISPENSE_STATE: begin
          dispense <= 1;
          credit   <= credit - ITEM_PRICE;
          if (credit - ITEM_PRICE > 0)
            state <= CHANGE_STATE;
          else
            state <= IDLE;
        end
        CHANGE_STATE: begin
          change_valid  <= 1;
          change_amount <= credit[4:0];
          credit        <= '0;
          state         <= IDLE;
        end
      endcase
    end
  end
endmodule