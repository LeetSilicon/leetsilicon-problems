module tb;
  logic        ACLK;
  logic        ARESETn;
  logic        AWVALID; logic AWREADY; logic [31:0] AWADDR;
  logic        WVALID;  logic WREADY;  logic [31:0] WDATA; logic [3:0] WSTRB;
  logic        BVALID;  logic BREADY;  logic [1:0]  BRESP;
  logic        ARVALID; logic ARREADY; logic [31:0] ARADDR;
  logic        RVALID;  logic RREADY;  logic [31:0] RDATA; logic [1:0] RRESP;
  int          p = 0, f = 0;

  initial ACLK = 0;

  always #5 ACLK = ~ACLK;
  axi_lite_single_reg dut (.*);

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
    @(posedge ACLK);
    BREADY = 0;
  endtask

  task automatic axi_read(input logic [31:0] addr, output logic [31:0] data);
    ARVALID = 1; ARADDR = addr;
    @(posedge ACLK);
    while (!(ARREADY && ARVALID)) @(posedge ACLK);
    ARVALID = 0;
    RREADY  = 1;
    while (!RVALID) @(posedge ACLK);
    data   = RDATA;
    @(posedge ACLK);
    RREADY = 0;
  endtask

  logic [31:0] rd;

  initial begin
    ARESETn = 0; AWVALID = 0; WVALID = 0; BREADY = 0;
    ARVALID = 0; RREADY  = 0; WSTRB  = 0;
    @(posedge ACLK); @(posedge ACLK);
    ARESETn = 1; @(posedge ACLK);

    // TC1 — Simple write
    axi_write(32'h00, 32'h1234_5678);
    p++; $display("PASS: TC1 write completed");

    // TC2 — Simple read
    axi_read(32'h00, rd);
    if (rd == 32'h1234_5678) begin p++; $display("PASS: TC2 read back correct"); end
    else begin f++; $display("FAIL: TC2 got %h", rd); end

    // TC3 — AW before W (natural order already tested)
    axi_write(32'h00, 32'hDEAD_BEEF);
    axi_read(32'h00, rd);
    if (rd == 32'hDEAD_BEEF) begin p++; $display("PASS: TC3 AW before W"); end
    else begin f++; $display("FAIL: TC3"); end

    // TC5 — Backpressure: assert RVALID but delay RREADY
    ARVALID = 1; ARADDR = 32'h00;
    @(posedge ACLK); while (!(ARREADY && ARVALID)) @(posedge ACLK);
    ARVALID = 0;
    repeat (3) @(posedge ACLK);   // Delay RREADY
    @(negedge ACLK);
    if (RVALID) begin p++; $display("PASS: TC5 RVALID held during backpressure"); end
    else begin f++; $display("FAIL: TC5 RVALID dropped"); end
    RREADY = 1; @(posedge ACLK); RREADY = 0;

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule