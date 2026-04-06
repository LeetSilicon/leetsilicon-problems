module tb;
  localparam N = 8;

  logic [N-1:0]  request;
  logic [2:0]    index;
  logic          valid;
  int            p = 0, f = 0;

  priority_encoder #(.N(N)) dut (.*);

  task automatic check(
    input string       msg,
    input logic [2:0]  exp_idx,
    input logic        exp_valid
  );
    #1;
    if (index === exp_idx && valid === exp_valid) begin
      p++;
      $display("PASS: %s", msg);
    end else begin
      f++;
      $display("FAIL: %s  exp idx=%0d valid=%b  got idx=%0d valid=%b",
               msg, exp_idx, exp_valid, index, valid);
    end
  endtask

  initial begin
    // TC1 — Single request: bit 3 set
    request = 8'b0000_1000; check("TC1 single req bit3", 3, 1);

    // TC2 — Multiple requests LSB-first: bits 2,3,5 set → index=2
    request = 8'b0010_1100; check("TC2 LSB priority bits 2,3,5 → 2", 2, 1);

    // TC4 — All zeros → valid=0
    request = 8'b0000_0000; check("TC4 all zeros valid=0", 0, 0);

    // TC5 — All ones → LSB wins → index=0
    request = 8'b1111_1111; check("TC5 all ones → index=0", 0, 1);

    // Extra — Only MSB set
    request = 8'b1000_0000; check("MSB only → index=7", 7, 1);

    // Extra — Bit 1 only
    request = 8'b0000_0010; check("Bit 1 only → index=1", 1, 1);

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule