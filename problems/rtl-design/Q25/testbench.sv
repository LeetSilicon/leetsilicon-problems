module tb;
  logic        ACLK;
  logic        ARESETn;
  logic        AWVALID, AWREADY; logic [31:0] AWADDR;
  logic        WVALID,  WREADY;  logic [31:0] WDATA; logic [3:0] WSTRB;
  logic        BVALID,  BREADY;  logic [1:0]  BRESP;
  logic        ARVALID, ARREADY; logic [31:0] ARADDR;
  logic        RVALID,  RREADY;  logic [31:0] RDATA; logic [1:0] RRESP;
  int          p = 0, f = 0;

  initial ACLK = 0;

  always #5 ACLK = ~ACLK;
  axi_reg_file dut (.*);

  task automatic axi_write(input logic [31:0] addr, input logic [31:0] data);
    AWVALID = 1; AWADDR = addr;
    WVALID  = 1; WDATA  = data; WSTRB = 4'hF;
    @(posedge ACLK);
    while (!(AWREADY && AWVALID)) @(posedge ACLK);
    AWVALID = 0;
    while (!(WREADY && WVALID)) @(posedge ACLK);
    WVALID = 0;
    BREADY = 1;
    while (!BVALID) @(posedge ACLK);
    @(posedge ACLK); BREADY = 0;
  endtask

  task automatic axi_read(input logic [31:0] addr, output logic [31:0] data);
    ARVALID = 1; ARADDR = addr;
    @(posedge ACLK);
    while (!(ARREADY && ARVALID)) @(posedge ACLK);
    ARVALID = 0;
    RREADY  = 1;
    while (!RVALID) @(posedge ACLK);
    data   = RDATA;
    @(posedge ACLK); RREADY = 0;
  endtask

  logic [31:0] rd;

  initial begin
    ARESETn = 0; AWVALID = 0; WVALID = 0; BREADY = 0; ARVALID = 0; RREADY = 0;
    @(posedge ACLK); @(posedge ACLK);
    ARESETn = 1; @(posedge ACLK);

    axi_write(32'h00, 32'h11);
    axi_read(32'h00, rd);
    if (rd == 32'h11) begin p++; $display("PASS: TC1 reg0=0x11"); end
    else begin f++; $display("FAIL: TC1 got %h", rd); end

    axi_write(32'h0C, 32'hDEAD_BEEF);
    axi_read(32'h0C, rd);
    if (rd == 32'hDEAD_BEEF) begin p++; $display("PASS: TC2 reg3=0xDEADBEEF"); end
    else begin f++; $display("FAIL: TC2"); end

    axi_write(32'h04, 32'h22);
    axi_read(32'h04, rd);
    if (rd == 32'h22) begin p++; $display("PASS: TC3 reg1 read"); end
    else begin f++; $display("FAIL: TC3"); end

    // TC4 — Invalid read address
    axi_read(32'h10, rd);
    if (RRESP == 2'b10) begin p++; $display("PASS: TC4 RRESP=SLVERR on invalid"); end
    else begin f++; $display("FAIL: TC4 RRESP=%b", RRESP); end

    // TC5 — Reset clears all registers
    ARESETn = 0; @(posedge ACLK); @(posedge ACLK); ARESETn = 1; @(posedge ACLK);
    axi_read(32'h00, rd);
    if (rd == 0) begin p++; $display("PASS: TC5 reset clears regs"); end
    else begin f++; $display("FAIL: TC5 got %h", rd); end

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule