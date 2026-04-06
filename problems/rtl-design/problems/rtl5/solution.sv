module debounce_sync (
  input  logic clk,
  input  logic rst_n,
  input  logic async_in,
  output logic debounced_level,
  output logic debounced_rise_pulse
);
  // 2-flop synchronizer
  logic sync1, sync2;

  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      sync1 <= 0;
      sync2 <= 0;
    end else begin
      sync1 <= async_in;
      sync2 <= sync1;
    end
  end

  // Debounce filter: require 2 consecutive high samples
  logic prev;

  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      prev             <= 0;
      debounced_level  <= 0;
    end else begin
      prev <= sync2;
      // Accept high only after 2 stable samples
      if (sync2 && prev)  debounced_level <= 1;
      if (!sync2 && !prev) debounced_level <= 0;
    end
  end

  // Rising edge of debounced_level
  logic debounced_prev;
  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) debounced_prev <= 0;
    else        debounced_prev <= debounced_level;
  end

  assign debounced_rise_pulse = debounced_level & ~debounced_prev;
endmodule