// Signal Within Range
module assert_range;
  property p_in_range;
    @(posedge clk) disable iff (rst)
    valid |-> (data >= MIN_VAL && data <= MAX_VAL);
  endproperty
  
  a_range: assert property (p_in_range)
    else $error("FAIL: data=%0d not in range [%0d:%0d]", data, MIN_VAL, MAX_VAL);
endmodule
