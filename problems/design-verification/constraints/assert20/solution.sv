// Signal Pattern Match
module assert_pattern;
  sequence s_pattern;
    sig == 1 ##1 sig == 0 ##1 sig == 1 ##1 sig == 1;
  endsequence
  
  property p_pattern_detect;
    @(posedge clk) disable iff (rst)
    s_pattern |-> ##1 detected;
  endproperty
  
  a_pattern: assert property (p_pattern_detect)
    else $error("FAIL: detected not asserted after pattern 1011");
  
  c_pattern: cover property (s_pattern);
endmodule
