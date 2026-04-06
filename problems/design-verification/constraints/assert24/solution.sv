// UVM RAL Register Access
class ral_reg_test extends uvm_reg_sequence;
  my_reg_block reg_model;
  
  task body();
    uvm_status_e status;
    uvm_reg_data_t rdata;
    
    // Write and readback
    reg_model.ctrl_reg.write(status, 32'hDEAD_BEEF, UVM_FRONTDOOR);
    assert(status == UVM_IS_OK) else \`uvm_error("RAL", "Write failed")
    
    reg_model.ctrl_reg.read(status, rdata, UVM_FRONTDOOR);
    assert(status == UVM_IS_OK) else \`uvm_error("RAL", "Read failed")
    assert(rdata == 32'hDEAD_BEEF) else
      \`uvm_error("RAL", $sformatf("Readback mismatch: exp=0xDEADBEEF got=0x%0h", rdata))
    
    // Mirror check
    reg_model.ctrl_reg.mirror(status, UVM_CHECK);
    assert(status == UVM_IS_OK) else \`uvm_error("RAL", "Mirror check failed")
  endtask
endclass
