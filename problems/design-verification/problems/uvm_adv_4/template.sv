// Split-beat driver starter
class split_beat_driver extends uvm_driver #(my_transaction);
  \`uvm_component_utils(split_beat_driver)

  virtual split_bus_if vif;

  function new(string name = "split_beat_driver", uvm_component parent = null);
    super.new(name, parent);
  endfunction

  task run_phase(uvm_phase phase);
    my_transaction req;
    forever begin
      seq_item_port.get_next_item(req);
      // TODO: Drive the lower 32-bit beat.
      // TODO: Handle any inter-beat gap or backpressure.
      // TODO: Drive the upper 32-bit beat.
      seq_item_port.item_done();
    end
  endtask
endclass
