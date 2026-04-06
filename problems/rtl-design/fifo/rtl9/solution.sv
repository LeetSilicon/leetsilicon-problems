module timebase (
  input  logic clk,
  input  logic rst_n,
  input  logic tick_1ms,
  output logic sec_pulse,
  output logic min_pulse,
  output logic hour_pulse
);
  logic [9:0] ms_cnt;    // 0..999
  logic [5:0] sec_cnt;   // 0..59
  logic [5:0] min_cnt;   // 0..59

  // ms → sec
  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      ms_cnt   <= '0;
      sec_pulse <= 0;
    end else begin
      sec_pulse <= 0;
      if (tick_1ms) begin
        if (ms_cnt == 999) begin
          ms_cnt    <= '0;
          sec_pulse <= 1;
        end else begin
          ms_cnt <= ms_cnt + 1;
        end
      end
    end
  end

  // sec → min
  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      sec_cnt   <= '0;
      min_pulse <= 0;
    end else begin
      min_pulse <= 0;
      if (sec_pulse) begin
        if (sec_cnt == 59) begin
          sec_cnt   <= '0;
          min_pulse <= 1;
        end else begin
          sec_cnt <= sec_cnt + 1;
        end
      end
    end
  end

  // min → hour
  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      min_cnt    <= '0;
      hour_pulse <= 0;
    end else begin
      hour_pulse <= 0;
      if (min_pulse) begin
        if (min_cnt == 59) begin
          min_cnt    <= '0;
          hour_pulse <= 1;
        end else begin
          min_cnt <= min_cnt + 1;
        end
      end
    end
  end
endmodule