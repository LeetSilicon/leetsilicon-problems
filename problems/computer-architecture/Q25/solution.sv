module bank_conflict #(
  parameter N_BANKS    = 32,
  parameter THREADS    = 32,
  parameter ADDR_W     = 32,
  parameter BANK_OFFSET = 2
)(
  input  logic [ADDR_W-1:0]                   addr [THREADS],
  input  logic [THREADS-1:0]                  active_mask,
  output logic                                has_conflict,
  output logic [$clog2(N_BANKS)-1:0]          conflict_bank_id,
  output logic                                can_issue,
  output logic [THREADS-1:0]                  conflict_mask
);
  logic [THREADS-1:0] used [N_BANKS];
  logic [$clog2(N_BANKS)-1:0] bank;

  always_comb begin
    has_conflict     = 1'b0;
    conflict_bank_id = '0;
    can_issue        = 1'b1;
    conflict_mask    = '0;
    for (int b = 0; b < N_BANKS; b++) used[b] = '0;

    for (int t = 0; t < THREADS; t++) begin
      if (active_mask[t]) begin
        bank = (addr[t] >> BANK_OFFSET) & (N_BANKS-1);
        if (|used[bank]) begin
          has_conflict      = 1'b1;
          can_issue         = 1'b0;
          conflict_bank_id  = bank;
          conflict_mask     = conflict_mask | used[bank];
          conflict_mask[t]  = 1'b1;
        end
        used[bank][t] = 1'b1;
      end
    end
  end
endmodule