module tb_edge_detector_debug;
  logic clk, rst, sig_in;
  logic pulse;

  edge_detector_debug dut(.clk(clk), .rst(rst), .sig_in(sig_in), .pulse(pulse));

  always #5 clk = ~clk;

  initial begin
    clk=0; rst=1; sig_in=0;
    repeat (2) @(posedge clk);
    rst=0;

    @(negedge clk); sig_in=1;
    repeat (3) @(posedge clk); // pulse should be 1 for only first cycle
    @(negedge clk); sig_in=0;
    @(posedge clk);

    @(negedge clk); sig_in=1;
    @(posedge clk);
    @(negedge clk); sig_in=0;
    @(posedge clk);

    #20 $finish;
  end

  initial begin
    $dumpfile("dump.vcd");
    $dumpvars(0, tb_edge_detector_debug);
  end
endmodule