module tb;
  logic [31:0] data_in, data_out;
  logic [4:0]  shamt;
  logic [1:0]  shift_type;
  int          p = 0, f = 0;

  // DUT instantiation
  barrel_shifter #(.W(32)) dut (.*);

  task automatic check(input string msg, input logic [31:0] exp);
    #1;
    if (data_out === exp) begin
      p++;
      $display("PASS: %s", msg);
    end else begin
      f++;
      $display("FAIL: %s  got=%h", msg, data_out);
    end
  endtask

  initial begin
    data_in = 32'h0000_0001; shamt = 4; shift_type = 2'b00; check("SLL",  32'h0000_0010);
    data_in = 32'h0000_0080; shamt = 3; shift_type = 2'b01; check("SRL",  32'h0000_0010);
    data_in = 32'hF000_0000; shamt = 4; shift_type = 2'b10; check("SRA",  32'hFF00_0000);

    // Zero shift: all types should pass data through unchanged
    data_in = 32'hDEAD_BEEF; shamt = 0;
    shift_type = 2'b00; check("SLL shamt=0", 32'hDEAD_BEEF);
    shift_type = 2'b01; check("SRL shamt=0", 32'hDEAD_BEEF);
    shift_type = 2'b10; check("SRA shamt=0", 32'hDEAD_BEEF);

    // Max shift (31 for 32-bit)
    data_in = 32'h0000_0001; shamt = 31;
    shift_type = 2'b00; check("SLL max", 32'h8000_0000);
    data_in = 32'h8000_0000; shamt = 31;
    shift_type = 2'b01; check("SRL max", 32'h0000_0001);
    data_in = 32'h8000_0000; shamt = 31;
    shift_type = 2'b10; check("SRA max", 32'hFFFF_FFFF);  // sign-extended

    // SRA positive: no sign extension
    data_in = 32'h7000_0000; shamt = 4;
    shift_type = 2'b10; check("SRA pos", 32'h0700_0000);

    // Summary
    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule