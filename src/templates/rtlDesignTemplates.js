/**
 * rtlDesignTemplates — Code templates for the "rtl-design" domain.
 * Auto-split from codeTemplates.js
 */

export const rtlDesignTemplates = (qId, language) => {
  if (language === 'systemverilog') {
    // FIFO related questions
    if (qId === 'fifo1') {
      return `// ============================================================
// Synchronous FIFO with Full/Empty/Almost flags
// ============================================================
// Single clock domain FIFO; typical implementation uses memory + rd/wr pointers and/or
// an occupancy counter to generate full/empty and threshold flags.
//
// TODO: Choose reset type (sync vs async) and document it.
// TODO: Decide read data semantics:
// - Option A: registered read (rd_data updates only on successful read)
// - Option B: combinational read (rd_data reflects mem at rd_ptr)
// TODO: Define overflow/underflow behavior (ignore operation vs optional internal bookkeeping).

module sync_fifo #(
  parameter int unsigned DEPTH = 8,    // TODO: power-of-2 recommended
  parameter int unsigned WIDTH = 8,

  // Thresholds in "entries" (0..DEPTH)
  parameter int unsigned ALMOST_FULL_THRESHOLD  = DEPTH-1,
  parameter int unsigned ALMOST_EMPTY_THRESHOLD = 1
) (
  input  logic               clk,
  input  logic               rst_n,

  input  logic               write_en,
  input  logic [WIDTH-1:0]   write_data,

  input  logic               read_en,
  output logic [WIDTH-1:0]   read_data,

  output logic               full,
  output logic               empty,
  output logic               almost_full,
  output logic               almost_empty
);

  localparam int unsigned ADDR_W = $clog2(DEPTH);

  // Storage
  logic [WIDTH-1:0] mem [0:DEPTH-1];

  // Pointers and occupancy
  logic [ADDR_W-1:0] rd_ptr, wr_ptr;
  logic [ADDR_W:0]   count; // extra bit to represent DEPTH

  // ----------------------------
  // TODO: Parameter/legal checks
  // ----------------------------
  // TODO: Ensure thresholds satisfy:
  // 0 <= ALMOST_EMPTY_THRESHOLD < ALMOST_FULL_THRESHOLD <= DEPTH
  // TODO: Decide behavior if DEPTH is not power-of-2 (pointer wrap logic still must work).
  // TODO: Decide what to do if DEPTH==1 (ADDR_W may be 0 tool-dependent).

  // ----------------------------
  // TODO: Derived handshakes
  // ----------------------------
  // TODO: write_fire = write_en && !full
  // TODO: read_fire  = read_en  && !empty
  // TODO: simultaneous read+write allowed when both fire (count unchanged).

  // ----------------------------
  // TODO: Flag generation from count
  // ----------------------------
  // full  = (count == DEPTH)
  // empty = (count == 0)
  // almost_full  = (count >= ALMOST_FULL_THRESHOLD)
  // almost_empty = (count <= ALMOST_EMPTY_THRESHOLD)

  // ----------------------------
  // Sequential logic
  // ----------------------------
  always_ff @(posedge clk or negedge rst_n) begin
  if (!rst_n) begin
  // TODO: Reset:
  // rd_ptr=0; wr_ptr=0; count=0; empty=1; full=0; read_data defined.
  // almost flags depend on thresholds.
  // Optional internal error bookkeeping, if added, would reset here.
  end else begin
  // TODO: Write operation:
  // - If write_fire: mem[wr_ptr] <= write_data; wr_ptr++ (wrap); count++ if no read_fire.
  // - If write_en && full: ignore write (optionally record an overflow event internally).

  // TODO: Read operation:
  // - If read_fire: read_data <= mem[rd_ptr] (if registered); rd_ptr++ (wrap); count-- if no write_fire.
  // - If read_en && empty: ignore read (optionally record an underflow event internally).

  // TODO: Simultaneous read+write:
  // - If both fire: do both pointer updates; count unchanged.
  // - TODO: Define if reading and writing same address can occur (depends on full/empty boundaries).
  end
  end

endmodule


`;}

      if (qId === 'fifo2') {
      return `// ============================================================
// Asynchronous FIFO (Dual-Clock, Gray code CDC)
// ============================================================
// Key ideas:
// - Maintain binary pointers locally (for addressing), convert to Gray for CDC.
// - Synchronize Gray pointers across domains with 2-FF synchronizers.
// - Empty in read domain: rgray_next == synced wgray.
// - Full in write domain: wgray_next equals synced rgray with MSBs inverted.
//
// TODO: Decide reset strategy:
// - Separate resets per domain (write_rst_n, read_rst_n) OR shared async reset.
// TODO: Decide memory: true dual-port RAM recommended for independent rd/wr clocks.

module async_fifo #(
  parameter int unsigned DEPTH = 16,   // must be power of 2 [per spec]
  parameter int unsigned WIDTH = 8
) (
  // Write domain
  input  logic               write_clk,
  input  logic               write_rst_n,
  input  logic               write_en,
  input  logic [WIDTH-1:0]   write_data,
  output logic               full,

  // Read domain
  input  logic               read_clk,
  input  logic               read_rst_n,
  input  logic               read_en,
  output logic [WIDTH-1:0]   read_data,
  output logic               empty
);

  localparam int unsigned ADDR_W = $clog2(DEPTH);
  // Use ADDR_W+1 pointer bits (extra bit disambiguates full vs empty).
  localparam int unsigned PTR_W  = ADDR_W + 1;

  // Memory (dual-port)
  logic [WIDTH-1:0] mem [0:DEPTH-1];

  // Write pointers
  logic [PTR_W-1:0] wbin,  wbin_next;
  logic [PTR_W-1:0] wgray, wgray_next;

  // Read pointers
  logic [PTR_W-1:0] rbin,  rbin_next;
  logic [PTR_W-1:0] rgray, rgray_next;

  // Synchronized Gray pointers
  logic [PTR_W-1:0] rgray_sync_w; // read pointer synced into write clock domain
  logic [PTR_W-1:0] wgray_sync_r; // write pointer synced into read clock domain

  // 2-FF sync stages (no comb logic between stages).
  logic [PTR_W-1:0] rgray_w_q1, rgray_w_q2;
  logic [PTR_W-1:0] wgray_r_q1, wgray_r_q2;

  // ----------------------------
  // TODO: Utility functions
  // ----------------------------
  function automatic logic [PTR_W-1:0] bin2gray(input logic [PTR_W-1:0] bin);
  // TODO: gray = (bin >> 1) ^ bin.
  bin2gray = '0;
  endfunction

  function automatic logic [PTR_W-1:0] gray2bin(input logic [PTR_W-1:0] gray);
  // TODO: Only needed if you compute occupancy; optional in this design.
  gray2bin = '0;
  endfunction

  // ----------------------------
  // TODO: Write-domain logic
  // ----------------------------
  // TODO: Compute wbin_next/wgray_next based on write_en && !full.
  // TODO: Memory write on write_clk when wr_fire:
  // mem[wbin[ADDR_W-1:0]] <= write_data;

  // TODO: Full detection in write domain using Gray comparison:
  // full = (wgray_next == {~rgray_sync_w[PTR_W-1:PTR_W-2], rgray_sync_w[PTR_W-3:0]});
  // TODO: Confirm which MSBs to invert for your PTR_W (the standard inverts top 2 bits).

  // ----------------------------
  // TODO: Read-domain logic
  // ----------------------------
  // TODO: Compute rbin_next/rgray_next based on read_en && !empty.
  // TODO: Memory read on read_clk when rd_fire:
  // read_data <= mem[rbin[ADDR_W-1:0]];
  //
  // TODO: Empty detection in read domain:
  // empty = (rgray_next == wgray_sync_r);

  // ----------------------------
  // TODO: Synchronizers
  // ----------------------------
  // TODO: In write_clk domain: synchronize rgray into write domain with 2 FFs.
  // TODO: In read_clk domain: synchronize wgray into read domain with 2 FFs.
  // TODO: Assign rgray_sync_w = rgray_w_q2; wgray_sync_r = wgray_r_q2;

  // ----------------------------
  // TODO: Reset behavior
  // ----------------------------
  // TODO: On reset in each domain:
  // - local bin/gray pointers to 0
  // - sync chains to 0
  // results in empty=1, full=0 after both domains reset as intended.

endmodule


`;}

if (qId === 'fifo3') {
      return `// ============================================================
// FIFO with Asymmetric Read/Write Widths (Width Conversion)
// ============================================================
// Goal: support WRITE_WIDTH != READ_WIDTH with integer ratio.
// Common approach: choose smallest unit as storage granularity (e.g., bytes) and
// pack/unpack across the boundary.
//
// TODO: Document packing order with an explicit example (LSB-first vs MSB-first).
// TODO: Define full/empty based on whether you can accept an entire write beat
//       or produce an entire read beat.

module fifo_width_conv #(
  parameter int unsigned DEPTH_BYTES  = 64,  // capacity expressed in bytes (recommended)
  parameter int unsigned WRITE_WIDTH  = 32,
  parameter int unsigned READ_WIDTH   = 8,

  // TODO: Optional almost thresholds in bytes
  parameter int unsigned AFULL_BYTES  = DEPTH_BYTES-1,
  parameter int unsigned AEMPTY_BYTES = 1
) (
  input  logic                      clk,
  input  logic                      rst_n,

  // Write side
  input  logic                      write_en,
  input  logic [WRITE_WIDTH-1:0]    write_data,
  output logic                      full,

  // Read side
  input  logic                      read_en,
  output logic [READ_WIDTH-1:0]     read_data,
  output logic                      empty
);

  // ----------------------------
  // TODO: Compile-time checks
  // ----------------------------
  // TODO: Enforce integer ratio:
  // - Either WRITE_WIDTH % READ_WIDTH == 0 OR READ_WIDTH % WRITE_WIDTH == 0.
  // TODO: Define UNIT_BYTES = min(WRITE_WIDTH, READ_WIDTH)/8 (require byte multiple).
  // TODO: Decide if non-multiple-of-8 widths are allowed (usually disallow).

  // ----------------------------
  // TODO: Storage granularity
  // ----------------------------
  // TODO: Choose smallest unit storage (e.g., 8-bit byte memory) to simplify conversion.
  // Example: mem_byte[0:DEPTH_BYTES-1].
  // TODO: Maintain byte-level read/write pointers and occupancy_bytes.

  // ----------------------------
  // TODO: Write path behavior
  // ----------------------------
  // Case A: WRITE_WIDTH > READ_WIDTH
  // - One write_en writes multiple units (e.g., 32b -> 4 bytes) into FIFO sequentially.
  // TODO: Implement "sub-write" counter 0..(WRITE_BYTES-1) or unrolled loop.
  //
  // Case B: WRITE_WIDTH < READ_WIDTH
  // - Need to accumulate multiple writes into a wider word before allowing one read.
  // TODO: Implement assembly register + counter (collected_bytes).
  // TODO: Define when assembled word is committed to storage.

  // ----------------------------
  // TODO: Read path behavior
  // ----------------------------
  // Case A: READ_WIDTH < WRITE_WIDTH
  // - Reads pop smaller units sequentially (bytes) following documented order.
  //
  // Case B: READ_WIDTH > WRITE_WIDTH
  // - Reads should block until enough units accumulated (empty=1 until enough).
  // TODO: Ensure empty is based on availability of READ_BYTES, not just >0.

  // ----------------------------
  // TODO: Full/empty computation
  // ----------------------------
  // TODO: Express in bytes:
  // - full when remaining_capacity_bytes < WRITE_BYTES
  // - empty when available_bytes < READ_BYTES
  // TODO: Define behavior for simultaneous rd+wr (count changes by +WRITE_BYTES-READ_BYTES).

  // ----------------------------
  // TODO: Packing order
  // ----------------------------
  // TODO: LSB-first example (must document):
  // - For 32->8: first read returns write_data[7:0], then [15:8], etc.
  // - For 8->32: assemble as {byte3,byte2,byte1,byte0} or vice versa (document).

endmodule


`;}


    // FSM related questions
    if (qId === 'fsm1' ) {
      return `// ============================================================
// Overlapping Sequence Detector for 1011
// ============================================================
// Detect pattern "1011" on serial input in (1 bit/cycle).
// Overlapping means the FSM must fall back to the longest suffix that is also a prefix,
// not always to IDLE, after partial or full matches.
//
// TODO: Choose FSM type and document:
// - Mealy: detect can pulse on a transition (state+input).
// - Moore: detect asserted in a dedicated DETECT state (often 1-cycle).
//
// TODO: Clarify pulse vs level for detect.
// TODO: Choose reset type (sync/async) and document it.

module seq_det_1011 #(
  parameter bit MEALY = 1  // TODO: 1=Mealy, 0=Moore
) (
  input  logic clk,
  input  logic rst_n,
  input  logic in,
  output logic detect
);

  // ----------------------------
  // TODO: State definitions
  // ----------------------------
  // Suggested conceptual states (names only):
  // - IDLE: none matched
  // - S1:   seen "1"
  // - S10:  seen "10"
  // - S101: seen "101"
  // - (Moore only) DETECT: complete "1011"
  //
  // TODO: Choose encoding (enum logic [..:0]) and list states clearly.

  typedef enum logic [2:0] {
  // TODO: fill with your states
  ST_IDLE  = 3'd0
  } state_t;

  state_t state_q, state_d;

  // ----------------------------
  // TODO: Next-state logic
  // ----------------------------
  always_comb begin
  // TODO: Default next state = current state (or IDLE) and default detect=0.
  // TODO: Provide complete transitions for every state for in=0 and in=1. (No missing arcs.)
  //
  // TODO: Overlap handling:
  // - After a full match "1011", next state must reflect that "1" can be start of a new match,
  //   not necessarily IDLE.
  // - On mismatch, fall back appropriately (e.g., from having seen "101" and receiving 0,
  //   you may still have matched "10" as suffix).
  //
  // TODO: If MEALY:
  // - detect asserted based on (state_q and in) on the match-completing transition.
  // TODO: If MOORE:
  // - detect asserted only in DETECT state, and DETECT state lasts exactly 1 cycle.
  end

  // ----------------------------
  // State register
  // ----------------------------
  always_ff @(posedge clk or negedge rst_n) begin
  if (!rst_n) begin
  // TODO: Reset to IDLE, detect=0 (if detect registered).
  state_q <= ST_IDLE;
  end else begin
  // TODO: state_q <= state_d
  end
  end

  // ----------------------------
  // TODO: Output logic (if Moore)
  // ----------------------------
  // TODO: If Moore, make detect a pure function of state_q (combinational decode),
  // or register it carefully so it is a clean 1-cycle pulse.

endmodule


`;}

      if (qId === 'fsm2' ) {
      return `// ============================================================
// Traffic Light Controller (Moore FSM with timers)
// ============================================================
// Moore FSM: outputs depend only on state and change on clock edges.
// Safety requirement: never both directions green at once; include yellow between green->red.
//
// TODO: Choose whether to include ALL_RED state on reset or between phases.

module traffic_light #(
  parameter int unsigned NS_GREEN_TIME  = 10,
  parameter int unsigned NS_YELLOW_TIME = 2,
  parameter int unsigned EW_GREEN_TIME  = 10,
  parameter int unsigned EW_YELLOW_TIME = 2
) (
  input  logic clk,
  input  logic rst_n,

  output logic ns_red,
  output logic ns_yellow,
  output logic ns_green,

  output logic ew_red,
  output logic ew_yellow,
  output logic ew_green
);

  // ----------------------------
  // TODO: State definitions
  // ----------------------------
  // Required states:
  // - NS_GREEN, NS_YELLOW, EW_GREEN, EW_YELLOW
  // Optional:
  // - ALL_RED (safe reset / clearance)
  typedef enum logic [2:0] {
  // TODO: fill
  ST_NS_GREEN = 3'd0
  } state_t;

  state_t state_q, state_d;

  // ----------------------------
  // TODO: Timer/counter
  // ----------------------------
  // TODO: Choose timer scheme:
  // - down-counter loaded with state's duration, decremented each cycle
  // - or up-counter compared to threshold
  // TODO: Define when timer "expires" (==0 or ==duration-1).
  logic [$clog2(1+ (NS_GREEN_TIME>EW_GREEN_TIME?NS_GREEN_TIME:EW_GREEN_TIME) ):0] timer_q, timer_d;

  // ----------------------------
  // TODO: Next-state and timer update logic
  // ----------------------------
  always_comb begin
  // TODO: Defaults: state_d=state_q; timer_d=timer_q
  // TODO: If timer expired, transition to next state in sequence:
  // NS_GREEN -> NS_YELLOW -> EW_GREEN -> EW_YELLOW -> NS_GREEN ...
  // TODO: On state transition, reload timer for next state duration.
  end

  // ----------------------------
  // TODO: Moore output decode (state -> lights)
  // ----------------------------
  always_comb begin
  // TODO: Default all outputs 0.
  // TODO: For each state, assert exactly one light per direction.
  // Example: NS_GREEN => ns_green=1, ew_red=1, others 0.
  //
  // TODO: Add safety assertions in testbench:
  // - not (ns_green && ew_green)
  // - onehot per direction (or exactly one of red/yellow/green)
  end

  // ----------------------------
  // Sequential state/timer registers
  // ----------------------------
  always_ff @(posedge clk or negedge rst_n) begin
  if (!rst_n) begin
  // TODO: Reset to safe initial state and load timer accordingly.
  state_q <= ST_NS_GREEN; // TODO: or ALL_RED
  // timer_q <= ...
  end else begin
  // TODO: state_q <= state_d; timer_q <= timer_d
  end
  end

endmodule


`;}



          if (qId === 'fsm3' ) {
      return `// ============================================================
// Vending Machine FSM (coins, credit, dispense, change)
// ============================================================
// Typical FSM has states like IDLE, ACCEPT, DISPENSE, CHANGE.
// Many designs keep credit in a register and use states to sequence dispense/change.
//
// TODO: Decide Moore vs Mealy:
// - Mealy: dispense can pulse immediately when credit crosses price
// - Moore: use explicit DISPENSE/CHANGE states for clean outputs
//
// TODO: Define coin denominations supported and invalid coin behavior.
// TODO: Decide whether to support multiple purchases automatically (loop while credit>=price).

module vending_machine #(
  parameter int unsigned ITEM_PRICE = 25
) (
  input  logic                    clk,
  input  logic                    rst_n,
  input  logic                    coin_valid,
  input  logic [4:0]              coin_value,
  output logic                    dispense,
  output logic                    change_valid,
  output logic [4:0]              change_amount
);

  // ----------------------------
  // TODO: State definitions
  // ----------------------------
  typedef enum logic [2:0] {
  // TODO: IDLE/ACCEPT/DISPENSE/CHANGE/REFUND/ERROR, etc.
  ST_IDLE = 3'd0
  } state_t;

  state_t state_q, state_d;

  // Credit register
  logic [6:0] credit_q, credit_d;

  // ----------------------------
  // TODO: Coin validation
  // ----------------------------
  // TODO: is_valid_coin = (coin_value == 5 || 10 || 25 ...) or a lookup table.
  // TODO: invalid coin behavior: ignore vs error flag.

  // ----------------------------
  // TODO: Next-state + credit update
  // ----------------------------
  always_comb begin
  // TODO: Defaults:
  // state_d = state_q
  // credit_d = credit_q
  // dispense = 0; change_valid=0; change_amount=0

  // TODO: On coin_valid with valid coin: credit_d = credit_q + coin_value.
  // TODO: If refund: move to refund/change path and clear credit appropriately.
  // TODO: When credit >= ITEM_PRICE:
  // - assert dispense (pulse or in DISPENSE state)
  // - subtract ITEM_PRICE from credit
  // - compute remaining credit as change or keep as remaining credit for multiple purchases.
  //
  // TODO: Overpayment: change_amount = remaining credit, change_valid asserted.
  // TODO: Multiple purchases: loop while credit still >= ITEM_PRICE (define how many per cycle vs per state).
  end

  // ----------------------------
  // Sequential registers
  // ----------------------------
  always_ff @(posedge clk or negedge rst_n) begin
  if (!rst_n) begin
  // TODO: clear credit, deassert outputs via defaults
  state_q  <= ST_IDLE;
  credit_q <= '0;
  end else begin
  state_q  <= state_d;
  credit_q <= credit_d;
  end
  end

endmodule


`;}

    if (qId === 'mem1' ) {
      return `// ============================================================
// ID: mem1 — Single-Port Synchronous RAM (1 port, sync write)
// ============================================================
// Single-port RAM cannot read and write different addresses in the same cycle (one address port).
// Read behavior must be defined: sync (1-cycle latency) or comb (0-cycle latency).
// Read-during-write to same address must be defined: write-first, read-first, or undefined.
//
// TODO: Choose and document:
// - READ_LATENCY: 0 or 1
// - RDW_MODE: WRITE_FIRST / READ_FIRST / NO_CHANGE / UNDEFINED (whatever you support)
// TODO: Decide whether to include chip_enable.
// TODO: Decide reset policy (clear mem vs leave X/undefined for synthesis).

module sp_ram #(
  parameter DEPTH = 256,
  parameter WIDTH = 8
) (
  input  logic                      clk,
  input  logic                      write_en,
  input  logic                      read_en,
  input  logic [$clog2(DEPTH)-1:0] address,
  input  logic [WIDTH-1:0]          write_data,
  output logic [WIDTH-1:0]          read_data
);

  // Memory array
  logic [WIDTH-1:0] mem [0:DEPTH-1];

  // Optional registered output for 1-cycle read latency
  logic [WIDTH-1:0] read_data_q;

  // ----------------------------
  // TODO: Address width / DEPTH edge cases
  // ----------------------------
  // TODO: If DEPTH is not power-of-2, addr width is still clog2(DEPTH); decide if you allow
  // "out of range" addresses (addr >= DEPTH) in simulation, and what to do.

  // ----------------------------
  // TODO: Synchronous write
  // ----------------------------
  // TODO: On posedge clk, if (chip_en && write_en) mem[addr] <= write_data;

  // ----------------------------
  // TODO: Read implementation
  // ----------------------------
  // Option A: READ_LATENCY_1==1 (synchronous read, 1-cycle latency):
  // - On cycle N: if (chip_en && read_en) capture read_data_q <= mem[addr]
  // - read_data = read_data_q
  //
  // Option B: READ_LATENCY_1==0 (combinational read, 0-cycle latency):
  // - read_data = (chip_en && read_en) ? mem[addr] : (hold/0/'x) (document)

  // ----------------------------
  // TODO: Read-during-write (same address)
  // ----------------------------
  // When chip_en && read_en && write_en in same cycle to same addr:
  // - WRITE_FIRST: read returns new data being written.
  // - READ_FIRST:  read returns old stored data.
  // - UNDEFINED:   explicitly document and do not test, or assert error.
  //
  // TODO: Implement forwarding if WRITE_FIRST is required (especially for sync-read mode).

  // ----------------------------
  // TODO: Reset behavior
  // ----------------------------
  // TODO: If HAS_RESET_INIT:
  // - reset read_data_q/read_data to 0
  // - optionally clear mem (expensive); document if you do or not.

endmodule


`;}

      if (qId === 'mem2' ) {
      return `// ============================================================
// ID: mem2 — Dual-Port RAM (Simple DP or True DP)
// ============================================================
// Two independent ports, same clock in this template.
// Must define collision behavior:
// - read/write same address same cycle (read-first vs write-first vs undefined)
// - write/write same address (true dual-port only): define priority or flag error.
//
// TODO: Choose type:
// - SIMPLE_DP: Port A write-only, Port B read-only
// - TRUE_DP: both ports can read/write

module dp_ram #(
  parameter DEPTH = 256,
  parameter WIDTH = 8
) (
  input  logic                      clk,
  input  logic                      write_en_a,
  input  logic [$clog2(DEPTH)-1:0] addr_a,
  input  logic [WIDTH-1:0]          write_data_a,
  input  logic                      read_en_b,
  input  logic [$clog2(DEPTH)-1:0] addr_b,
  output logic [WIDTH-1:0]          read_data_b
);

  logic [WIDTH-1:0] mem [0:DEPTH-1];

  // TODO: Registered read outputs if you want 1-cycle latency per port (recommended).
  logic [WIDTH-1:0] rdata_a_q, rdata_b_q;

  // ----------------------------
  // TODO: Collision detection
  // ----------------------------
  // TODO: ww_collision = TRUE_DUAL_PORT && en_a && en_b && we_a && we_b && (addr_a == addr_b).
  // TODO: Define what happens on ww_collision:
  // - Port A priority, or Port B priority, or error/undefined.

  // ----------------------------
  // TODO: Write logic
  // ----------------------------
  // TODO: In always_ff:
  // - If SIMPLE_DP: only allow writes on Port A.
  // - If TRUE_DP: allow writes on both ports; handle ww_collision per spec.

  // ----------------------------
  // TODO: Read logic + RW collision behavior
  // ----------------------------
  // TODO: Read latency: 1-cycle sync read suggested:
  // if (en_a && re_a) rdata_a_q <= mem[addr_a];
  // if (en_b && re_b) rdata_b_q <= mem[addr_b];
  // rdata_* = rdata_*_q;
  //
  // TODO: Same-address RW collision: one port writes, other reads same address same cycle:
  // - If WRITE_FIRST_RW: read returns new write data.
  // - Else READ_FIRST_RW: read returns old mem value.
  // TODO: Implement forwarding mux(es) if choosing write-first.

  // ----------------------------
  // TODO: Reset
  // ----------------------------
  // TODO: Reset read data regs (optional); memory init optional.

endmodule


`;}

        if (qId === 'mem3' ) {
      return `// ============================================================
// ID: mem3 — Direct-mapped cache
// ============================================================
module direct_mapped_cache #(
  parameter ADDR_WIDTH  = 8,
  parameter DATA_WIDTH  = 8,
  parameter NUM_LINES   = 4,
  parameter OFFSET_BITS = 0
) (
  input  logic                   clk,
  input  logic                   rst_n,
  input  logic                   access,
  input  logic                   write_en,
  input  logic [ADDR_WIDTH-1:0]  address,
  input  logic [DATA_WIDTH-1:0]  write_data,
  input  logic [DATA_WIDTH-1:0]  mem_read_data,
  output logic [ADDR_WIDTH-1:0]  mem_address,
  output logic [DATA_WIDTH-1:0]  mem_write_data,
  output logic                   mem_write_en,
  output logic                   mem_read_req,
  output logic [DATA_WIDTH-1:0]  read_data,
  output logic                   hit,
  output logic                   miss
);

  // TODO: Implement tag/valid/data arrays and direct-mapped replacement.

endmodule


`;}

          if (qId === 'mem4' ) {
      return `// ============================================================
// ID: mem4 — Write-back set-associative cache
// ============================================================
module wb_cache #(
  parameter NUM_SETS   = 4,
  parameter NUM_WAYS   = 4,
  parameter TAG_BITS   = 4,
  parameter DATA_WIDTH = 8
) (
  input  logic                        clk,
  input  logic                        rst_n,
  input  logic                        access,
  input  logic                        write_en,
  input  logic [TAG_BITS-1:0]         addr_tag,
  input  logic [$clog2(NUM_SETS)-1:0] addr_set,
  input  logic [DATA_WIDTH-1:0]       write_data,
  output logic [DATA_WIDTH-1:0]       read_data,
  output logic                        hit,
  output logic                        miss,
  output logic                        wb_req,
  output logic [TAG_BITS-1:0]         wb_tag,
  output logic [$clog2(NUM_SETS)-1:0] wb_set,
  output logic [DATA_WIDTH-1:0]       wb_data
);

  // TODO: Implement hit detection, victim selection, and dirty write-back.

endmodule


`;}

    // Counter related
    if (qId === 'counter1' ) {
      return `// ============================================================
// ID: counter1 — N-bit Synchronous Up Counter (enable + reset)
// ============================================================
// Wraparound is natural with N-bit arithmetic (mod 2^N).
//
// TODO: Choose reset type:
// - synchronous reset (reset sampled on clk edge), or
// - asynchronous reset (in sensitivity list).
// TODO: Optionally add RESET_VALUE parameter (default 0).

module sync_counter #(
  parameter int unsigned N = 8,
  parameter logic [N-1:0] RESET_VALUE = '0
) (
  input  logic         clk,
  input  logic         rst_n,    // TODO: define active-low vs active-high reset
  input  logic         enable,
  output logic [N-1:0] count
);

  // TODO: Decide reset polarity usage (rst_n vs rst).
  // TODO: Implement always_ff with priority:
  // - if reset: count <= RESET_VALUE
  // - else if enable: count <= count + 1'b1
  // - else hold
  //
  // TODO: Confirm behavior for N=1.
  // TODO: Optional terminal_count output (count == {N{1'b1}}).

endmodule


`;}

      if (qId === 'counter2' ) {
      return `// ============================================================
// ID: counter2 — Gray-Code Counter (enable + reset)
// ============================================================
// Recommended approach: keep internal binary counter, output Gray code as:
// gray = (bin >> 1) ^ bin.
//
// TODO: Decide whether to output only gray_count or also binary_count for debug.

module gray_counter #(
  parameter int unsigned N = 4
) (
  input  logic         clk,
  input  logic         rst_n,
  input  logic         enable,
  output logic [N-1:0] gray_count
);

  logic [N-1:0] bin_q, bin_d;

  function automatic logic [N-1:0] bin2gray(input logic [N-1:0] b);
  // TODO: Implement gray conversion: (b >> 1) ^ b.
  bin2gray = '0;
  endfunction

  // TODO: Next binary count logic:
  // - if enable: bin_d = bin_q + 1
  // - else: bin_d = bin_q

  // TODO: gray_count combinational from bin_q (or from bin_d if you want gray to advance same cycle as bin updates).

  // TODO: Reset: bin_q=0, gray_count=0.

  // TODO: Testbench-only checks:
  // - Hamming distance between gray_count and $past(gray_count) is 1 when enable=1.
  // - Wraparound transition is also 1-bit (cyclic property).

endmodule


`;}
      if (qId === 'counter3' ) {
      return `// ============================================================
// ID: counter3 — Shift Register with Parallel Load + Serial Shift
// ============================================================
// Supports parallel load and serial shifting; serial_out is the shifted-out bit.
// TODO: Choose shift direction (RIGHT or LEFT) and document it.
// TODO: Decide whether to include serial_in; if not, fill with 0.
// TODO: Define control priority when load && shift asserted (common: load wins).

module shift_reg #(
  parameter WIDTH = 8
) (
  input  logic              clk,
  input  logic              rst_n,
  input  logic              load,
  input  logic              shift,
  input  logic [WIDTH-1:0]  data_in,
  input  logic              serial_in,
  output logic [WIDTH-1:0]  parallel_out,
  output logic              serial_out
);

  logic [WIDTH-1:0] shreg_q, shreg_d;

  // TODO: serial_out definition depends on direction:
  // - right shift => serial_out = shreg_q[0]
  // - left shift  => serial_out = shreg_q[WIDTH-1]

  // TODO: Next-state logic:
  // - if load: shreg_d = data_in
  // - else if shift: shreg_d = shifted value (insert serial_in or 0)
  // - else hold
  //
  // TODO: Priority: document and implement load vs shift.

  // TODO: Reset: shreg_q=0.

  // Expose parallel output
  always_comb begin
  parallel_out = shreg_q;
  end

endmodule


`;}

      if (qId === 'counter4' ) {
      return `// ============================================================
// ID: counter4 — Parameterizable Barrel Shifter (SLL/SRL/(SRA))
// ============================================================
// Single-cycle (combinational) shifter.
// TODO: Decide whether to implement staged mux barrel shifter or use shift operators.
// TODO: Define out-of-range shift_amt behavior (>= WIDTH). (Spec suggests clamp-to-zeros / sign-fill.)
//
// NOTE: If shift_amt width is clog2(WIDTH), it cannot represent WIDTH exactly,
// so out-of-range only applies if you widen shift_amt or accept invalid inputs.

module barrel_shifter #(
  parameter int unsigned WIDTH = 32,
  parameter bit          HAS_SRA = 1
) (
  input  logic [WIDTH-1:0]                  data_in,
  input  logic [$clog2(WIDTH)-1:0]           shift_amt,
  input  logic [1:0]                         shift_op,   // TODO: encode 00=SLL, 01=SRL, 10=SRA
  output logic [WIDTH-1:0]                   data_out
);

  // TODO: Implement three internal results:
  // - sll_result
  // - srl_result
  // - sra_result (only if HAS_SRA)
  //
  // TODO: Staged implementation approach:
  // - stages = clog2(WIDTH)
  // - stage i conditionally shifts by (1<<i) based on shift_amt[i]
  // TODO: For SRA: fill vacated MSBs with sign bit data_in[WIDTH-1].

  // TODO: Operation select mux:
  // case(shift_op)
  // 00: data_out = sll_result
  // 01: data_out = srl_result
  // 10: data_out = sra_result (if enabled)
  // default: data_out = data_in or 0 (document)
  // endcase

  // TODO: Test points:
  // - shift_amt=0 returns data_in
  // - shift_amt=WIDTH-1 max shift
  // - sign extension checks for SRA

endmodule


`;}

    if (qId === 'pipe1' ) {
      return `// ============================================================
// ID: pipe1 — Pipelined ALU (2-stage or 3-stage) with hazards
// ============================================================
// Goal: Accept a new op every cycle (after fill), with N-cycle latency.
// Use valid bits in every stage; forwarding (bypass) resolves RAW hazards by selecting
// EX inputs from later pipeline stages when rd matches rs.
//
// TODO: Choose pipeline depth and document stage responsibilities:
// - 2-stage example: ST0=EX (compute), ST1=WB (retire/commit)
// - 3-stage example: ST0=ID (latch operands), ST1=EX (compute), ST2=WB (retire)
//
// TODO: Define register spec: src/dest ids, x0 behavior, and whether you model a regfile or just tags.
// TODO: Decide stall/flush support and their priority (flush vs stall).

module pipelined_alu #(
  parameter int unsigned WIDTH    = 32,
  parameter int unsigned REG_ADDR = 5
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

  // TODO: Add EX/WB pipeline registers and forwarding from in-flight results.

endmodule


`;}

      if (qId === 'pipe2' ) {
      return `// ============================================================
// ID: pipe2 — Pipeline stage register with stall/flush
// ============================================================
module pipe_stage_reg #(
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

  // TODO: Flush should inject a bubble; stall should hold current contents.

endmodule


`;}

        if (qId === 'pipe3' ) {
      return `// ============================================================
// ID: pipe3 — Priority encoder
// ============================================================
module priority_encoder #(
  parameter int unsigned N = 8
) (
  input  logic [N-1:0]         request,
  output logic [$clog2(N)-1:0] index,
  output logic                 valid
);

  // TODO: Decide deterministic priority direction and implement the scan.

endmodule


`;}

          if (qId === 'arith1' ) {
      return `// ============================================================
// ID: arith1 — Parameterizable Adder/Subtractor (two's complement)
// ============================================================
// Subtraction via two's complement: A - B = A + (~B) + 1.
// Signed overflow rule (add): when adding same-sign operands yields opposite-sign result.
//
// TODO: Document flag meanings for subtraction:
// - carry_out from adder is often interpreted as "no borrow" for unsigned subtract,
//   and borrow = ~carry_out (if using A + ~B + 1 form).
//
// TODO: Decide whether overflow flag applies to:
// - signed interpretation only (typical), or
// - also provide separate unsigned overflow/underflow flags.

module adder_sub #(
  parameter int unsigned WIDTH = 32
) (
  input  logic [WIDTH-1:0] a,
  input  logic [WIDTH-1:0] b,
  input  logic             sub,
  output logic [WIDTH-1:0] result,
  output logic             carry_out,
  output logic             overflow
);

  // TODO: Implement combined adder/subtractor:
  // B_eff   = sub ? ~B : B
  // carry_in= sub ? 1'b1 : 1'b0
  // {carry_out, result} = A + B_eff + carry_in  (WIDTH+1-bit sum)
  //
  // TODO: Signed overflow:
  // For addition case (sub==0): overflow = (A_sign==B_sign) && (A_sign!=result_sign).
  // For subtraction case (sub==1): either derive subtraction overflow rule, or
  // re-express as A + (~B) + 1 and use a correct signed overflow formulation (document).
  //
  // TODO: Decide if you want separate flags:
  // - unsigned_overflow_add = carry_out
  // - unsigned_underflow_sub = ~carry_out

endmodule


`;}

            if (qId === 'arith2' ) {
      return `// ============================================================
// ID: arith2 — Multiplier (choose sequential or combinational)
// ============================================================
// Sequential shift-and-add multiplier iteratively accumulates partial products across cycles.
// Combinational can be as simple as "result = A * B" and let synthesis infer hardware.
//
// TODO: Choose implementation mode and document latency/throughput:
// - MODE=SEQ: WIDTH-cycle (typical) multi-cycle shift-and-add
// - MODE=COMB: purely combinational (single-cycle latency but large area/timing)
// - MODE=PIPE: multi-stage pipelined (high throughput)
//
// TODO: Define signed vs unsigned behavior (default unsigned).

module seq_multiplier #(
  parameter WIDTH = 16
) (
  input  logic               clk,
  input  logic               rst_n,
  input  logic               start,
  input  logic [WIDTH-1:0]   a,
  input  logic [WIDTH-1:0]   b,
  output logic [2*WIDTH-1:0] product,
  output logic               done,
  output logic               busy
);

  // ----------------------------
  // TODO: Interface semantics
  // ----------------------------
  // TODO: For MODE=SEQ:
  // - start sampled to launch operation
  // - busy high during computation
  // - done pulses when result valid (one cycle), then returns idle
  // TODO: For MODE=COMB:
  // - ignore clk/start/busy/done or tie done=1 when inputs valid (document)

  // ----------------------------
  // TODO: Sequential datapath (MODE=SEQ)
  // ----------------------------
  // Typical registers:
  // - multiplicand (2*WIDTH), multiplier (WIDTH), accumulator (2*WIDTH), count
  // Each cycle:
  // - if (multiplier[0]) accumulator += multiplicand
  // - multiplicand <<= 1; multiplier >>= 1; count++
  // Stop after WIDTH iterations; result=accumulator.

  // ----------------------------
  // TODO: Combinational datapath (MODE=COMB)
  // ----------------------------
  // TODO: result = A * B; (synthesis inferred)

  // ----------------------------
  // TODO: Reset behavior (MODE=SEQ/PIPE)
  // ----------------------------
  // TODO: On reset: busy=0, done=0, internal regs cleared.

endmodule


`;}

              if (qId === 'arith3' ) {
      return `// ============================================================
// ID: arith3 — Sequential Divider (restoring or non-restoring)
// ============================================================
// Restoring division steps (unsigned):
// - Initialize A(remainder)=0, Q(quotient)=dividend, M=divisor, n=WIDTH
// - Repeat: shift {A,Q} left, A = A - M, if A<0 then restore A and set Q0=0 else set Q0=1
//
// TODO: Choose algorithm: restoring (recommended) vs non-restoring.
// TODO: Choose signed vs unsigned (unsigned simpler).
// TODO: Define divide-by-zero outputs and timing (must not hang).

module seq_divider #(
  parameter WIDTH = 16
) (
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

  // ----------------------------
  // TODO: Divide-by-zero handling
  // ----------------------------
  // If divisor==0 on start:
  // - divide_by_zero=1
  // - quotient/remainder set to defined values (e.g., quotient=all1s, remainder=dividend)
  // - done asserted (pulse) and busy not stuck high.

  // ----------------------------
  // TODO: State machine
  // ----------------------------
  // Suggested states: IDLE, INIT, ITERATE, FINISH.
  // TODO: Cycle count: typically WIDTH iterations (+ init/finish).

  // ----------------------------
  // TODO: Registers for restoring division (unsigned)
  // ----------------------------
  // - A: partial remainder (WIDTH+1 bits often used for sign/borrow)
  // - Q: quotient shift register (WIDTH bits)
  // - M: divisor register (WIDTH bits)
  // - count: iteration counter

  // ----------------------------
  // TODO: Iteration step (restoring)
  // ----------------------------
  // 1) Shift left {A,Q} as a combined register.
  // 2) A = A - M.
  // 3) If A negative: A = A + M (restore) and set Q0=0; else set Q0=1.
  // TODO: Define "negative" detection for A (MSB of A in two's complement).

  // ----------------------------
  // TODO: Signed division (optional)
  // ----------------------------
  // TODO: If SIGNED_OP:
  // - capture signs, operate on absolute values, adjust sign of quotient/remainder at end.

  // ----------------------------
  // TODO: Reset
  // ----------------------------
  // TODO: busy=0, done=0, divide_by_zero=0, outputs to known values.

endmodule


`;}

                if (qId === 'bus1' ) {
      return `// ============================================================
// ID: bus1 — Memory-Mapped GPIO with Direction Control
// ============================================================
// Memory-mapped GPIO typically uses registers for OUT/DIR and samples IN,
// with direction controlling whether an output driver is enabled (tri-state OE).
//
// TODO: Document register map (offsets) and read latency (comb vs registered).
// TODO: Decide invalid-address behavior: return 0 / ignore write vs error flag.

module gpio_mm #(
  parameter GPIO_WIDTH = 8
) (
  input  logic                  clk,
  input  logic                  rst_n,
  input  logic [3:0]            address,
  input  logic [GPIO_WIDTH-1:0] write_data,
  input  logic                  write_en,
  input  logic                  read_en,
  output logic [GPIO_WIDTH-1:0] read_data,
  inout  wire [GPIO_WIDTH-1:0]  gpio_pins
);

  // ----------------------------
  // TODO: Register map constants
  // ----------------------------
  // Example offsets:
  // localparam logic [ADDR_W-1:0] ADDR_GPIO_OUT = 'h00;
  // localparam logic [ADDR_W-1:0] ADDR_GPIO_IN  = 'h04;
  // localparam logic [ADDR_W-1:0] ADDR_GPIO_DIR = 'h08;

  logic [GPIO_WIDTH-1:0] gpio_out_q, gpio_dir_q;
  logic [GPIO_WIDTH-1:0] gpio_in_samp; // sampled pin values

  // ----------------------------
  // TODO: GPIO pin drive / tri-state
  // ----------------------------
  // For each bit i:
  // if gpio_dir_q[i]==1: drive gpio_pins[i] with gpio_out_q[i]
  // else: do not drive (Hi-Z) so it behaves like input.
  //
  // TODO: Implement via generate loop and continuous assigns with 'z.

  // ----------------------------
  // TODO: Input sampling
  // ----------------------------
  // TODO: Define GPIO_IN semantics for output pins:
  // - loopback: return gpio_out_q on output bits
  // - or sample actual pin (may reflect contention)
  // TODO: Sample gpio_pins into gpio_in_samp (comb or registered).

  // ----------------------------
  // TODO: Write decode (synchronous)
  // ----------------------------
  always_ff @(posedge clk or negedge rst_n) begin
  if (!rst_n) begin
  // TODO: Reset: gpio_out=0; gpio_dir=0 (all inputs).
  end else begin
  // TODO: if write_en: case(addr) update gpio_out_q or gpio_dir_q; default ignore.
  // TODO: Optionally support byte enables.
  end
  end

  // ----------------------------
  // TODO: Read decode (combinational)
  // ----------------------------
  always_comb begin
  // TODO: Defaults:
  // read_data = 0
  // bus_err = 0
  //
  // TODO: if read_en: case(addr)
  // - OUT: read gpio_out_q
  // - IN:  read gpio_in_samp (or loopback mixed with sampling)
  // - DIR: read gpio_dir_q
  // - default: return 0 and/or bus_err=1 (document)
  end

endmodule


`;}

            if (qId === 'bus2' ) {
      return `// ============================================================
// ID: bus2 — APB Slave Peripheral (AMBA APB)
// ============================================================
// Two-phase transfer:
// - Setup:  PSEL=1, PENABLE=0
// - Access: PSEL=1, PENABLE=1, complete when PREADY=1
// PSLVERR is sampled only on the last cycle when PSEL & PENABLE & PREADY are high.
//
// TODO: Define register map and which regs are RO/WO/RW.
// TODO: Decide wait-state strategy (PREADY always 1 vs insert wait).

module apb_slave #(
  parameter int unsigned ADDR_W = 12,
  parameter int unsigned DATA_W = 32
) (
  input  logic                 PCLK,
  input  logic                 PRESETn,

  input  logic                 PSEL,
  input  logic                 PENABLE,
  input  logic                 PWRITE,
  input  logic [ADDR_W-1:0]    PADDR,
  input  logic [DATA_W-1:0]    PWDATA,

  output logic [DATA_W-1:0]    PRDATA,
  output logic                 PREADY,
  output logic                 PSLVERR
);

  // TODO: Internal registers
  logic [DATA_W-1:0] reg0, reg1, reg2;

  // ----------------------------
  // TODO: Address decode / validity
  // ----------------------------
  // TODO: addr_valid based on PADDR for implemented registers.

  // ----------------------------
  // TODO: PREADY generation
  // ----------------------------
  // Option A: zero-wait: PREADY=1 always.
  // Option B: insert wait states: when in access phase (PSEL && PENABLE) hold PREADY low for N cycles, then raise.
  //
  // TODO: If you insert wait, ensure address/control/data remain stable while PREADY=0 (master requirement).

  // ----------------------------
  // TODO: Transfer completion condition
  // ----------------------------
  // A transfer occurs on: xfer = PSEL && PENABLE && PREADY.
  // - if xfer && PWRITE: sample PWDATA and write reg
  // - if xfer && !PWRITE: PRDATA must be valid for sampling

  // ----------------------------
  // TODO: Write logic
  // ----------------------------
  always_ff @(posedge PCLK or negedge PRESETn) begin
  if (!PRESETn) begin
  // TODO: Reset regs, deassert PSLVERR (recommended low when not sampled).
  end else begin
  // TODO: if (xfer && PWRITE) case(PADDR) ... endcase
  // TODO: writes to RO regs should set PSLVERR on completion cycle (or ignore per spec).
  end
  end

  // ----------------------------
  // TODO: Read data mux
  // ----------------------------
  always_comb begin
  // TODO: Default PRDATA = 0.
  // TODO: Decode PADDR and drive PRDATA for reads.
  // Note: PRDATA is typically driven during setup/access; must be valid by the completion cycle.
  end

  // ----------------------------
  // TODO: PSLVERR generation
  // ----------------------------
  // TODO: PSLVERR should only be asserted meaningfully during completion cycle.
  // Example policy: PSLVERR = xfer && !addr_valid (and/or illegal access).
  // Recommended to drive PSLVERR low otherwise.

endmodule


`;}

if (qId === 'bus3') {
  return `// ============================================================
// Simple AXI-Lite slave with one 32-bit register at address 0x00.
// Supports one read or write transaction at a time.
// AW and W channels are independent and may arrive in any order.

module axi_lite_single_reg #(
  parameter int unsigned ADDR_W = 4,
  parameter int unsigned DATA_W = 32
) (
  input  logic                 ACLK,
  input  logic                 ARESETn,

  // Write address channel
  input  logic                 AWVALID,
  output logic                 AWREADY,
  input  logic [ADDR_W-1:0]    AWADDR,

  // Write data channel
  input  logic                 WVALID,
  output logic                 WREADY,
  input  logic [DATA_W-1:0]    WDATA,
  input  logic [DATA_W/8-1:0]  WSTRB,

  // Write response channel
  output logic                 BVALID,
  input  logic                 BREADY,
  output logic [1:0]           BRESP,

  // Read address channel
  input  logic                 ARVALID,
  output logic                 ARREADY,
  input  logic [ADDR_W-1:0]    ARADDR,

  // Read data channel
  output logic                 RVALID,
  input  logic                 RREADY,
  output logic [DATA_W-1:0]    RDATA,
  output logic [1:0]           RRESP
);

  logic [DATA_W-1:0] reg0;

  // TODO: Internal write tracking
  // Suggested:
  // logic aw_seen, w_seen;
  // logic [ADDR_W-1:0] awaddr_q;
  // logic [DATA_W-1:0] wdata_q;
  // logic [DATA_W/8-1:0] wstrb_q;

  // TODO: READY generation
  // AWREADY high when write address can be accepted
  // WREADY high when write data can be accepted
  // ARREADY high when read address can be accepted

  // TODO: Write flow
  // Capture AWADDR on AW handshake
  // Capture WDATA/WSTRB on W handshake
  // When both are received:
  //   if address == 0x0, update reg0 using WSTRB byte enables
  //   else return error response
  // Assert BVALID after write completes

  // TODO: WSTRB byte-write example
  // for (int i = 0; i < DATA_W/8; i++) begin
  //   if (wstrb_q[i]) reg0[8*i +: 8] <= wdata_q[8*i +: 8];
  // end

  // TODO: BRESP handling
  // 2'b00 = OKAY
  // 2'b10 = SLVERR
  // Hold BVALID until BREADY

  // TODO: Read flow
  // On AR handshake:
  //   if ARADDR == 0x0, RDATA = reg0, RRESP = OKAY
  //   else RDATA = 0, RRESP = SLVERR
  // Assert RVALID and hold until RREADY

  // TODO: Reset
  // Clear reg0 and internal flags
  // Deassert BVALID/RVALID

endmodule
`;
}

if (qId === 'bus4') {
  return `// ============================================================
// AXI-Lite GPIO peripheral.
// Register map:
//   0x00 -> gpio_out register
//   0x04 -> gpio_in status
// Writes update gpio_out. Reads return gpio_out or gpio_in.

module axi_gpio #(
  parameter int unsigned ADDR_W = 4,
  parameter int unsigned DATA_W = 32
) (
  input  logic                 ACLK,
  input  logic                 ARESETn,

  // Write address channel
  input  logic                 AWVALID,
  output logic                 AWREADY,
  input  logic [ADDR_W-1:0]    AWADDR,

  // Write data channel
  input  logic                 WVALID,
  output logic                 WREADY,
  input  logic [DATA_W-1:0]    WDATA,
  input  logic [DATA_W/8-1:0]  WSTRB,

  // Write response channel
  output logic                 BVALID,
  input  logic                 BREADY,
  output logic [1:0]           BRESP,

  // Read address channel
  input  logic                 ARVALID,
  output logic                 ARREADY,
  input  logic [ADDR_W-1:0]    ARADDR,

  // Read data channel
  output logic                 RVALID,
  input  logic                 RREADY,
  output logic [DATA_W-1:0]    RDATA,
  output logic [1:0]           RRESP,

  // GPIO ports
  input  logic [DATA_W-1:0]    gpio_in,
  output logic [DATA_W-1:0]    gpio_out
);

  // TODO: Internal write tracking for AW/W channel pairing
  // Suggested:
  // logic aw_seen, w_seen;
  // logic [ADDR_W-1:0] awaddr_q;
  // logic [DATA_W-1:0] wdata_q;
  // logic [DATA_W/8-1:0] wstrb_q;

  // TODO: Register map
  // 0x00 -> writable gpio_out register
  // 0x04 -> read-only gpio_in value

  // TODO: Write logic
  // If AWADDR == 0x00, update gpio_out using WSTRB
  // If AWADDR == 0x04, either ignore write or return SLVERR
  // If invalid address, return SLVERR

  // TODO: Read logic
  // ARADDR == 0x00 -> return gpio_out
  // ARADDR == 0x04 -> return gpio_in
  // else return 0 with SLVERR

  // TODO: Response behavior
  // BVALID held until BREADY
  // RVALID held until RREADY

  // TODO: Reset
  // Clear gpio_out to 0
  // Deassert BVALID/RVALID

endmodule
`;
}

if (qId === 'bus5') {
  return `// ============================================================
// AXI-Lite slave with four 32-bit registers.
// Register map:
//   0x00 -> reg0
//   0x04 -> reg1
//   0x08 -> reg2
//   0x0C -> reg3

module axi_reg_file #(
  parameter int unsigned ADDR_W = 4,
  parameter int unsigned DATA_W = 32
) (
  input  logic                 ACLK,
  input  logic                 ARESETn,

  // Write address channel
  input  logic                 AWVALID,
  output logic                 AWREADY,
  input  logic [ADDR_W-1:0]    AWADDR,

  // Write data channel
  input  logic                 WVALID,
  output logic                 WREADY,
  input  logic [DATA_W-1:0]    WDATA,
  input  logic [DATA_W/8-1:0]  WSTRB,

  // Write response channel
  output logic                 BVALID,
  input  logic                 BREADY,
  output logic [1:0]           BRESP,

  // Read address channel
  input  logic                 ARVALID,
  output logic                 ARREADY,
  input  logic [ADDR_W-1:0]    ARADDR,

  // Read data channel
  output logic                 RVALID,
  input  logic                 RREADY,
  output logic [DATA_W-1:0]    RDATA,
  output logic [1:0]           RRESP
);

  logic [DATA_W-1:0] reg0, reg1, reg2, reg3;

  // TODO: Internal state for write address/data capture
  // Suggested:
  // logic aw_seen, w_seen;
  // logic [ADDR_W-1:0] awaddr_q;
  // logic [DATA_W-1:0] wdata_q;
  // logic [DATA_W/8-1:0] wstrb_q;

  // TODO: READY generation
  // Accept AW and W independently
  // Allow one outstanding write and one outstanding read at a time

  // TODO: Write decode
  // case (awaddr_q[3:2])
  //   2'b00: write reg0
  //   2'b01: write reg1
  //   2'b10: write reg2
  //   2'b11: write reg3
  // endcase
  // Apply WSTRB for partial writes

  // TODO: Invalid write address
  // If address outside 0x00/0x04/0x08/0x0C, return SLVERR

  // TODO: Read decode
  // case (ARADDR[3:2])
  //   2'b00: RDATA = reg0
  //   2'b01: RDATA = reg1
  //   2'b10: RDATA = reg2
  //   2'b11: RDATA = reg3
  // endcase
  // Invalid address -> RDATA = 0, RRESP = SLVERR

  // TODO: Hold response valid signals
  // BVALID until BREADY
  // RVALID until RREADY

  // TODO: Reset
  // Clear reg0-reg3 and all response/handshake tracking flags

endmodule
`;
}

if (qId === 'bus6') {
  return `// ============================================================
// Read-only AXI-Lite peripheral.
module axi_read_only_status #(
  parameter VERSION = 32'h0000_0001
) (
  input  logic        ACLK,
  input  logic        ARESETn,
  input  logic [31:0] status_in,
  input  logic        AWVALID,
  output logic        AWREADY,
  input  logic [31:0] AWADDR,
  input  logic        WVALID,
  output logic        WREADY,
  input  logic [31:0] WDATA,
  input  logic [3:0]  WSTRB,
  output logic        BVALID,
  input  logic        BREADY,
  output logic [1:0]  BRESP,
  input  logic        ARVALID,
  output logic        ARREADY,
  input  logic [31:0] ARADDR,
  output logic        RVALID,
  input  logic        RREADY,
  output logic [31:0] RDATA,
  output logic [1:0]  RRESP
);

  // TODO: Reads return VERSION/status_in; writes respond with SLVERR.

endmodule
`;
}

if (qId === 'bus7') {
  return `// ============================================================
// Write-only AXI-Lite peripheral.
// Register map:
//   0x00 -> enable register
//   0x04 -> mode register
// Reads are not allowed and should return an error response.

module axi_write_only_ctrl (
  parameter int unsigned ADDR_W = 4,
  parameter int unsigned DATA_W = 32
) (
  input  logic                 ACLK,
  input  logic                 ARESETn,

  // Write address channel
  input  logic                 AWVALID,
  output logic                 AWREADY,
  input  logic [ADDR_W-1:0]    AWADDR,

  // Write data channel
  input  logic                 WVALID,
  output logic                 WREADY,
  input  logic [DATA_W-1:0]    WDATA,
  input  logic [DATA_W/8-1:0]  WSTRB,

  // Write response channel
  output logic                 BVALID,
  input  logic                 BREADY,
  output logic [1:0]           BRESP,

  // Read address channel
  input  logic                 ARVALID,
  output logic                 ARREADY,
  input  logic [ADDR_W-1:0]    ARADDR,

  // Read data channel
  output logic                 RVALID,
  input  logic                 RREADY,
  output logic [DATA_W-1:0]    RDATA,
  output logic [1:0]           RRESP,

  // Control outputs
  output logic                 enable_reg,
  output logic [DATA_W-1:0]    mode_reg
);

  // TODO: Internal write tracking
  // Suggested:
  // logic aw_seen, w_seen;
  // logic [ADDR_W-1:0] awaddr_q;
  // logic [DATA_W-1:0] wdata_q;
  // logic [DATA_W/8-1:0] wstrb_q;

  // TODO: Write decode
  // 0x00 -> enable_reg
  // 0x04 -> mode_reg
  // invalid address -> BRESP = SLVERR
  // Apply WSTRB to support byte writes

  // TODO: Read behavior
  // Any read attempt should return:
  //   RDATA = 0
  //   RRESP = 2'b10 (SLVERR)
  // Assert RVALID and hold until RREADY

  // TODO: READY generation
  // AWREADY/WREADY for normal write acceptance
  // ARREADY can still accept reads even if response will be an error

  // TODO: Reset
  // Clear enable_reg and mode_reg
  // Deassert BVALID/RVALID

endmodule
`;
}

                    if (qId === 'bus8' ) {
          return `// ============================================================
// ID: bus8 — Bus Arbiter (Fixed-Priority or Round-Robin)
// ============================================================
// Ensures one-hot (or all-zero) grant. Round-robin uses rotating pointer for fairness.
//
// TODO: Choose arbitration mode:
// - FIXED: lowest index wins
// - RR: rotate priority after each successful grant
// TODO: Define pointer update condition: on grant_valid or on external accept.

module bus_arbiter #(
  parameter int unsigned NUM_MASTERS = 4,
  parameter bit          ROUND_ROBIN = 1
) (
  input  logic                       clk,
  input  logic                       rst_n,

  input  logic [NUM_MASTERS-1:0]     request,
  output logic [NUM_MASTERS-1:0]     grant,
  output logic                       grant_valid
);

  // TODO: For RR, keep last_grant pointer.
  logic [$clog2(NUM_MASTERS)-1:0] last_grant;

  // ----------------------------
  // TODO: Combinational grant generation
  // ----------------------------
  // TODO: Defaults: grant='0; grant_valid = |request;
  // TODO: FIXED: grant lowest-index set bit (priority encoder).
  // TODO: RR: search from last_grant+1 with wrap; produce one-hot grant.

  // ----------------------------
  // TODO: Pointer update (RR)
  // ----------------------------
  // TODO: On reset: init last_grant (0 or NUM_MASTERS-1, document).
  // TODO: If grant_valid (or accept): update last_grant to granted index.
  // TODO: If no requests: hold last_grant.

  // ----------------------------
  // TODO: One-hot assertion (testbench)
  // ----------------------------
  // assert($onehot0(grant));

endmodule


`;}
  if (qId === 'rtl1') {
  return `// ============================================================
// ID: rtl1 — Edge / Toggle Detector
// ============================================================
// Goal: detect rising, falling, and any toggle using previous-sample compare. 

module edge_toggle_detect (
  input  logic clk,
  input  logic rst_n,
  input  logic sig_in,
  output logic rise_pulse,
  output logic fall_pulse,
  output logic toggle_pulse
);

  // TODO: Create 1-cycle delayed sample (sig_prev).
  // Why: edges are detected by comparing current sample with previous sample.
  logic sig_prev;

  // TODO: Sequential sample of sig_in into sig_prev (always_ff).
  // Why: makes comparison synchronous and stable.
  // always_ff @(posedge clk or negedge rst_n) ...

  // TODO: Combinational pulse equations.
  // Why: each pulse is a pure function of (sig_in, sig_prev).

  // TODO: Decide reset init for sig_prev.
  // Why: prevents spurious pulse after reset release.

endmodule
`;
  }

  if (qId === 'rtl2') {
  return `// ============================================================
// ID: rtl2 — 1-Cycle High Pulse Detector (0->1->0)
// ============================================================
// Goal: detect exactly-one-cycle high pulse using 2-cycle history. 

module one_cycle_pulse (
  input  logic clk,
  input  logic rst_n,
  input  logic sig_in,
  output logic onecycle_pulse
);

  // TODO: Two history registers (d1,d2).
  // Why: need a 3-sample window: (d2,d1,current).
  logic d1, d2;

  // TODO: Shift history each clock (always_ff).


  // TODO: Detect pattern 0,1,0.

  // TODO: Reset values for d1/d2.

endmodule
`;
  }

  if (qId === 'rtl3') {
  return `// ============================================================
// ID: rtl3 — Sequence Detector FSM (10110)
// ============================================================
// Goal: FSM asserts 1-cycle match when serial pattern 10110 completes. 

module seq_det_10110 (
  input  logic clk,
  input  logic rst_n,
  input  logic bit_in,
  output logic match_pulse
);

  // TODO: Define states for partial matches.
  // Why: each state encodes "how many prefix bits matched so far".
  // Example: IDLE, GOT1, GOT10, GOT101, GOT1011.
  // typedef enum logic [2:0] ...

  // TODO: Implement state register (always_ff).
  // Why: FSM must be synchronous.

  // TODO: Implement next-state logic (always_comb).
  // Why: transitions depend on bit_in and overlap policy.

  // TODO: Define overlap behavior.
  // Why: on mismatch you may go to a non-IDLE state if suffix is a prefix.

  // TODO: Generate match_pulse.
  // Why: usually asserted on the cycle the last bit '0' is accepted.

endmodule
`;
  }

  if (qId === 'rtl4') {
  return `// ============================================================
// ID: rtl4 — Pattern 10110 Anywhere in Last N Samples
// ============================================================
// Goal: shift-register window + decode all alignments. 

module pattern_in_window #(
  parameter int N = 8
) (
  input  logic clk,
  input  logic rst_n,
  input  logic bit_in,
  output logic found
);

  // TODO: Define pattern and length.
  // Why: keeps code maintainable.
  // localparam int K = 5;
  // localparam logic [K-1:0] PATTERN = 5'b10110;

  // TODO: N-bit shift register.
  // Why: stores last N input samples.
  logic [N-1:0] shreg;

  // TODO: Update shreg every clk (always_ff).
  // Why: sliding window capture.

  // TODO: Compare every K-bit slice and OR results.
  // Why: pattern may start at any position in the window.
  // found = '0;

  // TODO: Guard for N<K (optional).
  // Why: avoid invalid part-select/generate.

endmodule
`;
  }

  if (qId === 'rtl5') {
  return `// ============================================================
// ID: rtl5 — Debounce + Synchronize + Rising Pulse
// ============================================================
// Goal: 2FF sync async input, require stable-high for >=2 cycles, pulse on rise. 

module debounce_sync (
  input  logic clk,
  input  logic rst_n,
  input  logic async_in,
  output logic debounced_level,
  output logic debounced_rise_pulse
);

  // TODO: 2FF synchronizer (s1,s2).
  // Why: reduce metastability risk when bringing async_in into clk domain.
  logic s1, s2;

  // TODO: Stability filter state.
  // Why: require 2 consecutive high samples before asserting debounced_level.
  // Options: 2-bit history shift register, or small counter.
  logic [1:0] hi_hist;

  // TODO: Edge detect on debounced_level.


  // TODO: always_ff: synchronizer + filter + delayed debounced.

  // TODO: Filter rule.
  // Why: ">=2 cycles high" acceptance; optionally do symmetric deassert on 2 lows.

  // TODO: debounced_rise_pulse equation.
  // Why: 1-cycle pulse generation.
  // debounced_rise_pulse = debounced_level & ~debounced_d;

endmodule
`;
  }

  if (qId === 'rtl6') {
  return `// ============================================================
// ID: rtl6 — Binary Counter + Gray Output
// ============================================================
// Goal: binary counter increments; gray = bin ^ (bin >> 1). 

module bin_to_gray_counter #(
  parameter int W = 4
) (
  input  logic         clk,
  input  logic         rst_n,
  input  logic         enable,
  output logic [W-1:0] bin_count,
  output logic [W-1:0] gray_count
);

  // TODO: bin_count register increments when enable=1.
  // Why: gray coding is derived from stable binary count.
  // always_ff @(posedge clk or negedge rst_n) ...

  // TODO: gray_count generation.
  // Why: standard conversion ensures only 1 bit changes between successive gray codes.

  // TODO: Decide whether gray_count is registered or combinational.

endmodule
`;
  }

  if (qId === 'rtl7') {
  return `// ============================================================
// ID: rtl7 — Divisible-by-3 FSM (serial bits)
// ============================================================
// Goal: track remainder mod 3 (0/1/2) as bits stream in; div_by_3 when rem==0. 

module div_by_3 (
  input  logic clk,
  input  logic rst_n,
  input  logic bit_in,
  output logic div_by_3
);

  // TODO: Choose bit-append convention and document.
  // Why: transitions depend on whether bit_in is appended as LSB or MSB.

  // TODO: Define 3 FSM states = remainder {0,1,2}.
  typedef enum logic [1:0] {REM0, REM1, REM2} state_t;

  // TODO: State register (always_ff) with reset to REM0.

  // TODO: Next-state logic derived from modulo update.

  // TODO: Output logic.

endmodule
`;
  }

  if (qId === 'rtl8') {
  return `// ============================================================
// ID: rtl8 — Fibonacci Generator (enable)
// ============================================================
// Goal: maintain (a,b), update on enable: (a,b)<-(b,a+b). 

module fib_gen #(
  parameter int W = 32
) (
  input  logic         clk,
  input  logic         rst_n,
  input  logic         enable,
  output logic [W-1:0] fib_out
);

  // TODO: Two registers a and b.
  // Why: Fibonacci recurrence needs previous two values.
  logic [W-1:0] a, b;

  // TODO: Define output convention.


  // TODO: Compute sum.
  logic [W-1:0] sum;

  // TODO: always_ff update on enable.

  // TODO: Reset init values.

endmodule
`;
  }

  if (qId === 'rtl9') {
  return `// ============================================================
// ID: rtl9 — Timebase from 1ms tick (sec/min/hr)
// ============================================================
// Goal: count 1ms pulses to generate 1-cycle sec/min/hour pulses. 

module timebase (
  input  logic clk,
  input  logic rst_n,
  input  logic tick_1ms,
  output logic sec_pulse,
  output logic min_pulse,
  output logic hour_pulse
);

  // TODO: ms counter 0..999 (counts tick_1ms events).
  logic [9:0] ms_cnt;

  // TODO: sec counter 0..59 (counts sec_pulse events).
  logic [5:0] sec_cnt;

  // TODO: min counter 0..59 (counts min_pulse events).
  logic [5:0] min_cnt;

  // TODO: Use tick_1ms as clock-enable.

  // TODO: Generate sec_pulse on ms_cnt rollover.
  // Why: single-cycle pulse at terminal count (999 -> 0).

  // TODO: Generate min_pulse on sec_cnt rollover (driven by sec_pulse).
  // Why: cascade timebase hierarchy.

  // TODO: Generate hour_pulse on min_cnt rollover (driven by min_pulse).

endmodule
`;
  }

  if (qId === 'rtl10') {
  return `// ============================================================
// ID: rtl10 — Clock Divide-by-2
// ============================================================
// Goal: toggle output every rising edge -> clk/2. 

module clk_div2 (
  input  logic clk,
  input  logic rst_n,
  output logic clk_div2
);

  // TODO: Toggle flop for clk_div2.
  // Why: simplest divide-by-2 is a T-flop behavior.
  // always_ff @(posedge clk or negedge rst_n) ...

  // TODO: Reset init value.
  // Why: deterministic phase after reset.

endmodule
`;
  }

  if (qId === 'rtl11') {
  return `// ============================================================
// ID: rtl11 — Clock Divide-by-3 (~50% duty, glitch-free)
// ============================================================
// Goal: odd divider with ~50% duty typically uses posedge+negedge paths. 

module clk_div3_50 (
  input  logic clk,
  input  logic rst_n,
  output logic clk_div3_50
);

  // TODO: Posedge counter (mod-3) to generate a pulse/phase signal.
  // Why: establishes /3 sequencing on posedges.
  logic [1:0] pos_cnt;

  // TODO: Create a registered pulse on posedge at a chosen count.
  // Why: registered control ensures glitch-free combine.
  logic rise_pulse_reg;

  // TODO: Capture/transfer on negedge (negedge flop).
  // Why: uses both edges to balance duty cycle for odd divide.
  logic neg_pulse_reg;

  // TODO: Combine registered terms to form output clock (e.g., OR).

  // TODO: Reset all internal regs.

endmodule
`;
  }

  if (qId === 'rtl12') {
  return `// ============================================================
// ID: rtl12 — Clock Divide-by-N (~50% duty)
// ============================================================
// Goal: support even/odd N; keep output glitch-free. 

module clk_divN #(
  parameter int N = 4
) (
  input  logic clk,
  input  logic rst_n,
  output logic clk_divN
);

  // TODO: Validate N >= 2 (optional assert).
  // Why: divider must have a meaningful period.

  // TODO: Even N strategy.

  // TODO: Odd N strategy.
  // Why: ~50% duty for odd N generally needs dual-edge or more complex FSM.


endmodule
`;
  }

  if (qId === 'rtl13') {
  return `// ============================================================
// ID: rtl13 — Glitch-Free Clock Gating Cell (ICG-style)
// ============================================================
// Goal: latch enable when clk is low, AND with clk to avoid glitches. 

module icg_cell (
  input  logic clk_in,
  input  logic enable,
  output logic clk_gated
);

  // TODO: Latch enable when clk_in is low.
  // Why: if enable changes while clk_in is high, gating must not create runt pulses.
  logic en_latched;

  // TODO: Implement latch (always_latch or negedge FF modeling).
  // Why: standard ICG uses level-sensitive latch transparent during clk low.
  // always_latch if (!clk_in) en_latched <= enable;

  // TODO: Gate the clock.
  // Why: AND is typical for active-high enable.
  // assign clk_gated = clk_in & en_latched;

  // TODO: (Optional) add test_enable/scan_enable to force clocks on in test.
  // Why: many flows require ungated clocks during scan.

endmodule
`;
  }

  if (qId === 'rtl14') {
  return `// ============================================================
// ID: rtl14 — Reset: Async Assert, Sync Deassert
// ============================================================
// Goal: assert reset immediately, release reset cleanly on clk edge via 2FF chain. 

module reset_sync (
  input  logic clk,
  input  logic async_rst_n,
  output logic rst_n_sync
);

  // TODO: Two-stage synchronizer flops for deassertion.
  // Why: prevents metastability when async reset is released.
  logic r1, r2;

  // TODO: Use async clear on flops.
  // Why: async assertion requirement (reset takes effect without clock).
  // always_ff @(posedge clk or negedge async_rst_n) ...

  // TODO: Shift in '1' when async_rst_n is high.
  // Why: deassert becomes synchronous after two cycles.
  // r1 <= 1'b1; r2 <= r1;

  // TODO: Drive rst_n_sync from last stage.
  // Why: clean synchronized reset for rest of logic.
  // assign rst_n_sync = r2;

endmodule
`;
  }

  if (qId === 'rtl15') {
  return `// ============================================================
// ID: rtl15 — CDC 2-FF Synchronizer (1-bit)
// ============================================================
// Goal: synchronize async signal into dst_clk domain using two flops. 

module two_ff_sync (
  input  logic dst_clk,
  input  logic dst_rst_n,
  input  logic async_sig_in,
  output logic sig_sync
);

  // TODO: Two flops in destination domain.
  // Why: first flop may metastabilize; second flop greatly reduces propagation risk.
  logic s1, s2;

  // TODO: always_ff on dst_clk.
  // Why: synchronizer must be clocked only by destination clock.
  // always_ff @(posedge dst_clk or negedge dst_rst_n) ...

  // TODO: Assign output from second flop.
  // Why: use the stabilized version.
  // assign sig_sync = s2;

  // TODO: (Optional) attributes for sync regs.
  // Why: helps synthesis/STA treat these as CDC synchronizers.

endmodule
`;
  }

  if (qId === 'rtl16') {
  return `// ============================================================
// ID: rtl16 — CDC Handshake (fast->slow) (req/ack)
// ============================================================
// Goal: reliable event transfer; req held until ack observed; both directions synced. 

module handshake_cdc (
  // Fast domain
  input  logic fast_clk,
  input  logic fast_rst_n,
  input  logic send_req,
  output logic fast_busy,

  // Slow domain
  input  logic slow_clk,
  input  logic slow_rst_n,
  output logic slow_data_valid
);

  // TODO: Define protocol (level-based recommended).

  // TODO: Fast domain: generate/hold req_level until ack returns.

  // TODO: Slow domain: synchronize req_level, detect a new request, then pulse slow_data_valid and raise ack_level.

  // TODO: Synchronizers for req and ack.

  // TODO: Clear conditions.

endmodule
`;
  }

  if (qId === 'rtl17') {
  return `// ============================================================
// ID: rtl17 — Binary Pointer + Gray Pointer (CDC/FIFO-style)
// ============================================================
// Goal: maintain binary counter and compute Gray version for safe CDC compare. 

module gray_ptr #(
  parameter int W = 4
) (
  input  logic         clk,
  input  logic         rst_n,
  input  logic         inc,
  output logic [W-1:0] bin_ptr,
  output logic [W-1:0] gray_ptr
);

  // TODO: Binary pointer register increments when inc=1.
  // Why: binary pointer is convenient for local addressing.
  // always_ff @(posedge clk or negedge rst_n) ...

  // TODO: Compute Gray pointer.
  // Why: Gray code ensures only one bit changes per increment, safer for CDC sampling.
  // gray_ptr = bin_ptr ^ (bin_ptr >> 1);

  // TODO: Decide whether gray_ptr is registered.

endmodule
`;
  }


if (qId === 'misc1' ) {
      return `// ============================================================
// ID: misc1 — Rising/Falling Edge Detector (single-cycle pulses)
// ============================================================
// Standard approach: register previous sample and compare:
// rise when (sig_in==1 && sig_prev==0), fall when (sig_in==0 && sig_prev==1).
//
// TODO: If sig_in is asynchronous, add a 2-FF synchronizer before edge detect to reduce metastability risk.

module edge_detector #(
  parameter bit RESET_PREV = 1'b0
) (
  input  logic clk,
  input  logic rst_n,
  input  logic sig_in,
  output logic rise_pulse,
  output logic fall_pulse
);

  logic sig_prev;

  // TODO: Register previous sample each cycle; init on reset.
  // always_ff @(posedge clk or negedge rst_n) ...

  // TODO: Combinational pulse generation:
  // rise_pulse =  sig_in & ~sig_prev
  // fall_pulse = ~sig_in &  sig_prev

endmodule


`;}

            if (qId === 'misc2' ) {
      return `// ============================================================
// ID: misc2 — Top-K (or Max) Value Tracker for Streaming Data
// ============================================================
// Maintain K registers sorted descending; on each in_valid, compare and insert if needed.
// TODO: Document signed vs unsigned compare and duplicate policy (allow duplicates vs unique only).

module top_k_tracker #(
  parameter int unsigned K          = 3,
  parameter int unsigned DATA_WIDTH = 8
) (
  input  logic                  clk,
  input  logic                  rst_n,
  input  logic                  in_valid,
  input  logic [DATA_WIDTH-1:0] in_data,
  output logic [DATA_WIDTH-1:0] top_values [K]
);

  // TODO: Storage: top[0]..top[K-1], descending (top[0] largest).
  logic [K-1:0][DATA_WIDTH-1:0] top_q, top_d;

  // TODO: Reset: initialize to minimum representable (0 for unsigned, most-negative for signed).
  // TODO: On in_valid:
  // - If UNIQUE_ONLY: first check if in_data equals any top[i]; if so, skip.
  // - Find insertion position where in_data > top[i], insert, shift down, evict last.
  // TODO: For small K, implement compare-and-swap style network; for large K, consider iterative loop.

  // TODO: updated pulses when a new value enters top-K (or any top changes).

endmodule


`;}

              if (qId === 'misc3' ) {
      return `// ============================================================
// ID: misc3 — Sliding Window Min/Max (last W samples)
// ============================================================
// Naive method: store W samples, recompute min/max via comparator reduction when window updates.
// TODO: Document warm-up behavior: out_valid only after W samples received.

module sliding_window_minmax #(
  parameter WINDOW_SIZE = 4,
  parameter DATA_WIDTH  = 8
) (
  input  logic                  clk,
  input  logic                  rst_n,
  input  logic                  in_valid,
  input  logic [DATA_WIDTH-1:0] in_data,
  output logic [DATA_WIDTH-1:0] min_out,
  output logic [DATA_WIDTH-1:0] max_out,
  output logic                  out_valid
);

  localparam int unsigned PTR_W   = $clog2(WINDOW_SIZE);
  localparam int unsigned COUNT_W = $clog2(WINDOW_SIZE+1);

  // TODO: Circular buffer
  logic [WINDOW_SIZE-1:0][DATA_WIDTH-1:0] window_mem;
  logic [PTR_W-1:0]                       wr_ptr;
  logic [COUNT_W-1:0]                     sample_count;

  // TODO: On in_valid: write window_mem[wr_ptr] <= in_data; wr_ptr++; sample_count saturates at WINDOW_SIZE.
  // TODO: out_valid = (sample_count == WINDOW_SIZE).

  // TODO: Min/max compute:
  // Option A: full scan combinational when out_valid (or always), O(W) comparators.
  // Option B: comparator tree.
  // TODO: Signed compare uses $signed() if SIGNED_CMP.

endmodule


`;}

                if (qId === 'misc4' ) {
      return `// ============================================================
// ID: misc4 — Parameterizable PWM Generator (counter compare)
// ============================================================
// PWM basics: counter counts 0..PERIOD-1, and comparator sets output high while count < DUTY.
//
// TODO: Choose whether PERIOD/DUTY are parameters or runtime inputs.
// TODO: If runtime configurable, document update timing (immediate vs at period boundary to avoid glitches).

module pwm_gen #(
  parameter COUNTER_WIDTH = 8,
  parameter PERIOD        = 100,
  parameter DUTY          = 50
) (
  input  logic clk,
  input  logic rst_n,
  output logic pwm_out
);

  logic [COUNTER_WIDTH-1:0] cnt_q, cnt_d;

  // TODO: Counter update:
  // if (cnt_q == period-1) cnt_d = 0; else cnt_d = cnt_q + 1;

  // TODO: Comparator output:
  // pwm_out = (cnt_q < duty);  // edge cases: duty=0 => always 0, duty=period => always 1.

  // TODO: Reset: cnt_q=0, pwm_out=0 (or define initial).

  // TODO: Add parameter/legal checks:
  // - require 1 <= period <= 2^COUNTER_WIDTH
  // - require 0 <= duty <= period

endmodule


`;}       
    // Generic RTL template
    return `// TODO: Implement your RTL design
`;}

  return null;
};
