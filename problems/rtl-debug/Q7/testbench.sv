module tb_apb_slave_debug;
  logic PCLK, PRESETn, PSEL, PENABLE, PWRITE, PREADY;
  logic [7:0] PWDATA, PRDATA;

  apb_slave_debug dut(
    .PCLK(PCLK), .PRESETn(PRESETn), .PSEL(PSEL), .PENABLE(PENABLE),
    .PWRITE(PWRITE), .PWDATA(PWDATA), .PREADY(PREADY), .PRDATA(PRDATA)
  );

  always #5 PCLK = ~PCLK;

  initial begin
    PCLK=0; PRESETn=0; PSEL=0; PENABLE=0; PWRITE=0; PWDATA=8'h00;
    repeat (2) @(posedge PCLK); PRESETn=1;
    @(negedge PCLK); PSEL=1; PENABLE=0; PWRITE=0;
    @(posedge PCLK); #1; $display("setup phase PREADY=%0b (should be 0)", PREADY);
    @(negedge PCLK); PENABLE=1;
    @(posedge PCLK); #1; $display("access phase PREADY=%0b", PREADY);
    @(negedge PCLK); PSEL=0; PENABLE=0;
    #20 $finish;
  end

  initial begin
    $dumpfile("dump.vcd");
    $dumpvars(0, tb_apb_slave_debug);
  end
endmodule