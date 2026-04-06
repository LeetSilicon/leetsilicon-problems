module tb;
  logic [7:0] predicate, active_mask;
  logic       clk, rst_n, enter_if, enter_else, exit_if;
  int         p = 0, f = 0;

  initial clk = 0;

  always #5 clk = ~clk;
  thread_mask #(.THREADS(8), .STACK_D(4)) dut (.*);

  initial begin
    rst_n = 0;
    enter_if = 0;
    enter_else = 0;
    exit_if = 0;
    predicate = 0;
    @(posedge clk);
    @(posedge clk);
    rst_n = 1;
    #1;
    if (active_mask == 8'hFF) begin p++; $display("PASS: reset all active"); end
    else begin f++; $display("FAIL: reset mask"); end

    // if predicate 10101010
    @(negedge clk); predicate = 8'hAA; enter_if = 1;
    @(posedge clk); @(negedge clk); enter_if = 0;
    if (active_mask == 8'hAA) begin p++; $display("PASS: enter_if"); end
    else begin f++; $display("FAIL: enter_if mask=%h", active_mask); end

    // nested if with 11001100 => 10001000
    @(negedge clk); predicate = 8'hCC; enter_if = 1;
    @(posedge clk); @(negedge clk); enter_if = 0;
    if (active_mask == 8'h88) begin p++; $display("PASS: nested if"); end
    else begin f++; $display("FAIL: nested mask=%h", active_mask); end

    // exit nested if => back to 0xAA
    @(negedge clk); exit_if = 1;
    @(posedge clk); @(negedge clk); exit_if = 0;
    @(posedge clk); @(negedge clk);
    if (active_mask == 8'hAA) begin p++; $display("PASS: pop restore"); end
    else begin f++; $display("FAIL: pop restore mask=%h", active_mask); end

    // enter_else: should give active_mask & ~predicate (using saved mask 0xFF from outer)
    // Currently at outer level with active_mask=0xAA from first enter_if
    // enter_else with predicate 0xAA should give stack[sp-1] & ~pred = 0xFF & ~0xAA = 0x55
    @(negedge clk); predicate = 8'hAA; enter_else = 1;
    @(posedge clk); @(negedge clk); enter_else = 0;
    @(posedge clk); @(negedge clk);
    if (active_mask == 8'h55) begin p++; $display("PASS: enter_else"); end
    else begin f++; $display("FAIL: enter_else mask=%h", active_mask); end

    // exit outer if => back to all active 0xFF
    @(negedge clk); exit_if = 1;
    @(posedge clk); @(negedge clk); exit_if = 0;
    @(posedge clk); @(negedge clk);
    if (active_mask == 8'hFF) begin p++; $display("PASS: exit to all active"); end
    else begin f++; $display("FAIL: exit to all mask=%h", active_mask); end

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule