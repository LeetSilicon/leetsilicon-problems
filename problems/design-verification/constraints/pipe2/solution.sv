// No Overlapping Instructions (RAW hazard model)
class no_overlap extends uvm_object;
  rand bit [2:0] rd[8];  // destination register
  rand bit [2:0] rs1[8]; // source register 1
  rand bit [2:0] rs2[8]; // source register 2
  
  constraint c_range {
    foreach (rd[i])  rd[i]  inside {[0:7]};
    foreach (rs1[i]) rs1[i] inside {[0:7]};
    foreach (rs2[i]) rs2[i] inside {[0:7]};
  }
  
  // No RAW: instruction i+1 sources != instruction i destination
  constraint c_no_raw {
    foreach (rd[i]) {
      if (i < 7) {
        rs1[i+1] != rd[i];
        rs2[i+1] != rd[i];
      }
    }
  }
endclass
