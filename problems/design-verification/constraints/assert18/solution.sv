// Array Index Valid Range
module assert_index_range;
  property p_valid_index;
    @(posedge clk) disable iff (rst)
    rd_en |-> (addr < DEPTH);
  endproperty
  
  a_valid_index: assert property (p_valid_index)
    else $error("FAIL: addr=%0d exceeds DEPTH=%0d", addr, DEPTH);
endmodule
