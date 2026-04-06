module tb;
  logic        ACLK;
  logic        ARESETn;
  logic        AWVALID; logic AWREADY; logic [31:0] AWADDR;
  logic        WVALID;  logic WREADY;  logic [31:0] WDATA; logic [3:0] WSTRB;
  logic        BVALID;  logic BREADY;  logic [1:0]  BRESP;
  logic        ARVALID; logic ARREADY; logic [31:0] ARADDR;
  logic        RVALID;  logic RREADY;  logic [31:0] RDATA; logic [1:0] RRESP;
  logic [31:0] gpio_in;
  logic [31:0] gpio_out;
  int          p = 0, f = 0;

  initial ACLK = 0;

  always #5 ACLK = ~ACLK;
  axi_gpio dut (.*);

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
    ARVALID = 0; RREADY  = 0; gpio_in = 0;
    @(posedge ACLK); @(posedge ACLK);
    ARESETn = 1; @(posedge ACLK);

    // TC1 — Write gpio_out
    axi_write(32'h00, 32'hA5A5_A5A5);
    @(negedge ACLK);
    if (gpio_out == 32'hA5A5_A5A5) begin p++; $display("PASS: TC1 gpio_out correct"); end
    else begin f++; $display("FAIL: TC1 gpio_out=%h", gpio_out); end

    // TC2 — Read gpio_in
    gpio_in = 32'h0000_000F;
    axi_read(32'h04, rd);
    if (rd == 32'h0000_000F) begin p++; $display("PASS: TC2 gpio_in read"); end
    else begin f++; $display("FAIL: TC2 got %h", rd); end

    // TC3 — Output readback
    axi_read(32'h00, rd);
    if (rd == 32'hA5A5_A5A5) begin p++; $display("PASS: TC3 output readback"); end
    else begin f++; $display("FAIL: TC3"); end

    // TC4 — Invalid write (to gpio_in address 0x04)
    axi_write(32'h04, 32'hDEAD_BEEF);
    @(negedge ACLK);
    if (BRESP == 2'b10) begin p++; $display("PASS: TC4 SLVERR on invalid write"); end
    else begin f++; $display("FAIL: TC4 BRESP=%b", BRESP); end

    // TC5 — Reset
    ARESETn = 0; @(posedge ACLK); @(posedge ACLK); ARESETn = 1; @(posedge ACLK); @(negedge ACLK);
    if (gpio_out == 0) begin p++; $display("PASS: TC5 reset clears gpio_out"); end
    else begin f++; $display("FAIL: TC5"); end

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule