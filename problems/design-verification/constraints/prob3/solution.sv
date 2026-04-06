// Uniform Distribution by Bit Count
class uniform_bitcount extends uvm_object;
  rand bit [7:0] data;
  rand int unsigned target_ones;
  
  constraint c_target_dist {
    target_ones inside {[0:8]};
    // uniform across possible popcount values
  }
  
  constraint c_popcount {
    $countones(data) == target_ones;
  }
endclass
