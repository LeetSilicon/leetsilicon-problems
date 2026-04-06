module tb_ram_sp_debug;
  logic clk, we;
  logic [1:0] addr;
  logic [7:0] wdata, rdata;

  ram_sp_debug dut(.clk(clk), .we(we), .addr(addr), .wdata(wdata), .rdata(rdata));

  always #5 clk = ~clk;

  initial begin
    clk=0; we=0; addr=0; wdata=8'h00;
    @(posedge clk);

    @(negedge clk); we=1; addr=2'd1; wdata=8'hAA;
    @(posedge clk);
    @(negedge clk); we=0; addr=2'd1;
    @(posedge clk); #1; $display("read @1 = %h (expect AA)", rdata);

    @(negedge clk); we=1; addr=2'd2; wdata=8'h55;
    @(posedge clk);
    @(negedge clk); we=0; addr=2'd2;
    @(posedge clk); #1; $display("read @2 = %h (expect 55)", rdata);

    #20 $finish;
  end

  initial begin
    $dumpfile("dump.vcd");
    $dumpvars(0, tb_ram_sp_debug);
  end
endmodule