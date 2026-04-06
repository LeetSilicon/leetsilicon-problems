/**
 * rtlDesignSolution.js — Golden solutions + testbenches for RTL Design
 * Each entry: { solution: `RTL module`, testbench: `self-checking TB with pass/fail` }
 * Usage: import { rtlDesignTemplates } from './rtlDesignTemplates';
 */
export const rtlDesignTemplates = (qId, language) => {
  if (language === 'systemverilog') {

    // ─── FIFO / Queue ─────────────────────────────────────────────────────────

    if (qId === 'fifo1') {
      return {
        solution: `module sync_fifo #(
  parameter DEPTH               = 8,
  parameter WIDTH               = 8,
  parameter ALMOST_FULL_THRESH  = DEPTH - 1,
  parameter ALMOST_EMPTY_THRESH = 1
)(
  input  logic              clk,
  input  logic              rst_n,
  input  logic              write_en,
  input  logic [WIDTH-1:0]  write_data,
  input  logic              read_en,
  output logic [WIDTH-1:0]  read_data,
  output logic              full,
  output logic              empty,
  output logic              almost_full,
  output logic              almost_empty
);
  localparam PTR_W = $clog2(DEPTH);

  logic [WIDTH-1:0]   mem   [DEPTH];
  logic [PTR_W-1:0]   wr_ptr;
  logic [PTR_W-1:0]   rd_ptr;
  logic [PTR_W:0]     count;

  // Status flags
  assign full         = (count == DEPTH);
  assign empty        = (count == 0);
  assign almost_full  = (count >= ALMOST_FULL_THRESH);
  assign almost_empty = (count <= ALMOST_EMPTY_THRESH);

  // Read data — combinational (zero-cycle latency)
  assign read_data = mem[rd_ptr];

  // Write pointer and memory write
  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      wr_ptr <= '0;
    end else if (write_en && !full) begin
      mem[wr_ptr] <= write_data;
      wr_ptr      <= wr_ptr + 1;
    end
  end

  // Read pointer
  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      rd_ptr <= '0;
    end else if (read_en && !empty) begin
      rd_ptr <= rd_ptr + 1;
    end
  end

  // Occupancy counter
  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      count <= '0;
    end else begin
      unique case ({write_en && !full, read_en && !empty})
        2'b10:   count <= count + 1;
        2'b01:   count <= count - 1;
        default: count <= count;   // Both or neither
      endcase
    end
  end
endmodule`,
        testbench: `module tb;
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
endmodule`
      };
    }

    if (qId === 'fifo2') {
      return {
        solution: `module async_fifo #(
  parameter DEPTH = 8,
  parameter WIDTH = 8
)(
  // Write domain
  input  logic              write_clk,
  input  logic              write_rst_n,
  input  logic              write_en,
  input  logic [WIDTH-1:0]  write_data,
  output logic              full,
  // Read domain
  input  logic              read_clk,
  input  logic              read_rst_n,
  input  logic              read_en,
  output logic [WIDTH-1:0]  read_data,
  output logic              empty
);
  localparam PTR_W = $clog2(DEPTH) + 1;  // Extra bit for full/empty

  // Shared memory
  logic [WIDTH-1:0] mem [DEPTH];

  // Write domain pointers
  logic [PTR_W-1:0] wr_ptr_bin,  wr_ptr_gray;
  logic [PTR_W-1:0] rd_gray_sync1, rd_gray_sync2;  // 2-stage sync into write domain

  // Read domain pointers
  logic [PTR_W-1:0] rd_ptr_bin,  rd_ptr_gray;
  logic [PTR_W-1:0] wr_gray_sync1, wr_gray_sync2;  // 2-stage sync into read domain

  // Binary-to-Gray conversion
  function automatic logic [PTR_W-1:0] bin2gray(input logic [PTR_W-1:0] b);
    return (b >> 1) ^ b;
  endfunction

  // ── Write domain ──────────────────────────────────────────────────────────
  assign wr_ptr_gray = bin2gray(wr_ptr_bin);

  always_ff @(posedge write_clk or negedge write_rst_n) begin
    if (!write_rst_n) begin
      wr_ptr_bin <= '0;
    end else if (write_en && !full) begin
      mem[wr_ptr_bin[$clog2(DEPTH)-1:0]] <= write_data;
      wr_ptr_bin                          <= wr_ptr_bin + 1;
    end
  end

  // Synchronize rd_ptr_gray into write domain
  always_ff @(posedge write_clk or negedge write_rst_n) begin
    if (!write_rst_n) begin
      rd_gray_sync1 <= '0;
      rd_gray_sync2 <= '0;
    end else begin
      rd_gray_sync1 <= rd_ptr_gray;
      rd_gray_sync2 <= rd_gray_sync1;
    end
  end

  // Full: next write pointer equals synchronized read pointer with MSBs inverted
  logic [PTR_W-1:0] wr_gray_next;
  assign wr_gray_next = bin2gray(wr_ptr_bin + 1);
  assign full = (wr_gray_next[PTR_W-1:PTR_W-2] == {~rd_gray_sync2[PTR_W-1], rd_gray_sync2[PTR_W-2]})
             && (wr_gray_next[PTR_W-3:0] == rd_gray_sync2[PTR_W-3:0]);

  // ── Read domain ───────────────────────────────────────────────────────────
  assign rd_ptr_gray = bin2gray(rd_ptr_bin);

  always_ff @(posedge read_clk or negedge read_rst_n) begin
    if (!read_rst_n) begin
      rd_ptr_bin <= '0;
    end else if (read_en && !empty) begin
      rd_ptr_bin <= rd_ptr_bin + 1;
    end
  end

  assign read_data = mem[rd_ptr_bin[$clog2(DEPTH)-1:0]];

  // Synchronize wr_ptr_gray into read domain
  always_ff @(posedge read_clk or negedge read_rst_n) begin
    if (!read_rst_n) begin
      wr_gray_sync1 <= '0;
      wr_gray_sync2 <= '0;
    end else begin
      wr_gray_sync1 <= wr_ptr_gray;
      wr_gray_sync2 <= wr_gray_sync1;
    end
  end

  // Empty: read Gray pointer equals synchronized write Gray pointer
  assign empty = (rd_ptr_gray == wr_gray_sync2);
endmodule`,
        testbench: `module tb;
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
endmodule`
      };
    }

    if (qId === 'fifo3') {
      return {
        solution: `module fifo_width_conv #(
  parameter WRITE_WIDTH = 32,
  parameter READ_WIDTH  = 8,
  parameter DEPTH_UNITS = 16   // storage depth in min(WRITE_WIDTH, READ_WIDTH) units
)(
  input  logic                    clk,
  input  logic                    rst_n,
  input  logic                    write_en,
  input  logic [WRITE_WIDTH-1:0]  write_data,
  output logic                    full,
  input  logic                    read_en,
  output logic [READ_WIDTH-1:0]   read_data,
  output logic                    empty
);
  localparam UNIT_WIDTH  = (WRITE_WIDTH < READ_WIDTH) ? WRITE_WIDTH : READ_WIDTH;
  localparam WRITE_UNITS = WRITE_WIDTH / UNIT_WIDTH;
  localparam READ_UNITS  = READ_WIDTH  / UNIT_WIDTH;
  localparam ADDR_W      = (DEPTH_UNITS <= 1) ? 1 : $clog2(DEPTH_UNITS);
  localparam COUNT_W     = $clog2(DEPTH_UNITS + 1);
  localparam int unsigned DEPTH_UNITS_INT = DEPTH_UNITS;
  localparam logic [COUNT_W-1:0] WRITE_UNITS_COUNT = COUNT_W'(WRITE_UNITS);
  localparam logic [COUNT_W-1:0] READ_UNITS_COUNT  = COUNT_W'(READ_UNITS);
  localparam logic [COUNT_W-1:0] DEPTH_UNITS_COUNT = COUNT_W'(DEPTH_UNITS);

  logic [UNIT_WIDTH-1:0] mem [0:DEPTH_UNITS-1];
  logic [ADDR_W-1:0]     wr_ptr, rd_ptr;
  logic [COUNT_W-1:0]    count_units;

  function automatic [ADDR_W-1:0] ptr_add(
    input [ADDR_W-1:0] base,
    input int unsigned delta
  );
    int unsigned tmp;
    begin
      tmp = int'(base) + delta;
      ptr_add = ADDR_W'(tmp % DEPTH_UNITS_INT);
    end
  endfunction

  wire write_fire = write_en && !full;
  wire read_fire  = read_en  && !empty;

  assign full  = (count_units + WRITE_UNITS_COUNT > DEPTH_UNITS_COUNT);
  assign empty = (count_units < READ_UNITS_COUNT);

  // Write path: break incoming word into UNIT_WIDTH chunks, LSB-first
  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      wr_ptr <= '0;
    end else if (write_fire) begin
      for (int i = 0; i < WRITE_UNITS; i++) begin
        mem[ptr_add(wr_ptr, i)] <= write_data[i*UNIT_WIDTH +: UNIT_WIDTH];
      end
      wr_ptr <= ptr_add(wr_ptr, WRITE_UNITS);
    end
  end

  // Read path: assemble outgoing word from UNIT_WIDTH chunks, LSB-first
  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      rd_ptr    <= '0;
      read_data <= '0;
    end else if (read_fire) begin
      for (int i = 0; i < READ_UNITS; i++) begin
        read_data[i*UNIT_WIDTH +: UNIT_WIDTH] <= mem[ptr_add(rd_ptr, i)];
      end
      rd_ptr <= ptr_add(rd_ptr, READ_UNITS);
    end
  end

  // Occupancy in UNIT_WIDTH chunks
  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      count_units <= '0;
    end else begin
      unique case ({write_fire, read_fire})
        2'b10:   count_units <= count_units + WRITE_UNITS_COUNT;
        2'b01:   count_units <= count_units - READ_UNITS_COUNT;
        2'b11:   count_units <= count_units + WRITE_UNITS_COUNT - READ_UNITS_COUNT;
        default: count_units <= count_units;
      endcase
    end
  end
endmodule`,
        testbench: `module tb;
  logic clk;
  logic rst_n;

  // DUT A: 32 -> 8
  logic        w_en_a, r_en_a, full_a, empty_a;
  logic [31:0] w_data_a;
  logic [7:0]  r_data_a;

  // DUT B: 8 -> 32
  logic        w_en_b, r_en_b, full_b, empty_b;
  logic [7:0]  w_data_b;
  logic [31:0] r_data_b;

  int p = 0, f = 0;

  initial clk = 0;

  always #5 clk = ~clk;
  fifo_width_conv #(.WRITE_WIDTH(32), .READ_WIDTH(8), .DEPTH_UNITS(8)) dut_wide_to_narrow (
    .clk(clk), .rst_n(rst_n),
    .write_en(w_en_a), .write_data(w_data_a), .full(full_a),
    .read_en(r_en_a),  .read_data(r_data_a),  .empty(empty_a)
  );

  fifo_width_conv #(.WRITE_WIDTH(8), .READ_WIDTH(32), .DEPTH_UNITS(8)) dut_narrow_to_wide (
    .clk(clk), .rst_n(rst_n),
    .write_en(w_en_b), .write_data(w_data_b), .full(full_b),
    .read_en(r_en_b),  .read_data(r_data_b),  .empty(empty_b)
  );

  task automatic push32(input logic [31:0] d);
    @(negedge clk); w_en_a = 1; w_data_a = d;
    @(posedge clk); @(negedge clk); w_en_a = 0;
  endtask

  task automatic pop8(output logic [7:0] d);
    r_en_a = 1;
    @(posedge clk);
    r_en_a = 0;
    @(negedge clk);
    d = r_data_a;
  endtask

  task automatic push8(input logic [7:0] d);
    @(negedge clk); w_en_b = 1; w_data_b = d;
    @(posedge clk); @(negedge clk); w_en_b = 0;
  endtask

  task automatic pop32(output logic [31:0] d);
    r_en_b = 1;
    @(posedge clk);
    r_en_b = 0;
    @(negedge clk);
    d = r_data_b;
  endtask

  logic [7:0]  b0, b1, b2, b3;
  logic [31:0] w;

  initial begin
    rst_n    = 0;
    w_en_a   = 0; r_en_a = 0; w_data_a = '0;
    w_en_b   = 0; r_en_b = 0; w_data_b = '0;
    @(posedge clk); @(posedge clk);
    rst_n = 1; @(posedge clk);

    // TC1 — 32 -> 8, LSB-first order
    push32(32'hA1B2C3D4);
    pop8(b0); pop8(b1); pop8(b2); pop8(b3);
    if ({b3,b2,b1,b0} == 32'hA1B2C3D4) begin
      p++; $display("PASS: TC1 wide->narrow LSB-first order");
    end else begin
      f++; $display("FAIL: TC1 got bytes %h %h %h %h", b3, b2, b1, b0);
    end

    // TC2 — 8 -> 32 assembly
    push8(8'h11); push8(8'h22); push8(8'h33); push8(8'h44);
    pop32(w);
    if (w == 32'h44332211) begin
      p++; $display("PASS: TC2 narrow->wide assembly");
    end else begin
      f++; $display("FAIL: TC2 got %h", w);
    end

    // TC3 — partial blocking for 8 -> 32
    push8(8'hAA); push8(8'hBB); push8(8'hCC);
    @(negedge clk);
    if (empty_b) begin
      p++; $display("PASS: TC3 empty stays high until full 32b word available");
    end else begin
      f++; $display("FAIL: TC3 empty_b deasserted too early");
    end
    push8(8'hDD);
    @(negedge clk);
    if (!empty_b) begin
      p++; $display("PASS: TC3 empty clears after 4th byte");
    end else begin
      f++; $display("FAIL: TC3 empty_b still high after 4 bytes");
    end
    pop32(w);
    if (w == 32'hDDCCBBAA) begin
      p++; $display("PASS: TC3 read after full assembly");
    end else begin
      f++; $display("FAIL: TC3 got %h", w);
    end

    // TC4 — full condition with width conversion
    push32(32'h01020304);
    push32(32'h05060708); // DEPTH_UNITS=8 filled
    @(negedge clk);
    if (full_a) begin
      p++; $display("PASS: TC4 full asserted at capacity");
    end else begin
      f++; $display("FAIL: TC4 full not asserted");
    end

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule`
      };
    }

    // ─── Sequence Detectors / FSM ─────────────────────────────────────────────

    if (qId === 'fsm1') {
      return {
        solution: `// Mealy FSM — detect overlapping sequence 1011
module seq_det_1011 (
  input  logic clk,
  input  logic rst_n,
  input  logic in,
  output logic detect
);
  typedef enum logic [2:0] {
    IDLE,    // No progress
    S1,      // Seen "1"
    S10,     // Seen "10"
    S101,    // Seen "101"
    S1011    // Seen "1011" (complete)
  } state_t;

  state_t state, next_state;

  // State register
  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) state <= IDLE;
    else        state <= next_state;
  end

  // Next-state logic
  always_comb begin
    next_state = IDLE;
    case (state)
      IDLE:  next_state = in ? S1    : IDLE;
      S1:    next_state = in ? S1    : S10;
      S10:   next_state = in ? S101  : IDLE;
      S101:  next_state = in ? S1011 : S10;
      S1011: next_state = in ? S1    : S10;   // Overlapping: last "1" starts new match
    endcase
  end

  // Mealy output — detect when transition into S1011
  assign detect = (state == S101) && in;
endmodule`,
        testbench: `module tb;
  logic clk;
  logic rst_n;
  logic in;
  logic detect;
  int   p = 0, f = 0;

  initial clk = 0;

  always #5 clk = ~clk;
  seq_det_1011 dut (.*);

  task automatic drive_bit(input logic b, output logic det_sample);
    in = b;
    #1;                 // sample Mealy output before the state update edge
    det_sample = detect;
    @(posedge clk);
    #1;
  endtask

  logic det;

  initial begin
    rst_n = 0; in = 0;
    @(posedge clk); @(posedge clk);
    rst_n = 1;
    @(posedge clk); @(negedge clk);

    // TC1 — Single match: 0 1 0 1 1 0
    drive_bit(0, det);
    drive_bit(1, det);
    drive_bit(0, det);
    drive_bit(1, det);
    drive_bit(1, det);
    if (det) begin p++; $display("PASS: TC1 single match"); end
    else begin f++; $display("FAIL: TC1 single match"); end
    drive_bit(0, det);

    // TC2 — Overlap/fallback behavior on 1 0 1 0 should not falsely match
    rst_n = 0; @(posedge clk); @(posedge clk); rst_n = 1;
    drive_bit(1, det); if (det) begin f++; $display("FAIL: TC2 spurious detect"); end
    drive_bit(0, det); if (det) begin f++; $display("FAIL: TC2 spurious detect"); end
    drive_bit(1, det); if (det) begin f++; $display("FAIL: TC2 spurious detect"); end
    drive_bit(0, det);
    if (!det) begin p++; $display("PASS: TC2 fallback without false match"); end
    else begin f++; $display("FAIL: TC2 false detect"); end

    // TC3 — Two matches in 1 0 1 1 0 1 0 1 1
    rst_n = 0; @(posedge clk); @(posedge clk); rst_n = 1;
    drive_bit(1, det);
    drive_bit(0, det);
    drive_bit(1, det);
    drive_bit(1, det);
    if (det) begin p++; $display("PASS: TC3 first match"); end
    else begin f++; $display("FAIL: TC3 first match"); end
    drive_bit(0, det);
    drive_bit(1, det);
    drive_bit(0, det);
    drive_bit(1, det);
    drive_bit(1, det);
    if (det) begin p++; $display("PASS: TC3 second match"); end
    else begin f++; $display("FAIL: TC3 second match"); end

    // TC4 — No match
    rst_n = 0; @(posedge clk); @(posedge clk); rst_n = 1;
    begin
      logic any_det;
      any_det = 0;
      drive_bit(0, det); any_det |= det;
      drive_bit(0, det); any_det |= det;
      drive_bit(0, det); any_det |= det;
      drive_bit(1, det); any_det |= det;
      drive_bit(1, det); any_det |= det;
      drive_bit(0, det); any_det |= det;
      drive_bit(0, det); any_det |= det;
      if (!any_det) begin p++; $display("PASS: TC4 no match"); end
      else begin f++; $display("FAIL: TC4 spurious detect"); end
    end

    // TC5 — Reset during partial sequence
    rst_n = 0; @(posedge clk); @(posedge clk); rst_n = 1;
    drive_bit(1, det);
    drive_bit(0, det);
    drive_bit(1, det);
    rst_n = 0; @(posedge clk); @(posedge clk); rst_n = 1;
    drive_bit(1, det);
    drive_bit(0, det);
    drive_bit(1, det);
    drive_bit(1, det);
    if (det) begin p++; $display("PASS: TC5 reset recovery"); end
    else begin f++; $display("FAIL: TC5 reset recovery"); end

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule`
      };
    }

    if (qId === 'fsm2') {
      return {
        solution: `module traffic_light #(
  parameter NS_GREEN_TIME  = 10,
  parameter NS_YELLOW_TIME = 2,
  parameter EW_GREEN_TIME  = 10,
  parameter EW_YELLOW_TIME = 2
)(
  input  logic clk,
  input  logic rst_n,
  output logic ns_red,
  output logic ns_yellow,
  output logic ns_green,
  output logic ew_red,
  output logic ew_yellow,
  output logic ew_green
);
  typedef enum logic [1:0] {
    NS_GREEN,
    NS_YELLOW,
    EW_GREEN,
    EW_YELLOW
  } state_t;

  state_t       state;
  logic [3:0]   timer;

  // State register + timer
  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      state <= NS_GREEN;
      timer <= NS_GREEN_TIME - 1;
    end else begin
      if (timer == 0) begin
        case (state)
          NS_GREEN:  begin state <= NS_YELLOW; timer <= NS_YELLOW_TIME - 1; end
          NS_YELLOW: begin state <= EW_GREEN;  timer <= EW_GREEN_TIME  - 1; end
          EW_GREEN:  begin state <= EW_YELLOW; timer <= EW_YELLOW_TIME - 1; end
          EW_YELLOW: begin state <= NS_GREEN;  timer <= NS_GREEN_TIME  - 1; end
        endcase
      end else begin
        timer <= timer - 1;
      end
    end
  end

  // Moore outputs — depend only on state
  always_comb begin
    {ns_red, ns_yellow, ns_green} = 3'b100;   // Default: NS red
    {ew_red, ew_yellow, ew_green} = 3'b100;   // Default: EW red
    case (state)
      NS_GREEN:  begin {ns_red, ns_yellow, ns_green} = 3'b001; {ew_red, ew_yellow, ew_green} = 3'b100; end
      NS_YELLOW: begin {ns_red, ns_yellow, ns_green} = 3'b010; {ew_red, ew_yellow, ew_green} = 3'b100; end
      EW_GREEN:  begin {ns_red, ns_yellow, ns_green} = 3'b100; {ew_red, ew_yellow, ew_green} = 3'b001; end
      EW_YELLOW: begin {ns_red, ns_yellow, ns_green} = 3'b100; {ew_red, ew_yellow, ew_green} = 3'b010; end
    endcase
  end
endmodule`,
        testbench: `module tb;
  logic clk;
  logic rst_n;
  logic ns_red, ns_yellow, ns_green;
  logic ew_red, ew_yellow, ew_green;
  int   p = 0, f = 0;

  initial clk = 0;

  always #5 clk = ~clk;
  traffic_light #(
    .NS_GREEN_TIME(10), .NS_YELLOW_TIME(2),
    .EW_GREEN_TIME(10), .EW_YELLOW_TIME(2)
  ) dut (.*);

  initial begin
    // Reset
    rst_n = 0;
    @(posedge clk); @(posedge clk);
    rst_n = 1; @(posedge clk); @(negedge clk);

    // TC1 — Normal cycle: NS_GREEN for 10 cycles
    if (ns_green && ew_red) begin p++; $display("PASS: TC1 initial NS_GREEN"); end
    else begin f++; $display("FAIL: TC1 initial state"); end

    // Wait for NS_GREEN to expire (10 cycles)
    repeat (8) @(posedge clk);
    @(negedge clk);
    if (ns_yellow && ew_red) begin p++; $display("PASS: TC1 NS_YELLOW after 10"); end
    else begin f++; $display("FAIL: TC1 expected NS_YELLOW"); end

    // Wait for NS_YELLOW (2 cycles)
    repeat (2) @(posedge clk);
    @(negedge clk);
    if (ew_green && ns_red) begin p++; $display("PASS: TC1 EW_GREEN after yellow"); end
    else begin f++; $display("FAIL: TC1 expected EW_GREEN"); end

    // TC5 — Safety: both green never simultaneously
    repeat (30) begin
      @(posedge clk); @(negedge clk);
      if (ns_green && ew_green) begin
        f++;
        $display("FAIL: TC5 BOTH GREEN simultaneously!");
      end
    end
    p++;
    $display("PASS: TC5 never both directions green");

    // TC2 — Reset mid-cycle
    rst_n = 0; @(posedge clk); @(posedge clk); rst_n = 1; @(posedge clk); @(negedge clk);
    if (ns_green && ew_red) begin p++; $display("PASS: TC2 returns to NS_GREEN on reset"); end
    else begin f++; $display("FAIL: TC2 reset mid-cycle"); end

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule`
      };
    }

    if (qId === 'fsm3') {
      return {
        solution: `module vending_machine #(
  parameter ITEM_PRICE = 25
)(
  input  logic        clk,
  input  logic        rst_n,
  input  logic        coin_valid,
  input  logic [4:0]  coin_value,   // 5, 10, or 25 cents
  output logic        dispense,
  output logic        change_valid,
  output logic [4:0]  change_amount
);
  localparam CREDIT_BITS = 7;

  logic [CREDIT_BITS-1:0] credit;

  typedef enum logic [1:0] {
    IDLE,
    DISPENSE_STATE,
    CHANGE_STATE
  } state_t;

  state_t state;

  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      credit        <= '0;
      state         <= IDLE;
      dispense      <= 0;
      change_valid  <= 0;
      change_amount <= 0;
    end else begin
      dispense      <= 0;
      change_valid  <= 0;
      change_amount <= 0;

      case (state)
        IDLE: begin
          // Accumulate valid coins (5c, 10c, 25c only)
          if (coin_valid && (coin_value == 5 || coin_value == 10 || coin_value == 25)) begin
            credit <= credit + coin_value;
          end
          // Dispense when sufficient credit
          if ((credit + (coin_valid && (coin_value == 5 || coin_value == 10 || coin_value == 25)
                         ? coin_value : 0)) >= ITEM_PRICE) begin
            state <= DISPENSE_STATE;
          end
        end
        DISPENSE_STATE: begin
          dispense <= 1;
          credit   <= credit - ITEM_PRICE;
          if (credit - ITEM_PRICE > 0)
            state <= CHANGE_STATE;
          else
            state <= IDLE;
        end
        CHANGE_STATE: begin
          change_valid  <= 1;
          change_amount <= credit[4:0];
          credit        <= '0;
          state         <= IDLE;
        end
      endcase
    end
  end
endmodule`,
        testbench: `module tb;
  logic clk, rst_n, coin_valid, dispense, change_valid;
  logic [4:0] coin_value, change_amount;
  int p=0, f=0;
  initial clk=0; always #5 clk=~clk;
  vending_machine #(.ITEM_PRICE(25)) dut(.*);

  task automatic insert_coin(input logic [4:0] val);
    @(negedge clk); coin_valid=1; coin_value=val;
    @(posedge clk); @(negedge clk); coin_valid=0; coin_value=0;
  endtask

  initial begin
    rst_n=0; coin_valid=0; coin_value=0;
    @(posedge clk); @(posedge clk); rst_n=1;
    @(posedge clk); @(negedge clk);

    // TC1: Exact payment 25c → IDLE sees credit+25>=25 → DISPENSE_STATE → dispense=1
    insert_coin(25);
    // After task: state=DISPENSE_STATE (credit was updated + state transition on same edge)
    // Next posedge: DISPENSE_STATE executes, dispense<=1
    @(posedge clk); @(negedge clk);
    if (dispense) begin p++; $display("PASS: TC1 exact payment"); end
    else begin f++; $display("FAIL: TC1 dispense=%b state=%0d", dispense, dut.state); end

    // Wait for FSM to return to IDLE
    @(posedge clk); @(posedge clk); @(negedge clk);

    // TC2: Overpayment 10+25=35c → dispense + 10c change
    rst_n=0; @(posedge clk); @(posedge clk); rst_n=1; @(posedge clk); @(negedge clk);
    insert_coin(10);  // credit=10, not enough
    insert_coin(25);  // credit=10+25=35 >= 25 → DISPENSE_STATE
    @(posedge clk); @(negedge clk);
    if (dispense) begin p++; $display("PASS: TC2 dispense"); end
    else begin f++; $display("FAIL: TC2 dispense=%b credit=%0d state=%0d", dispense, dut.credit, dut.state); end
    // CHANGE_STATE next cycle
    @(posedge clk); @(negedge clk);
    if (change_valid && change_amount==10) begin p++; $display("PASS: TC2 change=10"); end
    else begin f++; $display("FAIL: TC2 change=%0d valid=%b", change_amount, change_valid); end

    @(posedge clk); @(posedge clk); @(negedge clk);

    // TC3: Underpayment 10c only → no dispense
    rst_n=0; @(posedge clk); @(posedge clk); rst_n=1; @(posedge clk); @(negedge clk);
    insert_coin(10);
    @(posedge clk); @(negedge clk);
    if (!dispense) begin p++; $display("PASS: TC3 no dispense"); end
    else begin f++; $display("FAIL: TC3"); end

    // TC6: Accumulated: 5+5+5+10 = 25 → dispense
    rst_n=0; @(posedge clk); @(posedge clk); rst_n=1; @(posedge clk); @(negedge clk);
    insert_coin(5); insert_coin(5); insert_coin(5); insert_coin(10);
    @(posedge clk); @(negedge clk);
    if (dispense) begin p++; $display("PASS: TC6 accumulated"); end
    else begin f++; $display("FAIL: TC6 dispense=%b credit=%0d", dispense, dut.credit); end

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule
`
      };
    }

    // ─── Memory / Cache ───────────────────────────────────────────────────────

    if (qId === 'mem1') {
      return {
        solution: `module sp_ram #(
  parameter DEPTH = 256,
  parameter WIDTH = 8
)(
  input  logic                      clk,
  input  logic                      write_en,
  input  logic                      read_en,
  input  logic [$clog2(DEPTH)-1:0] address,
  input  logic [WIDTH-1:0]          write_data,
  output logic [WIDTH-1:0]          read_data
);
  logic [WIDTH-1:0] mem [DEPTH];

  // Synchronous write
  always_ff @(posedge clk) begin
    if (write_en) begin
      mem[address] <= write_data;
    end
  end

  // Write-first read (1-cycle latency, returns new data on same-address write+read)
  always_ff @(posedge clk) begin
    if (read_en) begin
      if (write_en && (address == address))
        read_data <= write_data;   // Write-first forwarding
      else
        read_data <= mem[address];
    end
  end
endmodule`,
        testbench: `module tb;
  localparam DEPTH = 16, WIDTH = 8;
  logic clk, write_en, read_en;
  logic [3:0] address;
  logic [7:0] write_data, read_data;
  int p=0, f=0;
  initial clk=0; always #5 clk=~clk;
  sp_ram #(.DEPTH(DEPTH), .WIDTH(WIDTH)) dut(.*);
  initial begin
    write_en=0; read_en=0; address=0; write_data=0;
    @(posedge clk); @(posedge clk);

    // TC1
    @(negedge clk); address=3; write_data=8'hAA; write_en=1;
    @(posedge clk); @(negedge clk); write_en=0;
    @(negedge clk); read_en=1;
    @(posedge clk); @(negedge clk); read_en=0;
    @(posedge clk); @(negedge clk);
    if (read_data==8'hAA) begin p++; $display("PASS: TC1"); end
    else begin f++; $display("FAIL: TC1 got %h", read_data); end

    // TC4
    for (int i=0; i<4; i++) begin
      @(negedge clk); address=i; write_data=i*8'h11; write_en=1;
      @(posedge clk); @(negedge clk); write_en=0;
    end
    begin
      logic ok=1;
      for (int i=0; i<4; i++) begin
        @(negedge clk); address=i; read_en=1;
        @(posedge clk); @(negedge clk); read_en=0;
        @(posedge clk); @(negedge clk);
        if (read_data != i*8'h11) ok=0;
      end
      if (ok) begin p++; $display("PASS: TC4"); end
      else begin f++; $display("FAIL: TC4"); end
    end

    // TC5
    @(negedge clk); address=0; write_data=8'hFF; write_en=1;
    @(posedge clk); @(negedge clk); write_en=0;
    @(negedge clk); address=DEPTH-1; write_data=8'hEE; write_en=1;
    @(posedge clk); @(negedge clk); write_en=0;
    @(negedge clk); address=0; read_en=1;
    @(posedge clk); @(negedge clk); read_en=0;
    @(posedge clk); @(negedge clk);
    if (read_data==8'hFF) begin p++; $display("PASS: TC5"); end
    else begin f++; $display("FAIL: TC5 got %h", read_data); end

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule
`
      };
    }

    if (qId === 'mem2') {
      return {
        solution: `// Simple dual-port RAM: Port A write-only, Port B read-only
module dp_ram #(
  parameter DEPTH = 256,
  parameter WIDTH = 8
)(
  input  logic                      clk,
  // Port A — write
  input  logic                      write_en_a,
  input  logic [$clog2(DEPTH)-1:0] addr_a,
  input  logic [WIDTH-1:0]          write_data_a,
  // Port B — read
  input  logic                      read_en_b,
  input  logic [$clog2(DEPTH)-1:0] addr_b,
  output logic [WIDTH-1:0]          read_data_b
);
  logic [WIDTH-1:0] mem [DEPTH];

  // Port A: synchronous write
  always_ff @(posedge clk) begin
    if (write_en_a) begin
      mem[addr_a] <= write_data_a;
    end
  end

  // Port B: synchronous read (read-first on same-address collision)
  always_ff @(posedge clk) begin
    if (read_en_b) begin
      read_data_b <= mem[addr_b];
    end
  end
endmodule`,
        testbench: `module tb;
  localparam DEPTH=16, WIDTH=8;
  logic clk, write_en_a, read_en_b;
  logic [3:0] addr_a, addr_b;
  logic [7:0] write_data_a, read_data_b;
  int p=0, f=0;
  initial clk=0; always #5 clk=~clk;
  dp_ram #(.DEPTH(DEPTH), .WIDTH(WIDTH)) dut(.*);
  initial begin
    write_en_a=0; read_en_b=0; addr_a=0; addr_b=0; write_data_a=0;
    @(posedge clk); @(posedge clk);
    // TC1: Write portA, read portB
    @(negedge clk); addr_a=5; write_data_a=8'hBB; write_en_a=1;
    @(posedge clk); @(negedge clk); write_en_a=0;
    @(negedge clk); addr_b=5; read_en_b=1;
    @(posedge clk); @(negedge clk); read_en_b=0;
    @(posedge clk); @(negedge clk);
    if (read_data_b==8'hBB) begin p++; $display("PASS: TC1"); end
    else begin f++; $display("FAIL: TC1 got %h", read_data_b); end
    // TC5: read same addr
    @(negedge clk); addr_b=5; read_en_b=1;
    @(posedge clk); @(negedge clk); read_en_b=0;
    @(posedge clk); @(negedge clk);
    if (read_data_b==8'hBB) begin p++; $display("PASS: TC5"); end
    else begin f++; $display("FAIL: TC5 got %h", read_data_b); end
    // TC4: Simultaneous write A / read B same addr
    @(negedge clk); addr_a=2; write_data_a=8'hCC; write_en_a=1; addr_b=2; read_en_b=1;
    @(posedge clk); @(negedge clk); write_en_a=0; read_en_b=0;
    @(posedge clk); @(negedge clk);
    if (read_data_b==8'hCC || read_data_b==8'h00) begin p++; $display("PASS: TC4"); end
    else begin f++; $display("FAIL: TC4 got %h", read_data_b); end
    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule
`
      };
    }

    if (qId === 'mem3') {
      return {
        solution: `// Direct-mapped write-through cache with write-allocate
module direct_mapped_cache #(
  parameter ADDR_WIDTH  = 8,
  parameter DATA_WIDTH  = 8,
  parameter NUM_LINES   = 4,    // Number of cache lines
  parameter OFFSET_BITS = 0     // Words per line = 1 (single-word lines)
)(
  input  logic                    clk,
  input  logic                    rst_n,
  input  logic                    access,
  input  logic                    write_en,
  input  logic [ADDR_WIDTH-1:0]  address,
  input  logic [DATA_WIDTH-1:0]  write_data,
  // Simulated memory interface
  input  logic [DATA_WIDTH-1:0]  mem_read_data,   // Data from main memory
  output logic [ADDR_WIDTH-1:0]  mem_address,
  output logic [DATA_WIDTH-1:0]  mem_write_data,
  output logic                    mem_write_en,
  output logic                    mem_read_req,
  // Cache status
  output logic [DATA_WIDTH-1:0]  read_data,
  output logic                    hit,
  output logic                    miss
);
  localparam INDEX_BITS = $clog2(NUM_LINES);
  localparam TAG_BITS   = ADDR_WIDTH - INDEX_BITS - OFFSET_BITS;

  logic                  valid     [NUM_LINES];
  logic [TAG_BITS-1:0]   tag_array [NUM_LINES];
  logic [DATA_WIDTH-1:0] data_array[NUM_LINES];

  // Address decomposition
  logic [TAG_BITS-1:0]   addr_tag;
  logic [INDEX_BITS-1:0] addr_idx;

  assign addr_tag = address[ADDR_WIDTH-1 : ADDR_WIDTH-TAG_BITS];
  assign addr_idx = address[INDEX_BITS-1 : 0];

  // Hit detection (combinational)
  assign hit  = access && valid[addr_idx] && (tag_array[addr_idx] == addr_tag);
  assign miss = access && !hit;

  // Read data
  assign read_data = data_array[addr_idx];

  // Memory interface
  assign mem_address    = address;
  assign mem_write_data = write_data;
  assign mem_write_en   = access && write_en;   // Write-through: always write to memory
  assign mem_read_req   = miss && !write_en;    // Fetch on read miss

  // Cache update
  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      for (int i = 0; i < NUM_LINES; i++) begin
        valid[i] <= 0;
      end
    end else if (access) begin
      if (hit && write_en) begin
        // Write hit — update cache (write-through also writes to memory)
        data_array[addr_idx] <= write_data;
      end else if (miss && !write_en) begin
        // Read miss — fill from memory
        valid[addr_idx]      <= 1;
        tag_array[addr_idx]  <= addr_tag;
        data_array[addr_idx] <= mem_read_data;
      end else if (miss && write_en) begin
        // Write miss — write-allocate: fill then update
        valid[addr_idx]      <= 1;
        tag_array[addr_idx]  <= addr_tag;
        data_array[addr_idx] <= write_data;
      end
    end
  end
endmodule`,
        testbench: `module tb;
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
`
      };
    }

    if (qId === 'mem4') {
      return {
        solution: `// 4-way set-associative write-back cache with LRU replacement
module wb_cache #(
  parameter NUM_SETS   = 4,
  parameter NUM_WAYS   = 4,
  parameter TAG_BITS   = 4,
  parameter DATA_WIDTH = 8
)(
  input  logic                   clk,
  input  logic                   rst_n,
  input  logic                   access,
  input  logic                   write_en,
  input  logic [TAG_BITS-1:0]   addr_tag,
  input  logic [$clog2(NUM_SETS)-1:0] addr_set,
  input  logic [DATA_WIDTH-1:0]  write_data,
  output logic [DATA_WIDTH-1:0]  read_data,
  output logic                    hit,
  output logic                    miss,
  // Writeback interface
  output logic                    wb_req,
  output logic [TAG_BITS-1:0]    wb_tag,
  output logic [$clog2(NUM_SETS)-1:0] wb_set,
  output logic [DATA_WIDTH-1:0]  wb_data
);
  logic                  valid [NUM_SETS][NUM_WAYS];
  logic                  dirty [NUM_SETS][NUM_WAYS];
  logic [TAG_BITS-1:0]   tags  [NUM_SETS][NUM_WAYS];
  logic [DATA_WIDTH-1:0] data  [NUM_SETS][NUM_WAYS];
  logic [1:0]            lru   [NUM_SETS][NUM_WAYS]; // LRU rank: 3=MRU, 0=LRU

  logic [$clog2(NUM_WAYS)-1:0] hit_way;
  logic [$clog2(NUM_WAYS)-1:0] victim_way;
  logic                         any_hit;

  // Hit detection
  always_comb begin
    any_hit  = 0;
    hit_way  = '0;
    for (int w = 0; w < NUM_WAYS; w++) begin
      if (valid[addr_set][w] && tags[addr_set][w] == addr_tag) begin
        any_hit = 1;
        hit_way = w[$clog2(NUM_WAYS)-1:0];
      end
    end
  end

  // LRU victim selection
  always_comb begin
    victim_way = '0;
    // First prefer invalid way
    for (int w = NUM_WAYS-1; w >= 0; w--) begin
      if (!valid[addr_set][w]) victim_way = w[$clog2(NUM_WAYS)-1:0];
    end
    // If all valid, pick LRU (rank == 0)
    if (&{valid[addr_set][0], valid[addr_set][1], valid[addr_set][2], valid[addr_set][3]}) begin
      for (int w = 0; w < NUM_WAYS; w++) begin
        if (lru[addr_set][w] == 2'd0) victim_way = w[$clog2(NUM_WAYS)-1:0];
      end
    end
  end

  assign hit      = access && any_hit;
  assign miss     = access && !any_hit;
  assign read_data = data[addr_set][hit_way];
  assign wb_req   = miss && valid[addr_set][victim_way] && dirty[addr_set][victim_way];
  assign wb_tag   = tags[addr_set][victim_way];
  assign wb_set   = addr_set;
  assign wb_data  = data[addr_set][victim_way];

  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      for (int s = 0; s < NUM_SETS; s++) begin
        for (int w = 0; w < NUM_WAYS; w++) begin
          valid[s][w] <= 0;
          dirty[s][w] <= 0;
          lru[s][w]   <= w[1:0];
        end
      end
    end else if (access) begin
      if (any_hit) begin
        // Hit: update data on write, always update LRU
        if (write_en) begin
          data[addr_set][hit_way]  <= write_data;
          dirty[addr_set][hit_way] <= 1;
        end
        begin
          logic [1:0] old_rank;
          old_rank = lru[addr_set][hit_way];
          for (int w = 0; w < NUM_WAYS; w++) begin
            if (w[$clog2(NUM_WAYS)-1:0] == hit_way)
              lru[addr_set][w] <= 2'd3;
            else if (lru[addr_set][w] > old_rank)
              lru[addr_set][w] <= lru[addr_set][w] - 1'b1;
          end
        end
      end else begin
        // Miss: evict victim, fill new line
        valid[addr_set][victim_way] <= 1;
        dirty[addr_set][victim_way] <= write_en;
        tags[addr_set][victim_way]  <= addr_tag;
        data[addr_set][victim_way]  <= write_data;
        begin
          logic [1:0] old_rank;
          old_rank = lru[addr_set][victim_way];
          for (int w = 0; w < NUM_WAYS; w++) begin
            if (w[$clog2(NUM_WAYS)-1:0] == victim_way)
              lru[addr_set][w] <= 2'd3;
            else if (lru[addr_set][w] > old_rank)
              lru[addr_set][w] <= lru[addr_set][w] - 1'b1;
          end
        end
      end
    end
  end
endmodule`,
        testbench: `module tb;
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
`
      };
    }

    // ─── Counters / Registers / Shift Registers ───────────────────────────────

    if (qId === 'counter1') {
      return {
        solution: `module sync_counter #(
  parameter N           = 4,
  parameter RESET_VALUE = 0
)(
  input  logic         clk,
  input  logic         rst_n,
  input  logic         enable,
  output logic [N-1:0] count
);
  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      count <= N'(RESET_VALUE);
    end else if (enable) begin
      count <= count + 1;
    end
  end
endmodule`,
        testbench: `module tb;
  localparam N = 4;

  logic        clk;
  logic        rst_n;
  logic        enable;
  logic [N-1:0] count;
  int          p = 0, f = 0;

  initial clk = 0;

  always #5 clk = ~clk;
  sync_counter #(.N(N)) dut (.*);

  initial begin
    rst_n  = 0;
    enable = 0;
    @(posedge clk); @(posedge clk);
    rst_n = 1;
    @(posedge clk); @(negedge clk);

    // TC1 — Count 3 cycles
    @(negedge clk); enable = 1;
    repeat (3) @(posedge clk);
    @(negedge clk);
    if (count == 3) begin p++; $display("PASS: TC1 count=3 after 3 cycles"); end
    else begin f++; $display("FAIL: TC1 count=%0d", count); end

    // Continue to 10
    repeat (7) @(posedge clk);
    @(negedge clk);
    if (count == 10) begin p++; $display("PASS: TC1 count=10 after 10 cycles"); end
    else begin f++; $display("FAIL: TC1 count=%0d", count); end

    // TC2 — Hold on disable
    enable = 0;
    repeat (2) @(posedge clk);
    @(negedge clk);
    if (count == 10) begin p++; $display("PASS: TC2 hold when disabled"); end
    else begin f++; $display("FAIL: TC2 count changed to %0d", count); end
    enable = 1;
    @(posedge clk); @(negedge clk);
    if (count == 11) begin p++; $display("PASS: TC2 increments after re-enable"); end
    else begin f++; $display("FAIL: TC2 expected 11 got %0d", count); end

    // TC3 — Wraparound at 15 → 0
    // Count up to 15
    repeat (4) @(posedge clk);
    @(negedge clk);
    if (count == 15) begin p++; $display("PASS: TC3 at max 15"); end
    else begin f++; $display("FAIL: TC3 expected 15 got %0d", count); end
    @(posedge clk); @(negedge clk);
    if (count == 0) begin p++; $display("PASS: TC3 wraps to 0"); end
    else begin f++; $display("FAIL: TC3 wrap got %0d", count); end

    // TC4 — Reset
    @(posedge clk);
    rst_n = 0; @(posedge clk); @(negedge clk);
    if (count == 0) begin p++; $display("PASS: TC4 reset clears count"); end
    else begin f++; $display("FAIL: TC4 reset"); end
    rst_n = 1;

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule`
      };
    }

    if (qId === 'counter2') {
      return {
        solution: `module gray_counter #(
  parameter N = 4
)(
  input  logic         clk,
  input  logic         rst_n,
  input  logic         enable,
  output logic [N-1:0] gray_count
);
  logic [N-1:0] bin_count;

  // Binary counter
  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      bin_count <= '0;
    end else if (enable) begin
      bin_count <= bin_count + 1;
    end
  end

  // Combinational Gray conversion: gray = bin ^ (bin >> 1)
  assign gray_count = bin_count ^ (bin_count >> 1);
endmodule`,
        testbench: `module tb;
  localparam N = 4;

  logic        clk;
  logic        rst_n;
  logic        enable;
  logic [N-1:0] gray_count;
  logic [N-1:0] prev_gray;
  int          p = 0, f = 0;

  initial clk = 0;

  always #5 clk = ~clk;
  gray_counter #(.N(N)) dut (.*);

  function automatic int hamming(logic [N-1:0] a, logic [N-1:0] b);
    return $countones(a ^ b);
  endfunction

  initial begin
    rst_n  = 0;
    enable = 0;
    @(posedge clk); @(posedge clk);
    rst_n = 1; @(posedge clk); #1;

    // TC5 — Reset gives gray=0
    if (gray_count == 0) begin p++; $display("PASS: TC5 reset gray=0"); end
    else begin f++; $display("FAIL: TC5 gray=%b", gray_count); end

    // TC1 — Verify first few Gray values
    enable = 1;
    begin
      logic [3:0] expected [8];
      logic ok;
      expected = '{4'b0001, 4'b0011, 4'b0010, 4'b0110,
                   4'b0111, 4'b0101, 4'b0100, 4'b1100};
      ok = 1;
      for (int i = 0; i < 8; i++) begin
        @(posedge clk); #1;
        if (gray_count != expected[i]) ok = 0;
      end
      if (ok) begin p++; $display("PASS: TC1 Gray sequence correct"); end
      else begin f++; $display("FAIL: TC1 Gray sequence"); end
    end

    // TC2 — Hamming distance = 1 for all transitions (full cycle)
    enable = 0;
    rst_n  = 0; @(posedge clk); @(posedge clk); rst_n = 1; enable = 1;
    @(posedge clk); #1;
    begin
      logic hd_ok = 1;
      logic [N-1:0] prev;
      prev = gray_count;
      repeat (15) begin
        @(posedge clk); #1;
        if (hamming(prev, gray_count) != 1) hd_ok = 0;
        prev = gray_count;
      end
      // Wrap: check last→first
      @(posedge clk); #1;
      if (hamming(prev, gray_count) != 1) hd_ok = 0;
      if (hd_ok) begin p++; $display("PASS: TC2 Hamming distance=1 always"); end
      else begin f++; $display("FAIL: TC2 Hamming distance violation"); end
    end

    // TC4 — Enable hold
    begin
      logic [N-1:0] held;
      held   = gray_count;
      enable = 0;
      repeat (3) @(posedge clk);
      #1;
      if (gray_count == held) begin p++; $display("PASS: TC4 hold when disabled"); end
      else begin f++; $display("FAIL: TC4 hold"); end
    end

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule`
      };
    }

    if (qId === 'counter3') {
      return {
        solution: `// Shift register with parallel load, serial shift right, serial_in
module shift_reg #(
  parameter WIDTH = 8
)(
  input  logic              clk,
  input  logic              rst_n,
  input  logic              load,
  input  logic              shift,
  input  logic [WIDTH-1:0]  data_in,
  input  logic              serial_in,
  output logic [WIDTH-1:0]  parallel_out,
  output logic              serial_out
);
  logic [WIDTH-1:0] reg_val;

  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      reg_val <= '0;
    end else if (load) begin
      reg_val <= data_in;         // Load has priority
    end else if (shift) begin
      reg_val <= {serial_in, reg_val[WIDTH-1:1]};  // Shift right
    end
  end

  assign parallel_out = reg_val;

  // Register serial_out so it's stable after posedge
  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) serial_out <= 0;
    else if (shift && !load) serial_out <= reg_val[0];
  end
endmodule`,
        testbench: `module tb;
  localparam WIDTH = 4;

  logic              clk;
  logic              rst_n;
  logic              load;
  logic              shift;
  logic [WIDTH-1:0]  data_in;
  logic              serial_in;
  logic [WIDTH-1:0]  parallel_out;
  logic              serial_out;
  int                p = 0, f = 0;

  initial clk = 0;

  always #5 clk = ~clk;
  shift_reg #(.WIDTH(WIDTH)) dut (.*);

  initial begin
    rst_n     = 0;
    load      = 0;
    shift     = 0;
    data_in   = 0;
    serial_in = 0;
    @(posedge clk); @(posedge clk);
    rst_n = 1;
    @(posedge clk); @(negedge clk);

    // TC1 — Parallel load
    @(negedge clk); load = 1; data_in = 4'b1011;
    @(posedge clk); @(negedge clk); load = 0;
    if (parallel_out == 4'b1011) begin p++; $display("PASS: TC1 parallel load"); end
    else begin f++; $display("FAIL: TC1 load got %b", parallel_out); end

    // TC2 — Shift right 4 times with serial_in=0
    // serial_out sequence from 4'b1011: 1, 1, 0, 1
    begin
      logic [3:0] expected_serial = 4'b1011;   // LSB first
      logic ok = 1;
      @(negedge clk); serial_in = 0; shift = 1;
      for (int i = 0; i < 4; i++) begin
        @(posedge clk); @(negedge clk);
        if (serial_out != expected_serial[i]) ok = 0;
      end
      @(negedge clk); shift = 0;
      if (ok) begin p++; $display("PASS: TC2 serial out sequence"); end
      else begin f++; $display("FAIL: TC2 serial out"); end
    end

    // TC3 — Load priority over shift
    @(negedge clk); load = 1; shift = 1; data_in = 4'b1100;
    @(posedge clk); @(negedge clk); load = 0; shift = 0;
    if (parallel_out == 4'b1100) begin p++; $display("PASS: TC3 load priority"); end
    else begin f++; $display("FAIL: TC3 load priority got %b", parallel_out); end

    // TC4 — Shift with serial_in=1 fills MSB
    @(negedge clk); load = 1; data_in = 4'b0011;
    @(posedge clk); @(negedge clk); load = 0;
    @(negedge clk); serial_in = 1; shift = 1;
    @(posedge clk); @(negedge clk); shift = 0;
    if (parallel_out == 4'b1001) begin p++; $display("PASS: TC4 shift with serial_in=1"); end
    else begin f++; $display("FAIL: TC4 got %b", parallel_out); end

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule`
      };
    }

    if (qId === 'counter4') {
      return {
        solution: `module barrel_shifter #(
  parameter WIDTH = 8
)(
  input  logic [WIDTH-1:0]          data_in,
  input  logic [$clog2(WIDTH)-1:0]  shift_amt,
  input  logic [1:0]                shift_op,   // 00=SLL, 01=SRL, 10=SRA
  output logic [WIDTH-1:0]          data_out
);
  always_comb begin
    case (shift_op)
      2'b00: data_out =   data_in  << shift_amt;          // SLL
      2'b01: data_out =   data_in  >> shift_amt;          // SRL
      2'b10: data_out = $signed(data_in) >>> shift_amt;   // SRA
      default: data_out = data_in;
    endcase
  end
endmodule`,
        testbench: `module tb;
  logic [7:0] data_in, data_out;
  logic [2:0] shift_amt;
  logic [1:0] shift_op;
  int         p = 0, f = 0;

  barrel_shifter #(.WIDTH(8)) dut (.*);

  task automatic check(input string msg, input logic [7:0] exp);
    #1;
    if (data_out === exp) begin
      p++;
      $display("PASS: %s", msg);
    end else begin
      f++;
      $display("FAIL: %s  exp=%h  got=%h", msg, exp, data_out);
    end
  endtask

  initial begin
    // TC1 — SLL: 0x01 << 3 = 0x08
    data_in = 8'h01; shift_amt = 3; shift_op = 2'b00; check("SLL 1<<3",  8'h08);
    // TC2 — SRL: 0x80 >> 1 = 0x40
    data_in = 8'h80; shift_amt = 1; shift_op = 2'b01; check("SRL 0x80>>1", 8'h40);
    // TC3 — SRA: 0x80 >>> 1 = 0xC0 (sign-extend)
    data_in = 8'h80; shift_amt = 1; shift_op = 2'b10; check("SRA 0x80>>>1", 8'hC0);
    // TC4 — Zero shift
    data_in = 8'hAB; shift_amt = 0; shift_op = 2'b00; check("SLL 0 shift", 8'hAB);
    data_in = 8'hAB; shift_amt = 0; shift_op = 2'b01; check("SRL 0 shift", 8'hAB);
    data_in = 8'hAB; shift_amt = 0; shift_op = 2'b10; check("SRA 0 shift", 8'hAB);
    // TC5 — Maximum shift (7)
    data_in = 8'h01; shift_amt = 7; shift_op = 2'b00; check("SLL max",     8'h80);
    data_in = 8'h80; shift_amt = 7; shift_op = 2'b01; check("SRL max",     8'h01);
    data_in = 8'h80; shift_amt = 7; shift_op = 2'b10; check("SRA max neg", 8'hFF);
    data_in = 8'h7F; shift_amt = 7; shift_op = 2'b10; check("SRA max pos", 8'h00);

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule`
      };
    }

    // ─── Pipelining / Datapath ────────────────────────────────────────────────

    if (qId === 'pipe1') {
      return {
        solution: `module pipelined_alu #(
  parameter WIDTH    = 32,
  parameter REG_ADDR = 5
)(
  input  logic                    clk,
  input  logic                    rst_n,
  input  logic                    flush,
  input  logic                    input_valid,
  input  logic [3:0]              opcode,
  input  logic [REG_ADDR-1:0]     src_a_reg,
  input  logic [REG_ADDR-1:0]     src_b_reg,
  input  logic [WIDTH-1:0]        src_a_value,
  input  logic [WIDTH-1:0]        src_b_value,
  input  logic [REG_ADDR-1:0]     dest_reg,
  output logic                    wb_valid,
  output logic [WIDTH-1:0]        wb_result,
  output logic [REG_ADDR-1:0]     wb_dest
);
  logic                    ex_valid;
  logic [WIDTH-1:0]        ex_result;
  logic [REG_ADDR-1:0]     ex_dest;

  logic [WIDTH-1:0]        op_a_eff, op_b_eff;

  function automatic logic [WIDTH-1:0] alu_op(
    input logic [3:0]       op,
    input logic [WIDTH-1:0] a,
    input logic [WIDTH-1:0] b
  );
    case (op)
      4'd0: alu_op = a + b;
      4'd1: alu_op = a - b;
      4'd2: alu_op = a & b;
      4'd3: alu_op = a | b;
      4'd4: alu_op = a ^ b;
      default: alu_op = '0;
    endcase
  endfunction

  // Simple RAW forwarding for 2-stage pipeline:
  // current EX can bypass from prior cycle result sitting in EX/WB register,
  // and also from WB output if still visible.
  always_comb begin
    op_a_eff = src_a_value;
    op_b_eff = src_b_value;

    if (ex_valid && (src_a_reg == ex_dest) && (src_a_reg != '0)) op_a_eff = ex_result;
    else if (wb_valid && (src_a_reg == wb_dest) && (src_a_reg != '0)) op_a_eff = wb_result;

    if (ex_valid && (src_b_reg == ex_dest) && (src_b_reg != '0)) op_b_eff = ex_result;
    else if (wb_valid && (src_b_reg == wb_dest) && (src_b_reg != '0)) op_b_eff = wb_result;
  end

  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n || flush) begin
      ex_valid  <= 0;
      ex_result <= '0;
      ex_dest   <= '0;
    end else begin
      ex_valid  <= input_valid;
      ex_result <= alu_op(opcode, op_a_eff, op_b_eff);
      ex_dest   <= dest_reg;
    end
  end

  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n || flush) begin
      wb_valid  <= 0;
      wb_result <= '0;
      wb_dest   <= '0;
    end else begin
      wb_valid  <= ex_valid;
      wb_result <= ex_result;
      wb_dest   <= ex_dest;
    end
  end
endmodule`,
        testbench: `module tb;
  logic        clk;
  logic        rst_n;
  logic        flush;
  logic        input_valid;
  logic [3:0]  opcode;
  logic [4:0]  src_a_reg, src_b_reg, dest_reg;
  logic [31:0] src_a_value, src_b_value;
  logic        wb_valid;
  logic [31:0] wb_result;
  logic [4:0]  wb_dest;
  int          p = 0, f = 0;

  initial clk = 0;

  always #5 clk = ~clk;
  pipelined_alu #(.WIDTH(32), .REG_ADDR(5)) dut (.*);

  task automatic issue(
    input logic [3:0]  op,
    input logic [4:0]  sa_reg,
    input logic [4:0]  sb_reg,
    input logic [31:0] sa_val,
    input logic [31:0] sb_val,
    input logic [4:0]  dst
  );
    begin
      input_valid  = 1;
      opcode       = op;
      src_a_reg    = sa_reg;
      src_b_reg    = sb_reg;
      src_a_value  = sa_val;
      src_b_value  = sb_val;
      dest_reg     = dst;
      @(posedge clk);
      #1;
    end
  endtask

  task automatic bubble;
    begin
      input_valid = 0;
      @(posedge clk);
      #1;
    end
  endtask

  initial begin
    rst_n       = 0;
    flush       = 0;
    input_valid = 0;
    opcode      = '0;
    src_a_reg   = '0;
    src_b_reg   = '0;
    src_a_value = '0;
    src_b_value = '0;
    dest_reg    = '0;
    @(posedge clk); @(posedge clk);
    rst_n = 1; @(posedge clk); #1;

    // TC1 — throughput with independent ops
    issue(4'd0, 5'd2, 5'd3, 32'd1, 32'd2, 5'd1);   // R1 = 3
    issue(4'd0, 5'd4, 5'd5, 32'd3, 32'd4, 5'd6);   // R6 = 7
    if (wb_valid && wb_result == 32'd3 && wb_dest == 5'd1) begin p++; $display("PASS: TC1 result1"); end
    else begin f++; $display("FAIL: TC1 result1 valid=%b res=%0d dst=%0d", wb_valid, wb_result, wb_dest); end

    issue(4'd0, 5'd7, 5'd8, 32'd5, 32'd6, 5'd9);   // R9 = 11
    if (wb_valid && wb_result == 32'd7 && wb_dest == 5'd6) begin p++; $display("PASS: TC1 result2"); end
    else begin f++; $display("FAIL: TC1 result2 valid=%b res=%0d dst=%0d", wb_valid, wb_result, wb_dest); end

    bubble;
    if (wb_valid && wb_result == 32'd11 && wb_dest == 5'd9) begin p++; $display("PASS: TC1 result3"); end
    else begin f++; $display("FAIL: TC1 result3 valid=%b res=%0d dst=%0d", wb_valid, wb_result, wb_dest); end

    // TC2 — RAW forwarding: R1=A+B, then R4=R1+C without stall
    issue(4'd0, 5'd2, 5'd3, 32'd10, 32'd3, 5'd1);  // R1 = 13
    issue(4'd0, 5'd1, 5'd5, 32'd0,  32'd5, 5'd4);  // should forward R1 => 18
    if (wb_valid && wb_result == 32'd13 && wb_dest == 5'd1) begin p++; $display("PASS: TC2 producer result"); end
    else begin f++; $display("FAIL: TC2 producer"); end

    bubble;
    if (wb_valid && wb_result == 32'd18 && wb_dest == 5'd4) begin p++; $display("PASS: TC2 forwarded consumer result"); end
    else begin f++; $display("FAIL: TC2 forwarded consumer got res=%0d dst=%0d", wb_result, wb_dest); end

    // TC3 — dependent chain R1 -> R2 -> R3
    issue(4'd0, 5'd2, 5'd3, 32'd4, 32'd6, 5'd1);   // R1 = 10
    issue(4'd0, 5'd1, 5'd4, 32'd0, 32'd1, 5'd2);   // R2 = 11
    if (!(wb_valid && wb_result == 32'd10 && wb_dest == 5'd1)) begin
      f++; $display("FAIL: TC3 stage1");
    end
    issue(4'd0, 5'd2, 5'd5, 32'd0, 32'd2, 5'd3);   // R3 = 13
    if (!(wb_valid && wb_result == 32'd11 && wb_dest == 5'd2)) begin
      f++; $display("FAIL: TC3 stage2");
    end
    bubble;
    if (wb_valid && wb_result == 32'd13 && wb_dest == 5'd3) begin p++; $display("PASS: TC3 dependency chain"); end
    else begin f++; $display("FAIL: TC3 chain got res=%0d dst=%0d", wb_result, wb_dest); end

    // TC4 — flush kills in-flight result
    issue(4'd0, 5'd2, 5'd3, 32'd100, 32'd200, 5'd7);
    flush = 1;
    bubble;
    flush = 0;
    if (!wb_valid) begin p++; $display("PASS: TC4 flush clears pipeline"); end
    else begin f++; $display("FAIL: TC4 wb_valid remained high"); end

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule`
      };
    }

    if (qId === 'pipe2') {
      return {
        solution: `module pipe_stage_reg #(
  parameter DATA_WIDTH = 32,
  parameter CTRL_WIDTH = 8
)(
  input  logic                  clk,
  input  logic                  rst_n,
  input  logic                  stall,
  input  logic                  flush,
  input  logic [DATA_WIDTH-1:0] data_in,
  input  logic [CTRL_WIDTH-1:0] ctrl_in,
  input  logic                  valid_in,
  output logic [DATA_WIDTH-1:0] data_out,
  output logic [CTRL_WIDTH-1:0] ctrl_out,
  output logic                  valid_out
);
  // Flush takes priority over stall
  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      data_out  <= '0;
      ctrl_out  <= '0;
      valid_out <= 0;
    end else if (flush) begin
      // Inject bubble (NOP)
      data_out  <= '0;
      ctrl_out  <= '0;
      valid_out <= 0;
    end else if (!stall) begin
      // Normal propagation
      data_out  <= data_in;
      ctrl_out  <= ctrl_in;
      valid_out <= valid_in;
    end
    // Stall: hold all values (no else needed — registers retain value)
  end
endmodule`,
        testbench: `module tb;
  logic clk, rst_n, stall, flush, valid_in, valid_out;
  logic [31:0] data_in, data_out;
  logic [7:0] ctrl_in, ctrl_out;
  int p=0, f=0;
  initial clk=0; always #5 clk=~clk;
  pipe_stage_reg #(.DATA_WIDTH(32), .CTRL_WIDTH(8)) dut(.*);
  initial begin
    rst_n=0; stall=0; flush=0; data_in=0; ctrl_in=0; valid_in=0;
    @(posedge clk); @(posedge clk); rst_n=1;
    @(posedge clk); @(negedge clk);

    // TC3: pass-through
    @(negedge clk); data_in=32'hCAFE_BABE; ctrl_in=8'hAA; valid_in=1;
    @(posedge clk); @(negedge clk);
    if (data_out==32'hCAFE_BABE && valid_out) begin p++; $display("PASS: TC3"); end
    else begin f++; $display("FAIL: TC3 data=%h valid=%b", data_out, valid_out); end

    // TC1: immediately assert stall (keep valid_in=1 irrelevant since stall blocks)
    stall=1; valid_in=0; data_in=0;
    repeat(3) @(posedge clk);
    @(negedge clk);
    if (data_out==32'hCAFE_BABE && valid_out) begin p++; $display("PASS: TC1 stall"); end
    else begin f++; $display("FAIL: TC1 data=%h valid=%b", data_out, valid_out); end

    // TC2: flush clears
    stall=0; flush=1;
    @(posedge clk); @(negedge clk); flush=0;
    if (!valid_out) begin p++; $display("PASS: TC2 flush"); end
    else begin f++; $display("FAIL: TC2 valid=%b", valid_out); end

    // TC4: flush wins over stall
    @(negedge clk); data_in=32'hBBBB; valid_in=1;
    @(posedge clk); @(negedge clk); valid_in=0;
    stall=1; flush=1;
    @(posedge clk); @(negedge clk); stall=0; flush=0;
    if (!valid_out) begin p++; $display("PASS: TC4"); end
    else begin f++; $display("FAIL: TC4"); end

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule
`
      };
    }

    if (qId === 'pipe3') {
      return {
        solution: `// LSB-first priority encoder: index 0 = highest priority
module priority_encoder #(
  parameter N = 8
)(
  input  logic [N-1:0]           request,
  output logic [$clog2(N)-1:0]   index,
  output logic                    valid
);
  always_comb begin
    index = '0;
    valid = 0;
    for (int i = 0; i < N; i++) begin
      if (request[i]) begin
        index = i[$clog2(N)-1:0];
        valid = 1;
        break;
      end
    end
  end
endmodule`,
        testbench: `module tb;
  localparam N = 8;

  logic [N-1:0]  request;
  logic [2:0]    index;
  logic          valid;
  int            p = 0, f = 0;

  priority_encoder #(.N(N)) dut (.*);

  task automatic check(
    input string       msg,
    input logic [2:0]  exp_idx,
    input logic        exp_valid
  );
    #1;
    if (index === exp_idx && valid === exp_valid) begin
      p++;
      $display("PASS: %s", msg);
    end else begin
      f++;
      $display("FAIL: %s  exp idx=%0d valid=%b  got idx=%0d valid=%b",
               msg, exp_idx, exp_valid, index, valid);
    end
  endtask

  initial begin
    // TC1 — Single request: bit 3 set
    request = 8'b0000_1000; check("TC1 single req bit3", 3, 1);

    // TC2 — Multiple requests LSB-first: bits 2,3,5 set → index=2
    request = 8'b0010_1100; check("TC2 LSB priority bits 2,3,5 → 2", 2, 1);

    // TC4 — All zeros → valid=0
    request = 8'b0000_0000; check("TC4 all zeros valid=0", 0, 0);

    // TC5 — All ones → LSB wins → index=0
    request = 8'b1111_1111; check("TC5 all ones → index=0", 0, 1);

    // Extra — Only MSB set
    request = 8'b1000_0000; check("MSB only → index=7", 7, 1);

    // Extra — Bit 1 only
    request = 8'b0000_0010; check("Bit 1 only → index=1", 1, 1);

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule`
      };
    }

    // ─── Arithmetic ───────────────────────────────────────────────────────────

    if (qId === 'arith1') {
      return {
        solution: `module adder_sub #(
  parameter WIDTH = 32
)(
  input  logic [WIDTH-1:0] a,
  input  logic [WIDTH-1:0] b,
  input  logic             sub,
  output logic [WIDTH-1:0] result,
  output logic             carry_out,
  output logic             overflow
);
  logic [WIDTH-1:0] b_eff;
  logic [WIDTH:0]   sum_ext;

  always_comb begin
    b_eff     = sub ? ~b : b;
    sum_ext   = {1'b0, a} + {1'b0, b_eff} + sub;
    result    = sum_ext[WIDTH-1:0];
    carry_out = sum_ext[WIDTH];

    if (!sub) begin
      overflow = (a[WIDTH-1] == b[WIDTH-1]) &&
                 (result[WIDTH-1] != a[WIDTH-1]);
    end else begin
      overflow = (a[WIDTH-1] != b[WIDTH-1]) &&
                 (result[WIDTH-1] != a[WIDTH-1]);
    end
  end
endmodule`,
        testbench: `module tb;
  logic [31:0] a, b, result;
  logic        sub, carry_out, overflow;
  int          p = 0, f = 0;

  adder_sub #(.WIDTH(32)) dut (.*);

  task automatic check(
    input string       msg,
    input logic [31:0] ia,
    input logic [31:0] ib,
    input logic        is_sub,
    input logic [31:0] exp_result,
    input logic        exp_carry,
    input logic        exp_overflow
  );
    begin
      a = ia; b = ib; sub = is_sub; #1;
      if (result === exp_result && carry_out === exp_carry && overflow === exp_overflow) begin
        p++;
        $display("PASS: %s", msg);
      end else begin
        f++;
        $display("FAIL: %s result=%h carry=%b ovf=%b", msg, result, carry_out, overflow);
      end
    end
  endtask

  initial begin
    check("TC1 add 7 + 5",                32'd7,          32'd5,          1'b0, 32'd12,         1'b0, 1'b0);
    check("TC2 sub 20 - 3",               32'd20,         32'd3,          1'b1, 32'd17,         1'b1, 1'b0);
    check("TC3 add carry-out",            32'hFFFF_FFFF,  32'd1,          1'b0, 32'h0000_0000,  1'b1, 1'b0);
    check("TC4 signed add overflow",      32'h7FFF_FFFF,  32'd1,          1'b0, 32'h8000_0000,  1'b0, 1'b1);
    check("TC5 signed sub overflow",      32'h8000_0000,  32'd1,          1'b1, 32'h7FFF_FFFF,  1'b1, 1'b1);
    check("TC6 sub borrow example",       32'd3,          32'd5,          1'b1, 32'hFFFF_FFFE,  1'b0, 1'b0);

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule`
      };
    }

    if (qId === 'arith2') {
      return {
        solution: `module seq_multiplier #(
  parameter WIDTH = 16
)(
  input  logic              clk,
  input  logic              rst_n,
  input  logic              start,
  input  logic [WIDTH-1:0]  a,
  input  logic [WIDTH-1:0]  b,
  output logic [2*WIDTH-1:0] product,
  output logic              done,
  output logic              busy
);
  logic [2*WIDTH-1:0]    acc, b_shifted;
  logic [WIDTH-1:0]      a_reg;
  logic [$clog2(WIDTH):0] cnt;

  typedef enum logic [1:0] {
    IDLE,
    CALC,
    FIN
  } st_t;

  st_t st;

  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      st      <= IDLE;
      done    <= 0;
      busy    <= 0;
      product <= '0;
    end else begin
      done <= 0;
      case (st)
        IDLE: begin
          if (start) begin
            acc       <= '0;
            a_reg     <= a;
            b_shifted <= {{WIDTH{1'b0}}, b};
            cnt       <= '0;
            busy      <= 1;
            st        <= CALC;
          end
        end
        CALC: begin
          if (a_reg[0]) acc <= acc + b_shifted;
          a_reg     <= a_reg     >> 1;
          b_shifted <= b_shifted << 1;
          cnt       <= cnt + 1;
          if (cnt == WIDTH - 1) st <= FIN;
        end
        FIN: begin
          product <= acc;
          done    <= 1;
          busy    <= 0;
          st      <= IDLE;
        end
      endcase
    end
  end
endmodule`,
        testbench: `module tb;
  logic        clk;
  logic        rst_n;
  logic        start, done, busy;
  logic [15:0] a, b;
  logic [31:0] product;
  int          p = 0, f = 0;

  initial clk = 0;

  always #5 clk = ~clk;
  seq_multiplier #(.WIDTH(16)) dut (.*);

  task automatic check(input string msg, input logic [31:0] exp);
    start = 1; @(posedge clk); start = 0;
    wait (done);
    @(negedge clk);
    if (product === exp) begin
      p++;
      $display("PASS: %s", msg);
    end else begin
      f++;
      $display("FAIL: %s  exp=%0d  got=%0d", msg, exp, product);
    end
  endtask

  initial begin
    rst_n = 0; start = 0;
    @(posedge clk); @(posedge clk);
    rst_n = 1; @(posedge clk);

    a = 3;   b = 7;   check("3 * 7 = 21",          21);
    a = 0;   b = 255; check("0 * 255 = 0",           0);
    a = 255; b = 255; check("255 * 255 = 65025",  65025);
    a = 16;  b = 4;   check("16 * 4 = 64",           64);

    // TC4 — Back-to-back
    a = 5; b = 4;
    start = 1; @(posedge clk); start = 0;
    wait (done); @(posedge clk);
    a = 6; b = 3;
    start = 1; @(posedge clk); start = 0;
    wait (done);
    @(negedge clk);
    if (product == 18) begin p++; $display("PASS: TC4 back-to-back second result"); end
    else begin f++; $display("FAIL: TC4 got %0d", product); end

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule`
      };
    }

    if (qId === 'arith3') {
      return {
        solution: `module seq_divider #(
  parameter WIDTH = 16
)(
  input  logic              clk,
  input  logic              rst_n,
  input  logic              start,
  input  logic [WIDTH-1:0]  dividend,
  input  logic [WIDTH-1:0]  divisor,
  output logic [WIDTH-1:0]  quotient,
  output logic [WIDTH-1:0]  remainder,
  output logic              done,
  output logic              busy,
  output logic              div_by_zero
);
  logic [WIDTH-1:0]        q_reg, div_reg;
  logic [WIDTH:0]          r_reg;
  logic [$clog2(WIDTH):0]  cnt;

  typedef enum logic [1:0] { IDLE, CALC, FIN } st_t;
  st_t st;

  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      st          <= IDLE;
      q_reg       <= '0;
      div_reg     <= '0;
      r_reg       <= '0;
      quotient    <= '0;
      remainder   <= '0;
      cnt         <= '0;
      done        <= 0;
      busy        <= 0;
      div_by_zero <= 0;
    end else begin
      done        <= 0;
      div_by_zero <= 0;

      case (st)
        IDLE: begin
          busy <= 0;
          if (start) begin
            if (divisor == 0) begin
              quotient    <= '1;
              remainder   <= dividend;
              div_by_zero <= 1;
              done        <= 1;
            end else begin
              q_reg   <= dividend;
              div_reg <= divisor;
              r_reg   <= '0;
              cnt     <= '0;
              busy    <= 1;
              st      <= CALC;
            end
          end
        end

        CALC: begin
          logic [WIDTH:0]       r_next;
          logic [WIDTH-1:0]     q_next;

          r_next = {r_reg[WIDTH-1:0], q_reg[WIDTH-1]};
          q_next = {q_reg[WIDTH-2:0], 1'b0};

          if (r_next >= {1'b0, div_reg}) begin
            r_next   = r_next - {1'b0, div_reg};
            q_next[0] = 1'b1;
          end

          r_reg <= r_next;
          q_reg <= q_next;
          cnt   <= cnt + 1;

          if (cnt == WIDTH - 1) begin
            st <= FIN;
          end
        end

        FIN: begin
          quotient  <= q_reg;
          remainder <= r_reg[WIDTH-1:0];
          done      <= 1;
          busy      <= 0;
          st        <= IDLE;
        end
      endcase
    end
  end
endmodule`,
        testbench: `module tb;
  logic        clk;
  logic        rst_n;
  logic        start, done, busy, div_by_zero;
  logic [15:0] dividend, divisor, quotient, remainder;
  int          p = 0, f = 0;

  initial clk = 0;

  always #5 clk = ~clk;
  seq_divider #(.WIDTH(16)) dut (.*);

  task automatic check(input string msg, input logic [15:0] eq, input logic [15:0] er);
    start = 1; @(posedge clk); start = 0;
    wait (done);
    @(negedge clk);
    if (quotient === eq && remainder === er) begin
      p++;
      $display("PASS: %s", msg);
    end else begin
      f++;
      $display("FAIL: %s  q=%0d r=%0d", msg, quotient, remainder);
    end
  endtask

  initial begin
    rst_n = 0; start = 0;
    @(posedge clk); @(posedge clk);
    rst_n = 1; @(posedge clk);

    dividend = 20;  divisor = 5;  check("20 / 5  = q=4, r=0",    4, 0);
    dividend = 22;  divisor = 5;  check("22 / 5  = q=4, r=2",    4, 2);
    dividend = 3;   divisor = 10; check("3 / 10  = q=0, r=3",    0, 3);
    dividend = 255; divisor = 1;  check("255 / 1 = q=255, r=0", 255, 0);

    // TC3 — Divide by zero
    dividend = 7; divisor = 0;
    start = 1; @(posedge clk); start = 0;
    wait (done); @(negedge clk);
    if (div_by_zero) begin p++; $display("PASS: TC3 div_by_zero flag"); end
    else begin f++; $display("FAIL: TC3 div_by_zero"); end

    // TC6 — Back-to-back
    dividend = 20; divisor = 5;
    start = 1; @(posedge clk); start = 0; wait(done); @(posedge clk);
    dividend = 22; divisor = 5;
    start = 1; @(posedge clk); start = 0; wait(done); @(negedge clk);
    if (quotient == 4 && remainder == 2) begin p++; $display("PASS: TC6 back-to-back"); end
    else begin f++; $display("FAIL: TC6"); end

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule`
      };
    }

    // ─── Interfaces / Bus / AXI / APB ─────────────────────────────────────────

    if (qId === 'bus1') {
      return {
        solution: `module gpio_mm #(
  parameter GPIO_WIDTH = 8
)(
  input  logic                      clk,
  input  logic                      rst_n,
  // Memory-mapped bus
  input  logic [3:0]                address,
  input  logic [GPIO_WIDTH-1:0]     write_data,
  input  logic                      write_en,
  input  logic                      read_en,
  output logic [GPIO_WIDTH-1:0]     read_data,
  // GPIO pins
  inout  wire  [GPIO_WIDTH-1:0]     gpio_pins
);
  localparam ADDR_OUT = 4'h0;
  localparam ADDR_IN  = 4'h4;
  localparam ADDR_DIR = 4'h8;

  logic [GPIO_WIDTH-1:0] gpio_out_reg;
  logic [GPIO_WIDTH-1:0] gpio_dir_reg;

  // Tri-state drive: dir=1 → output, dir=0 → high-Z
  genvar i;
  generate
    for (i = 0; i < GPIO_WIDTH; i++) begin : tristate
      assign gpio_pins[i] = gpio_dir_reg[i] ? gpio_out_reg[i] : 1'bz;
    end
  endgenerate

  // Write decode
  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      gpio_out_reg <= '0;
      gpio_dir_reg <= '0;
    end else if (write_en) begin
      case (address)
        ADDR_OUT: gpio_out_reg <= write_data;
        ADDR_DIR: gpio_dir_reg <= write_data;
        default: ;  // Ignore invalid addresses
      endcase
    end
  end

  // Read decode (combinational)
  always_comb begin
    case (address)
      ADDR_OUT: read_data = gpio_out_reg;
      ADDR_IN:  read_data = gpio_pins;
      ADDR_DIR: read_data = gpio_dir_reg;
      default:  read_data = '0;
    endcase
  end
endmodule`,
        testbench: `module tb;
  logic       clk;
  logic       rst_n;
  logic [3:0] address;
  logic [7:0] write_data;
  logic       write_en;
  logic       read_en;
  logic [7:0] read_data;
  wire  [7:0] gpio_pins;
  logic [7:0] pin_drive;
  logic       pin_en;
  int         p = 0, f = 0;

  initial clk = 0;

  always #5 clk = ~clk;
  gpio_mm #(.GPIO_WIDTH(8)) dut (.*);

  // Testbench drives gpio_pins only when input mode
  assign gpio_pins = pin_en ? pin_drive : 8'hzz;

  initial begin
    rst_n      = 0;
    write_en   = 0;
    read_en    = 0;
    address    = 0;
    write_data = 0;
    pin_drive  = 0;
    pin_en     = 0;
    @(posedge clk); @(posedge clk);
    rst_n = 1; @(posedge clk);

    // TC1 — Write then readback GPIO_OUT
    address = 4'h0; write_data = 8'h5A; write_en = 1;
    @(posedge clk); write_en = 0;
    read_en = 1; @(negedge clk);
    if (read_data == 8'h5A) begin p++; $display("PASS: TC1 readback GPIO_OUT"); end
    else begin f++; $display("FAIL: TC1 got %h", read_data); end
    read_en = 0;

    // TC2 — Direction control: set all outputs
    address = 4'h8; write_data = 8'hFF; write_en = 1;
    @(posedge clk); write_en = 0;
    address = 4'h0; write_data = 8'hAA; write_en = 1;
    @(posedge clk); write_en = 0; @(negedge clk);
    if (dut.gpio_out_reg == 8'hAA) begin p++; $display("PASS: TC2 output driven 0xAA"); end
    else begin f++; $display("FAIL: TC2 gpio_pins=%h", gpio_pins); end

    // TC3 — Input sampling
    address = 4'h8; write_data = 8'h00; write_en = 1;
    @(posedge clk); write_en = 0;
    pin_drive = 8'h33; pin_en = 1;
    address  = 4'h4; read_en = 1; @(negedge clk);
    if (read_data == 8'h33) begin p++; $display("PASS: TC3 input sampling"); end
    else begin f++; $display("FAIL: TC3 GPIO_IN got %h", read_data); end
    pin_en  = 0;
    read_en = 0;

    // TC5 — Invalid address returns 0
    address = 4'hC; read_en = 1; @(negedge clk);
    if (read_data == 0) begin p++; $display("PASS: TC5 invalid address returns 0"); end
    else begin f++; $display("FAIL: TC5 got %h", read_data); end
    read_en = 0;

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule`
      };
    }

    if (qId === 'bus2') {
      return {
        solution: `module apb_slave #(
  parameter DATA_WIDTH = 32,
  parameter ADDR_WIDTH = 8
)(
  input  logic                      PCLK,
  input  logic                      PRESETn,
  // APB signals
  input  logic                      PSEL,
  input  logic                      PENABLE,
  input  logic                      PWRITE,
  input  logic [ADDR_WIDTH-1:0]     PADDR,
  input  logic [DATA_WIDTH-1:0]     PWDATA,
  output logic [DATA_WIDTH-1:0]     PRDATA,
  output logic                      PREADY,
  output logic                      PSLVERR
);
  localparam ADDR_REG0 = 8'h00;
  localparam ADDR_REG1 = 8'h04;
  localparam ADDR_REG2 = 8'h08;

  logic [DATA_WIDTH-1:0] reg0;
  logic [DATA_WIDTH-1:0] reg1;   // Read-only (hardcoded for demo)
  logic                   addr_valid;

  assign addr_valid = (PADDR == ADDR_REG0) || (PADDR == ADDR_REG1) || (PADDR == ADDR_REG2);

  // Zero-wait-state: always ready
  assign PREADY  = 1'b1;
  assign PSLVERR = PSEL && PENABLE && !addr_valid;

  // Transfer complete condition: PSEL && PENABLE && PREADY
  // Write
  always_ff @(posedge PCLK or negedge PRESETn) begin
    if (!PRESETn) begin
      reg0 <= '0;
    end else if (PSEL && PENABLE && PREADY && PWRITE) begin
      case (PADDR)
        ADDR_REG0: reg0 <= PWDATA;
        default: ;
      endcase
    end
  end

  // Read (combinational)
  always_comb begin
    PRDATA = '0;
    if (!PWRITE) begin
      case (PADDR)
        ADDR_REG0: PRDATA = reg0;
        ADDR_REG1: PRDATA = 32'hDEAD_C0DE;   // Hardcoded read-only
        ADDR_REG2: PRDATA = 32'hCAFE_BABE;
        default:   PRDATA = '0;
      endcase
    end
  end
endmodule`,
        testbench: `module tb;
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
endmodule`
      };
    }

    if (qId === 'bus3') {
      return {
        solution: `module axi_lite_single_reg (
  input  logic        ACLK,
  input  logic        ARESETn,
  // Write address channel
  input  logic        AWVALID,
  output logic        AWREADY,
  input  logic [31:0] AWADDR,
  // Write data channel
  input  logic        WVALID,
  output logic        WREADY,
  input  logic [31:0] WDATA,
  input  logic [3:0]  WSTRB,
  // Write response channel
  output logic        BVALID,
  input  logic        BREADY,
  output logic [1:0]  BRESP,
  // Read address channel
  input  logic        ARVALID,
  output logic        ARREADY,
  input  logic [31:0] ARADDR,
  // Read data channel
  output logic        RVALID,
  input  logic        RREADY,
  output logic [31:0] RDATA,
  output logic [1:0]  RRESP
);
  logic [31:0] reg_data;

  // Latch flags for AW and W
  logic aw_done, w_done;
  logic [31:0] aw_addr_lat, w_data_lat;

  // Accept AW immediately when no pending write
  assign AWREADY = !aw_done;
  assign WREADY  = !w_done;

  // AW latch
  always_ff @(posedge ACLK or negedge ARESETn) begin
    if (!ARESETn) begin
      aw_done     <= 0;
      aw_addr_lat <= '0;
    end else begin
      if (AWVALID && AWREADY) begin
        aw_done     <= 1;
        aw_addr_lat <= AWADDR;
      end
      if (BVALID && BREADY) aw_done <= 0;
    end
  end

  // W latch
  always_ff @(posedge ACLK or negedge ARESETn) begin
    if (!ARESETn) begin
      w_done    <= 0;
      w_data_lat <= '0;
    end else begin
      if (WVALID && WREADY) begin
        w_done     <= 1;
        w_data_lat <= WDATA;
      end
      if (BVALID && BREADY) w_done <= 0;
    end
  end

  // Register write when both AW and W received
  always_ff @(posedge ACLK or negedge ARESETn) begin
    if (!ARESETn) begin
      reg_data <= '0;
    end else if (aw_done && w_done && !(BVALID && !BREADY)) begin
      if (aw_addr_lat == 32'h00) reg_data <= w_data_lat;
    end
  end

  // Write response
  always_ff @(posedge ACLK or negedge ARESETn) begin
    if (!ARESETn) begin
      BVALID <= 0;
      BRESP  <= 2'b00;
    end else begin
      if (aw_done && w_done && !BVALID) begin
        BVALID <= 1;
        BRESP  <= 2'b00;  // OKAY
      end else if (BVALID && BREADY) begin
        BVALID <= 0;
      end
    end
  end

  // AR acceptance
  assign ARREADY = !RVALID;

  // Read response
  always_ff @(posedge ACLK or negedge ARESETn) begin
    if (!ARESETn) begin
      RVALID <= 0;
      RDATA  <= '0;
      RRESP  <= 2'b00;
    end else begin
      if (ARVALID && ARREADY) begin
        RVALID <= 1;
        RDATA  <= (ARADDR == 32'h00) ? reg_data : '0;
        RRESP  <= 2'b00;
      end else if (RVALID && RREADY) begin
        RVALID <= 0;
      end
    end
  end
endmodule`,
        testbench: `module tb;
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
endmodule`
      };
    }

    if (qId === 'bus4') {
      return {
        solution: `module axi_gpio #(
  parameter GPIO_WIDTH = 32
)(
  input  logic                    ACLK,
  input  logic                    ARESETn,
  // AXI-Lite write
  input  logic                    AWVALID, output logic AWREADY,
  input  logic [31:0]             AWADDR,
  input  logic                    WVALID,  output logic WREADY,
  input  logic [GPIO_WIDTH-1:0]   WDATA,
  input  logic [3:0]              WSTRB,
  output logic                    BVALID,  input  logic BREADY,
  output logic [1:0]              BRESP,
  // AXI-Lite read
  input  logic                    ARVALID, output logic ARREADY,
  input  logic [31:0]             ARADDR,
  output logic                    RVALID,  input  logic RREADY,
  output logic [GPIO_WIDTH-1:0]   RDATA,
  output logic [1:0]              RRESP,
  // GPIO
  input  logic [GPIO_WIDTH-1:0]   gpio_in,
  output logic [GPIO_WIDTH-1:0]   gpio_out
);
  localparam ADDR_OUT = 32'h00;
  localparam ADDR_IN  = 32'h04;

  logic aw_done, w_done;
  logic [31:0] aw_addr_lat;
  logic [GPIO_WIDTH-1:0] w_data_lat;
  logic write_err;

  assign AWREADY = !aw_done;
  assign WREADY  = !w_done;
  assign ARREADY = !RVALID;

  always_ff @(posedge ACLK or negedge ARESETn) begin
    if (!ARESETn) begin
      aw_done <= 0; aw_addr_lat <= '0;
    end else begin
      if (AWVALID && AWREADY) begin aw_done <= 1; aw_addr_lat <= AWADDR; end
      if (BVALID && BREADY)   aw_done <= 0;
    end
  end

  always_ff @(posedge ACLK or negedge ARESETn) begin
    if (!ARESETn) begin
      w_done <= 0; w_data_lat <= '0;
    end else begin
      if (WVALID && WREADY) begin w_done <= 1; w_data_lat <= WDATA; end
      if (BVALID && BREADY)  w_done <= 0;
    end
  end

  assign write_err = aw_done && (aw_addr_lat == ADDR_IN);

  always_ff @(posedge ACLK or negedge ARESETn) begin
    if (!ARESETn) begin
      gpio_out <= '0;
    end else if (aw_done && w_done && !BVALID) begin
      if (aw_addr_lat == ADDR_OUT) gpio_out <= w_data_lat;
    end
  end

  always_ff @(posedge ACLK or negedge ARESETn) begin
    if (!ARESETn) begin
      BVALID <= 0; BRESP <= 2'b00;
    end else begin
      if (aw_done && w_done && !BVALID) begin
        BVALID <= 1;
        BRESP  <= write_err ? 2'b10 : 2'b00;   // SLVERR or OKAY
      end else if (BVALID && BREADY) begin
        BVALID <= 0;
      end
    end
  end

  always_ff @(posedge ACLK or negedge ARESETn) begin
    if (!ARESETn) begin
      RVALID <= 0; RDATA <= '0; RRESP <= 2'b00;
    end else begin
      if (ARVALID && ARREADY) begin
        RVALID <= 1;
        case (ARADDR)
          ADDR_OUT: begin RDATA <= gpio_out; RRESP <= 2'b00; end
          ADDR_IN:  begin RDATA <= gpio_in;  RRESP <= 2'b00; end
          default:  begin RDATA <= '0;       RRESP <= 2'b10; end
        endcase
      end else if (RVALID && RREADY) begin
        RVALID <= 0;
      end
    end
  end
endmodule`,
        testbench: `module tb;
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
endmodule`
      };
    }

    if (qId === 'bus5') {
      return {
        solution: `module axi_reg_file (
  input  logic        ACLK,
  input  logic        ARESETn,
  // Write
  input  logic        AWVALID, output logic AWREADY, input  logic [31:0] AWADDR,
  input  logic        WVALID,  output logic WREADY,  input  logic [31:0] WDATA, input logic [3:0] WSTRB,
  output logic        BVALID,  input  logic BREADY,  output logic [1:0]  BRESP,
  // Read
  input  logic        ARVALID, output logic ARREADY, input  logic [31:0] ARADDR,
  output logic        RVALID,  input  logic RREADY,  output logic [31:0] RDATA, output logic [1:0] RRESP
);
  logic [31:0] regs [4];  // reg0=0x00, reg1=0x04, reg2=0x08, reg3=0x0C

  logic aw_done, w_done;
  logic [31:0] aw_lat, wd_lat;
  logic        addr_ok_w, addr_ok_r;

  assign AWREADY = !aw_done;
  assign WREADY  = !w_done;
  assign ARREADY = !RVALID;
  assign addr_ok_w = aw_done && (aw_lat inside {32'h00, 32'h04, 32'h08, 32'h0C});

  always_ff @(posedge ACLK or negedge ARESETn) begin
    if (!ARESETn) begin
      aw_done <= 0; aw_lat <= '0;
    end else begin
      if (AWVALID && AWREADY) begin aw_done <= 1; aw_lat <= AWADDR; end
      if (BVALID && BREADY)   aw_done <= 0;
    end
  end

  always_ff @(posedge ACLK or negedge ARESETn) begin
    if (!ARESETn) begin
      w_done <= 0; wd_lat <= '0;
    end else begin
      if (WVALID && WREADY) begin w_done <= 1; wd_lat <= WDATA; end
      if (BVALID && BREADY) w_done <= 0;
    end
  end

  always_ff @(posedge ACLK or negedge ARESETn) begin
    if (!ARESETn) begin
      foreach (regs[i]) regs[i] <= '0;
    end else if (aw_done && w_done && !BVALID && addr_ok_w) begin
      case (aw_lat)
        32'h00: regs[0] <= wd_lat;
        32'h04: regs[1] <= wd_lat;
        32'h08: regs[2] <= wd_lat;
        32'h0C: regs[3] <= wd_lat;
      endcase
    end
  end

  always_ff @(posedge ACLK or negedge ARESETn) begin
    if (!ARESETn) begin
      BVALID <= 0; BRESP <= 2'b00;
    end else begin
      if (aw_done && w_done && !BVALID) begin
        BVALID <= 1;
        BRESP  <= addr_ok_w ? 2'b00 : 2'b10;
      end else if (BVALID && BREADY) begin
        BVALID <= 0;
      end
    end
  end

  always_ff @(posedge ACLK or negedge ARESETn) begin
    if (!ARESETn) begin
      RVALID <= 0; RDATA <= '0; RRESP <= 2'b00;
    end else begin
      if (ARVALID && ARREADY) begin
        RVALID <= 1;
        case (ARADDR)
          32'h00: begin RDATA <= regs[0]; RRESP <= 2'b00; end
          32'h04: begin RDATA <= regs[1]; RRESP <= 2'b00; end
          32'h08: begin RDATA <= regs[2]; RRESP <= 2'b00; end
          32'h0C: begin RDATA <= regs[3]; RRESP <= 2'b00; end
          default: begin RDATA <= '0;    RRESP <= 2'b10; end
        endcase
      end else if (RVALID && RREADY) begin
        RVALID <= 0;
      end
    end
  end
endmodule`,
        testbench: `module tb;
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
endmodule`
      };
    }

    if (qId === 'bus6') {
      return {
        solution: `module axi_read_only_status #(
  parameter VERSION = 32'h0000_0001
)(
  input  logic        ACLK,
  input  logic        ARESETn,
  input  logic [31:0] status_in,
  // Write (always error)
  input  logic        AWVALID, output logic AWREADY, input  logic [31:0] AWADDR,
  input  logic        WVALID,  output logic WREADY,  input  logic [31:0] WDATA, input logic [3:0] WSTRB,
  output logic        BVALID,  input  logic BREADY,  output logic [1:0]  BRESP,
  // Read
  input  logic        ARVALID, output logic ARREADY, input  logic [31:0] ARADDR,
  output logic        RVALID,  input  logic RREADY,  output logic [31:0] RDATA, output logic [1:0] RRESP
);
  logic aw_done, w_done;

  assign AWREADY = !aw_done;
  assign WREADY  = !w_done;
  assign ARREADY = !RVALID;

  always_ff @(posedge ACLK or negedge ARESETn) begin
    if (!ARESETn) begin aw_done <= 0; end
    else begin
      if (AWVALID && AWREADY) aw_done <= 1;
      if (BVALID && BREADY)   aw_done <= 0;
    end
  end

  always_ff @(posedge ACLK or negedge ARESETn) begin
    if (!ARESETn) begin w_done <= 0; end
    else begin
      if (WVALID && WREADY) w_done <= 1;
      if (BVALID && BREADY) w_done <= 0;
    end
  end

  // All writes return SLVERR
  always_ff @(posedge ACLK or negedge ARESETn) begin
    if (!ARESETn) begin BVALID <= 0; BRESP <= 2'b10; end
    else begin
      if (aw_done && w_done && !BVALID) begin BVALID <= 1; BRESP <= 2'b10; end
      else if (BVALID && BREADY) BVALID <= 0;
    end
  end

  always_ff @(posedge ACLK or negedge ARESETn) begin
    if (!ARESETn) begin RVALID <= 0; RDATA <= '0; RRESP <= 2'b00; end
    else begin
      if (ARVALID && ARREADY) begin
        RVALID <= 1;
        case (ARADDR)
          32'h00: begin RDATA <= VERSION;   RRESP <= 2'b00; end
          32'h04: begin RDATA <= status_in; RRESP <= 2'b00; end
          default: begin RDATA <= '0;       RRESP <= 2'b10; end
        endcase
      end else if (RVALID && RREADY) begin
        RVALID <= 0;
      end
    end
  end
endmodule`,
        testbench: `module tb;
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
`
      };
    }

    if (qId === 'bus7') {
      return {
        solution: `module axi_write_only_ctrl (
  input  logic        ACLK,
  input  logic        ARESETn,
  // Write
  input  logic        AWVALID, output logic AWREADY, input  logic [31:0] AWADDR,
  input  logic        WVALID,  output logic WREADY,  input  logic [31:0] WDATA, input logic [3:0] WSTRB,
  output logic        BVALID,  input  logic BREADY,  output logic [1:0]  BRESP,
  // Read (always error)
  input  logic        ARVALID, output logic ARREADY, input  logic [31:0] ARADDR,
  output logic        RVALID,  input  logic RREADY,  output logic [31:0] RDATA, output logic [1:0] RRESP,
  // Control outputs
  output logic        enable_reg,
  output logic [31:0] mode_reg
);
  logic aw_done, w_done;
  logic [31:0] aw_lat, wd_lat;

  assign AWREADY = !aw_done;
  assign WREADY  = !w_done;
  assign ARREADY = !RVALID;

  always_ff @(posedge ACLK or negedge ARESETn) begin
    if (!ARESETn) begin aw_done <= 0; aw_lat <= '0; end
    else begin
      if (AWVALID && AWREADY) begin aw_done <= 1; aw_lat <= AWADDR; end
      if (BVALID && BREADY)   aw_done <= 0;
    end
  end

  always_ff @(posedge ACLK or negedge ARESETn) begin
    if (!ARESETn) begin w_done <= 0; wd_lat <= '0; end
    else begin
      if (WVALID && WREADY) begin w_done <= 1; wd_lat <= WDATA; end
      if (BVALID && BREADY) w_done <= 0;
    end
  end

  always_ff @(posedge ACLK or negedge ARESETn) begin
    if (!ARESETn) begin enable_reg <= 0; mode_reg <= '0; end
    else if (aw_done && w_done && !BVALID) begin
      case (aw_lat)
        32'h00: enable_reg <= wd_lat[0];
        32'h04: mode_reg   <= wd_lat;
        default: ;
      endcase
    end
  end

  always_ff @(posedge ACLK or negedge ARESETn) begin
    if (!ARESETn) begin BVALID <= 0; BRESP <= 2'b00; end
    else begin
      if (aw_done && w_done && !BVALID) begin
        BVALID <= 1;
        BRESP  <= (aw_lat inside {32'h00, 32'h04}) ? 2'b00 : 2'b10;
      end else if (BVALID && BREADY) BVALID <= 0;
    end
  end

  // All reads return SLVERR
  always_ff @(posedge ACLK or negedge ARESETn) begin
    if (!ARESETn) begin RVALID <= 0; RDATA <= '0; RRESP <= 2'b10; end
    else begin
      if (ARVALID && ARREADY) begin RVALID <= 1; RDATA <= '0; RRESP <= 2'b10; end
      else if (RVALID && RREADY) RVALID <= 0;
    end
  end
endmodule`,
        testbench: `module tb;
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
endmodule`
      };
    }

    if (qId === 'bus8') {
      return {
        solution: `module bus_arbiter #(
  parameter NUM_MASTERS = 4
)(
  input  logic                    clk,
  input  logic                    rst_n,
  input  logic [NUM_MASTERS-1:0]  request,
  output logic [NUM_MASTERS-1:0]  grant,
  output logic                    grant_valid
);
  localparam LOG2 = (NUM_MASTERS <= 1) ? 1 : $clog2(NUM_MASTERS);

  logic [LOG2-1:0] last_grant;
  logic [LOG2-1:0] next_grant_idx;
  logic            found_grant;

  always_comb begin
    integer idx;

    grant          = '0;
    next_grant_idx = last_grant;
    found_grant    = 0;
    idx            = 0;

    for (int i = 1; i <= NUM_MASTERS; i++) begin
      idx = (last_grant + i) % NUM_MASTERS;
      if (!found_grant && request[idx]) begin
        grant[idx]      = 1'b1;
        next_grant_idx  = idx[LOG2-1:0];
        found_grant     = 1'b1;
      end
    end
  end

  assign grant_valid = found_grant;

  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      last_grant <= NUM_MASTERS-1;
    end else if (grant_valid) begin
      last_grant <= next_grant_idx;
    end
  end
endmodule`,
        testbench: `module tb;
  logic       clk;
  logic       rst_n;
  logic [3:0] request, grant;
  logic       grant_valid;
  int         p = 0, f = 0;

  initial clk = 0;

  always #5 clk = ~clk;
  bus_arbiter #(.NUM_MASTERS(4)) dut (.*);

  initial begin
    rst_n   = 0;
    request = 0;
    @(posedge clk); @(posedge clk);
    rst_n = 1;
    @(posedge clk); @(negedge clk);

    // TC1 — Fixed contention: masters 1 and 2 requesting
    request = 4'b0110;
    @(posedge clk); @(negedge clk);
    // Starting from last=0, first candidate is 1
    if (grant == 4'b0010) begin p++; $display("PASS: TC1 grant master1"); end
    else begin f++; $display("FAIL: TC1 grant=%b", grant); end

    // TC2 — Round-robin: all requesting
    request = 4'b1111;
    @(posedge clk); @(negedge clk);
    if ($countones(grant) == 1) begin p++; $display("PASS: TC2 one-hot grant"); end
    else begin f++; $display("FAIL: TC2 grant=%b", grant); end

    // Run several more cycles and verify rotation
    begin
      logic [3:0] grants_seen = 0;
      repeat (4) begin
        @(posedge clk); @(negedge clk);
        grants_seen |= grant;
      end
      if (grants_seen == 4'b1111) begin p++; $display("PASS: TC2 all masters served"); end
      else begin f++; $display("FAIL: TC2 not all served seen=%b", grants_seen); end
    end

    // TC4 — Single master
    request = 4'b1000;
    @(posedge clk); @(negedge clk);
    if (grant == 4'b1000) begin p++; $display("PASS: TC4 single master granted"); end
    else begin f++; $display("FAIL: TC4 grant=%b", grant); end

    // TC5 — No requests
    request = 4'b0000;
    @(posedge clk); @(negedge clk);
    if (grant == 4'b0000 && !grant_valid) begin p++; $display("PASS: TC5 no grant when no request"); end
    else begin f++; $display("FAIL: TC5"); end

    // TC6 — One-hot property: verify across several cycles
    request = 4'b1111;
    begin
      logic onehot_ok = 1;
      repeat (8) begin
        @(posedge clk); @(negedge clk);
        if ($countones(grant) > 1) onehot_ok = 0;
      end
      if (onehot_ok) begin p++; $display("PASS: TC6 always one-hot grant"); end
      else begin f++; $display("FAIL: TC6 multi-bit grant"); end
    end

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule`
      };
    }

    // ─── Basic RTL ────────────────────────────────────────────────────────────

    if (qId === 'rtl1') {
      return {
        solution: `module edge_toggle_detect (
  input  logic clk,
  input  logic rst_n,
  input  logic sig_in,
  output logic rise_pulse,
  output logic fall_pulse,
  output logic toggle_pulse
);
  logic sig_prev;

  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      sig_prev     <= 0;
      rise_pulse   <= 0;
      fall_pulse   <= 0;
      toggle_pulse <= 0;
    end else begin
      rise_pulse   <=  sig_in & ~sig_prev;
      fall_pulse   <= ~sig_in &  sig_prev;
      toggle_pulse <=  sig_in ^  sig_prev;
      sig_prev     <= sig_in;
    end
  end
endmodule`,
        testbench: `module tb;
  logic clk;
  logic rst_n;
  logic sig_in;
  logic rise_pulse, fall_pulse, toggle_pulse;
  int   p = 0, f = 0;

  initial clk = 0;

  always #5 clk = ~clk;
  edge_toggle_detect dut (.*);

  initial begin
    rst_n  = 0; sig_in = 0;
    @(posedge clk); @(posedge clk);
    rst_n = 1; @(posedge clk); @(negedge clk);

    // TC — Rising edge 0→1
    @(negedge clk); sig_in = 1;
    @(posedge clk); @(negedge clk);
    if (rise_pulse && !fall_pulse && toggle_pulse) begin
      p++;
      $display("PASS: rising edge detected");
    end else begin
      f++;
      $display("FAIL: rise=%b fall=%b toggle=%b", rise_pulse, fall_pulse, toggle_pulse);
    end

    // Held high — no more pulses
    @(posedge clk); @(negedge clk);
    if (!rise_pulse && !fall_pulse && !toggle_pulse) begin
      p++;
      $display("PASS: no pulse while steady high");
    end else begin
      f++;
      $display("FAIL: spurious pulse while steady");
    end

    // TC — Falling edge 1→0
    @(negedge clk); sig_in = 0;
    @(posedge clk); @(negedge clk);
    if (!rise_pulse && fall_pulse && toggle_pulse) begin
      p++;
      $display("PASS: falling edge detected");
    end else begin
      f++;
      $display("FAIL: fall edge");
    end

    // TC — No toggle: constant low
    @(posedge clk); @(negedge clk);
    if (!rise_pulse && !fall_pulse && !toggle_pulse) begin
      p++;
      $display("PASS: no pulse on constant input");
    end else begin
      f++;
      $display("FAIL: spurious pulse on constant");
    end

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule`
      };
    }

    if (qId === 'rtl2') {
      return {
        solution: `module one_cycle_pulse (
  input  logic clk,
  input  logic rst_n,
  input  logic sig_in,
  output logic onecycle_pulse
);
  logic d1, d2;

  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      d1 <= 0;
      d2 <= 0;
    end else begin
      d1 <= sig_in;
      d2 <= d1;
    end
  end

  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) onecycle_pulse <= 0;
    else        onecycle_pulse <= ~d2 & d1 & ~sig_in;
  end
endmodule`,
        testbench: `module tb;
  logic clk;
  logic rst_n;
  logic sig_in;
  logic onecycle_pulse;
  int   p = 0, f = 0;

  initial clk = 0;

  always #5 clk = ~clk;
  one_cycle_pulse dut (.*);

  initial begin
    rst_n  = 0; sig_in = 0;
    @(posedge clk); @(posedge clk);
    rst_n = 1;

    // TC — Valid: 0,1,0 → should trigger
    @(negedge clk); sig_in = 0;
    @(posedge clk); @(negedge clk); sig_in = 1;
    @(posedge clk); @(negedge clk); sig_in = 0;
    @(posedge clk); @(negedge clk);  // registered: pulse appears here
    if (onecycle_pulse) begin p++; $display("PASS: one-cycle pulse detected"); end
    else begin f++; $display("FAIL: one-cycle pulse not detected"); end

    // TC — Two-cycle high: 0,1,1,0 → should NOT trigger
    sig_in = 0; @(posedge clk);
    sig_in = 1; @(posedge clk);
    sig_in = 1; @(posedge clk);
    sig_in = 0; @(posedge clk); @(negedge clk);
    if (!onecycle_pulse) begin p++; $display("PASS: two-cycle high does not trigger"); end
    else begin f++; $display("FAIL: two-cycle high triggered"); end

    // TC — Stuck high: no trigger
    @(negedge clk); sig_in = 1;
    repeat (4) @(posedge clk);
    @(posedge clk); @(negedge clk);
    if (!onecycle_pulse) begin p++; $display("PASS: stuck high no trigger"); end
    else begin f++; $display("FAIL: stuck high triggered"); end

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule`
      };
    }

    if (qId === 'rtl3') {
      return {
        solution: `// Mealy FSM detecting serial pattern 1,0,1,1,0 (non-overlapping)
module seq_det_10110 (
  input  logic clk,
  input  logic rst_n,
  input  logic bit_in,
  output logic match_pulse
);
  typedef enum logic [2:0] {
    S0,    // No match progress
    S1,    // Seen "1"
    S10,   // Seen "10"
    S101,  // Seen "101"
    S1011  // Seen "1011"
  } state_t;

  state_t state;

  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) state <= S0;
    else case (state)
      S0:    state <= bit_in ? S1    : S0;
      S1:    state <= bit_in ? S1    : S10;
      S10:   state <= bit_in ? S101  : S0;
      S101:  state <= bit_in ? S1011 : S10;
      S1011: state <= bit_in ? S1    : S0;   // "10110" complete on 0
    endcase
  end

  // match on transition S1011 → S0 (received final 0)
  assign match_pulse = (state == S1011) && !bit_in;
endmodule`,
        testbench: `module tb;
  logic clk;
  logic rst_n;
  logic bit_in;
  logic match_pulse;
  int   p = 0, f = 0;

  initial clk = 0;

  always #5 clk = ~clk;
  seq_det_10110 dut (.*);

  task automatic drive_bit(input logic b, output logic pulse_sample);
    bit_in = b;
    #1;                 // Mealy output is valid before state update
    pulse_sample = match_pulse;
    @(posedge clk);
    #1;
  endtask

  logic pulse;

  initial begin
    rst_n = 0; bit_in = 0;
    @(posedge clk); @(posedge clk);
    rst_n = 1;

    // TC1 — exact match 10110
    drive_bit(1, pulse);
    drive_bit(0, pulse);
    drive_bit(1, pulse);
    drive_bit(1, pulse);
    drive_bit(0, pulse);
    if (pulse) begin p++; $display("PASS: TC1 match on 10110"); end
    else begin f++; $display("FAIL: TC1 no match"); end

    // TC2 — wrong pattern should never pulse
    rst_n = 0; @(posedge clk); @(posedge clk); rst_n = 1;
    begin
      logic any_pulse;
      any_pulse = 0;
      drive_bit(1, pulse); any_pulse |= pulse;
      drive_bit(1, pulse); any_pulse |= pulse;
      drive_bit(0, pulse); any_pulse |= pulse;
      drive_bit(0, pulse); any_pulse |= pulse;
      drive_bit(1, pulse); any_pulse |= pulse;
      if (!any_pulse) begin p++; $display("PASS: TC2 no spurious match"); end
      else begin f++; $display("FAIL: TC2 spurious match"); end
    end

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule`
      };
    }

    if (qId === 'rtl4') {
      return {
        solution: `module pattern_in_window #(
  parameter N       = 8,
  parameter K       = 5,
  parameter PATTERN = 5'b10110
)(
  input  logic clk,
  input  logic rst_n,
  input  logic bit_in,
  output logic found
);
  logic [N-1:0] window;

  // Shift register — new bit enters at MSB
  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) window <= '0;
    else        window <= {bit_in, window[N-1:1]};
  end

  // Compare each K-bit slice against PATTERN, OR all matches
  always_comb begin
    found = 0;
    for (int i = 0; i <= N-K; i++) begin
      if (window[i +: K] == PATTERN) found = 1;
    end
  end
endmodule`,
        testbench: `module tb;
  logic clk;
  logic rst_n;
  logic bit_in;
  logic found;
  int   p = 0, f = 0;

  initial clk = 0;

  always #5 clk = ~clk;
  pattern_in_window #(.N(8), .K(5), .PATTERN(5'b10110)) dut (.*);

  task automatic drive(input logic b);
    bit_in = b;
    @(posedge clk);
    #1;
  endtask

  initial begin
    rst_n  = 0; bit_in = 0;
    @(posedge clk); @(posedge clk);
    rst_n = 1;

    // TC — Found: shift in 10110 and verify found=1
    drive(0); drive(1); drive(1); drive(0); drive(1);  // 10110 MSB-first into window
    // Window now has 10110 somewhere — may need more bits
    drive(0); drive(0); drive(0);
    // By now window = 00010110 — pattern at [4:0]
    if (found) begin p++; $display("PASS: pattern found in window"); end
    else begin f++; $display("FAIL: pattern not found"); end

    // TC — Shift out: shift in 8 more zeros to push pattern out
    repeat (8) drive(0);
    if (!found) begin p++; $display("PASS: pattern shifted out, found=0"); end
    else begin f++; $display("FAIL: found still set after shift-out"); end

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule`
      };
    }

    if (qId === 'rtl5') {
      return {
        solution: `module debounce_sync (
  input  logic clk,
  input  logic rst_n,
  input  logic async_in,
  output logic debounced_level,
  output logic debounced_rise_pulse
);
  // 2-flop synchronizer
  logic sync1, sync2;

  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      sync1 <= 0;
      sync2 <= 0;
    end else begin
      sync1 <= async_in;
      sync2 <= sync1;
    end
  end

  // Debounce filter: require 2 consecutive high samples
  logic prev;

  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      prev             <= 0;
      debounced_level  <= 0;
    end else begin
      prev <= sync2;
      // Accept high only after 2 stable samples
      if (sync2 && prev)  debounced_level <= 1;
      if (!sync2 && !prev) debounced_level <= 0;
    end
  end

  // Rising edge of debounced_level
  logic debounced_prev;
  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) debounced_prev <= 0;
    else        debounced_prev <= debounced_level;
  end

  assign debounced_rise_pulse = debounced_level & ~debounced_prev;
endmodule`,
        testbench: `module tb;
  logic clk;
  logic rst_n;
  logic async_in;
  logic debounced_level;
  logic debounced_rise_pulse;
  int   p = 0, f = 0;
  int   rise_count;

  initial clk = 0;

  always #5 clk = ~clk;
  debounce_sync dut (.*);

  initial begin
    rst_n = 0;
    async_in = 0;
    rise_count = 0;
    @(posedge clk); @(posedge clk);
    rst_n = 1;

    // TC1 — one-cycle glitch rejected
    async_in = 1; @(posedge clk);
    async_in = 0; @(posedge clk);
    repeat (3) @(posedge clk);
    #1;
    if (!debounced_level) begin p++; $display("PASS: TC1 glitch rejected"); end
    else begin f++; $display("FAIL: TC1 glitch accepted"); end

    // TC2 — stable high accepted and rise pulse occurs exactly once
    async_in = 1;
    repeat (6) begin
      @(posedge clk); #1;
      if (debounced_rise_pulse) rise_count++;
    end

    if (debounced_level) begin p++; $display("PASS: TC2 stable high accepted"); end
    else begin f++; $display("FAIL: TC2 stable high rejected"); end

    if (rise_count == 1) begin p++; $display("PASS: TC2 rise pulse exactly once"); end
    else begin f++; $display("FAIL: TC2 rise pulse count=%0d", rise_count); end

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule`
      };
    }

    if (qId === 'rtl6') {
      return {
        solution: `module bin_to_gray_counter #(
  parameter W = 4
)(
  input  logic        clk,
  input  logic        rst_n,
  input  logic        enable,
  output logic [W-1:0] bin_count,
  output logic [W-1:0] gray_count
);
  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) bin_count <= '0;
    else if (enable) bin_count <= bin_count + 1;
  end

  assign gray_count = bin_count ^ (bin_count >> 1);
endmodule`,
        testbench: `module tb;
  logic       clk;
  logic       rst_n;
  logic       enable;
  logic [3:0] bin_count, gray_count;
  int         p = 0, f = 0;

  initial clk = 0;

  always #5 clk = ~clk;
  bin_to_gray_counter #(.W(4)) dut (.*);

  initial begin
    rst_n  = 0; enable = 0;
    @(posedge clk); @(posedge clk); rst_n = 1; @(posedge clk); #1;

    // TC — Reset: bin=0, gray=0
    if (bin_count == 0 && gray_count == 0) begin p++; $display("PASS: reset bin=0 gray=0"); end
    else begin f++; $display("FAIL: reset"); end

    // TC — Verify first few gray outputs
    enable = 1;
    begin
      logic [3:0] expected_gray [4] = '{4'b0001, 4'b0011, 4'b0010, 4'b0110};
      logic ok = 1;
      for (int i = 0; i < 4; i++) begin
        @(posedge clk); #1;
        if (gray_count != expected_gray[i]) ok = 0;
      end
      if (ok) begin p++; $display("PASS: first 4 Gray values correct"); end
      else begin f++; $display("FAIL: Gray sequence"); end
    end

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule`
      };
    }

    if (qId === 'rtl7') {
      return {
        solution: `// FSM: 3 states = remainder mod 3 (MSB-first serial input)
module div_by_3 (
  input  logic clk,
  input  logic rst_n,
  input  logic bit_in,
  output logic div_by_3
);
  // States: R0 (rem=0), R1 (rem=1), R2 (rem=2)
  // Transition: new_rem = (2*rem + bit_in) mod 3
  typedef enum logic [1:0] {
    R0,   // remainder 0
    R1,   // remainder 1
    R2    // remainder 2
  } state_t;

  state_t state;

  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) state <= R0;
    else case (state)
      R0: state <= bit_in ? R1 : R0;
      R1: state <= bit_in ? R0 : R2;
      R2: state <= bit_in ? R2 : R1;
    endcase
  end

  assign div_by_3 = (state == R0);
endmodule`,
        testbench: `module tb;
  logic clk;
  logic rst_n;
  logic bit_in;
  logic div_by_3;
  int   p = 0, f = 0;

  initial clk = 0;

  always #5 clk = ~clk;
  div_by_3 dut (.*);

  task automatic drive(input logic b);
    @(negedge clk); @(negedge clk); bit_in = b; @(posedge clk); @(negedge clk);
  endtask

  initial begin
    rst_n  = 0; bit_in = 0;
    @(posedge clk); @(posedge clk); rst_n = 1;

    // 0b110 = 6 → div_by_3
    drive(1); drive(1); drive(0); // 6
    if (div_by_3) begin p++; $display("PASS: 6 divisible by 3"); end
    else begin f++; $display("FAIL: 6 should be divisible"); end

    // Reset and test 0b100 = 4 → not div_by_3
    rst_n = 0; @(posedge clk); @(posedge clk); rst_n = 1;
    drive(1); drive(0); drive(0); // 4
    if (!div_by_3) begin p++; $display("PASS: 4 not divisible by 3"); end
    else begin f++; $display("FAIL: 4 should not be divisible"); end

    // Reset and test 0b1001 = 9 → div_by_3
    rst_n = 0; @(posedge clk); @(posedge clk); rst_n = 1;
    drive(1); drive(0); drive(0); drive(1); // 9
    if (div_by_3) begin p++; $display("PASS: 9 divisible by 3"); end
    else begin f++; $display("FAIL: 9 should be divisible"); end

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule`
      };
    }

    if (qId === 'rtl8') {
      return {
        solution: `module fib_gen #(
  parameter W = 16
)(
  input  logic          clk,
  input  logic          rst_n,
  input  logic          enable,
  output logic [W-1:0]  fib_out
);
  logic [W-1:0] a, b;

  // a=0, b=1 on reset → outputs: 0, 1, 1, 2, 3, 5, ...
  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      a <= '0;
      b <= 1;
    end else if (enable) begin
      a <= b;
      b <= a + b;
    end
  end

  assign fib_out = a;
endmodule`,
        testbench: `module tb;
  logic        clk;
  logic        rst_n;
  logic        enable;
  logic [15:0] fib_out;
  int          p = 0, f = 0;

  initial clk = 0;

  always #5 clk = ~clk;
  fib_gen #(.W(16)) dut (.*);

  initial begin
    rst_n  = 0; enable = 0;
    @(posedge clk); @(posedge clk); rst_n = 1;
    @(posedge clk); @(negedge clk);

    // TC — Check fib sequence: a=0,1,1,2,3,5,8
    begin
      logic ok = 1;
      @(negedge clk); enable = 1;
      if (fib_out != 0) ok = 0;
      @(posedge clk); @(negedge clk);
      if (fib_out != 1) ok = 0;
      @(posedge clk); @(negedge clk);
      if (fib_out != 1) ok = 0;
      @(posedge clk); @(negedge clk);
      if (fib_out != 2) ok = 0;
      @(posedge clk); @(negedge clk);
      if (fib_out != 3) ok = 0;
      @(posedge clk); @(negedge clk);
      if (fib_out != 5) ok = 0;
      @(posedge clk); @(negedge clk);
      if (fib_out != 8) ok = 0;
      if (ok) begin p++; $display("PASS: Fibonacci sequence"); end
      else begin f++; $display("FAIL: Fibonacci fib=%0d", fib_out); end
    end

    // TC — Hold: enable=0 freezes output
    enable = 0;
    begin
      logic [15:0] held = fib_out;
      @(posedge clk); @(posedge clk); @(negedge clk);
      if (fib_out == held) begin p++; $display("PASS: hold when disabled"); end
      else begin f++; $display("FAIL: hold"); end
    end

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule`
      };
    }

    if (qId === 'rtl9') {
      return {
        solution: `module timebase (
  input  logic clk,
  input  logic rst_n,
  input  logic tick_1ms,
  output logic sec_pulse,
  output logic min_pulse,
  output logic hour_pulse
);
  logic [9:0] ms_cnt;    // 0..999
  logic [5:0] sec_cnt;   // 0..59
  logic [5:0] min_cnt;   // 0..59

  // ms → sec
  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      ms_cnt   <= '0;
      sec_pulse <= 0;
    end else begin
      sec_pulse <= 0;
      if (tick_1ms) begin
        if (ms_cnt == 999) begin
          ms_cnt    <= '0;
          sec_pulse <= 1;
        end else begin
          ms_cnt <= ms_cnt + 1;
        end
      end
    end
  end

  // sec → min
  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      sec_cnt   <= '0;
      min_pulse <= 0;
    end else begin
      min_pulse <= 0;
      if (sec_pulse) begin
        if (sec_cnt == 59) begin
          sec_cnt   <= '0;
          min_pulse <= 1;
        end else begin
          sec_cnt <= sec_cnt + 1;
        end
      end
    end
  end

  // min → hour
  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      min_cnt    <= '0;
      hour_pulse <= 0;
    end else begin
      hour_pulse <= 0;
      if (min_pulse) begin
        if (min_cnt == 59) begin
          min_cnt    <= '0;
          hour_pulse <= 1;
        end else begin
          min_cnt <= min_cnt + 1;
        end
      end
    end
  end
endmodule`,
        testbench: `module tb;
  logic clk;
  logic rst_n;
  logic tick_1ms;
  logic sec_pulse, min_pulse, hour_pulse;
  int   p = 0, f = 0;
  int   sec_count;

  initial clk = 0;

  always #5 clk = ~clk;
  timebase dut (.*);

  initial begin
    rst_n    = 0; tick_1ms = 0;
    @(posedge clk); @(posedge clk); rst_n = 1;

    // TC — 1000 ticks produce one sec_pulse
    sec_count = 0;
    repeat (1000) begin
      @(negedge clk); tick_1ms = 1; @(posedge clk);
      @(negedge clk); tick_1ms = 0; @(posedge clk);
      if (sec_pulse) sec_count++;
    end
    if (sec_count == 1) begin p++; $display("PASS: exactly 1 sec_pulse per 1000 ticks"); end
    else begin f++; $display("FAIL: sec_count=%0d", sec_count); end

    // TC — 60 sec_pulses produce one min_pulse
    begin
      int mc = 0;
      repeat (60 * 1000) begin
        tick_1ms = 1; @(posedge clk);
        tick_1ms = 0; @(posedge clk);
        if (min_pulse) mc++;
      end
      if (mc == 1) begin p++; $display("PASS: 1 min_pulse after 60 seconds"); end
      else begin f++; $display("FAIL: min_count=%0d", mc); end
    end

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule`
      };
    }

    if (qId === 'rtl10') {
      return {
        solution: `module clk_div2 (
  input  logic clk,
  input  logic rst_n,
  output logic clk_div2
);
  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) clk_div2 <= 0;
    else        clk_div2 <= ~clk_div2;
  end
endmodule`,
        testbench: `module tb;
  logic clk;
  logic rst_n;
  logic clk_div2;
  int   p = 0, f = 0;

  initial clk = 0;

  always #5 clk = ~clk;
  clk_div2 dut (.*);

  initial begin
    rst_n = 0;
    @(posedge clk); @(posedge clk); rst_n = 1;

    // Verify output toggles every 2 input clocks → period = 20ns
    begin
      logic prev = clk_div2;
      int   toggle_count = 0;
      repeat (20) begin
        @(posedge clk); @(negedge clk);
        if (clk_div2 != prev) toggle_count++;
        prev = clk_div2;
      end
      // 20 input clocks = 10 output toggles (5 full cycles)
      if (toggle_count >= 19) begin p++; $display("PASS: clk_div2 toggles=%0d", toggle_count); end
      else begin f++; $display("FAIL: toggle_count=%0d expected 10", toggle_count); end
    end

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule`
      };
    }

    if (qId === 'rtl11') {
      return {
        solution: `// Divide-by-3 with ~50% duty cycle using posedge + negedge capture and OR
module clk_div3_50 (
  input  logic clk,
  input  logic rst_n,
  output logic clk_div3_50
);
  logic [1:0] cnt_pos;   // Posedge counter 0..2
  logic [1:0] cnt_neg;   // Negedge counter 0..2
  logic        pos_out;
  logic        neg_out;

  // Counter on rising edge
  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      cnt_pos <= 0;
      pos_out <= 0;
    end else begin
      if (cnt_pos == 2) cnt_pos <= 0;
      else cnt_pos <= cnt_pos + 1;
      pos_out <= (cnt_pos == 0) || (cnt_pos == 1);
    end
  end

  // Delayed version on falling edge
  always_ff @(negedge clk or negedge rst_n) begin
    if (!rst_n) begin
      cnt_neg <= 0;
      neg_out <= 0;
    end else begin
      if (cnt_neg == 2) cnt_neg <= 0;
      else cnt_neg <= cnt_neg + 1;
      neg_out <= (cnt_neg == 0) || (cnt_neg == 1);
    end
  end

  // OR both to get ~50% output
  assign clk_div3_50 = pos_out & neg_out;
endmodule`,
        testbench: `module tb;
  logic clk;
  logic rst_n;
  logic clk_div3_50;
  int   p = 0, f = 0;

  initial clk = 0;
  always #5 clk = ~clk;   // 10ns period

  clk_div3_50 dut (.*);

  initial begin
    rst_n = 0;
    @(posedge clk); @(posedge clk); rst_n = 1;

    // TC — Output period should be 3 input cycles = 30ns
    // Count transitions over 30 cycles = 10 output periods
    begin
      realtime t_rise1, t_rise2;
      real period;
      @(posedge clk_div3_50); t_rise1 = $realtime;
      @(posedge clk_div3_50); t_rise2 = $realtime;
      period = t_rise2 - t_rise1;
      if (period == 30.0) begin p++; $display("PASS: clk_div3 period=30ns"); end
      else begin f++; $display("FAIL: period=%.1fns expected 30", period); end
    end

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule`
      };
    }

    if (qId === 'rtl12') {
      return {
        solution: `module clk_divN #(
  parameter N = 4
)(
  input  logic clk,
  input  logic rst_n,
  output logic clk_divN
);
  localparam HALF = N / 2;
  localparam ODD  = N[0];   // 1 if N is odd

  logic [$clog2(N)-1:0] cnt_pos;
  logic                   pos_out;

  // Posedge counter
  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      cnt_pos <= 0;
      pos_out <= 0;
    end else begin
      if (cnt_pos == N - 1) cnt_pos <= 0;
      else cnt_pos <= cnt_pos + 1;
      pos_out <= (cnt_pos < HALF);
    end
  end

  // For even N: use posedge output directly (50% duty)
  // For odd N: also generate negedge version and OR them
  generate
    if (ODD) begin : gen_odd
      logic [$clog2(N)-1:0] cnt_neg;
      logic                   neg_out;

      always_ff @(negedge clk or negedge rst_n) begin
        if (!rst_n) begin
          cnt_neg <= 0;
          neg_out <= 0;
        end else begin
          if (cnt_neg == N - 1) cnt_neg <= 0;
          else cnt_neg <= cnt_neg + 1;
          neg_out <= (cnt_neg < HALF);
        end
      end

      assign clk_divN = pos_out & neg_out;
    end else begin : gen_even
      assign clk_divN = pos_out;
    end
  endgenerate
endmodule`,
        testbench: `module tb;
  logic clk;
  logic rst_n;
  logic clk_div4, clk_div5;
  int   p = 0, f = 0;

  initial clk = 0;

  always #5 clk = ~clk;
  clk_divN #(.N(4)) dut4 (.clk(clk), .rst_n(rst_n), .clk_divN(clk_div4));
  clk_divN #(.N(5)) dut5 (.clk(clk), .rst_n(rst_n), .clk_divN(clk_div5));

  initial begin
    rst_n = 0;
    @(posedge clk); @(posedge clk);
    rst_n = 1;

    // TC1 — N=4 even divide
    begin
      realtime t1, t2;
      @(posedge clk_div4); t1 = $realtime;
      @(posedge clk_div4); t2 = $realtime;
      if ((t2 - t1) == 40.0) begin p++; $display("PASS: TC1 N=4 period=40ns"); end
      else begin f++; $display("FAIL: TC1 N=4 period=%.1fns", t2 - t1); end
    end

    // TC2 — N=5 odd divide
    begin
      realtime t1, t2;
      @(posedge clk_div5); t1 = $realtime;
      @(posedge clk_div5); t2 = $realtime;
      if ((t2 - t1) == 50.0) begin p++; $display("PASS: TC2 N=5 period=50ns"); end
      else begin f++; $display("FAIL: TC2 N=5 period=%.1fns", t2 - t1); end
    end

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule`
      };
    }

    if (qId === 'rtl13') {
      return {
        solution: `module icg_cell (
  input  logic clk_in,
  input  logic enable,
  output logic clk_gated
);
  logic enable_latched;

  // Level-sensitive latch: transparent when clk_in=0, holds when clk_in=1
  always_latch begin
    if (!clk_in) enable_latched <= enable;
  end

  assign clk_gated = clk_in & enable_latched;
endmodule`,
        testbench: `module tb;
  logic clk_in;
  logic enable;
  logic clk_gated;
  int   p = 0, f = 0;

  // Generate 10ns period clock
  initial clk_in = 0;
  initial clk_in = 0;
  always #5 clk_in = ~clk_in;
  icg_cell dut (.*);

  initial begin
    enable = 0;
    #3;   // Start in the middle of a low phase

    // TC — Enable=1: gate should pass clock
    enable = 1;
    @(posedge clk_in); @(posedge clk_in); #1;
    if (clk_gated) begin p++; $display("PASS: clock passes when enabled"); end
    else begin f++; $display("FAIL: clock gated when it should pass"); end

    // TC — Enable=0: gate should stop clock
    @(negedge clk_in);   // Change enable during low phase (safe)
    enable = 0;
    @(posedge clk_in); #1;
    if (!clk_gated) begin p++; $display("PASS: clock gated when disabled"); end
    else begin f++; $display("FAIL: clock passes when disabled"); end

    // TC — Enable toggle while clk_in high must not glitch
    @(posedge clk_in);   // clk is now high
    #2;
    enable = 1;   // Toggle during high — latch holds, no glitch
    #1;
    if (!clk_gated) begin p++; $display("PASS: no glitch on enable during high"); end
    else begin f++; $display("FAIL: glitch detected"); end

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule`
      };
    }

    if (qId === 'rtl14') {
      return {
        solution: `module reset_sync (
  input  logic clk,
  input  logic async_rst_n,
  output logic rst_n_sync
);
  logic ff1, ff2;

  // 2-flop synchronizer with async assert, sync deassert
  always_ff @(posedge clk or negedge async_rst_n) begin
    if (!async_rst_n) begin
      ff1 <= 0;
      ff2 <= 0;
    end else begin
      ff1 <= 1;
      ff2 <= ff1;
    end
  end

  assign rst_n_sync = ff2;
endmodule`,
        testbench: `module tb;
  logic clk;
  logic async_rst_n;
  logic rst_n_sync;
  int   p = 0, f = 0;

  initial clk = 0;

  always #5 clk = ~clk;
  reset_sync dut (.*);

  initial begin
    async_rst_n = 0;
    @(posedge clk); @(posedge clk); #1;

    // TC — Assert resets immediately
    if (!rst_n_sync) begin p++; $display("PASS: reset asserts immediately"); end
    else begin f++; $display("FAIL: reset not asserted"); end

    // TC — Deassert occurs only on clock edge(s)
    async_rst_n = 1;
    #2;   // Partway into a clock period
    // rst_n_sync should not yet deassert (not at clock edge)
    if (!rst_n_sync) begin p++; $display("PASS: sync deassert — still held between edges"); end
    else begin f++; $display("FAIL: deasserted too early"); end

    // After 2 clock edges, should deassert
    @(posedge clk); @(posedge clk); #1;
    if (rst_n_sync) begin p++; $display("PASS: deasserted after 2 clock edges"); end
    else begin f++; $display("FAIL: still in reset after 2 edges"); end

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule`
      };
    }

    if (qId === 'rtl15') {
      return {
        solution: `module two_ff_sync (
  input  logic dst_clk,
  input  logic dst_rst_n,
  input  logic async_sig_in,
  output logic sig_sync
);
  logic ff1;

  always_ff @(posedge dst_clk or negedge dst_rst_n) begin
    if (!dst_rst_n) begin
      ff1      <= 0;
      sig_sync <= 0;
    end else begin
      ff1      <= async_sig_in;
      sig_sync <= ff1;
    end
  end
endmodule`,
        testbench: `module tb;
  logic dst_clk;
  logic dst_rst_n;
  logic async_sig_in;
  logic sig_sync;
  int   p = 0, f = 0;

  initial dst_clk = 0;

  always #5 dst_clk = ~dst_clk;
  two_ff_sync dut (.*);

  initial begin
    dst_rst_n   = 0;
    async_sig_in = 0;
    @(posedge dst_clk); @(posedge dst_clk);
    dst_rst_n = 1;

    // TC — Signal propagates after 2 flop latency
    @(negedge dst_clk); async_sig_in = 1;
    @(posedge dst_clk); @(negedge dst_clk);
    // After 1 cycle: ff1 captures the input
    if (!sig_sync) begin p++; $display("PASS: not yet through after 1 cycle"); end
    else begin f++; $display("FAIL: output propagated too fast"); end

    @(posedge dst_clk); @(negedge dst_clk);
    if (sig_sync) begin p++; $display("PASS: signal through after 2 cycles"); end
    else begin f++; $display("FAIL: signal not synchronized"); end

    // TC — De-assert propagates with same latency
    async_sig_in = 0;
    @(posedge dst_clk); @(posedge dst_clk); @(negedge dst_clk);
    if (!sig_sync) begin p++; $display("PASS: de-assert synchronized"); end
    else begin f++; $display("FAIL: still high after de-assert"); end

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule`
      };
    }

    if (qId === 'rtl16') {
      return {
        solution: `// Handshake CDC: fast → slow domain using req/ack
module handshake_cdc (
  // Fast domain
  input  logic fast_clk,
  input  logic fast_rst_n,
  input  logic send_req,      // One-cycle pulse to send
  output logic fast_busy,
  // Slow domain
  input  logic slow_clk,
  input  logic slow_rst_n,
  output logic slow_data_valid
);
  // Fast domain: hold req until ack received
  logic req_ff;
  logic ack_sync1, ack_sync2;

  // Slow domain: sync req, generate ack
  logic req_sync1, req_sync2, req_prev;
  logic ack_ff;

  // ── Fast domain ──────────────────────────────────────────────────────────
  assign fast_busy = req_ff;

  always_ff @(posedge fast_clk or negedge fast_rst_n) begin
    if (!fast_rst_n) begin
      req_ff <= 0;
    end else begin
      if (send_req && !req_ff) req_ff <= 1;        // Latch request
      if (ack_sync2)           req_ff <= 0;        // Clear on ack
    end
  end

  // Synchronize ack into fast domain
  always_ff @(posedge fast_clk or negedge fast_rst_n) begin
    if (!fast_rst_n) begin
      ack_sync1 <= 0;
      ack_sync2 <= 0;
    end else begin
      ack_sync1 <= ack_ff;
      ack_sync2 <= ack_sync1;
    end
  end

  // ── Slow domain ───────────────────────────────────────────────────────────
  // Synchronize req into slow domain
  always_ff @(posedge slow_clk or negedge slow_rst_n) begin
    if (!slow_rst_n) begin
      req_sync1 <= 0;
      req_sync2 <= 0;
      req_prev  <= 0;
      ack_ff    <= 0;
    end else begin
      req_sync1 <= req_ff;
      req_sync2 <= req_sync1;
      req_prev  <= req_sync2;
      // Rising edge of synchronized req → capture data, send ack
      if (req_sync2 && !req_prev) begin
        ack_ff <= 1;
      end else if (!req_sync2) begin
        ack_ff <= 0;
      end
    end
  end

  assign slow_data_valid = req_sync2 && !req_prev;
endmodule`,
        testbench: `module tb;
  logic fast_clk;
  logic fast_rst_n;
  logic slow_clk;
  logic slow_rst_n;
  logic send_req;
  logic fast_busy;
  logic slow_data_valid;
  int   p = 0, f = 0;

  initial fast_clk = 0;
  always #3  fast_clk = ~fast_clk;   // ~167 MHz
  initial slow_clk = 0;
  always #7  slow_clk = ~slow_clk;   // ~71 MHz

  handshake_cdc dut (.*);

  initial begin
    fast_rst_n = 0; slow_rst_n = 0; send_req = 0;
    repeat (4) @(posedge fast_clk);
    repeat (4) @(posedge slow_clk);
    fast_rst_n = 1; slow_rst_n = 1;

    // TC — Single request produces single acknowledge
    @(posedge fast_clk);
    send_req = 1; @(posedge fast_clk); send_req = 0;

    // Wait for slow side to capture
    begin
      int timeout = 0;
      while (!slow_data_valid && timeout < 50) begin
        @(posedge slow_clk); timeout++;
      end
      if (slow_data_valid) begin p++; $display("PASS: slow_data_valid received"); end
      else begin f++; $display("FAIL: no slow_data_valid"); end
    end

    // Wait for fast side to clear busy
    begin
      int timeout = 0;
      while (fast_busy && timeout < 50) begin
        @(posedge fast_clk); timeout++;
      end
      if (!fast_busy) begin p++; $display("PASS: fast_busy cleared after ack"); end
      else begin f++; $display("FAIL: fast_busy not cleared"); end
    end

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule`
      };
    }

    if (qId === 'rtl17') {
      return {
        solution: `module gray_ptr #(
  parameter W = 4
)(
  input  logic         clk,
  input  logic         rst_n,
  input  logic         inc,
  output logic [W-1:0] bin_ptr,
  output logic [W-1:0] gray_ptr
);
  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) bin_ptr <= '0;
    else if (inc) bin_ptr <= bin_ptr + 1;
  end

  assign gray_ptr = bin_ptr ^ (bin_ptr >> 1);
endmodule`,
        testbench: `module tb;
  logic       clk;
  logic       rst_n;
  logic       inc;
  logic [3:0] bin_ptr, gray_ptr;
  int         p = 0, f = 0;

  initial clk = 0;

  always #5 clk = ~clk;
  gray_ptr #(.W(4)) dut (.*);

  function automatic int hamming4(logic [3:0] a, logic [3:0] b);
    return $countones(a ^ b);
  endfunction

  initial begin
    rst_n = 0; inc = 0;
    @(posedge clk); @(posedge clk); rst_n = 1; @(posedge clk); #1;

    // Validate gray = bin ^ (bin >> 1) across increments
    inc = 1;
    begin
      logic ok = 1;
      logic [3:0] prev_gray = gray_ptr;
      repeat (16) begin
        @(posedge clk); #1;
        // Check formula
        if (gray_ptr != (bin_ptr ^ (bin_ptr >> 1))) ok = 0;
        // Check Hamming distance 1
        if (hamming4(prev_gray, gray_ptr) != 1) ok = 0;
        prev_gray = gray_ptr;
      end
      if (ok) begin p++; $display("PASS: gray = bin^(bin>>1) and Hamming=1 always"); end
      else begin f++; $display("FAIL: Gray pointer validation"); end
    end

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule`
      };
    }

    // ─── Miscellaneous Classic RTL ────────────────────────────────────────────

    if (qId === 'misc1') {
      return {
        solution: `module edge_detector (
  input  logic clk,
  input  logic rst_n,
  input  logic sig_in,
  output logic rise_pulse,
  output logic fall_pulse
);
  logic sig_prev;

  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      sig_prev   <= 0;
      rise_pulse <= 0;
      fall_pulse <= 0;
    end else begin
      rise_pulse <=  sig_in & ~sig_prev;
      fall_pulse <= ~sig_in &  sig_prev;
      sig_prev   <= sig_in;
    end
  end
endmodule`,
        testbench: `module tb;
  logic clk, rst_n, sig_in, rise_pulse, fall_pulse;
  int p=0, f=0;
  initial clk=0; always #5 clk=~clk;
  edge_detector dut(.*);
  initial begin
    rst_n=0; sig_in=0;
    @(posedge clk); @(posedge clk); rst_n=1;
    @(posedge clk); @(negedge clk);

    // TC1: Rising edge 0→1
    @(negedge clk); sig_in=0;
    @(posedge clk); @(negedge clk); sig_in=1;
    @(posedge clk); @(negedge clk);
    if (rise_pulse && !fall_pulse) begin p++; $display("PASS: TC1 rise"); end
    else begin f++; $display("FAIL: TC1 rise=%b fall=%b", rise_pulse, fall_pulse); end

    // TC2: Falling edge 1→0
    @(negedge clk); sig_in=0;
    @(posedge clk); @(negedge clk);
    if (!rise_pulse && fall_pulse) begin p++; $display("PASS: TC2 fall"); end
    else begin f++; $display("FAIL: TC2 rise=%b fall=%b", rise_pulse, fall_pulse); end

    // TC3: Count edges in sequence 0,1,0,1,0
    begin
      int rises=0, falls=0;
      @(negedge clk); sig_in=0;
      @(posedge clk); @(negedge clk); sig_in=1;
      @(posedge clk); @(negedge clk); if (rise_pulse) rises++;
      sig_in=0;
      @(posedge clk); @(negedge clk); if (fall_pulse) falls++;
      sig_in=1;
      @(posedge clk); @(negedge clk); if (rise_pulse) rises++;
      sig_in=0;
      @(posedge clk); @(negedge clk); if (fall_pulse) falls++;
      if (rises==2 && falls==2) begin p++; $display("PASS: TC3 rises=%0d falls=%0d", rises, falls); end
      else begin f++; $display("FAIL: TC3 rises=%0d falls=%0d", rises, falls); end
    end

    // TC4: No edge on constant high
    @(negedge clk); sig_in=1;
    @(posedge clk); @(posedge clk); @(negedge clk);
    if (!rise_pulse && !fall_pulse) begin p++; $display("PASS: TC4 steady"); end
    else begin f++; $display("FAIL: TC4"); end

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule
`
      };
    }

    if (qId === 'misc2') {
      return {
        solution: `module top_k_tracker #(
  parameter K          = 3,
  parameter DATA_WIDTH = 8
)(
  input  logic                  clk,
  input  logic                  rst_n,
  input  logic                  in_valid,
  input  logic [DATA_WIDTH-1:0] in_data,
  output logic [DATA_WIDTH-1:0] top_values [K]
);
  // top_values[0] = largest, top_values[K-1] = smallest of top-K
  // Keeps duplicates

  logic [DATA_WIDTH-1:0] next_top [K];
  always_comb begin
    for (int i = 0; i < K; i++) next_top[i] = top_values[i];
    if (in_valid) begin
      if (in_data > top_values[0]) begin
        next_top[0] = in_data;
        for (int i = 1; i < K; i++) next_top[i] = top_values[i-1];
      end else begin
        automatic logic done = 0;
        for (int i = 1; i < K; i++) begin
          if (!done && in_data > top_values[i]) begin
            next_top[i] = in_data;
            for (int j = i+1; j < K; j++) next_top[j] = top_values[j-1];
            done = 1;
          end
        end
      end
    end
  end
  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      for (int i = 0; i < K; i++) top_values[i] = '0;
    end else begin
      for (int i = 0; i < K; i++) top_values[i] <= next_top[i];
    end
  end
endmodule`,
        testbench: `module tb;
  logic       clk;
  logic       rst_n;
  logic       in_valid;
  logic [7:0] in_data;
  logic [7:0] top_values [3];
  int         p = 0, f = 0;

  initial clk = 0;

  always #5 clk = ~clk;
  top_k_tracker #(.K(3), .DATA_WIDTH(8)) dut (.*);

  task automatic push(input logic [7:0] d);
    @(negedge clk); in_valid = 1; in_data = d;
    @(posedge clk); @(negedge clk);
    in_valid = 0; @(posedge clk); @(negedge clk);
  endtask

  initial begin
    rst_n    = 0;
    in_valid = 0;
    in_data  = 0;
    @(posedge clk); @(posedge clk); rst_n = 1;

    // TC1 — Max only (K=1 — using K=3 but checking top[0])
    push(3); push(1); push(5); push(2); push(4);
    if (top_values[0] == 5) begin p++; $display("PASS: TC1 max=5"); end
    else begin f++; $display("FAIL: TC1 max=%0d", top_values[0]); end

    // TC2 — Top-2: stream [4,9,1,7,3]
    rst_n = 0; @(posedge clk); @(posedge clk); rst_n = 1;
    push(4); push(9); push(1); push(7); push(3);
    if (top_values[0] == 9 && top_values[1] == 7) begin
      p++;
      $display("PASS: TC2 top[0]=9 top[1]=7");
    end else begin
      f++;
      $display("FAIL: TC2 top[0]=%0d top[1]=%0d", top_values[0], top_values[1]);
    end

    // TC3 — Sorted insertion K=3: [5,8,3,9,2]
    rst_n = 0; @(posedge clk); @(posedge clk); rst_n = 1;
    push(5); push(8); push(3); push(9); push(2);
    if (top_values[0] == 9 && top_values[1] == 8 && top_values[2] == 5) begin
      p++;
      $display("PASS: TC3 top=[9,8,5]");
    end else begin
      f++;
      $display("FAIL: TC3 top=[%0d,%0d,%0d]", top_values[0], top_values[1], top_values[2]);
    end

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule`
      };
    }

    if (qId === 'misc3') {
      return {
        solution: `module sliding_window_minmax #(
  parameter WINDOW_SIZE = 4,
  parameter DATA_WIDTH  = 8
)(
  input  logic                   clk,
  input  logic                   rst_n,
  input  logic                   in_valid,
  input  logic [DATA_WIDTH-1:0]  in_data,
  output logic [DATA_WIDTH-1:0]  min_out,
  output logic [DATA_WIDTH-1:0]  max_out,
  output logic                    out_valid
);
  logic [DATA_WIDTH-1:0] window [WINDOW_SIZE];
  logic [$clog2(WINDOW_SIZE):0] fill_cnt;
  logic [$clog2(WINDOW_SIZE)-1:0] wr_ptr;

  // Shift register buffer
  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      fill_cnt  <= '0;
      wr_ptr    <= '0;
      out_valid <= 0;
      for (int i = 0; i < WINDOW_SIZE; i++) window[i] <= '0;
    end else if (in_valid) begin
      window[wr_ptr] <= in_data;
      wr_ptr         <= (wr_ptr == WINDOW_SIZE - 1) ? '0 : wr_ptr + 1;
      if (fill_cnt < WINDOW_SIZE) fill_cnt <= fill_cnt + 1;
      out_valid      <= (fill_cnt == WINDOW_SIZE - 1) || (fill_cnt == WINDOW_SIZE);
    end
  end

  // Combinational min/max over entire window
  always_comb begin
    min_out = window[0];
    max_out = window[0];
    for (int i = 1; i < WINDOW_SIZE; i++) begin
      if (window[i] < min_out) min_out = window[i];
      if (window[i] > max_out) max_out = window[i];
    end
  end
endmodule`,
        testbench: `module tb;
  logic       clk;
  logic       rst_n;
  logic       in_valid;
  logic [7:0] in_data;
  logic [7:0] min_out, max_out;
  logic       out_valid;
  int         p = 0, f = 0;

  initial clk = 0;

  always #5 clk = ~clk;
  sliding_window_minmax #(.WINDOW_SIZE(3), .DATA_WIDTH(8)) dut (.*);

  task automatic push(input logic [7:0] d);
    @(negedge clk); in_valid = 1; in_data = d;
    @(posedge clk); @(negedge clk);
    in_valid = 0; @(posedge clk); @(negedge clk);
  endtask

  initial begin
    rst_n    = 0;
    in_valid = 0;
    in_data  = 0;
    @(posedge clk); @(posedge clk); rst_n = 1;

    // TC1 — Warm-up: W=3, 2 samples not valid yet
    push(4); push(2); @(negedge clk);
    if (!out_valid) begin p++; $display("PASS: TC1 not valid before window full"); end
    else begin f++; $display("FAIL: TC1 premature valid"); end

    // After 3rd sample, valid
    push(12);
    if (out_valid && min_out == 2 && max_out == 12) begin
      p++;
      $display("PASS: TC2 window=[4,2,12] min=2 max=12");
    end else begin
      f++;
      $display("FAIL: TC2 min=%0d max=%0d valid=%b", min_out, max_out, out_valid);
    end

    // TC2 — Slide: push 3 → window=[2,12,3]
    push(3);
    if (min_out == 2 && max_out == 12) begin p++; $display("PASS: TC2 after 3"); end
    else begin f++; $display("FAIL: TC2 after 3 min=%0d max=%0d", min_out, max_out); end

    // Push 1 → window=[12,3,1]
    push(1);
    if (min_out == 1 && max_out == 12) begin p++; $display("PASS: TC2 after 1 min=1 max=12"); end
    else begin f++; $display("FAIL: TC2 after 1 min=%0d max=%0d", min_out, max_out); end

    // TC3 — Constant input
    rst_n = 0; @(posedge clk); @(posedge clk); rst_n = 1;
    push(7); push(7); push(7);
    if (min_out == 7 && max_out == 7) begin p++; $display("PASS: TC3 constant min=max=7"); end
    else begin f++; $display("FAIL: TC3"); end

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule`
      };
    }

    if (qId === 'misc4') {
      return {
        solution: `module pwm_gen #(
  parameter COUNTER_WIDTH = 8,
  parameter PERIOD        = 100,
  parameter DUTY          = 50
)(
  input  logic clk,
  input  logic rst_n,
  output logic pwm_out
);
  logic [COUNTER_WIDTH-1:0] counter;

  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      counter <= '0;
    end else begin
      if (counter == PERIOD - 1) counter <= '0;
      else                       counter <= counter + 1;
    end
  end

  assign pwm_out = (counter < DUTY);
endmodule`,
        testbench: `module tb;
  logic clk;
  logic rst_n;
  logic pwm_25, pwm_0, pwm_100;
  int   p = 0, f = 0;

  initial clk = 0;

  always #5 clk = ~clk;
  pwm_gen #(.COUNTER_WIDTH(4), .PERIOD(8), .DUTY(2)) dut25  (.clk(clk), .rst_n(rst_n), .pwm_out(pwm_25));
  pwm_gen #(.COUNTER_WIDTH(4), .PERIOD(8), .DUTY(0)) dut0   (.clk(clk), .rst_n(rst_n), .pwm_out(pwm_0));
  pwm_gen #(.COUNTER_WIDTH(4), .PERIOD(8), .DUTY(8)) dut100 (.clk(clk), .rst_n(rst_n), .pwm_out(pwm_100));

  initial begin
    rst_n = 0;
    @(posedge clk); @(posedge clk);
    rst_n = 1;

    // TC1 — 25% duty over one full period
    begin
      int high_cnt, low_cnt;
      high_cnt = 0;
      low_cnt  = 0;
      repeat (8) begin
        @(posedge clk); #1;
        if (pwm_25) high_cnt++;
        else        low_cnt++;
      end
      if (high_cnt == 2 && low_cnt == 6) begin
        p++; $display("PASS: TC1 25%% duty");
      end else begin
        f++; $display("FAIL: TC1 high=%0d low=%0d", high_cnt, low_cnt);
      end
    end

    // TC2 — 0% duty always low
    begin
      logic ok;
      ok = 1;
      repeat (8) begin
        @(posedge clk); #1;
        if (pwm_0 !== 1'b0) ok = 0;
      end
      if (ok) begin p++; $display("PASS: TC2 0%% duty always low"); end
      else begin f++; $display("FAIL: TC2 pwm_0 not always low"); end
    end

    // TC3 — 100% duty always high
    begin
      logic ok;
      ok = 1;
      repeat (8) begin
        @(posedge clk); #1;
        if (pwm_100 !== 1'b1) ok = 0;
      end
      if (ok) begin p++; $display("PASS: TC3 100%% duty always high"); end
      else begin f++; $display("FAIL: TC3 pwm_100 not always high"); end
    end

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule`
      };
    }

  }
  return null;
};
