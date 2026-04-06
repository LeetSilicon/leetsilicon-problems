module mshr #(
  parameter ENTRIES  = 4,
  parameter ADDR_W   = 32,
  parameter REQS     = 4,
  parameter OFFSET_W = 4
)(
  input  logic                          clk,
  input  logic                          rst_n,
  input  logic                          alloc_req,
  input  logic                          refill_done,
  input  logic [ADDR_W-1:0]             alloc_addr,
  input  logic [$clog2(REQS)-1:0]       requester_id,
  input  logic [$clog2(ENTRIES)-1:0]    refill_entry,
  output logic                          full,
  output logic                          hit,
  output logic                          issue_mem_req,
  output logic [$clog2(ENTRIES)-1:0]    alloc_entry,
  output logic [$clog2(ENTRIES)-1:0]    hit_entry,
  output logic [REQS-1:0]               merged_waiters
);
  // Use packed valid bitvector for Verilator comb sensitivity
  logic [ENTRIES-1:0]              valid_vec;
  logic [ADDR_W-OFFSET_W-1:0]     line    [ENTRIES];
  logic [REQS-1:0]                waiters [ENTRIES];
  logic [ADDR_W-OFFSET_W-1:0]     alloc_line;

  assign alloc_line     = alloc_addr[ADDR_W-1:OFFSET_W];
  assign merged_waiters = waiters[refill_entry];

  always_comb begin
    hit         = 1'b0;
    hit_entry   = '0;
    full        = 1'b1;
    alloc_entry = '0;

    for (int i = 0; i < ENTRIES; i++) begin
      if (valid_vec[i] && (line[i] == alloc_line) && !hit) begin
        hit       = 1'b1;
        hit_entry = i[$clog2(ENTRIES)-1:0];
      end
    end

    for (int i = 0; i < ENTRIES; i++) begin
      if (!valid_vec[i] && full) begin
        full        = 1'b0;
        alloc_entry = i[$clog2(ENTRIES)-1:0];
      end
    end
  end

  assign issue_mem_req = alloc_req && !hit && !full;

  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      valid_vec <= '0;
      for (int i = 0; i < ENTRIES; i++) begin
        line[i]    <= '0;
        waiters[i] <= '0;
      end
    end else begin
      if (alloc_req) begin
        if (hit) begin
          waiters[hit_entry][requester_id] <= 1'b1;
        end else if (!full) begin
          valid_vec[alloc_entry]               <= 1'b1;
          line[alloc_entry]                    <= alloc_line;
          waiters[alloc_entry]                 <= '0;
          waiters[alloc_entry][requester_id]   <= 1'b1;
        end
      end

      if (refill_done) begin
        valid_vec[refill_entry]   <= 1'b0;
        waiters[refill_entry]     <= '0;
      end
    end
  end
endmodule