// Coverage subscriber starter
class coverage_subscriber extends uvm_subscriber #(my_transaction);
  \`uvm_component_utils(coverage_subscriber)

  // TODO: Add sampled transaction fields for the covergroup.
  // TODO: Define coverpoints and crosses required by the problem.

  function new(string name = "coverage_subscriber", uvm_component parent = null);
    super.new(name, parent);
    // TODO: Construct the covergroup.
  endfunction

  virtual function void write(my_transaction t);
    // TODO: Copy fields from t and sample the covergroup.
  endfunction

  virtual function void report_phase(uvm_phase phase);
    // TODO: Print or record coverage statistics.
  endfunction
endclass
