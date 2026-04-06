// Protocol Event Sequence Coverage
module assert_protocol_seq;
  // REQ -> GNT -> DATA -> ACK sequence
  sequence s_protocol;
    req ##[1:3] gnt ##1 data_valid ##[1:2] ack;
  endsequence
  
  property p_protocol;
    @(posedge clk) disable iff (rst)
    req |-> s_protocol;
  endproperty
  
  a_protocol: assert property (p_protocol);
  c_protocol: cover property (p_protocol);
  
  covergroup cg_protocol @(posedge clk);
    cp_req_to_gnt: coverpoint (req && !gnt) {
      bins wait_1 = {1} iff ($past(req, 1) && !$past(gnt, 1));
    }
  endgroup
endmodule
