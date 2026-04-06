// No Signal Overlap
module assert_no_overlap;
  property p_no_overlap;
    @(posedge clk) disable iff (rst)
    !(sig_a && sig_b);
  endproperty
  
  a_no_overlap: assert property (p_no_overlap)
    else $error("FAIL: sig_a and sig_b asserted simultaneously");
endmodule
