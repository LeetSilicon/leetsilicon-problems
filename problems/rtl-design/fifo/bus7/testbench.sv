module tb;
  logic        ACLK;
  logic        ARESETn;
  logic        AWVALID, AWREADY; logic [31:0] AWADDR;
  logic        WVALID,  WREADY;  logic [31:0] WDATA; logic [3:0] WSTRB;
  logic        BVALID,  BREADY;  logic [1:0]  BRESP;
  logic        ARVALID, ARREADY; logic [31:0] ARADDR;
  logic        RVALID,  RREADY;  logic [31:0] RDATA; logic [1:0] RRESP;
  logic        enable_reg;
  logic [31:0] mode_reg;
  int          p = 0, f = 0;

  initial ACLK = 0;

  always #5 ACLK = ~ACLK;
  axi_write_only_ctrl dut (.*);

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

  initial begin
    ARESETn = 0; AWVALID = 0; WVALID = 0; BREADY = 0; ARVALID = 0; RREADY = 0;
    @(posedge ACLK); @(posedge ACLK); ARESETn = 1; @(posedge ACLK);

    // TC1 — Write enable
    axi_write(32'h00, 32'h1); @(negedge ACLK);
    if (enable_reg) begin p++; $display("PASS: TC1 enable=1"); end
    else begin f++; $display("FAIL: TC1"); end

    // TC2 — Write mode
    axi_write(32'h04, 32'h3); @(negedge ACLK);
    if (mode_reg == 32'h3) begin p++; $display("PASS: TC2 mode=3"); end
    else begin f++; $display("FAIL: TC2"); end

    // TC3 — Read attempt returns SLVERR
    ARVALID = 1; ARADDR = 32'h00;
    @(posedge ACLK);
    while (!(ARREADY && ARVALID)) @(posedge ACLK);
    ARVALID = 0;
    RREADY  = 1;
    while (!RVALID) @(posedge ACLK);
    @(negedge ACLK);
    if (RRESP == 2'b10) begin p++; $display("PASS: TC3 read returns SLVERR"); end
    else begin f++; $display("FAIL: TC3 RRESP=%b", RRESP); end
    @(posedge ACLK); RREADY = 0;

    // TC4 — Invalid write address
    axi_write(32'h08, 32'hFF);
    if (BRESP == 2'b10) begin p++; $display("PASS: TC4 invalid addr SLVERR"); end
    else begin f++; $display("FAIL: TC4"); end

    // TC5 — Reset
    ARESETn = 0; @(posedge ACLK); @(posedge ACLK); ARESETn = 1; @(posedge ACLK); @(negedge ACLK);
    if (enable_reg == 0 && mode_reg == 0) begin p++; $display("PASS: TC5 reset"); end
    else begin f++; $display("FAIL: TC5"); end

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule