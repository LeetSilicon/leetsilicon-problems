// Split-Beat Monitor Reassembly
class split_beat_monitor extends uvm_monitor;
  \`uvm_component_utils(split_beat_monitor)
  
  uvm_analysis_port #(burst_txn) ap;
  virtual bus_if vif;
  
  task run_phase(uvm_phase phase);
    forever begin
      burst_txn txn;
      collect_burst(txn);
      ap.write(txn);
    end
  endtask
  
  task collect_burst(output burst_txn txn);
    txn = burst_txn::type_id::create("mon_txn");
    
    // Wait for address phase
    @(posedge vif.clk iff (vif.valid && vif.ready));
    txn.addr       = vif.addr;
    txn.beat_count = vif.len + 1;
    txn.data       = new[txn.beat_count];
    
    // Collect data beats
    for (int i = 0; i < txn.beat_count; i++) begin
      @(posedge vif.clk iff (vif.wvalid && vif.wready));
      txn.data[i] = vif.wdata;
      if (vif.wlast && i != txn.beat_count - 1)
        \`uvm_warning("MON", "Premature wlast")
    end
  endtask
endclass
