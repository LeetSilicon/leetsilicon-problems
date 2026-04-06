// Conditional Probability Constraint
class cond_prob extends uvm_object;
  rand bit [7:0] data;
  rand bit mode;
  
  constraint c_mode_dist {
    mode dist {0 := 70, 1 := 30};
  }
  
  constraint c_data_by_mode {
    if (mode == 0) data inside {[0:127]};
    else           data inside {[128:255]};
  }
endclass
