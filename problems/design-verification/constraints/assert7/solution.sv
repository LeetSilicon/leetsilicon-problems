// Event Within 5 Cycles
module assert_within_5;
  property p_req_ack;
    @(posedge clk) disable iff (rst)
    req |-> ##[1:5] ack;
  endproperty
  
  a_req_ack: assert property (p_req_ack)
    else $error("FAIL: ack not received within 5 cycles of req");
endmodule
