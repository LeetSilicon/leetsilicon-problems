module tb;
  logic        PCLK;
  logic        PRESETn;
  logic        PSEL, PENABLE, PWRITE;
  logic [7:0]  PADDR;
  logic [31:0] PWDATA, PRDATA;
  logic        PREADY, PSLVERR;
  int          p = 0, f = 0;

  initial PCLK = 0;

  always #5 PCLK = ~PCLK;
  apb_slave dut (.*);

  task automatic apb_write(input logic [7:0] addr, input logic [31:0] data);
    // Setup phase
    PSEL    = 1; PENABLE = 0; PWRITE = 1;
    PADDR   = addr; PWDATA = data;
    @(posedge PCLK);
    // Enable phase
    PENABLE = 1;
    @(posedge PCLK);
    PSEL    = 0; PENABLE = 0;
    @(posedge PCLK);
  endtask

  task automatic apb_read(input logic [7:0] addr, output logic [31:0] data);
    // Setup phase
    PSEL    = 1; PENABLE = 0; PWRITE = 0;
    PADDR   = addr;
    @(posedge PCLK);
    // Enable phase
    PENABLE = 1;
    @(posedge PCLK);
    data    = PRDATA;
    PSEL    = 0; PENABLE = 0;
    @(posedge PCLK);
  endtask

  logic [31:0] rd;

  initial begin
    PRESETn = 0; PSEL = 0; PENABLE = 0; PWRITE = 0;
    PADDR = 0; PWDATA = 0;
    @(posedge PCLK); @(posedge PCLK);
    PRESETn = 1; @(posedge PCLK);

    // TC1 — APB write zero wait state
    apb_write(8'h00, 32'hAAAA_5555);
    apb_read(8'h00, rd);
    if (rd == 32'hAAAA_5555) begin p++; $display("PASS: TC1 write/read REG0"); end
    else begin f++; $display("FAIL: TC1 got %h", rd); end

    // TC2 — APB read
    apb_read(8'h04, rd);
    if (rd == 32'hDEAD_C0DE) begin p++; $display("PASS: TC2 read REG1"); end
    else begin f++; $display("FAIL: TC2"); end

    // TC4 — Error on invalid address
    PSEL    = 1; PENABLE = 0; PWRITE = 1; PADDR = 8'hFF; PWDATA = 0;
    @(posedge PCLK);
    PENABLE = 1; @(posedge PCLK); @(negedge PCLK);
    if (PSLVERR) begin p++; $display("PASS: TC4 PSLVERR on invalid address"); end
    else begin f++; $display("FAIL: TC4 no PSLVERR"); end
    PSEL = 0; PENABLE = 0;

    // TC5 — Back-to-back: write then read
    apb_write(8'h00, 32'hBEEF_CAFE);
    apb_read(8'h00, rd);
    if (rd == 32'hBEEF_CAFE) begin p++; $display("PASS: TC5 back-to-back"); end
    else begin f++; $display("FAIL: TC5"); end

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule