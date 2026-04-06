// Functional Coverage Subscriber
class func_cov_subscriber extends uvm_subscriber #(my_txn);
  \`uvm_component_utils(func_cov_subscriber)
  
  covergroup cg_txn with function sample(my_txn t);
    cp_opcode: coverpoint t.opcode {
      bins read  = {OP_READ};
      bins write = {OP_WRITE};
      bins rmw   = {OP_RMW};
      illegal_bins bad = default;
    }
    
    cp_size: coverpoint t.size {
      bins byte_sz = {1};
      bins half    = {2};
      bins word    = {4};
    }
    
    cp_addr: coverpoint t.addr[7:0] {
      bins low   = {[0:63]};
      bins mid   = {[64:191]};
      bins high  = {[192:255]};
    }
    
    cx_op_size: cross cp_opcode, cp_size;
    cx_op_addr: cross cp_opcode, cp_addr;
  endgroup
  
  function new(string name, uvm_component parent);
    super.new(name, parent);
    cg_txn = new();
  endfunction
  
  function void write(my_txn t);
    cg_txn.sample(t);
  endfunction
  
  function void report_phase(uvm_phase phase);
    \`uvm_info("COV", $sformatf("Coverage = %.1f%%", cg_txn.get_coverage()), UVM_LOW)
  endfunction
endclass
