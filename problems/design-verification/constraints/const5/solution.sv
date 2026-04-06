// Even-Odd Index Constraint
class even_odd_idx extends uvm_object;
  \`uvm_object_utils(even_odd_idx)

  rand int arr[10];

  function new(string name = "even_odd_idx");
    super.new(name);
  endfunction
  
  constraint c_parity {
    foreach (arr[i]) arr[i][0] == i[0];
  }
  
  constraint c_bounds {
    foreach (arr[i]) {
      arr[i] >= -100;
      arr[i] <= 100;
    }
  }
endclass
