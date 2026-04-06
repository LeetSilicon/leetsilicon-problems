class three_same extends uvm_object;
  \`uvm_object_utils(three_same)

  rand bit [7:0] arr[10];
  rand bit [7:0] dup_val;
  rand int unsigned dup_idx[3];

  function new(string name = "three_same");
    super.new(name);
  endfunction

  constraint c_dup_idx {
    unique {dup_idx};
    foreach(dup_idx[i]) dup_idx[i] inside {[0:9]};
  }

  constraint c_triplicate {
    foreach(arr[i]) {
      if ((i == dup_idx[0]) || (i == dup_idx[1]) || (i == dup_idx[2]))
        arr[i] == dup_val;
      else
        arr[i] != dup_val;
    }
  }

  constraint c_bounds {
    dup_val inside {[0:255]};
    foreach(arr[i]) arr[i] inside {[0:255]};
  }
endclass
