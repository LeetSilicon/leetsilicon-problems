module tb_seq1011_debug;
  logic clk, rst, in_bit;
  logic detect;

  seq1011_debug dut(.clk(clk), .rst(rst), .in_bit(in_bit), .detect(detect));

  always #5 clk = ~clk;

  task drive(input logic b);
    begin
      in_bit = b;
      @(posedge clk);
      #1;
      $display("t=%0t in=%0b detect=%0b", $time, in_bit, detect);
    end
  endtask

  initial begin
    clk = 0; rst = 1; in_bit = 0;
    repeat (2) @(posedge clk);
    rst = 0;

    // pattern: 1 0 1 1 => detect should pulse at final bit
    drive(1); drive(0); drive(1); drive(1);

    // overlap pattern
    drive(0); drive(1); drive(1);

    #20 $finish;
  end

  initial begin
    $dumpfile("dump.vcd");
    $dumpvars(0, tb_seq1011_debug);
  end
endmodule