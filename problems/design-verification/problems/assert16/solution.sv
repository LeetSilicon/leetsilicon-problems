// FSM State Transition Coverage
module assert_fsm_coverage;
  // Assertion: only valid transitions
  property p_valid_transition;
    @(posedge clk) disable iff (rst)
    (state == IDLE)  |=> (state inside {IDLE, ACTIVE});
  endproperty
  
  property p_active_transition;
    @(posedge clk) disable iff (rst)
    (state == ACTIVE) |=> (state inside {ACTIVE, DONE, ERROR});
  endproperty
  
  property p_done_transition;
    @(posedge clk) disable iff (rst)
    (state == DONE)   |=> (state inside {DONE, IDLE});
  endproperty
  
  a_idle:   assert property (p_valid_transition);
  a_active: assert property (p_active_transition);
  a_done:   assert property (p_done_transition);
  
  // Coverage
  covergroup cg_fsm @(posedge clk);
    cp_state: coverpoint state {
      bins idle   = {IDLE};
      bins active = {ACTIVE};
      bins done   = {DONE};
      bins error  = {ERROR};
    }
    cp_transitions: coverpoint state {
      bins idle_to_active   = (IDLE   => ACTIVE);
      bins active_to_done   = (ACTIVE => DONE);
      bins active_to_error  = (ACTIVE => ERROR);
      bins done_to_idle     = (DONE   => IDLE);
    }
  endgroup
endmodule
