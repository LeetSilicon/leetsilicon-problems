module tb_shiftreg_debug;
  logic clk, rst, load, shift_en, ser_in;
  logic [7:0] par_in, q;

  shiftreg_debug dut(.clk(clk), .rst(rst), .load(load), .shift_en(shift_en), .ser_in(ser_in), .par_in(par_in), .q(q));

  always #5 clk = ~clk;

  initial begin
    clk=0; rst=1; load=0; shift_en=0; ser_in=0; par_in=8'h00;
    repeat (2) @(posedge clk); rst=0;

    @(negedge clk); par_in=8'hA5; load=1; shift_en=1; ser_in=1'b1; // load should win
    @(negedge clk); load=0; shift_en=0;
    @(posedge clk); #1; $display("q=%h (expected A5)", q);

    @(negedge clk); shift_en=1; ser_in=1'b1;
    @(negedge clk); shift_en=0;
    @(posedge clk); #1; $display("q after shift=%h", q);

    #20 $finish;
  end

  initial begin
    $dumpfile("dump.vcd");
    $dumpvars(0, tb_shiftreg_debug);
  end
endmodule