// Detect Rising Edge
module assert_rising_edge;
  // Rising edge of sig should trigger ack within 1 to 3 cycles
  property p_rising_edge_fixed;
    @(posedge clk) disable iff (rst)
    $rose(sig) |-> ##[1:3] ack;
  endproperty
  
  a_rising: assert property (p_rising_edge_fixed)
    else $error("FAIL: ack not within 1-3 cycles after sig rising edge");
endmodule
