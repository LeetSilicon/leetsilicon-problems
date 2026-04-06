module tb_req_ack_debug;
  logic clk, rst, req, ack;
  req_ack_debug dut(.clk(clk), .rst(rst), .req(req), .ack(ack));

  always #5 clk = ~clk;

  initial begin
    clk=0; rst=1; req=0;
    repeat (2) @(posedge clk);
    rst=0;

    @(negedge clk); req=1;
    repeat (4) @(posedge clk); // ack should not stay high all 4 cycles
    @(negedge clk); req=0;
    @(posedge clk);

    @(negedge clk); req=1;
    @(posedge clk);
    @(negedge clk); req=0;
    @(posedge clk);

    #20 $finish;
  end

  initial begin
    $dumpfile("dump.vcd");
    $dumpvars(0, tb_req_ack_debug);
  end
endmodule