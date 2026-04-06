// Queue with Size-Based Range
class queue_size_range extends uvm_object;
  rand int unsigned q[$];
  
  constraint c_size {
    q.size() inside {[3:10]};
  }
  
  constraint c_val_range {
    foreach (q[i]) q[i] inside {[0 : q.size() * 10]};
  }
  
  constraint c_sorted {
    foreach (q[i]) {
      if (i > 0) q[i] >= q[i-1];
    }
  }
endclass
