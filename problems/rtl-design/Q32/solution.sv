module pattern_in_window #(
  parameter N       = 8,
  parameter K       = 5,
  parameter PATTERN = 5'b10110
)(
  input  logic clk,
  input  logic rst_n,
  input  logic bit_in,
  output logic found
);
  logic [N-1:0] window;

  // Shift register — new bit enters at MSB
  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) window <= '0;
    else        window <= {bit_in, window[N-1:1]};
  end

  // Compare each K-bit slice against PATTERN, OR all matches
  always_comb begin
    found = 0;
    for (int i = 0; i <= N-K; i++) begin
      if (window[i +: K] == PATTERN) found = 1;
    end
  end
endmodule