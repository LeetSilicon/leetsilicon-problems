module tb;
  logic [31:0] addr [4];
  logic [3:0]  active_mask, conflict_mask;
  logic        has_conflict, can_issue;
  logic [1:0]  conflict_bank_id;
  int          p = 0, f = 0;

  bank_conflict #(.N_BANKS(4), .THREADS(4), .ADDR_W(32), .BANK_OFFSET(2)) dut (.*);

  initial begin
    active_mask = 4'b1111;
    addr[0] = 32'h0;  // bank0
    addr[1] = 32'h4;  // bank1
    addr[2] = 32'h8;  // bank2
    addr[3] = 32'hC;  // bank3
    #1;
    if (!has_conflict && can_issue) begin
      p++;
      $display("PASS: no conflict");
    end else begin
      f++;
      $display("FAIL: no-conflict case");
    end

    // Threads 0 and 1 both bank1.
    addr[0] = 32'h4;
    addr[1] = 32'h14;
    #1;
    if (has_conflict && !can_issue && conflict_bank_id == 1) begin
      p++;
      $display("PASS: conflict bank1");
    end else begin
      f++;
      $display("FAIL: conflict case bank=%0d", conflict_bank_id);
    end

    // Mask out one thread; conflict should disappear.
    active_mask = 4'b0010;
    #1;
    if (!has_conflict) begin
      p++;
      $display("PASS: masked thread ignored");
    end else begin
      f++;
      $display("FAIL: masked thread still conflicts");
    end

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule