module top_k_tracker #(
  parameter K          = 3,
  parameter DATA_WIDTH = 8
)(
  input  logic                  clk,
  input  logic                  rst_n,
  input  logic                  in_valid,
  input  logic [DATA_WIDTH-1:0] in_data,
  output logic [DATA_WIDTH-1:0] top_values [K]
);
  // top_values[0] = largest, top_values[K-1] = smallest of top-K
  // Keeps duplicates

  logic [DATA_WIDTH-1:0] next_top [K];
  always_comb begin
    for (int i = 0; i < K; i++) next_top[i] = top_values[i];
    if (in_valid) begin
      if (in_data > top_values[0]) begin
        next_top[0] = in_data;
        for (int i = 1; i < K; i++) next_top[i] = top_values[i-1];
      end else begin
        automatic logic done = 0;
        for (int i = 1; i < K; i++) begin
          if (!done && in_data > top_values[i]) begin
            next_top[i] = in_data;
            for (int j = i+1; j < K; j++) next_top[j] = top_values[j-1];
            done = 1;
          end
        end
      end
    end
  end
  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      for (int i = 0; i < K; i++) top_values[i] = '0;
    end else begin
      for (int i = 0; i < K; i++) top_values[i] <= next_top[i];
    end
  end
endmodule