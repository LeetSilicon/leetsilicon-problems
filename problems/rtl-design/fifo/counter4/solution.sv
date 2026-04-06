module barrel_shifter #(
  parameter WIDTH = 8
)(
  input  logic [WIDTH-1:0]          data_in,
  input  logic [$clog2(WIDTH)-1:0]  shift_amt,
  input  logic [1:0]                shift_op,   // 00=SLL, 01=SRL, 10=SRA
  output logic [WIDTH-1:0]          data_out
);
  always_comb begin
    case (shift_op)
      2'b00: data_out =   data_in  << shift_amt;          // SLL
      2'b01: data_out =   data_in  >> shift_amt;          // SRL
      2'b10: data_out = $signed(data_in) >>> shift_amt;   // SRA
      default: data_out = data_in;
    endcase
  end
endmodule