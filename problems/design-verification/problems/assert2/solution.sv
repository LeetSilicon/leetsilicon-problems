// Data Stable for One Cycle
module assert_data_stable;
  property p_data_stable;
    @(posedge clk) disable iff (rst)
    valid |=> $stable(data);
  endproperty
  
  a_data_stable: assert property (p_data_stable)
    else $error("FAIL: data changed one cycle after valid");
endmodule
