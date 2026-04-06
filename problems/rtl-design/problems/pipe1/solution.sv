module pipelined_alu #(
  parameter WIDTH    = 32,
  parameter REG_ADDR = 5
)(
  input  logic                    clk,
  input  logic                    rst_n,
  input  logic                    flush,
  input  logic                    input_valid,
  input  logic [3:0]              opcode,
  input  logic [REG_ADDR-1:0]     src_a_reg,
  input  logic [REG_ADDR-1:0]     src_b_reg,
  input  logic [WIDTH-1:0]        src_a_value,
  input  logic [WIDTH-1:0]        src_b_value,
  input  logic [REG_ADDR-1:0]     dest_reg,
  output logic                    wb_valid,
  output logic [WIDTH-1:0]        wb_result,
  output logic [REG_ADDR-1:0]     wb_dest
);
  logic                    ex_valid;
  logic [WIDTH-1:0]        ex_result;
  logic [REG_ADDR-1:0]     ex_dest;

  logic [WIDTH-1:0]        op_a_eff, op_b_eff;

  function automatic logic [WIDTH-1:0] alu_op(
    input logic [3:0]       op,
    input logic [WIDTH-1:0] a,
    input logic [WIDTH-1:0] b
  );
    case (op)
      4'd0: alu_op = a + b;
      4'd1: alu_op = a - b;
      4'd2: alu_op = a & b;
      4'd3: alu_op = a | b;
      4'd4: alu_op = a ^ b;
      default: alu_op = '0;
    endcase
  endfunction

  // Simple RAW forwarding for 2-stage pipeline:
  // current EX can bypass from prior cycle result sitting in EX/WB register,
  // and also from WB output if still visible.
  always_comb begin
    op_a_eff = src_a_value;
    op_b_eff = src_b_value;

    if (ex_valid && (src_a_reg == ex_dest) && (src_a_reg != '0)) op_a_eff = ex_result;
    else if (wb_valid && (src_a_reg == wb_dest) && (src_a_reg != '0)) op_a_eff = wb_result;

    if (ex_valid && (src_b_reg == ex_dest) && (src_b_reg != '0)) op_b_eff = ex_result;
    else if (wb_valid && (src_b_reg == wb_dest) && (src_b_reg != '0)) op_b_eff = wb_result;
  end

  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n || flush) begin
      ex_valid  <= 0;
      ex_result <= '0;
      ex_dest   <= '0;
    end else begin
      ex_valid  <= input_valid;
      ex_result <= alu_op(opcode, op_a_eff, op_b_eff);
      ex_dest   <= dest_reg;
    end
  end

  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n || flush) begin
      wb_valid  <= 0;
      wb_result <= '0;
      wb_dest   <= '0;
    end else begin
      wb_valid  <= ex_valid;
      wb_result <= ex_result;
      wb_dest   <= ex_dest;
    end
  end
endmodule