// Rising Then Falling Edge
module assert_rise_fall;
  property p_rise_then_fall;
    @(posedge clk) disable iff (rst)
    $rose(sig) |-> ##[1:10] $fell(sig);
  endproperty
  
  a_rise_fall: assert property (p_rise_then_fall)
    else $error("FAIL: no falling edge within 10 cycles of rising edge");
endmodule
