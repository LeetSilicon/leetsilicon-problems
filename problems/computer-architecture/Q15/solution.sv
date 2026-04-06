module hazard_detect (
  input  logic [4:0] id_rs1,
  input  logic [4:0] id_rs2,
  input  logic [4:0] ex_rd,
  input  logic       ex_mem_read,
  input  logic       id_uses_rs2,  // 0 for I-type (rs2 field is immediate)
  output logic       stall
);
  assign stall = ex_mem_read
              && (ex_rd != 0)
              && ((ex_rd == id_rs1) || (id_uses_rs2 && ex_rd == id_rs2));
endmodule