module tb;
  logic [7:0] data_in, data_out;
  logic [2:0] shift_amt;
  logic [1:0] shift_op;
  int         p = 0, f = 0;

  barrel_shifter #(.WIDTH(8)) dut (.*);

  task automatic check(input string msg, input logic [7:0] exp);
    #1;
    if (data_out === exp) begin
      p++;
      $display("PASS: %s", msg);
    end else begin
      f++;
      $display("FAIL: %s  exp=%h  got=%h", msg, exp, data_out);
    end
  endtask

  initial begin
    // TC1 — SLL: 0x01 << 3 = 0x08
    data_in = 8'h01; shift_amt = 3; shift_op = 2'b00; check("SLL 1<<3",  8'h08);
    // TC2 — SRL: 0x80 >> 1 = 0x40
    data_in = 8'h80; shift_amt = 1; shift_op = 2'b01; check("SRL 0x80>>1", 8'h40);
    // TC3 — SRA: 0x80 >>> 1 = 0xC0 (sign-extend)
    data_in = 8'h80; shift_amt = 1; shift_op = 2'b10; check("SRA 0x80>>>1", 8'hC0);
    // TC4 — Zero shift
    data_in = 8'hAB; shift_amt = 0; shift_op = 2'b00; check("SLL 0 shift", 8'hAB);
    data_in = 8'hAB; shift_amt = 0; shift_op = 2'b01; check("SRL 0 shift", 8'hAB);
    data_in = 8'hAB; shift_amt = 0; shift_op = 2'b10; check("SRA 0 shift", 8'hAB);
    // TC5 — Maximum shift (7)
    data_in = 8'h01; shift_amt = 7; shift_op = 2'b00; check("SLL max",     8'h80);
    data_in = 8'h80; shift_amt = 7; shift_op = 2'b01; check("SRL max",     8'h01);
    data_in = 8'h80; shift_amt = 7; shift_op = 2'b10; check("SRA max neg", 8'hFF);
    data_in = 8'h7F; shift_amt = 7; shift_op = 2'b10; check("SRA max pos", 8'h00);

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule