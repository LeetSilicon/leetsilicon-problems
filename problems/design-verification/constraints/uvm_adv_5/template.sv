// Split-beat monitor starter
class split_beat_monitor extends uvm_monitor;
  \`uvm_component_utils(split_beat_monitor)

  virtual split_bus_if vif;
  uvm_analysis_port #(my_transaction) ap;

  function new(string name = "split_beat_monitor", uvm_component parent = null);
    super.new(name, parent);
    ap = new("ap", this);
  endfunction

  task run_phase(uvm_phase phase);
    // TODO: Capture each accepted beat.
    // TODO: Correlate beats by transaction identifier.
    // TODO: Reassemble and publish the full 64-bit transaction.
    // TODO: Handle missing-beat timeout behavior if required.
  endtask
endclass
