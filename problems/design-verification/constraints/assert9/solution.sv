// Counter Zero After Reset
module assert_counter_reset;
  property p_counter_after_reset;
    @(posedge clk)
    $fell(rst_n) |=> (counter == 0);
  endproperty
  
  a_counter_reset: assert property (p_counter_after_reset)
    else $error("FAIL: counter not zero after reset deasserted");
endmodule
