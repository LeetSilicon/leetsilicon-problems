module tb;
  logic clk, rst_n, coin_valid, dispense, change_valid;
  logic [4:0] coin_value, change_amount;
  int p=0, f=0;
  initial clk=0; always #5 clk=~clk;
  vending_machine #(.ITEM_PRICE(25)) dut(.*);

  task automatic insert_coin(input logic [4:0] val);
    @(negedge clk); coin_valid=1; coin_value=val;
    @(posedge clk); @(negedge clk); coin_valid=0; coin_value=0;
  endtask

  initial begin
    rst_n=0; coin_valid=0; coin_value=0;
    @(posedge clk); @(posedge clk); rst_n=1;
    @(posedge clk); @(negedge clk);

    // TC1: Exact payment 25c → IDLE sees credit+25>=25 → DISPENSE_STATE → dispense=1
    insert_coin(25);
    // After task: state=DISPENSE_STATE (credit was updated + state transition on same edge)
    // Next posedge: DISPENSE_STATE executes, dispense<=1
    @(posedge clk); @(negedge clk);
    if (dispense) begin p++; $display("PASS: TC1 exact payment"); end
    else begin f++; $display("FAIL: TC1 dispense=%b state=%0d", dispense, dut.state); end

    // Wait for FSM to return to IDLE
    @(posedge clk); @(posedge clk); @(negedge clk);

    // TC2: Overpayment 10+25=35c → dispense + 10c change
    rst_n=0; @(posedge clk); @(posedge clk); rst_n=1; @(posedge clk); @(negedge clk);
    insert_coin(10);  // credit=10, not enough
    insert_coin(25);  // credit=10+25=35 >= 25 → DISPENSE_STATE
    @(posedge clk); @(negedge clk);
    if (dispense) begin p++; $display("PASS: TC2 dispense"); end
    else begin f++; $display("FAIL: TC2 dispense=%b credit=%0d state=%0d", dispense, dut.credit, dut.state); end
    // CHANGE_STATE next cycle
    @(posedge clk); @(negedge clk);
    if (change_valid && change_amount==10) begin p++; $display("PASS: TC2 change=10"); end
    else begin f++; $display("FAIL: TC2 change=%0d valid=%b", change_amount, change_valid); end

    @(posedge clk); @(posedge clk); @(negedge clk);

    // TC3: Underpayment 10c only → no dispense
    rst_n=0; @(posedge clk); @(posedge clk); rst_n=1; @(posedge clk); @(negedge clk);
    insert_coin(10);
    @(posedge clk); @(negedge clk);
    if (!dispense) begin p++; $display("PASS: TC3 no dispense"); end
    else begin f++; $display("FAIL: TC3"); end

    // TC6: Accumulated: 5+5+5+10 = 25 → dispense
    rst_n=0; @(posedge clk); @(posedge clk); rst_n=1; @(posedge clk); @(negedge clk);
    insert_coin(5); insert_coin(5); insert_coin(5); insert_coin(10);
    @(posedge clk); @(negedge clk);
    if (dispense) begin p++; $display("PASS: TC6 accumulated"); end
    else begin f++; $display("FAIL: TC6 dispense=%b credit=%0d", dispense, dut.credit); end

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule
