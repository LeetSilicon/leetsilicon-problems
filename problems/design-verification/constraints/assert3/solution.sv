// Count Zero on Reset
module assert_count_reset;
  property p_count_zero_on_reset;
    @(posedge clk)
    rst |-> (count == '0);
  endproperty
  
  a_count_reset: assert property (p_count_zero_on_reset)
    else $error("FAIL: count not zero during reset");
endmodule
