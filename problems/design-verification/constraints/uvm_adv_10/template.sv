// Procedural protocol monitor starter
class proto_assert_monitor extends uvm_monitor;
  \`uvm_component_utils(proto_assert_monitor)

  virtual proto_if vif;

  function new(string name = "proto_assert_monitor", uvm_component parent = null);
    super.new(name, parent);
  endfunction

  task run_phase(uvm_phase phase);
    forever begin
      @(posedge vif.clk);
      if (!vif.rst_n) begin
        // TODO: Reset any local state used for protocol checking.
        continue;
      end

      // TODO: Check for valid drop mid-packet.
      // TODO: Check for illegal ready toggling.
      // TODO: Check for data stability violations.
      // TODO: Report failures with \`uvm_error.
    end
  endtask
endclass
