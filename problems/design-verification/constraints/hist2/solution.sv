// No Repeat in Next 3 Draws
class no_repeat_3 extends uvm_object;
  rand bit [7:0] draw;
  bit [7:0] prev_draws[$];
  
  constraint c_bounds {
    draw inside {[0:15]};
  }
  
  constraint c_no_repeat {
    foreach (prev_draws[i]) {
      if (i >= prev_draws.size() - 3) draw != prev_draws[i];
    }
  }
  
  function void post_randomize();
    prev_draws.push_back(draw);
  endfunction
endclass
