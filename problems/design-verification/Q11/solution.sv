// 5% Probability for Lower Bits Same
class lower_bits_prob extends uvm_object;
  rand bit [15:0] data;
  rand bit lower_same;
  
  constraint c_lower_same_dist {
    lower_same dist {1 := 5, 0 := 95};
  }
  
  constraint c_apply {
    if (lower_same) data[3:0] == data[7:4];
  }
endclass
