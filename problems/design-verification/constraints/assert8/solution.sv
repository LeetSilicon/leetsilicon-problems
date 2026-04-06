// High for 3 Consecutive Cycles
module assert_3_consec;
  property p_high_3;
    @(posedge clk) disable iff (rst)
    $rose(sig) |-> sig [*3];
  endproperty
  
  a_high_3: assert property (p_high_3)
    else $error("FAIL: sig not high for 3 consecutive cycles after rising");
endmodule
