module instr_decode (
  input  logic [31:0] instr,
  output logic [4:0]  rs1,
  output logic [4:0]  rs2,
  output logic [4:0]  rd,
  output logic [31:0] imm,
  output logic [6:0]  opcode,
  output logic [6:0]  funct7,
  output logic [2:0]  funct3,
  output logic        reg_write,
  output logic        mem_read,
  output logic        mem_write,
  output logic        branch,
  output logic        alu_src,
  output logic        jump,
  output logic        mem_to_reg,
  output logic        illegal_instruction,
  output logic [3:0]  alu_op
);
  assign opcode = instr[6:0];
  assign rd     = instr[11:7];
  assign funct3 = instr[14:12];
  assign rs1    = instr[19:15];
  assign rs2    = instr[24:20];
  assign funct7 = instr[31:25];

  always_comb begin
    case (opcode)
      7'b0010011,
      7'b0000011,
      7'b1100111: imm = {{20{instr[31]}}, instr[31:20]};
      7'b0100011: imm = {{20{instr[31]}}, instr[31:25], instr[11:7]};
      7'b1100011: imm = {{19{instr[31]}}, instr[31], instr[7], instr[30:25], instr[11:8], 1'b0};
      7'b0110111,
      7'b0010111: imm = {instr[31:12], 12'b0};
      7'b1101111: imm = {{11{instr[31]}}, instr[31], instr[19:12], instr[20], instr[30:21], 1'b0};
      default:    imm = 32'b0;
    endcase
  end

  always_comb begin
    reg_write           = 1'b0;
    mem_read            = 1'b0;
    mem_write           = 1'b0;
    branch              = 1'b0;
    alu_src             = 1'b0;
    jump                = 1'b0;
    mem_to_reg          = 1'b0;
    illegal_instruction = 1'b0;
    alu_op              = 4'd0;

    case (opcode)
      7'b0110011: begin // R-type
        reg_write = 1'b1;
        alu_src   = 1'b0;
        case (funct3)
          3'b000: alu_op = funct7[5] ? 4'd1 : 4'd0;
          3'b111: alu_op = 4'd2;
          3'b110: alu_op = 4'd3;
          default: alu_op = 4'd0;
        endcase
      end
      7'b0010011: begin // I-type ALU
        reg_write = 1'b1;
        alu_src   = 1'b1;
        alu_op    = 4'd0;
      end
      7'b0000011: begin // Load
        reg_write  = 1'b1;
        mem_read   = 1'b1;
        alu_src    = 1'b1;
        mem_to_reg = 1'b1;
        alu_op     = 4'd0;
      end
      7'b0100011: begin // Store
        mem_write = 1'b1;
        alu_src   = 1'b1;
        alu_op    = 4'd0;
      end
      7'b1100011: begin // Branch
        branch = 1'b1;
        alu_op = 4'd1;
      end
      7'b1101111,
      7'b1100111: begin // JAL/JALR
        jump      = 1'b1;
        reg_write = 1'b1;
        alu_src   = 1'b1;
      end
      7'b0110111,
      7'b0010111: begin // LUI/AUIPC
        reg_write = 1'b1;
        alu_src   = 1'b1;
      end
      default: begin
        illegal_instruction = 1'b1;
      end
    endcase
  end
endmodule