// Divide-by-3 with ~50% duty cycle using posedge + negedge capture and OR
module clk_div3_50 (
  input  logic clk,
  input  logic rst_n,
  output logic clk_div3_50
);
  logic [1:0] cnt_pos;   // Posedge counter 0..2
  logic [1:0] cnt_neg;   // Negedge counter 0..2
  logic        pos_out;
  logic        neg_out;

  // Counter on rising edge
  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      cnt_pos <= 0;
      pos_out <= 0;
    end else begin
      if (cnt_pos == 2) cnt_pos <= 0;
      else cnt_pos <= cnt_pos + 1;
      pos_out <= (cnt_pos == 0) || (cnt_pos == 1);
    end
  end

  // Delayed version on falling edge
  always_ff @(negedge clk or negedge rst_n) begin
    if (!rst_n) begin
      cnt_neg <= 0;
      neg_out <= 0;
    end else begin
      if (cnt_neg == 2) cnt_neg <= 0;
      else cnt_neg <= cnt_neg + 1;
      neg_out <= (cnt_neg == 0) || (cnt_neg == 1);
    end
  end

  // OR both to get ~50% output
  assign clk_div3_50 = pos_out & neg_out;
endmodule