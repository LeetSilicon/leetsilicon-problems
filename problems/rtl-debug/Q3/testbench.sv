module tb_handshake_debug;
  logic clk, rst, load_new, src_ready, src_valid;
  logic [7:0] load_data, src_data;

  handshake_debug dut(
    .clk(clk), .rst(rst), .load_new(load_new), .load_data(load_data),
    .src_ready(src_ready), .src_valid(src_valid), .src_data(src_data)
  );

  always #5 clk = ~clk;

  initial begin
    clk=0; rst=1; load_new=0; load_data=0; src_ready=0;
    repeat (2) @(posedge clk);
    rst=0;

    @(negedge clk); load_new=1; load_data=8'hA1;
    @(negedge clk); load_new=0;

    // Backpressure: data should remain A1
    repeat (2) begin
      @(negedge clk); load_new=1; load_data = load_data + 8'h11;
      @(negedge clk); load_new=0;
    end

    @(negedge clk); src_ready=1;
    @(negedge clk); src_ready=0;

    #20 $finish;
  end

  initial begin
    $dumpfile("dump.vcd");
    $dumpvars(0, tb_handshake_debug);
  end
endmodule