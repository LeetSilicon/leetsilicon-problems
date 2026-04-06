module tb;
  localparam DEPTH = 8;
  localparam WIDTH = 8;

  logic              write_clk;
  logic              read_clk;
  logic              write_rst_n;
  logic              read_rst_n;
  logic              write_en;
  logic [WIDTH-1:0]  write_data;
  logic              full;
  logic              read_en;
  logic [WIDTH-1:0]  read_data;
  logic              empty;
  int                p = 0, f = 0;

  // Independent clock frequencies
  initial write_clk = 0;
  always #5  write_clk = ~write_clk;   // 100 MHz
  initial read_clk = 0;
  always #7  read_clk  = ~read_clk;    // ~71 MHz

  // DUT instantiation
  async_fifo #(.DEPTH(DEPTH), .WIDTH(WIDTH)) dut (.*);

  initial begin
    // Reset both domains
    write_rst_n = 0;
    read_rst_n  = 0;
    write_en    = 0;
    read_en     = 0;
    write_data  = 0;
    repeat (4) @(posedge write_clk);
    repeat (4) @(posedge read_clk);
    write_rst_n = 1;
    read_rst_n  = 1;

    // TC5 — Reset recovery
    #10;
    if (empty && !full) begin
      p++;
      $display("PASS: TC5 empty after reset");
    end else begin
      f++;
      $display("FAIL: TC5 reset recovery");
    end

    // TC1 — Write 8 entries, then read all
    repeat (8) begin
      @(posedge write_clk);
      write_en   = 1;
      write_data = write_data + 1;
      @(posedge write_clk);
      write_en = 0;
    end

    // Wait for sync latency then read
    repeat (6) @(posedge read_clk);
    begin
      logic [WIDTH-1:0] prev;
      logic [WIDTH-1:0] curr;
      logic order_ok = 1;
      prev = 0;
      repeat (8) begin
        if (!empty) begin
          @(posedge read_clk);
          read_en = 1;
          @(posedge read_clk);
          read_en = 0;
          #10;
          curr = read_data;
          if (curr != prev + 1) order_ok = 0;
          prev = curr;
        end
      end
      if (order_ok) begin p++; $display("PASS: TC1 FIFO order preserved"); end
      else begin f++; $display("FAIL: TC1 FIFO order"); end
    end

    // TC2 — Full flag
    repeat (4) @(posedge write_clk);
    write_data = 0;
    repeat (DEPTH) begin
      @(posedge write_clk);
      write_en   = 1;
      write_data = write_data + 1;
      @(posedge write_clk);
      write_en = 0;
    end
    repeat (4) @(posedge write_clk);
    #10;
    if (full) begin p++; $display("PASS: TC2 full asserts"); end
    else begin f++; $display("FAIL: TC2 full"); end

    // TC3 — Empty flag after draining
    repeat (DEPTH) begin
      @(posedge read_clk);
      read_en = 1;
      @(posedge read_clk);
      read_en = 0;
    end
    repeat (6) @(posedge read_clk);
    #10;
    if (empty) begin p++; $display("PASS: TC3 empty asserts"); end
    else begin f++; $display("FAIL: TC3 empty"); end

    // Summary
    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule