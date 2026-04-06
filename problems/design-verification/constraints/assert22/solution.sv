// Transaction Data Validity
module assert_txn_valid;
  property p_txn_data;
    @(posedge clk) disable iff (rst)
    txn_valid |-> !$isunknown(txn_data) && !$isunknown(txn_addr);
  endproperty
  
  property p_txn_response;
    @(posedge clk) disable iff (rst)
    txn_valid |-> ##[1:10] txn_done;
  endproperty
  
  a_data_valid: assert property (p_txn_data);
  a_response:   assert property (p_txn_response);
endmodule
