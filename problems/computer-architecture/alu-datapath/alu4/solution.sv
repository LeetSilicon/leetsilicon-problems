module barrel_shifter #(
  parameter W = 32
)(
  input  logic [W-1:0]         data_in,
  input  logic [$clog2(W)-1:0] shamt,
  input  logic [1:0]            shift_type,
  output logic [W-1:0]         data_out
);
  always_comb begin
    case (shift_type)
      2'b00: data_out =  data_in  << shamt;          // SLL
      2'b01: data_out =  data_in  >> shamt;          // SRL
      2'b10: data_out = $signed(data_in) >>> shamt;  // SRA
      default: data_out = data_in;
    endcase
  end
endmodule