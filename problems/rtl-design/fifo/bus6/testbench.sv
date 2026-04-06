module tb;
  logic ACLK, ARESETn;
  logic [31:0] status_in;
  logic AWVALID, AWREADY; logic [31:0] AWADDR;
  logic WVALID, WREADY; logic [31:0] WDATA; logic [3:0] WSTRB;
  logic BVALID, BREADY; logic [1:0] BRESP;
  logic ARVALID, ARREADY; logic [31:0] ARADDR;
  logic RVALID, RREADY; logic [31:0] RDATA; logic [1:0] RRESP;
  int p=0, f=0;
  initial ACLK=0; always #5 ACLK=~ACLK;
  axi_read_only_status #(.VERSION(32'h0000_0001)) dut(.*);
  initial begin #50_000; $display("FATAL: timeout"); $fatal; end

  task automatic axi_read(input logic [31:0] addr, output logic [31:0] data);
    @(negedge ACLK); ARVALID=1; ARADDR=addr;
    @(posedge ACLK); @(negedge ACLK); ARVALID=0; RREADY=1;
    // Wait for RVALID
    while (!RVALID) @(posedge ACLK);
    @(negedge ACLK); data=RDATA;
    @(posedge ACLK); @(negedge ACLK); RREADY=0;
  endtask

  task automatic axi_write(input logic [31:0] addr, input logic [31:0] data);
    @(negedge ACLK); AWVALID=1; AWADDR=addr; WVALID=1; WDATA=data; WSTRB=4'hF;
    @(posedge ACLK); @(negedge ACLK); AWVALID=0; WVALID=0; BREADY=1;
    while (!BVALID) @(posedge ACLK);
    @(negedge ACLK);
    @(posedge ACLK); @(negedge ACLK); BREADY=0;
  endtask

  logic [31:0] rd;
  initial begin
    ARESETn=0; AWVALID=0; WVALID=0; BREADY=0; ARVALID=0; RREADY=0; status_in=0;
    @(posedge ACLK); @(posedge ACLK); ARESETn=1;
    @(posedge ACLK); @(negedge ACLK);

    // TC1: Read version register
    axi_read(32'h00, rd);
    if (rd==32'h0000_0001) begin p++; $display("PASS: TC1 version"); end
    else begin f++; $display("FAIL: TC1 got %h", rd); end

    // TC2: Read status
    status_in=32'hCAFE_1234;
    axi_read(32'h04, rd);
    if (rd==32'hCAFE_1234) begin p++; $display("PASS: TC2 status"); end
    else begin f++; $display("FAIL: TC2 got %h", rd); end

    // TC3: Write returns error
    axi_write(32'h00, 32'hDEAD);
    if (BRESP==2'b10) begin p++; $display("PASS: TC3 SLVERR"); end
    else begin f++; $display("FAIL: TC3 BRESP=%b", BRESP); end

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule
