// Event A Must Happen Before B After Start
module assert_a_before_b_fixed;
  // Correct property: B must not occur before A after start
  property p_a_before_b_fixed;
    @(posedge clk) disable iff (rst)
    $rose(start) |-> (!event_b until event_a);
  endproperty

  a_order: assert property (p_a_before_b_fixed)
    else $error("FAIL: event_b occurred before event_a after start");
endmodule
