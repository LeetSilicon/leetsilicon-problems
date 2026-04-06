// Grouped 1s in Binary (all 1s contiguous)
class grouped_ones extends uvm_object;
  rand bit [15:0] data;
  rand int unsigned start_bit, num_ones;
  
  constraint c_ones_range {
    num_ones inside {[1:16]};
    start_bit inside {[0:15]};
    start_bit + num_ones <= 16;
  }
  
  constraint c_grouped {
    foreach (data[i]) {
      if (i >= start_bit && i < start_bit + num_ones)
        data[i] == 1'b1;
      else
        data[i] == 1'b0;
    }
  }
endclass
