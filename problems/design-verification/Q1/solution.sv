class array_sum_constraint extends uvm_object;
  \`uvm_object_utils(array_sum_constraint)

  rand int unsigned arr[10];

  function new(string name = "array_sum_constraint");
    super.new(name);
  endfunction

  // Each element between 0 and 100
  constraint c_bounds {
    foreach(arr[i]) arr[i] inside {[0:100]};
  }

  // Sum must be exactly 100
  constraint c_sum {
    arr[0] + arr[1] + arr[2] + arr[3] + arr[4] +
    arr[5] + arr[6] + arr[7] + arr[8] + arr[9] == 100;
  }

  function void post_randomize();
    int total = 0;
    foreach(arr[i]) total += arr[i];
    assert(total == 100) else $fatal("Sum mismatch: %0d", total);
  endfunction
endclass
