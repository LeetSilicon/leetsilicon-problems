// ============================================================
// Hazard Detection Unit (Load-Use)
// ============================================================
// Classic load-use stall: if EX-stage instruction is a load (MemRead=1) and
// ID-stage instruction needs the same destination register, stall and insert bubble.
//
// Actions commonly include:
// - PCWrite=0 (freeze PC)
// - IFIDWrite=0 (freeze IF/ID register)
// - ID/EX flush: set control signals to 0 to inject NOP into EX.

module hazard_detect (
  input  logic [4:0] id_rs1,
  input  logic [4:0] id_rs2,
  input  logic [4:0] ex_rd,
  input  logic       ex_mem_read,
  input  logic       id_uses_rs2,  // 0 for I-type (rs2 field is immediate)
  output logic       stall
);

  always_comb begin
  // TODO: Default outputs to safe values (no latches).
  // TODO: Compute stall condition:
  // stall = ex_mem_read
  //          && (ex_rd != 0)
  //          && ( (ex_rd == id_rs1) ||
  //               (id_uses_rs2 && ex_rd == id_rs2) );
  //
  // TODO: Stall actions on stall:
  // pc_write = ~stall
  // ifid_write = ~stall
  // idex_flush_controls = stall (bubble insertion)
  //
  // TODO: Ensure stall duration is exactly one cycle (should happen naturally if signals are combinational
  // and pipeline advances next cycle).
  end

endmodule

