module rob #(
  parameter ENTRIES = 8,
  parameter W       = 32
)(
  input  logic                          clk,
  input  logic                          rst_n,
  input  logic                          dispatch,
  input  logic                          writeback,
  input  logic                          commit,
  input  logic                          flush,
  input  logic [$clog2(ENTRIES)-1:0]    wb_id,
  input  logic [$clog2(ENTRIES)-1:0]    flush_tail,
  input  logic [4:0]                    dest_arch,
  input  logic [W-1:0]                  wb_value,
  output logic                          full,
  output logic                          empty,
  output logic                          commit_valid,
  output logic [4:0]                    commit_arch,
  output logic [W-1:0]                  commit_value,
  output logic [$clog2(ENTRIES)-1:0]    alloc_id
);
  logic [ENTRIES-1:0]                 valid, ready;
  logic [4:0]                         arch_dest [ENTRIES];
  logic [W-1:0]                       value     [ENTRIES];
  logic [$clog2(ENTRIES)-1:0]         head, tail;

  assign empty       = (head == tail) && !valid[head];
  assign full        = (head == tail) &&  valid[head];
  assign alloc_id    = tail;
  assign commit_valid = valid[head] && ready[head];
  assign commit_arch  = arch_dest[head];
  assign commit_value = value[head];

  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      head <= '0;
      tail <= '0;
      valid <= '0;
      ready <= '0;
      for (int i = 0; i < ENTRIES; i++) begin
        arch_dest[i] <= '0;
        value[i]     <= '0;
      end
    end else begin
      if (dispatch && !full) begin
        valid[tail]     <= 1'b1;
        ready[tail]     <= 1'b0;
        arch_dest[tail] <= dest_arch;
        tail            <= (tail == ENTRIES-1) ? '0 : (tail + 1'b1);
      end

      if (writeback) begin
        ready[wb_id] <= 1'b1;
        value[wb_id] <= wb_value;
      end

      if (commit_valid && commit) begin
        valid[head] <= 1'b0;
        ready[head] <= 1'b0;
        head        <= (head == ENTRIES-1) ? '0 : (head + 1'b1);
      end

      if (flush) begin
        // Invalidate entries in range [flush_tail, tail) with wrap-around.
        // If flush_tail == tail, nothing to invalidate.
        if (flush_tail != tail) begin
          for (int i = 0; i < ENTRIES; i++) begin
            logic in_flush_range;
            if (flush_tail < tail)
              in_flush_range = (i[$clog2(ENTRIES)-1:0] >= flush_tail) &&
                               (i[$clog2(ENTRIES)-1:0] < tail);
            else // flush_tail > tail (wrapped)
              in_flush_range = (i[$clog2(ENTRIES)-1:0] >= flush_tail) ||
                               (i[$clog2(ENTRIES)-1:0] < tail);
            if (in_flush_range) begin
              valid[i] <= 1'b0;
              ready[i] <= 1'b0;
            end
          end
        end
        tail <= flush_tail;
      end
    end
  end
endmodule