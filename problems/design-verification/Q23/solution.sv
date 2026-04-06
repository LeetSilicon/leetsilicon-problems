// Power of 4
class power_of_four extends uvm_object;
  rand bit [31:0] data;
  
  constraint c_power_of_4 {
    $countones(data) == 1;               // power of 2
    $countones(data & 32'h55555555) == 1; // bit in even position = power of 4
    data != 0;
  }
endclass
