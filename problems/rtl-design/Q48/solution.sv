module sliding_window_minmax #(
  parameter WINDOW_SIZE = 4,
  parameter DATA_WIDTH  = 8
)(
  input  logic                   clk,
  input  logic                   rst_n,
  input  logic                   in_valid,
  input  logic [DATA_WIDTH-1:0]  in_data,
  output logic [DATA_WIDTH-1:0]  min_out,
  output logic [DATA_WIDTH-1:0]  max_out,
  output logic                    out_valid
);
  logic [DATA_WIDTH-1:0] window [WINDOW_SIZE];
  logic [$clog2(WINDOW_SIZE):0] fill_cnt;
  logic [$clog2(WINDOW_SIZE)-1:0] wr_ptr;

  // Shift register buffer
  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      fill_cnt  <= '0;
      wr_ptr    <= '0;
      out_valid <= 0;
      for (int i = 0; i < WINDOW_SIZE; i++) window[i] <= '0;
    end else if (in_valid) begin
      window[wr_ptr] <= in_data;
      wr_ptr         <= (wr_ptr == WINDOW_SIZE - 1) ? '0 : wr_ptr + 1;
      if (fill_cnt < WINDOW_SIZE) fill_cnt <= fill_cnt + 1;
      out_valid      <= (fill_cnt == WINDOW_SIZE - 1) || (fill_cnt == WINDOW_SIZE);
    end
  end

  // Combinational min/max over entire window
  always_comb begin
    min_out = window[0];
    max_out = window[0];
    for (int i = 1; i < WINDOW_SIZE; i++) begin
      if (window[i] < min_out) min_out = window[i];
      if (window[i] > max_out) max_out = window[i];
    end
  end
endmodule