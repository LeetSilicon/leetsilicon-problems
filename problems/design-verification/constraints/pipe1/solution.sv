// Instruction Repetition Constraints
class instr_rep extends uvm_object;
  rand bit [3:0] opcode[10]; // 10 instructions
  
  constraint c_range {
    foreach (opcode[i]) opcode[i] inside {[0:7]}; // 8 opcodes
  }
  
  // Same opcode cannot appear more than 3 times consecutively
  constraint c_no_3_consec {
    foreach (opcode[i]) {
      if (i >= 2) !(opcode[i] == opcode[i-1] && opcode[i] == opcode[i-2]);
    }
  }
endclass
