// Exactly 5 Consecutive Bits Set
class five_consecutive extends uvm_object;
  rand bit [15:0] data;
  rand int unsigned start_pos;
  
  constraint c_start {
    start_pos inside {[0:11]}; // 16 - 5 = 11
  }
  
  constraint c_consecutive {
    // set exactly bits [start_pos +: 5]
    foreach (data[i]) {
      if (i >= start_pos && i < start_pos + 5)
        data[i] == 1'b1;
      else
        data[i] == 1'b0;
    }
  }
endclass
