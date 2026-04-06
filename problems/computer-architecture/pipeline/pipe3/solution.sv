module forwarding_unit (
  input  logic [4:0] id_ex_rs1,
  input  logic [4:0] id_ex_rs2,
  input  logic [4:0] ex_mem_rd,
  input  logic [4:0] mem_wb_rd,
  input  logic       ex_mem_reg_write,
  input  logic       mem_wb_reg_write,
  output logic [1:0] fwd_a,
  output logic [1:0] fwd_b
);
  // Encoding: 00=no forward, 01=MEM/WB, 10=EX/MEM
  always_comb begin
    fwd_a = 2'b00;
    fwd_b = 2'b00;
    // EX-stage forwarding (higher priority) => 10
    if (ex_mem_reg_write && ex_mem_rd != 0 && ex_mem_rd == id_ex_rs1)
      fwd_a = 2'b10;
    else if (mem_wb_reg_write && mem_wb_rd != 0 && mem_wb_rd == id_ex_rs1)
      fwd_a = 2'b01;
    if (ex_mem_reg_write && ex_mem_rd != 0 && ex_mem_rd == id_ex_rs2)
      fwd_b = 2'b10;
    else if (mem_wb_reg_write && mem_wb_rd != 0 && mem_wb_rd == id_ex_rs2)
      fwd_b = 2'b01;
  end
endmodule