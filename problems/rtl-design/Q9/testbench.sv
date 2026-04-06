module tb;
  logic clk, rst_n, access, write_en, hit, miss, mem_write_en, mem_read_req;
  logic [7:0] address, write_data, mem_read_data, mem_address, mem_write_data, read_data;
  int p=0, f=0;
  initial clk=0; always #5 clk=~clk;
  direct_mapped_cache #(.ADDR_WIDTH(8), .DATA_WIDTH(8), .NUM_LINES(4)) dut(.*);
  initial begin
    rst_n=0; access=0; write_en=0; address=0; write_data=0; mem_read_data=0;
    @(posedge clk); @(posedge clk); rst_n=1;
    @(posedge clk); @(negedge clk);

    // TC1: Cold miss at 0x01, then hit
    @(negedge clk); access=1; write_en=0; address=8'h01; mem_read_data=8'hAB;
    #1; // combinational settle - check miss BEFORE posedge fills
    if (miss) begin p++; $display("PASS: TC1 cold miss"); end
    else begin f++; $display("FAIL: TC1 expected miss h=%b m=%b", hit, miss); end
    @(posedge clk); @(negedge clk); // posedge fills the line
    // Now access same addr again - should hit
    #1;
    if (hit) begin p++; $display("PASS: TC1 hit after fill"); end
    else begin f++; $display("FAIL: TC1 expected hit h=%b m=%b", hit, miss); end
    access=0;

    // TC2: Conflict miss - different tag, same index
    @(negedge clk); access=1; address=8'h41; mem_read_data=8'hCD; // same index as 0x01
    #1;
    if (miss) begin p++; $display("PASS: TC2 conflict miss"); end
    else begin f++; $display("FAIL: TC2 expected miss"); end
    @(posedge clk); @(negedge clk); access=0;

    // TC3: Write-through hit
    @(negedge clk); access=1; address=8'h41; write_en=1; write_data=8'hFF;
    #1;
    if (hit) begin p++; $display("PASS: TC3 write-through hit"); end
    else begin f++; $display("FAIL: TC3"); end
    @(posedge clk); @(negedge clk); access=0; write_en=0;

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule
