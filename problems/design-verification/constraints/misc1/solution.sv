// Fixed Index Value
class fixed_index extends uvm_object;
  rand int unsigned arr[8];
  
  constraint c_bounds {
    foreach (arr[i]) arr[i] inside {[0:100]};
  }
  
  // arr[3] must always be 42
  constraint c_fixed {
    arr[3] == 42;
  }
endclass
