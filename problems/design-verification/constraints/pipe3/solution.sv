// Achieve Without Constraints (post_randomize approach)
class achieve_post extends uvm_object;
  rand bit [7:0] data;
  bit [7:0] transformed;
  
  function void post_randomize();
    // Gray code encoding
    transformed = data ^ (data >> 1);
  endfunction
endclass
