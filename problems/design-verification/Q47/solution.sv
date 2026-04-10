// Event Precedence by 10 Cycles
module assert_precedence;
  property p_event1_before_event2_strict;
  @(posedge clk) disable iff (rst || cycle_count < 10)
  $rose(event2) |-> (
    (|($past($rose(event1), [10:$]))) &&
    !($past($rose(event1), [0:9]))
  );
endproperty

assert property (p_event1_before_event2_strict);
endmodule
