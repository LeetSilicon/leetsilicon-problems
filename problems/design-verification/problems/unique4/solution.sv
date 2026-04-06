// Two Arrays with Sorted Relationship
class sorted_relationship extends uvm_object;
  \`uvm_object_utils(sorted_relationship)

  rand int unsigned array1[];
  rand int unsigned array2[];
  rand int unsigned pick_idx[];

  function new(string name = "sorted_relationship");
    super.new(name);
  endfunction

  constraint c_size {
    array1.size() inside {[6:9]};
    array2.size() == array1.size();
    pick_idx.size() == array2.size();
  }
  
  constraint c_sorted_array1 {
    foreach (array1[i]) if (i > 0) array1[i] >= array1[i-1];
  }
  
  constraint c_membership {
    foreach (pick_idx[i]) {
      pick_idx[i] inside {[0:array1.size()-1]};
      array2[i] == array1[pick_idx[i]];
    }
  }
  
  constraint c_bounds {
    foreach (array1[i]) array1[i] inside {[0:100]};
    foreach (array2[i]) array2[i] inside {[0:100]};
  }
endclass
