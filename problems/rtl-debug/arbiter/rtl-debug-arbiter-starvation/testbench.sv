module tb_rr_arbiter_debug;
  logic clk, rst;
  logic [1:0] req, grant;

  rr_arbiter_debug dut(.clk(clk), .rst(rst), .req(req), .grant(grant));

  always #5 clk = ~clk;

  initial begin
    clk=0; rst=1; req=2'b00;
    repeat (2) @(posedge clk); rst=0;
    req=2'b11;
    repeat (8) begin
      @(posedge clk); #1;
      $display("t=%0t req=%b grant=%b rr_ptr=%0b", $time, req, grant, dut.rr_ptr);
    end
    #20 $finish;
  end

  initial begin
    $dumpfile("dump.vcd");
    $dumpvars(0, tb_rr_arbiter_debug);
  end
endmodule