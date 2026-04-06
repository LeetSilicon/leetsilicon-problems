// Equal 1s and 0s
class equal_ones_zeros extends uvm_object;
  rand bit [15:0] data;
  
  constraint c_equal {
    $countones(data) == 8; // 16 bits, half 1s half 0s
  }
endclass
