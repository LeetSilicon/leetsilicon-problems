// 5 Non-Adjacent Set Bits
class non_adj_bits extends uvm_object;
  rand bit [15:0] data;
  
  constraint c_five_bits {
    $countones(data) == 5;
  }
  
  constraint c_non_adjacent {
    foreach (data[i]) {
      if (i > 0) !(data[i] && data[i-1]);
    }
  }
endclass
