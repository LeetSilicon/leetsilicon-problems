// Dynamic Array with Repetition Rules
class dyn_array_rep extends uvm_object;
  \`uvm_object_utils(dyn_array_rep)

  rand int unsigned arr[];
  int unsigned cnt[5];

  function new(string name = "dyn_array_rep");
    super.new(name);
  endfunction
  
  constraint c_size {
    arr.size() == 300;
  }
  
  constraint c_domain {
    foreach (arr[i]) arr[i] inside {[0:4]};
  }

  constraint c_frequency {
    cnt[0] == arr.sum() with (int'(item == 0));
    cnt[1] == arr.sum() with (int'(item == 1));
    cnt[2] == arr.sum() with (int'(item == 2));
    cnt[3] == arr.sum() with (int'(item == 3));
    cnt[4] == arr.sum() with (int'(item == 4));
    foreach (cnt[v]) cnt[v] >= 40;
  }

  constraint c_no_adjacent_repeat_for_1_to_4 {
    foreach (arr[i]) if ((i > 0) && (arr[i] inside {[1:4]})) arr[i] != arr[i-1];
  }
endclass
