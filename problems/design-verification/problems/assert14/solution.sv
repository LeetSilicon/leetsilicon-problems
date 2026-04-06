// Data Consistent After Enable
module assert_data_after_en;
  property p_data_consistent;
    @(posedge clk) disable iff (rst)
    $rose(enable) |=> $stable(data) [*3];
  endproperty
  
  a_data_consistent: assert property (p_data_consistent)
    else $error("FAIL: data not stable for 3 cycles after enable rose");
endmodule
