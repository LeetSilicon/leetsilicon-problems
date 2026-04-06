// Protocol Assertion Monitor
class protocol_assertion_monitor extends uvm_monitor;
  \`uvm_component_utils(protocol_assertion_monitor)
  
  virtual bus_if vif;
  uvm_analysis_port #(my_txn) ap;
  
  int unsigned valid_hold_violations;
  int unsigned data_stable_violations;
  
  task run_phase(uvm_phase phase);
    fork
      check_valid_hold();
      check_data_stable();
      collect_transactions();
    join
  endtask
  
  // Valid must not drop until ready
  task check_valid_hold();
    forever begin
      @(posedge vif.clk);
      if (vif.valid && !vif.ready) begin
        @(posedge vif.clk);
        if (!vif.valid) begin
          valid_hold_violations++;
          \`uvm_error("PROTO", "Valid dropped before ready asserted")
        end
      end
    end
  endtask
  
  // Data must be stable while valid && !ready
  task check_data_stable();
    logic [31:0] saved_data;
    forever begin
      @(posedge vif.clk);
      if (vif.valid && !vif.ready) begin
        saved_data = vif.data;
        @(posedge vif.clk);
        if (vif.valid && vif.data !== saved_data) begin
          data_stable_violations++;
          \`uvm_error("PROTO", "Data changed while waiting for ready")
        end
      end
    end
  endtask
  
  task collect_transactions();
    forever begin
      my_txn t;
      @(posedge vif.clk iff (vif.valid && vif.ready));
      t = my_txn::type_id::create("mon_txn");
      t.addr = vif.addr;
      t.data = vif.data;
      ap.write(t);
    end
  endtask
  
  function void report_phase(uvm_phase phase);
    \`uvm_info("PROTO", $sformatf("Valid-hold violations: %0d", valid_hold_violations), UVM_LOW)
    \`uvm_info("PROTO", $sformatf("Data-stable violations: %0d", data_stable_violations), UVM_LOW)
  endfunction
endclass
