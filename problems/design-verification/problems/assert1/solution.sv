// Signal High When Valid
module assert_valid_data;
  property p_data_when_valid;
    @(posedge clk) disable iff (rst)
    valid |-> data;
  endproperty
  
  a_data_when_valid: assert property (p_data_when_valid)
    else $error("FAIL: data not high when valid asserted");
endmodule
