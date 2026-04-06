// Split-Beat Driver
class split_beat_driver extends uvm_driver #(burst_txn);
  \`uvm_component_utils(split_beat_driver)
  
  virtual bus_if vif;
  
  task run_phase(uvm_phase phase);
    forever begin
      burst_txn txn;
      seq_item_port.get_next_item(txn);
      drive_burst(txn);
      seq_item_port.item_done();
    end
  endtask
  
  task drive_burst(burst_txn txn);
    // Drive address phase
    @(posedge vif.clk);
    vif.addr   <= txn.addr;
    vif.len    <= txn.beat_count - 1;
    vif.valid  <= 1'b1;
    
    // Wait for address accept
    @(posedge vif.clk iff vif.ready);
    vif.valid <= 1'b0;
    
    // Drive data beats
    for (int i = 0; i < txn.beat_count; i++) begin
      @(posedge vif.clk);
      vif.wdata  <= txn.data[i];
      vif.wvalid <= 1'b1;
      vif.wlast  <= (i == txn.beat_count - 1);
      @(posedge vif.clk iff vif.wready);
    end
    vif.wvalid <= 1'b0;
    vif.wlast  <= 1'b0;
  endtask
endclass
