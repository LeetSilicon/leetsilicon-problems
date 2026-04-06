// Event Precedence by 10 Cycles
module assert_precedence;
  property p_a_before_b;
    @(posedge clk) disable iff (rst)
    $rose(event_a) |-> ##[1:10] event_b;
  endproperty
  
  a_precedence: assert property (p_a_before_b)
    else $error("FAIL: event_b not within 10 cycles after event_a");
endmodule
