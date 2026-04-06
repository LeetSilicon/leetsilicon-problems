module tb_onehot_fsm_debug;
  logic clk, rst, start, done;
  logic [1:0] state;

  onehot_fsm_debug dut(.clk(clk), .rst(rst), .start(start), .done(done), .state(state));

  always #5 clk = ~clk;

  initial begin
    clk=0; rst=1; start=0; done=0;
    repeat (2) @(posedge clk);
    rst=0;

    @(negedge clk); start=1;
    @(posedge clk);
    @(negedge clk); start=0;
    repeat (2) @(posedge clk);

    @(negedge clk); done=1;
    @(posedge clk);
    @(negedge clk); done=0;
    repeat (2) @(posedge clk);

    #20 $finish;
  end

  initial begin
    $dumpfile("dump.vcd");
    $dumpvars(0, tb_onehot_fsm_debug);
  end
endmodule