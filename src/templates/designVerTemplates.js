/**
 * designVerTemplates — starter templates for the "design-verification" domain.
 * Templates intentionally provide only boilerplate and TODO markers.
 * Reference solutions remain in designVerificationSolution.js.
 */

const assertionTemplate = `// Assertion starter template
module assertion_template (
  input logic        clk,
  input logic        rst_n,
  input logic        valid,
  input logic        ready,
  input logic [31:0] data
);

  // TODO: Add any extra interface signals required by the question.

  property p_check;
    @(posedge clk) disable iff (!rst_n)
      // TODO: Write the assertion condition for this problem.
      1'b1;
  endproperty

  assert property (p_check)
    else $error("Assertion failed at time %0t", $time);

endmodule
`;

const constraintTemplate = `// Constrained-random starter template
class dv_seq_item extends uvm_sequence_item;
  \`uvm_object_utils(dv_seq_item)

  // TODO: Declare the rand variables needed for this problem.

  function new(string name = "dv_seq_item");
    super.new(name);
  endfunction

  constraint c_main {
    // TODO: Add the required constraints here.
  }

  function void post_randomize();
    // TODO: Add any derived calculations or output queue construction here.
  endfunction
endclass
`;

const uvmAdvTemplates = {
  uvm_adv_1: `// Out-of-order scoreboard starter
class ooo_scoreboard extends uvm_scoreboard;
  \`uvm_component_utils(ooo_scoreboard)

  // TODO: Declare storage for expected and actual transactions.

  function new(string name = "ooo_scoreboard", uvm_component parent = null);
    super.new(name, parent);
  endfunction

  // TODO: Add analysis implementation methods for expected and actual streams.

  function void compare_if_ready(int unsigned transaction_id);
    // TODO: Compare expected and actual transactions when both are available.
  endfunction
endclass
`,

  uvm_adv_2: `// Router scoreboard starter
class ooo_router_sb extends uvm_scoreboard;
  \`uvm_component_utils(ooo_router_sb)

  // TODO: Track input transactions and predicted outputs.

  function new(string name = "ooo_router_sb", uvm_component parent = null);
    super.new(name, parent);
  endfunction

  // TODO: Add write methods for input and output streams.
  // TODO: Add compare/predict helper methods as needed.
endclass
`,

  uvm_adv_3: `// Framing monitor starter
class framing_monitor extends uvm_monitor;
  \`uvm_component_utils(framing_monitor)

  virtual framing_if vif;
  uvm_analysis_port #(frame_transaction) ap;

  function new(string name = "framing_monitor", uvm_component parent = null);
    super.new(name, parent);
    ap = new("ap", this);
  endfunction

  task run_phase(uvm_phase phase);
    // TODO: Detect the start delimiter.
    // TODO: Capture payload nibbles.
    // TODO: Detect the stop delimiter and publish a transaction.
  endtask
endclass
`,

  uvm_adv_4: `// Split-beat driver starter
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
`,

  uvm_adv_5: `// Split-beat monitor starter
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
`,

  uvm_adv_6: `// Coverage subscriber starter
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
`,

  uvm_adv_7: `// Coverage environment starter
class coverage_env extends uvm_env;
  \`uvm_component_utils(coverage_env)

  // TODO: Declare the monitor and coverage subscriber handles.

  function new(string name = "coverage_env", uvm_component parent = null);
    super.new(name, parent);
  endfunction

  virtual function void build_phase(uvm_phase phase);
    super.build_phase(phase);
    // TODO: Create the monitor and subscriber components.
  endfunction

  virtual function void connect_phase(uvm_phase phase);
    super.connect_phase(phase);
    // TODO: Connect monitor analysis port to subscriber analysis export.
  endfunction
endclass
`,

  uvm_adv_8: `// Analysis FIFO scoreboard starter
class fifo_scoreboard extends uvm_scoreboard;
  \`uvm_component_utils(fifo_scoreboard)

  uvm_tlm_analysis_fifo #(my_transaction) fifo;

  function new(string name = "fifo_scoreboard", uvm_component parent = null);
    super.new(name, parent);
  endfunction

  virtual function void build_phase(uvm_phase phase);
    super.build_phase(phase);
    fifo = new("fifo", this);
  endfunction

  task run_phase(uvm_phase phase);
    my_transaction tr;
    forever begin
      fifo.get(tr);
      // TODO: Check the transaction pulled from the analysis FIFO.
    end
  endtask
endclass
`,

  uvm_adv_9: `// Driver response-path starter
class response_driver extends uvm_driver #(my_transaction);
  \`uvm_component_utils(response_driver)

  virtual dut_if vif;

  function new(string name = "response_driver", uvm_component parent = null);
    super.new(name, parent);
  endfunction

  task run_phase(uvm_phase phase);
    my_transaction req;
    my_transaction rsp;
    forever begin
      seq_item_port.get_next_item(req);
      // TODO: Drive the request to the DUT.
      // TODO: Create and populate the response item.
      seq_item_port.item_done(rsp);
    end
  endtask
endclass

class response_sequence extends uvm_sequence #(my_transaction);
  \`uvm_object_utils(response_sequence)

  function new(string name = "response_sequence");
    super.new(name);
  endfunction

  task body();
    my_transaction req;
    my_transaction rsp;
    // TODO: Start a request item.
    // TODO: Wait for and consume the response item.
  endtask
endclass
`,

  uvm_adv_10: `// Procedural protocol monitor starter
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
`,
};

export const designVerTemplates = (qId, language) => {
  if (language !== 'systemverilog') {
    return null;
  }

  if (qId.startsWith('assert')) {
    return assertionTemplate;
  }

  if (qId.startsWith('uvm_adv_')) {
    return uvmAdvTemplates[qId] || uvmAdvTemplates.uvm_adv_1;
  }

  return constraintTemplate;
};
