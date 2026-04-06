module alu_control (
  input  logic [1:0] alu_op,
  input  logic [2:0] funct3,
  input  logic       funct7_b5,
  output logic [3:0] alu_ctrl
);
  always_comb begin
    case (alu_op)
      2'b00: alu_ctrl = 4'd0;  // Load/Store — ADD
      2'b01: alu_ctrl = 4'd1;  // Branch    — SUB
      2'b10: begin
        case (funct3)
          3'b000: alu_ctrl = funct7_b5 ? 4'd1 : 4'd0;  // SUB / ADD
          3'b001: alu_ctrl = 4'd6;                      // SLL
          3'b010: alu_ctrl = 4'd5;                      // SLT
          3'b100: alu_ctrl = 4'd4;                      // XOR
          3'b101: alu_ctrl = funct7_b5 ? 4'd8 : 4'd7;  // SRA / SRL
          3'b110: alu_ctrl = 4'd3;                      // OR
          3'b111: alu_ctrl = 4'd2;                      // AND
          default: alu_ctrl = 4'd0;
        endcase
      end
      default: alu_ctrl = 4'd0;
    endcase
  end
endmodule