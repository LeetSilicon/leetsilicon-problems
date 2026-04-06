module tb_mod10_counter_debug;
  logic clk, rst, en;
  logic [3:0] count;
  logic tc_pulse;

  mod10_counter_debug dut(.clk(clk), .rst(rst), .en(en), .count(count), .tc_pulse(tc_pulse));

  always #5 clk = ~clk;

  initial begin
    clk=0; rst=1; en=0;
    repeat (2) @(posedge clk);
    rst=0; en=1;
    repeat (15) begin
      @(posedge clk); #1;
      $display("t=%0t count=%0d tc=%0b", $time, count, tc_pulse);
    end
    #10 $finish;
  end

  initial begin
    $dumpfile("dump.vcd");
    $dumpvars(0, tb_mod10_counter_debug);
  end
endmodule