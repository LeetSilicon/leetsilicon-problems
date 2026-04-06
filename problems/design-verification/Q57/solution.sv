// Bus Protocol Address Alignment
module assert_addr_align;
  property p_aligned;
    @(posedge clk) disable iff (rst)
    valid |-> (addr % ALIGN == 0);
  endproperty
  
  property p_aligned_4byte;
    @(posedge clk) disable iff (rst)
    (valid && size == 2'b10) |-> (addr[1:0] == 2'b00);  // 4-byte aligned
  endproperty
  
  property p_aligned_2byte;
    @(posedge clk) disable iff (rst)
    (valid && size == 2'b01) |-> (addr[0] == 1'b0);      // 2-byte aligned
  endproperty
  
  a_align4: assert property (p_aligned_4byte);
  a_align2: assert property (p_aligned_2byte);
endmodule
