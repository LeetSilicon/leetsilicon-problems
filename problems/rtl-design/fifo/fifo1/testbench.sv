module tb;
  localparam DEPTH               = 8;
  localparam WIDTH               = 8;
  localparam ALMOST_FULL_THRESH  = 6;
  localparam ALMOST_EMPTY_THRESH = 2;

  logic              clk;
  logic              rst_n;
  logic              write_en;
  logic [WIDTH-1:0]  write_data;
  logic              read_en;
  logic [WIDTH-1:0]  read_data;
  logic              full, empty, almost_full, almost_empty;
  int                p = 0, f = 0;

  // Clock generation
  initial clk = 0;
  always #5 clk = ~clk;
  // DUT instantiation
  sync_fifo #(
    .DEPTH               (DEPTH),
    .WIDTH               (WIDTH),
    .ALMOST_FULL_THRESH  (ALMOST_FULL_THRESH),
    .ALMOST_EMPTY_THRESH (ALMOST_EMPTY_THRESH)
  ) dut (.*);

  task automatic push(input logic [WIDTH-1:0] d);
    
    @(negedge clk); write_en = 1;
    write_data = d;
    @(posedge clk); @(negedge clk);
    write_en = 0;
  endtask

  task automatic pop(output logic [WIDTH-1:0] d);
    @(negedge clk); read_en = 1;
    d = read_data;  // capture before posedge advances ptr
    @(posedge clk); @(negedge clk);
    read_en = 0;
  endtask

  logic [WIDTH-1:0] rd;

  initial begin
    // Reset sequence
    rst_n      = 0;
    write_en   = 0;
    read_en    = 0;
    write_data = 0;
    @(posedge clk);
    @(posedge clk);
    rst_n = 1;
    @(posedge clk);

    // TC1 — Basic FIFO order
    push(8'hAA); push(8'hBB); push(8'hCC);
    pop(rd);
    if (rd == 8'hAA) begin p++; $display("PASS: TC1 pop 0xAA"); end
    else begin f++; $display("FAIL: TC1 pop 0xAA got %h", rd); end
    pop(rd);
    if (rd == 8'hBB) begin p++; $display("PASS: TC1 pop 0xBB"); end
    else begin f++; $display("FAIL: TC1 pop 0xBB got %h", rd); end
    pop(rd);
    if (rd == 8'hCC) begin p++; $display("PASS: TC1 pop 0xCC"); end
    else begin f++; $display("FAIL: TC1 pop 0xCC got %h", rd); end

    // TC2 — Full flag: fill all 8 slots
    repeat (8) push(8'hFF);
    @(negedge clk);
    if (full) begin p++; $display("PASS: TC2 full after 8 writes"); end
    else begin f++; $display("FAIL: TC2 full not set"); end
    // Overflow attempt must be ignored
    push(8'hEE);
    @(negedge clk);
    if (full) begin p++; $display("PASS: TC2 still full after overflow attempt"); end
    else begin f++; $display("FAIL: TC2 full cleared unexpectedly"); end

    // Reset before TC3
    rst_n = 0; @(posedge clk); @(posedge clk); rst_n = 1; @(posedge clk);

    // TC3 — Empty flag
    push(8'h01); push(8'h02); push(8'h03);
    pop(rd); pop(rd); pop(rd);
    @(negedge clk);
    if (empty) begin p++; $display("PASS: TC3 empty after 3 reads"); end
    else begin f++; $display("FAIL: TC3 empty not set"); end
    read_en = 1; @(posedge clk); read_en = 0; @(negedge clk);
    if (empty) begin p++; $display("PASS: TC3 still empty after underflow attempt"); end
    else begin f++; $display("FAIL: TC3 empty cleared unexpectedly"); end

    // Reset before TC4
    rst_n = 0; @(posedge clk); @(posedge clk); rst_n = 1; @(posedge clk);

    // TC4 — Almost-full threshold (threshold = 6)
    repeat (6) push(8'hAA);
    @(negedge clk);
    if (almost_full && !full) begin p++; $display("PASS: TC4 almost_full=1 at count=6"); end
    else begin f++; $display("FAIL: TC4 almost_full"); end

    // TC5 — Almost-empty threshold (threshold = 2)
    rst_n = 0; @(posedge clk); @(posedge clk); rst_n = 1; @(posedge clk);
    repeat (3) push(8'hBB);
    pop(rd); @(negedge clk);  // count=2
    if (almost_empty && !empty) begin p++; $display("PASS: TC5 almost_empty=1 at count=2"); end
    else begin f++; $display("FAIL: TC5 almost_empty"); end

    // TC6 — Simultaneous read+write
    rst_n = 0; @(posedge clk); @(posedge clk); rst_n = 1; @(posedge clk);
    repeat (4) push(8'hCD);          // count=4
    write_en = 1; write_data = 8'hEF;
    read_en  = 1;
    @(posedge clk);
    write_en = 0; read_en = 0;
    @(negedge clk);
    // count must still be 4
    if (!full && !empty) begin p++; $display("PASS: TC6 simultaneous R+W"); end
    else begin f++; $display("FAIL: TC6 simultaneous R+W"); end

    // Summary
    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule