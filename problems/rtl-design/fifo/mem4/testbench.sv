module tb;
  logic clk, rst_n, access, write_en, hit, miss, wb_req;
  logic [3:0] addr_tag, wb_tag;
  logic [1:0] addr_set, wb_set;
  logic [7:0] write_data, read_data, wb_data;
  int p=0, f=0;
  initial clk=0; always #5 clk=~clk;
  wb_cache #(.NUM_SETS(4), .NUM_WAYS(4), .TAG_BITS(4), .DATA_WIDTH(8)) dut(.*);
  task automatic cw(input logic [1:0] s, input logic [3:0] t, input logic [7:0] d);
    @(negedge clk); addr_set=s; addr_tag=t; write_data=d; write_en=1; access=1;
    @(posedge clk); @(negedge clk); access=0; write_en=0;
  endtask
  initial begin
    rst_n=0; access=0; write_en=0; addr_tag=0; addr_set=0; write_data=0;
    @(posedge clk); @(posedge clk); rst_n=1;
    @(posedge clk); @(negedge clk);
    // Fill all 4 ways in set 0 with dirty data
    cw(0, 4'h1, 8'hAA); cw(0, 4'h2, 8'hBB); cw(0, 4'h3, 8'hCC); cw(0, 4'h4, 8'hDD);
    // TC1: Read hit
    @(negedge clk); addr_set=0; addr_tag=4'h1; write_en=0; access=1; #1;
    if (hit) begin p++; $display("PASS: TC1 hit"); end
    else begin f++; $display("FAIL: TC1"); end
    @(posedge clk); @(negedge clk); access=0;
    // TC2: 5th tag → miss with dirty eviction
    @(negedge clk); addr_set=0; addr_tag=4'h5; write_en=0; access=1; #1;
    if (miss && wb_req) begin p++; $display("PASS: TC2 dirty eviction"); end
    else begin f++; $display("FAIL: TC2 miss=%b wb_req=%b", miss, wb_req); end
    @(posedge clk); @(negedge clk); access=0;
    // TC3: Read same tag again → hit (just filled)
    @(negedge clk); addr_set=0; addr_tag=4'h5; write_en=0; access=1; #1;
    if (hit) begin p++; $display("PASS: TC3 hit after fill"); end
    else begin f++; $display("FAIL: TC3"); end
    @(posedge clk); @(negedge clk); access=0;
    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule
