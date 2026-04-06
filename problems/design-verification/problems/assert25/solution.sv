// Driver-Monitor Communication
class driver_monitor_check extends uvm_scoreboard;
  uvm_analysis_imp #(my_transaction, driver_monitor_check) drv_imp;
  uvm_analysis_imp #(my_transaction, driver_monitor_check) mon_imp;
  
  my_transaction drv_q[$];
  my_transaction mon_q[$];
  
  function void write_drv(my_transaction t);
    drv_q.push_back(t);
    check_match();
  endfunction
  
  function void write_mon(my_transaction t);
    mon_q.push_back(t);
    check_match();
  endfunction
  
  function void check_match();
    while (drv_q.size() > 0 && mon_q.size() > 0) begin
      my_transaction d = drv_q.pop_front();
      my_transaction m = mon_q.pop_front();
      assert(d.compare(m)) else
        \`uvm_error("SCB", $sformatf("Driver/Monitor mismatch: drv=%s mon=%s",
                   d.sprint(), m.sprint()))
    end
  endfunction
endclass
