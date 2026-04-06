module tb_fifo_debug;
  logic clk, rst, wr_en, rd_en;
  logic [7:0] din, dout;
  logic full, empty;

  fifo_debug #(.DEPTH(4), .WIDTH(8)) dut(
    .clk(clk), .rst(rst), .wr_en(wr_en), .rd_en(rd_en),
    .din(din), .dout(dout), .full(full), .empty(empty)
  );

  always #5 clk = ~clk;

  task do_write(input [7:0] v);
    begin
      @(negedge clk);
      wr_en = 1; rd_en = 0; din = v;
      @(negedge clk);
      wr_en = 0;
      $display("WRITE %0d full=%0b empty=%0b", v, full, empty);
    end
  endtask

  initial begin
    clk=0; rst=1; wr_en=0; rd_en=0; din='0;
    repeat (2) @(posedge clk);
    rst=0;

    do_write(8'h11);
    do_write(8'h22);
    do_write(8'h33);
    do_write(8'h44); // should still be accepted before full=1

    #20 $finish;
  end

  initial begin
    $dumpfile("dump.vcd");
    $dumpvars(0, tb_fifo_debug);
  end
endmodule