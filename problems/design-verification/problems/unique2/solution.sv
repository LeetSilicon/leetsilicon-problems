// Partition one input queue into three output queues
class three_queues extends uvm_object;
  \`uvm_object_utils(three_queues)

  int unsigned q_in[$];
  int unsigned q_out[3][$];
  rand int unsigned owner[];

  function new(string name = "three_queues");
    super.new(name);
  endfunction

  function void set_input(const ref int unsigned values[$]);
    q_in = values;
    owner = new[q_in.size()];
  endfunction
  
  constraint c_owner_size {
    owner.size() == q_in.size();
    foreach (owner[i]) owner[i] inside {[0:2]};
  }

  function void post_randomize();
    foreach (q_out[k]) q_out[k].delete();
    foreach (owner[i]) q_out[owner[i]].push_back(q_in[i]);
  endfunction

  function bit check_partition();
    int unsigned merged[$];
    foreach (q_out[k]) foreach (q_out[k][i]) merged.push_back(q_out[k][i]);
    return merged.size() == q_in.size();
  }
endclass
