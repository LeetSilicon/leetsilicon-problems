// Signal Always High (during operation)
module assert_always_high;
  property p_always_high;
    @(posedge clk) disable iff (rst)
    en |-> sig_out;
  endproperty
  
  a_always_high: assert property (p_always_high)
    else $error("FAIL: sig_out not high while en asserted");
endmodule
