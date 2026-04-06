// Signal Toggles Every 4 Cycles
module assert_toggle_4_fixed;
  property p_toggle_fixed;
    @(posedge clk) disable iff (rst)
    $rose(sig) |-> sig[*4] ##1 !sig[*4];
  endproperty
  
  a_toggle: assert property (p_toggle_fixed)
    else $error("FAIL: sig not toggling every 4 cycles");
endmodule
