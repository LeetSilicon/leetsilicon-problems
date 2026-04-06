// No Consecutive Zeros
class no_consec_zeros extends uvm_object;
  \`uvm_object_utils(no_consec_zeros)

  rand int unsigned arr[];
  int unsigned cnt[6];

  function new(string name = "no_consec_zeros");
    super.new(name);
  endfunction

  constraint c_size {
    arr.size() == 300;
  }

  constraint c_domain {
    foreach (arr[i]) arr[i] inside {[0:5]};
  }

  constraint c_frequency {
    cnt[0] == arr.sum() with (int'(item == 0));
    cnt[1] == arr.sum() with (int'(item == 1));
    cnt[2] == arr.sum() with (int'(item == 2));
    cnt[3] == arr.sum() with (int'(item == 3));
    cnt[4] == arr.sum() with (int'(item == 4));
    cnt[5] == arr.sum() with (int'(item == 5));
    foreach (cnt[v]) cnt[v] >= 40;
  }
  
  constraint c_no_consecutive_zeros {
    foreach (arr[i]) if (i > 0) !(arr[i] == 0 && arr[i-1] == 0);
  }
endclass
