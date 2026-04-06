// Map to N Non-Empty Queues
class map_to_queues extends uvm_object;
  \`uvm_object_utils(map_to_queues)

  parameter int N = 4;
  localparam int M = 12;

  int unsigned values[M];
  int unsigned out_q[N][$];
  rand int unsigned assign_q[M];
  int unsigned queue_count[N];

  function new(string name = "map_to_queues");
    super.new(name);
  endfunction
  
  constraint c_bounds {
    foreach (values[i]) values[i] inside {[1:50]};
    foreach (assign_q[i]) assign_q[i] inside {[0:N-1]};
  }
  
  constraint c_all_queues_nonempty {
    foreach (queue_count[k]) {
      queue_count[k] == assign_q.sum() with (int'(item == k));
      queue_count[k] >= 1;
    }
  }

  function void post_randomize();
    foreach (out_q[k]) out_q[k].delete();
    foreach (assign_q[i]) out_q[assign_q[i]].push_back(values[i]);
  endfunction

  function bit is_feasible();
    return N <= M;
  }
endclass
