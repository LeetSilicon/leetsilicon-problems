// Last 4 Values Unique
class last4_unique extends uvm_object;
  rand bit [7:0] value;
  bit [7:0] history[$];
  
  constraint c_bounds {
    value inside {[0:31]};
  }
  
  constraint c_not_in_history {
    if (history.size() >= 1) value != history[history.size()-1];
    if (history.size() >= 2) value != history[history.size()-2];
    if (history.size() >= 3) value != history[history.size()-3];
    if (history.size() >= 4) value != history[history.size()-4];
  }
  
  function void post_randomize();
    history.push_back(value);
    if (history.size() > 4) history.pop_front();
  endfunction
endclass
