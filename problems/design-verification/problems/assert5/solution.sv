// Output Equals Sum
module assert_sum;
  property p_sum;
    @(posedge clk) disable iff (rst)
    valid |-> (out == (a + b));
  endproperty
  
  a_sum: assert property (p_sum)
    else $error("FAIL: out != a + b when valid");
endmodule
