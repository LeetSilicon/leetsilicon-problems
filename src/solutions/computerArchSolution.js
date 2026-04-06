/**
 * computerArchSolution.js — Golden solutions + SystemVerilog testbenches for Computer Architecture
 * Each entry: { solution: `RTL module`, testbench: `self-checking TB with pass/fail` }
 * Usage: import { computerArchSolutions } from './computerArchSolutions';
 */
export const computerArchSolutions = (qId, language) => {
  if (language === 'systemverilog') {

    // ─── Cache & Memory ───────────────────────────────────────────────────────

    if (qId === 'cache1') {
      return {
        solution: `module cache_lru4 #(
  parameter NUM_SETS  = 64,
  parameter WAY_COUNT = 4
)(
  input  logic                          clk,
  input  logic                          rst_n,
  input  logic                          req_valid,
  input  logic                          hit,
  input  logic                          refill,
  input  logic [$clog2(NUM_SETS)-1:0]  req_set,
  input  logic [$clog2(WAY_COUNT)-1:0] hit_way,
  input  logic [$clog2(WAY_COUNT)-1:0] refill_way,
  input  logic [WAY_COUNT-1:0]         way_valid,
  output logic                          victim_valid,
  output logic [$clog2(WAY_COUNT)-1:0] victim_way
);
  // Flattened rank storage: rank_flat[set*WAY_COUNT + way]
  logic [1:0] rank_flat [NUM_SETS * WAY_COUNT];

  logic [$clog2(WAY_COUNT)-1:0] acc;
  logic [1:0] old_r;
  logic [$clog2(NUM_SETS * WAY_COUNT)-1:0] base;

  always_comb begin
    acc  = hit ? hit_way : refill_way;
    base = req_set * WAY_COUNT;
    old_r = rank_flat[base + acc];
  end

  always_comb begin
    victim_valid = 1;
    victim_way   = '0;
    if (way_valid != '1) begin
      for (int i = 0; i < WAY_COUNT; i++) begin
        if (!way_valid[i]) begin
          victim_way = i[$clog2(WAY_COUNT)-1:0];
          break;
        end
      end
    end else begin
      for (int i = 0; i < WAY_COUNT; i++) begin
        if (rank_flat[base + i] == 0) begin
          victim_way = i[$clog2(WAY_COUNT)-1:0];
          break;
        end
      end
    end
  end

  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      for (int s = 0; s < NUM_SETS; s++)
        for (int w = 0; w < WAY_COUNT; w++)
          rank_flat[s * WAY_COUNT + w] <= w[1:0];
    end else if (req_valid && (hit || refill)) begin
      for (int w = 0; w < WAY_COUNT; w++) begin
        if (w[$clog2(WAY_COUNT)-1:0] == acc)
          rank_flat[base + w] <= 2'd3;
        else if (rank_flat[base + w] > old_r)
          rank_flat[base + w] <= rank_flat[base + w] - 1;
      end
    end
  end
endmodule`,
        testbench: `module tb;
  logic        clk;
  logic        rst_n, req_valid, hit, refill;
  logic [5:0]  req_set;
  logic [1:0]  hit_way, refill_way, victim_way;
  logic [3:0]  way_valid;
  logic        victim_valid;
  int          p = 0, f = 0;

  initial clk = 0;
  always #5 clk = ~clk;
  cache_lru4 #(.NUM_SETS(64)) dut (.*);
  initial begin #100_000; $display("FATAL: timeout"); $fatal; end

  initial begin
    rst_n=0; req_valid=0; hit=0; refill=0; way_valid=0; req_set=0;
    hit_way=0; refill_way=0;
    @(posedge clk); @(posedge clk); rst_n=1;
    @(posedge clk); @(negedge clk);

    // Cold miss — no valid ways
    req_valid=1; req_set=0; way_valid=4'b0000;
    @(posedge clk); @(negedge clk);
    if (victim_way == 0) begin p++; $display("PASS: cold miss way0"); end
    else begin f++; $display("FAIL: cold miss got %0d", victim_way); end

    // Fill 4 ways: drive refill_way at negedge, posedge latches it
    @(negedge clk); refill=1; refill_way=0;
    @(posedge clk); @(negedge clk); way_valid=4'b0001;
    refill_way=1;
    @(posedge clk); @(negedge clk); way_valid=4'b0011;
    refill_way=2;
    @(posedge clk); @(negedge clk); way_valid=4'b0111;
    refill_way=3;
    @(posedge clk); @(negedge clk); way_valid=4'b1111;
    refill=0;

    @(posedge clk); @(negedge clk);
    if (victim_way == 0) begin p++; $display("PASS: LRU=way0 after fill"); end
    else begin f++; $display("FAIL: expected way0 got %0d", victim_way); end

    // Hit way 0 → way 1 becomes LRU
    @(negedge clk); hit=1; hit_way=0;
    @(posedge clk); @(negedge clk); hit=0;
    @(posedge clk); @(negedge clk);
    if (victim_way == 1) begin p++; $display("PASS: LRU=way1 after hit0"); end
    else begin f++; $display("FAIL: expected way1 got %0d", victim_way); end

    // Hit way 1 → way 2 becomes LRU
    @(negedge clk); hit=1; hit_way=1;
    @(posedge clk); @(negedge clk); hit=0;
    @(posedge clk); @(negedge clk);
    if (victim_way == 2) begin p++; $display("PASS: LRU=way2 after hit1"); end
    else begin f++; $display("FAIL: expected way2 got %0d", victim_way); end

    // Independent set test
    req_set=1; way_valid=4'b0000;
    @(posedge clk); @(negedge clk);
    if (victim_way == 0) begin p++; $display("PASS: set1 independent"); end
    else begin f++; $display("FAIL: set1 got %0d", victim_way); end

    req_valid=0; @(posedge clk);
    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule`
      };
    }

    if (qId === 'cache2') {
      return {
        solution: `module cache_plru #(
  parameter NUM_SETS = 64,
  parameter N_WAYS   = 4
)(
  input  logic                         clk,
  input  logic                         rst_n,
  input  logic                         access_valid,
  input  logic [$clog2(NUM_SETS)-1:0] access_set,
  input  logic [$clog2(N_WAYS)-1:0]   access_way,
  output logic [$clog2(N_WAYS)-1:0]   victim_way
);
  localparam LEVELS    = $clog2(N_WAYS);
  localparam TREE_BITS = N_WAYS - 1;

  logic [TREE_BITS-1:0] tree [NUM_SETS];

  // Victim selection: walk tree following bits
  always_comb begin
    int node;
    node = 0;
    victim_way = '0;
    for (int l = 0; l < LEVELS; l++) begin
      if (tree[access_set][node]) begin
        victim_way[(LEVELS-1)-l] = 1;
        node = 2*node + 2;
      end else begin
        victim_way[(LEVELS-1)-l] = 0;
        node = 2*node + 1;
      end
    end
  end

  // Update: flip bits along access path
  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      for (int s = 0; s < NUM_SETS; s++)
        tree[s] <= '0;
    end else if (access_valid) begin
      // Compute updated tree inline to avoid comb feedback
      automatic int node = 0;
      automatic logic dir;
      for (int l = 0; l < LEVELS; l++) begin
        dir = access_way[(LEVELS-1)-l];
        tree[access_set][node] <= !dir;
        node = dir ? (2*node + 2) : (2*node + 1);
      end
    end
  end
endmodule`,
        testbench: `module tb;
  logic       clk;
  logic       rst_n, access_valid;
  logic [5:0] access_set;
  logic [1:0] access_way, victim_way;
  int         p = 0, f = 0;

  // Clock generation
  initial clk = 0;
  always #5 clk = ~clk;
  // DUT instantiation
  cache_plru #(.NUM_SETS(64), .N_WAYS(4)) dut (.*);

  initial begin
    // Reset sequence
    rst_n        = 0;
    access_valid = 0;
    access_set   = 0;
    @(posedge clk);
    @(posedge clk);
    rst_n = 1;

    // Reset state should deterministically pick way 0.
    @(negedge clk);
    if (victim_way == 0 && dut.tree[0] == 3'b000) begin
      p++;
      $display("PASS: reset victim way0");
    end else begin
      f++;
      $display("FAIL: reset victim=%0d tree=%b", victim_way, dut.tree[0]);
    end

    // Access way 0 and verify tree flips
    @(negedge clk); access_valid = 1; access_way = 0;
    @(posedge clk); @(negedge clk); access_valid = 0;
    @(posedge clk); @(negedge clk);
    if (victim_way == 2 && dut.tree[0] == 3'b011) begin
      p++;
      $display("PASS: access way0 updates victim to way2");
    end else begin
      f++;
      $display("FAIL: after way0 victim=%0d tree=%b", victim_way, dut.tree[0]);
    end

    // Access way 3 and verify
    @(negedge clk); access_valid = 1; access_way = 3;
    @(posedge clk); @(negedge clk); access_valid = 0;
    @(posedge clk); @(negedge clk);
    if (victim_way == 1 && dut.tree[0] == 3'b010) begin
      p++;
      $display("PASS: access way3 updates victim to way1");
    end else begin
      f++;
      $display("FAIL: after way3 victim=%0d tree=%b", victim_way, dut.tree[0]);
    end

    // Access all 4 ways in sequence and verify rotation
    @(negedge clk); access_valid = 1; access_way = 1;
    @(posedge clk); @(negedge clk); access_valid = 0;
    @(posedge clk); @(negedge clk);
    if (victim_way != 1) begin
      p++;
      $display("PASS: after way1 access victim=%0d (not 1)", victim_way);
    end else begin
      f++;
      $display("FAIL: victim should not be 1");
    end

    @(posedge clk);

    // Summary
    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule`
      };
    }

    if (qId === 'cache3') {
      return {
        solution: `module cache_lfu #(
  parameter NUM_SETS = 64,
  parameter N_WAYS   = 4,
  parameter CNT_W    = 4
)(
  input  logic                         clk,
  input  logic                         rst_n,
  input  logic                         req_valid,
  input  logic                         hit,
  input  logic                         refill,
  input  logic [$clog2(NUM_SETS)-1:0]  req_set,
  input  logic [$clog2(N_WAYS)-1:0]    hit_way,
  input  logic [$clog2(N_WAYS)-1:0]    refill_way,
  input  logic [N_WAYS-1:0]            way_valid,
  output logic [$clog2(N_WAYS)-1:0]    victim_way
);
  logic [CNT_W-1:0] freq [NUM_SETS * N_WAYS];
  localparam logic [CNT_W-1:0] MAX_CNT = {CNT_W{1'b1}};

  logic [$clog2(NUM_SETS * N_WAYS)-1:0] base;
  assign base = req_set * N_WAYS;

  always_comb begin
    logic found_invalid;
    logic [CNT_W-1:0] min_freq;
    victim_way    = '0;
    found_invalid = 1'b0;
    min_freq      = MAX_CNT;

    for (int w = 0; w < N_WAYS; w++) begin
      if (!way_valid[w] && !found_invalid) begin
        victim_way    = w[$clog2(N_WAYS)-1:0];
        found_invalid = 1'b1;
      end
    end

    if (!found_invalid) begin
      for (int w = 0; w < N_WAYS; w++) begin
        if (freq[base + w] < min_freq) begin
          min_freq   = freq[base + w];
          victim_way = w[$clog2(N_WAYS)-1:0];
        end
      end
    end
  end

  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      for (int i = 0; i < NUM_SETS * N_WAYS; i++)
        freq[i] = '0;
    end else if (req_valid) begin
      if (hit && (freq[base + hit_way] < MAX_CNT))
        freq[base + hit_way] <= freq[base + hit_way] + 1'b1;
      if (refill)
        freq[base + refill_way] <= {{(CNT_W-1){1'b0}}, 1'b1};
    end
  end
endmodule`,
        testbench: `module tb;
  logic       clk;
  logic       rst_n, req_valid, hit, refill;
  logic [5:0] req_set;
  logic [1:0] hit_way, refill_way, victim_way;
  logic [3:0] way_valid;
  int         p = 0, f = 0;

  initial clk = 0;

  always #5 clk = ~clk;
  cache_lfu #(.NUM_SETS(64), .N_WAYS(4), .CNT_W(2)) dut (.*);

  // Hold req_valid=1 throughout test, toggle hit/refill
  task automatic do_refill(input logic [1:0] way);
    refill     = 1;
    hit        = 0;
    refill_way = way;
    @(posedge clk);
    @(negedge clk);
    refill     = 0;
  endtask

  task automatic do_hit(input logic [1:0] way);
    hit     = 1;
    refill  = 0;
    hit_way = way;
    @(posedge clk);
    @(negedge clk);
    hit     = 0;
  endtask

  initial begin
    rst_n     = 0;
    req_valid = 0;
    hit       = 0;
    refill    = 0;
    req_set   = 0;
    way_valid = 0;
    @(posedge clk);
    @(posedge clk);
    rst_n = 1;
    @(posedge clk);

    req_valid = 1;

    // Fill all ways with initial frequency=1.
    do_refill(0); way_valid[0] = 1;
    do_refill(1); way_valid[1] = 1;
    do_refill(2); way_valid[2] = 1;
    do_refill(3); way_valid[3] = 1;

    // Raise freq of way0 to saturation (2-bit counter => max 3).
    do_hit(0);
    do_hit(0);
    do_hit(0);
    @(negedge clk);
    if (dut.freq[0] == 2'b11) begin
      p++;
      $display("PASS: saturation");
    end else begin
      f++;
      $display("FAIL: saturation freq=%0d", dut.freq[0]);
    end

    // Boost way1 once more so way2/way3 remain LFU; tie-break => way2.
    do_hit(1);
    @(negedge clk);
    if (victim_way == 2) begin
      p++;
      $display("PASS: LFU victim way2");
    end else begin
      f++;
      $display("FAIL: victim=%0d", victim_way);
    end

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule`
      };
    }

    if (qId === 'cache4') {
      return {
        solution: `module cache_tag_cmp #(
  parameter TAG_W  = 20,
  parameter N_WAYS = 4
)(
  input  logic [TAG_W-1:0]           req_tag,
  input  logic [TAG_W-1:0]           way_tag [N_WAYS],
  input  logic [N_WAYS-1:0]          way_valid,
  output logic [N_WAYS-1:0]          way_match,
  output logic                       hit,
  output logic                       miss,
  output logic [$clog2(N_WAYS)-1:0]  hit_way,
  output logic                       multi_hit_error
);
  always_comb begin
    for (int w = 0; w < N_WAYS; w++) begin
      way_match[w] = way_valid[w] && (way_tag[w] == req_tag);
    end

    hit             = |way_match;
    miss            = !hit;
    multi_hit_error = |(way_match & (way_match - 1'b1));
    hit_way         = '0;

    // Lowest-index match wins.
    for (int w = 0; w < N_WAYS; w++) begin
      if (way_match[w]) begin
        hit_way = w[$clog2(N_WAYS)-1:0];
        break;
      end
    end
  end
endmodule`,
        testbench: `module tb;
  logic [19:0] req_tag;
  logic [19:0] way_tag [4];
  logic [3:0]  way_valid;
  logic [3:0]  way_match;
  logic        hit, miss, multi_hit_error;
  logic [1:0]  hit_way;
  int          p = 0, f = 0;

  cache_tag_cmp #(.TAG_W(20), .N_WAYS(4)) dut (.*);

  initial begin
    // Single hit.
    way_valid  = 4'b1111;
    way_tag[0] = 20'hA;
    way_tag[1] = 20'hB;
    way_tag[2] = 20'hC;
    way_tag[3] = 20'hD;
    req_tag    = 20'hC;
    #1;
    if (hit && !miss && hit_way == 2 && way_match == 4'b0100 && !multi_hit_error) begin
      p++;
      $display("PASS: single hit");
    end else begin
      f++;
      $display("FAIL: single hit");
    end

    // All invalid => miss.
    way_valid = 4'b0000;
    req_tag   = 20'hB;
    #1;
    if (!hit && miss) begin
      p++;
      $display("PASS: invalid ways miss");
    end else begin
      f++;
      $display("FAIL: invalid miss");
    end

    // Multi-hit => lowest index wins.
    way_valid  = 4'b1010;
    way_tag[1] = 20'h55;
    way_tag[3] = 20'h55;
    req_tag    = 20'h55;
    #1;
    if (hit && hit_way == 1 && multi_hit_error) begin
      p++;
      $display("PASS: multi-hit resolution");
    end else begin
      f++;
      $display("FAIL: multi-hit hit_way=%0d err=%0b", hit_way, multi_hit_error);
    end

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule`
      };
    }

    if (qId === 'cache5') {
      return {
        solution: `module cache_dirty #(
  parameter NUM_SETS = 64,
  parameter N_WAYS   = 4,
  parameter TAG_W    = 20
)(
  input  logic                         clk,
  input  logic                         rst_n,
  input  logic                         write_hit,
  input  logic                         refill_done,
  input  logic                         write_alloc_fill,
  input  logic                         evict_valid,
  input  logic                         wb_done,
  input  logic [$clog2(NUM_SETS)-1:0]  hit_set,
  input  logic [$clog2(NUM_SETS)-1:0]  refill_set,
  input  logic [$clog2(NUM_SETS)-1:0]  evict_set,
  input  logic [$clog2(N_WAYS)-1:0]    hit_way,
  input  logic [$clog2(N_WAYS)-1:0]    refill_way,
  input  logic [$clog2(N_WAYS)-1:0]    evict_way,
  input  logic [TAG_W-1:0]             evict_tag,
  output logic                         evict_dirty,
  output logic                         writeback_req,
  output logic [TAG_W+$clog2(NUM_SETS)-1:0] writeback_addr
);
  // Packed bit-vector for Verilator sensitivity
  logic [NUM_SETS*N_WAYS-1:0] dirty;

  assign evict_dirty    = dirty[evict_set * N_WAYS + evict_way];
  assign writeback_req  = evict_valid && dirty[evict_set * N_WAYS + evict_way];
  assign writeback_addr = {evict_tag, evict_set};

  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      dirty <= '0;
    end else begin
      if (write_hit)
        dirty[hit_set * N_WAYS + hit_way] <= 1'b1;
      if (refill_done)
        dirty[refill_set * N_WAYS + refill_way] <= write_alloc_fill;
      if (wb_done)
        dirty[evict_set * N_WAYS + evict_way] <= 1'b0;
    end
  end
endmodule`,
        testbench: `module tb;
  logic       clk;
  logic       rst_n, write_hit, refill_done, write_alloc_fill, evict_valid, wb_done;
  logic       evict_dirty, writeback_req;
  logic [5:0] hit_set, refill_set, evict_set;
  logic [1:0] hit_way, refill_way, evict_way;
  logic [19:0] evict_tag;
  logic [25:0] writeback_addr;
  int         p = 0, f = 0;

  initial clk = 0;

  always #5 clk = ~clk;
  cache_dirty #(.NUM_SETS(64), .N_WAYS(4), .TAG_W(20)) dut (.*);

  initial begin
    rst_n            = 0;
    write_hit        = 0;
    refill_done      = 0;
    write_alloc_fill = 0;
    evict_valid      = 0;
    wb_done          = 0;
    hit_set = 0; refill_set = 0; evict_set = 0;
    hit_way = 0; refill_way = 0; evict_way = 0;
    evict_tag = 0;
    @(posedge clk);
    @(posedge clk);
    rst_n = 1;
    @(posedge clk); @(negedge clk);

    // Read refill creates a clean line (way 1, set 0).
    @(negedge clk);
    refill_set = 0; refill_way = 1; refill_done = 1; write_alloc_fill = 0;
    @(posedge clk); @(negedge clk);
    refill_done = 0;
    // Check: evicting this clean line should NOT generate writeback
    evict_set = 0; evict_way = 1; evict_valid = 1;
    @(posedge clk); @(negedge clk);
    if (!writeback_req) begin p++; $display("PASS: clean eviction no writeback"); end
    else begin f++; $display("FAIL: unexpected writeback"); end
    evict_valid = 0;

    // Write hit marks dirty, then eviction requests writeback.
    @(negedge clk);
    hit_set = 0; hit_way = 1; write_hit = 1;
    @(posedge clk); @(negedge clk);
    write_hit = 0;
    // Now check dirty status
    evict_set = 0; evict_way = 1; evict_tag = 20'hABCDE; evict_valid = 1;
    @(posedge clk); @(negedge clk);
    if (evict_dirty && writeback_req && writeback_addr == {20'hABCDE, 6'd0}) begin
      p++;
      $display("PASS: dirty eviction writeback");
    end else begin
      f++;
      $display("FAIL: dirty eviction d=%b wb=%b addr=%h", evict_dirty, writeback_req, writeback_addr);
    end

    // Ack clears dirty bit.
    @(negedge clk);
    wb_done = 1;
    @(posedge clk); @(negedge clk);
    wb_done = 0;
    @(posedge clk); @(negedge clk);
    if (!evict_dirty) begin p++; $display("PASS: dirty cleared after writeback"); end
    else begin f++; $display("FAIL: dirty not cleared"); end
    evict_valid = 0;

    // Write-allocate fill: should be dirty immediately
    @(negedge clk);
    refill_set = 0; refill_way = 2; write_alloc_fill = 1; refill_done = 1;
    @(posedge clk); @(negedge clk);
    refill_done = 0; write_alloc_fill = 0;
    evict_set = 0; evict_way = 2; evict_valid = 1;
    @(posedge clk); @(negedge clk);
    if (evict_dirty && writeback_req) begin
      p++;
      $display("PASS: write-alloc fill is dirty");
    end else begin
      f++;
      $display("FAIL: write-alloc dirty=%b wb_req=%b", evict_dirty, writeback_req);
    end
    evict_valid = 0;

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule`
      };
    }

    if (qId === 'cache6') {
      return {
        solution: `module cache_refill_fsm #(
  parameter LINE_WORDS = 4
)(
  input  logic                          clk,
  input  logic                          rst_n,
  input  logic                          miss,
  input  logic                          mem_rvalid,
  input  logic                          mem_rlast,
  output logic                          mem_req,
  output logic                          stall,
  output logic                          refill_done,
  output logic [$clog2(LINE_WORDS)-1:0] beat_count
);
  typedef enum logic [2:0] {IDLE, REQUEST, WAIT, FILL, COMPLETE} state_t;
  state_t state;

  assign stall = (state != IDLE);

  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      state       <= IDLE;
      mem_req     <= 0;
      refill_done <= 0;
      beat_count  <= '0;
    end else begin
      mem_req     <= 0;
      refill_done <= 0;
      case (state)
        IDLE: begin
          beat_count <= '0;
          if (miss) begin
            state   <= REQUEST;
            mem_req <= 1;
          end
        end
        REQUEST: begin
          state <= WAIT;
        end
        WAIT: begin
          if (mem_rvalid) begin
            beat_count <= '0;
            if (mem_rlast || LINE_WORDS == 1) begin
              state       <= COMPLETE;
              refill_done <= 1;
            end else
              state <= FILL;
          end
        end
        FILL: begin
          if (mem_rvalid) begin
            beat_count <= beat_count + 1'b1;
            if (mem_rlast || beat_count == LINE_WORDS[$clog2(LINE_WORDS)-1:0] - 2) begin
              state       <= COMPLETE;
              refill_done <= 1;
            end
          end
        end
        COMPLETE: begin
          state <= IDLE;
        end
        default: state <= IDLE;
      endcase
    end
  end
endmodule`,
        testbench: `module tb;
  logic       clk;
  logic       rst_n, miss, mem_rvalid, mem_rlast;
  logic       mem_req, stall, refill_done;
  logic [1:0] beat_count;
  int         p = 0, f = 0;

  initial clk = 0;
  always #5 clk = ~clk;
  cache_refill_fsm #(.LINE_WORDS(4)) dut (.*);
  initial begin #100_000; $display("FATAL: timeout"); $fatal; end

  initial begin
    rst_n=0; miss=0; mem_rvalid=0; mem_rlast=0;
    @(posedge clk); @(posedge clk); rst_n=1;
    @(posedge clk); @(negedge clk);

    // Drive miss at negedge, stable through posedge
    @(negedge clk); miss = 1;
    @(posedge clk); @(negedge clk); miss = 0;
    // Now in REQUEST state: mem_req=1 (registered from IDLE transition)
    if (stall && mem_req) begin p++; $display("PASS: mem_req asserted"); end
    else begin f++; $display("FAIL: mem_req stall=%b mr=%b", stall, mem_req); end

    @(posedge clk); @(negedge clk);
    // Now in WAIT state
    if (stall && !mem_req) begin p++; $display("PASS: WAIT state"); end
    else begin f++; $display("FAIL: WAIT stall=%b mr=%b", stall, mem_req); end

    // Drive 4 beats of data: hold mem_rvalid=1 continuously
    @(negedge clk); mem_rvalid = 1; mem_rlast = 0;
    @(posedge clk); @(negedge clk);  // WAIT → FILL, bc<=0
    if (beat_count == 0) begin p++; $display("PASS: beat0 bc=0"); end
    else begin f++; $display("FAIL: beat0 bc=%0d", beat_count); end

    @(posedge clk); @(negedge clk);  // FILL: bc<=1
    if (beat_count == 1) begin p++; $display("PASS: beat1 bc=1"); end
    else begin f++; $display("FAIL: beat1 bc=%0d", beat_count); end

    @(negedge clk); mem_rlast = 1;
    @(posedge clk); @(negedge clk);  // FILL: last beat, bc<=3, refill_done<=1
    if (beat_count == 3 && refill_done) begin p++; $display("PASS: last beat bc=3 done=1"); end
    else begin f++; $display("FAIL: last bc=%0d done=%b", beat_count, refill_done); end

    @(negedge clk); mem_rvalid = 0; mem_rlast = 0;
    @(posedge clk); @(negedge clk);  // COMPLETE → IDLE
    if (!stall && !refill_done) begin p++; $display("PASS: back to IDLE"); end
    else begin f++; $display("FAIL: not IDLE stall=%b done=%b", stall, refill_done); end

    // Reset mid-refill
    @(negedge clk); miss = 1;
    @(posedge clk); @(negedge clk); miss = 0;  // REQUEST
    @(posedge clk); @(negedge clk);            // WAIT
    @(negedge clk); mem_rvalid = 1;
    @(posedge clk); @(negedge clk);            // FILL
    rst_n = 0;
    @(posedge clk); @(posedge clk);
    rst_n = 1; mem_rvalid = 0;
    @(posedge clk); @(negedge clk);
    if (!stall) begin p++; $display("PASS: reset mid-refill"); end
    else begin f++; $display("FAIL: reset mid-refill"); end

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule`
      };
    }

    if (qId === 'cache7') {
      return {
        solution: `module mshr #(
  parameter ENTRIES  = 4,
  parameter ADDR_W   = 32,
  parameter REQS     = 4,
  parameter OFFSET_W = 4
)(
  input  logic                          clk,
  input  logic                          rst_n,
  input  logic                          alloc_req,
  input  logic                          refill_done,
  input  logic [ADDR_W-1:0]             alloc_addr,
  input  logic [$clog2(REQS)-1:0]       requester_id,
  input  logic [$clog2(ENTRIES)-1:0]    refill_entry,
  output logic                          full,
  output logic                          hit,
  output logic                          issue_mem_req,
  output logic [$clog2(ENTRIES)-1:0]    alloc_entry,
  output logic [$clog2(ENTRIES)-1:0]    hit_entry,
  output logic [REQS-1:0]               merged_waiters
);
  // Use packed valid bitvector for Verilator comb sensitivity
  logic [ENTRIES-1:0]              valid_vec;
  logic [ADDR_W-OFFSET_W-1:0]     line    [ENTRIES];
  logic [REQS-1:0]                waiters [ENTRIES];
  logic [ADDR_W-OFFSET_W-1:0]     alloc_line;

  assign alloc_line     = alloc_addr[ADDR_W-1:OFFSET_W];
  assign merged_waiters = waiters[refill_entry];

  always_comb begin
    hit         = 1'b0;
    hit_entry   = '0;
    full        = 1'b1;
    alloc_entry = '0;

    for (int i = 0; i < ENTRIES; i++) begin
      if (valid_vec[i] && (line[i] == alloc_line) && !hit) begin
        hit       = 1'b1;
        hit_entry = i[$clog2(ENTRIES)-1:0];
      end
    end

    for (int i = 0; i < ENTRIES; i++) begin
      if (!valid_vec[i] && full) begin
        full        = 1'b0;
        alloc_entry = i[$clog2(ENTRIES)-1:0];
      end
    end
  end

  assign issue_mem_req = alloc_req && !hit && !full;

  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      valid_vec <= '0;
      for (int i = 0; i < ENTRIES; i++) begin
        line[i]    <= '0;
        waiters[i] <= '0;
      end
    end else begin
      if (alloc_req) begin
        if (hit) begin
          waiters[hit_entry][requester_id] <= 1'b1;
        end else if (!full) begin
          valid_vec[alloc_entry]               <= 1'b1;
          line[alloc_entry]                    <= alloc_line;
          waiters[alloc_entry]                 <= '0;
          waiters[alloc_entry][requester_id]   <= 1'b1;
        end
      end

      if (refill_done) begin
        valid_vec[refill_entry]   <= 1'b0;
        waiters[refill_entry]     <= '0;
      end
    end
  end
endmodule`,
        testbench: `module tb;
  logic       clk;
  logic       rst_n, alloc_req, refill_done;
  logic       full, hit, issue_mem_req;
  logic [31:0] alloc_addr;
  logic [1:0] requester_id, alloc_entry, refill_entry, hit_entry;
  logic [3:0] merged_waiters;
  int         p = 0, f = 0;

  initial clk = 0;

  always #5 clk = ~clk;
  mshr #(.ENTRIES(4), .ADDR_W(32), .REQS(4), .OFFSET_W(4)) dut (.*);

  initial begin
    rst_n       = 0;
    alloc_req   = 0;
    refill_done = 0;
    requester_id = 0;
    alloc_addr  = 0;
    refill_entry = 0;
    @(posedge clk);
    @(posedge clk);
    rst_n = 1;
    @(posedge clk); @(negedge clk);  // settle after reset

    // First miss: drive at negedge, check comb before posedge commits
    @(negedge clk);
    alloc_req    = 1;
    alloc_addr   = 32'hDEAD_BEF0;
    requester_id = 0;
    #1;  // let comb settle (valid_vec still 0 from reset)
    if (issue_mem_req && !hit) begin
      p++;
      $display("PASS: new miss allocates");
    end else begin
      f++;
      $display("FAIL: allocate issue=%b hit=%b full=%b", issue_mem_req, hit, full);
    end
    @(posedge clk); @(negedge clk);  // posedge commits allocation
    alloc_req = 0;

    // Same cache line, different byte offset: should merge
    @(negedge clk);
    alloc_addr   = 32'hDEAD_BEF8;
    requester_id = 1;
    alloc_req    = 1;
    #1;  // comb settle: valid_vec[0]=1, line[0] matches → hit=1
    if (hit) begin
      p++;
      $display("PASS: same-line merge hit");
    end else begin
      f++;
      $display("FAIL: merge hit=%b", hit);
    end
    @(posedge clk); @(negedge clk);  // commit merge
    alloc_req    = 0;
    refill_entry = hit_entry;
    @(posedge clk); @(negedge clk);
    if (merged_waiters[1:0] == 2'b11) begin
      p++;
      $display("PASS: waiter mask merged");
    end else begin
      f++;
      $display("FAIL: waiters=%b", merged_waiters);
    end

    // Refill frees the entry.
    @(negedge clk); refill_done = 1;
    @(posedge clk); @(negedge clk); refill_done = 0;
    @(posedge clk); @(negedge clk);
    if (!dut.valid_vec[refill_entry]) begin
      p++;
      $display("PASS: entry freed on refill");
    end else begin
      f++;
      $display("FAIL: entry not freed");
    end

    // Backpressure: fill all 4 entries
    @(negedge clk); alloc_req = 1;
    alloc_addr = 32'h0000_1000; requester_id = 0;
    @(posedge clk); @(negedge clk);
    alloc_addr = 32'h0000_2000;
    @(posedge clk); @(negedge clk);
    alloc_addr = 32'h0000_3000;
    @(posedge clk); @(negedge clk);
    alloc_addr = 32'h0000_4000;
    @(posedge clk); @(negedge clk);
    // 5th line should be blocked
    alloc_addr = 32'h0000_5000;
    @(posedge clk); @(negedge clk);
    if (full && !issue_mem_req) begin
      p++;
      $display("PASS: MSHR full backpressure");
    end else begin
      f++;
      $display("FAIL: backpressure full=%b issue=%b", full, issue_mem_req);
    end
    alloc_req = 0;

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule`
      };
    }

    // ─── ALU ──────────────────────────────────────────────────────────────────

    if (qId === 'alu1') {
      return {
        solution: `module alu #(
  parameter W = 32
)(
  input  logic [W-1:0] a,
  input  logic [W-1:0] b,
  input  logic [3:0]   op,
  output logic [W-1:0] result,
  output logic         zero,
  output logic         carry,
  output logic         overflow,
  output logic         negative
);
  logic [W:0] tmp;

  always_comb begin
    tmp      = '0;
    overflow = 1'b0;

    case (op)
      4'd0: tmp = a + b;
      4'd1: tmp = a - b;
      4'd2: tmp = {1'b0, (a & b)};
      4'd3: tmp = {1'b0, (a | b)};
      4'd4: tmp = {1'b0, (a ^ b)};
      4'd5: tmp = {{W{1'b0}}, ($signed(a) < $signed(b))};
      4'd6: tmp = {1'b0, (a << b[$clog2(W)-1:0])};
      4'd7: tmp = {1'b0, (a >> b[$clog2(W)-1:0])};
      4'd8: tmp = {1'b0, ($signed(a) >>> b[$clog2(W)-1:0])};
      default: tmp = '0;
    endcase

    result   = tmp[W-1:0];
    carry    = tmp[W];
    zero     = (result == '0);
    negative = result[W-1];

    if (op == 4'd0) overflow = (a[W-1] == b[W-1]) && (result[W-1] != a[W-1]);
    if (op == 4'd1) overflow = (a[W-1] != b[W-1]) && (result[W-1] != a[W-1]);
  end
endmodule`,
        testbench: `module tb;
  logic [31:0] a, b, result;
  logic [3:0]  op;
  logic        zero, carry, overflow, negative;
  int          p = 0, f = 0;

  // DUT instantiation
  alu #(.W(32)) dut (.*);

  task automatic check(input string msg, input logic [31:0] exp);
    #1;
    if (result === exp) begin
      p++;
      $display("PASS: %s", msg);
    end else begin
      f++;
      $display("FAIL: %s  exp=%h  got=%h", msg, exp, result);
    end
  endtask

  initial begin
    op = 4'd0; a = 5;            b = 3;         check("ADD",        8);
    op = 4'd1; a = 10;           b = 3;         check("SUB",        7);
    op = 4'd2; a = 32'hFF00;     b = 32'h0F0F;  check("AND",        32'h0F00);
    op = 4'd3; a = 32'hFF00;     b = 32'h0F0F;  check("OR",         32'hFF0F);
    op = 4'd4; a = 32'hFF00;     b = 32'h0F0F;  check("XOR",        32'hF00F);
    op = 4'd5; a = 32'hFFFFFFFF; b = 1;         check("SLT(-1<1)",  1);
    op = 4'd5; a = 1;            b = 32'hFFFFFFFF; check("SLT(1>-1)", 0);

    // Zero flag
    op = 4'd1; a = 5; b = 5; #1;
    if (zero === 1) begin p++; $display("PASS: zero flag"); end
    else begin f++; $display("FAIL: zero flag"); end

    // Overflow: MAX_INT + 1
    op = 4'd0; a = 32'h7FFF_FFFF; b = 1; #1;
    if (overflow === 1) begin p++; $display("PASS: add overflow"); end
    else begin f++; $display("FAIL: add overflow"); end

    // No overflow: 5 + 3
    op = 4'd0; a = 5; b = 3; #1;
    if (overflow === 0) begin p++; $display("PASS: no overflow"); end
    else begin f++; $display("FAIL: no overflow"); end

    // Negative flag
    op = 4'd1; a = 3; b = 10; #1;
    if (negative === 1) begin p++; $display("PASS: negative flag"); end
    else begin f++; $display("FAIL: negative flag"); end

    // Summary
    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule`
      };
    }

    if (qId === 'alu2') {
      return {
        solution: `module alu_control (
  input  logic [1:0] alu_op,
  input  logic [2:0] funct3,
  input  logic       funct7_b5,
  output logic [3:0] alu_ctrl
);
  always_comb begin
    case (alu_op)
      2'b00: alu_ctrl = 4'd0;  // Load/Store — ADD
      2'b01: alu_ctrl = 4'd1;  // Branch    — SUB
      2'b10: begin
        case (funct3)
          3'b000: alu_ctrl = funct7_b5 ? 4'd1 : 4'd0;  // SUB / ADD
          3'b001: alu_ctrl = 4'd6;                      // SLL
          3'b010: alu_ctrl = 4'd5;                      // SLT
          3'b100: alu_ctrl = 4'd4;                      // XOR
          3'b101: alu_ctrl = funct7_b5 ? 4'd8 : 4'd7;  // SRA / SRL
          3'b110: alu_ctrl = 4'd3;                      // OR
          3'b111: alu_ctrl = 4'd2;                      // AND
          default: alu_ctrl = 4'd0;
        endcase
      end
      default: alu_ctrl = 4'd0;
    endcase
  end
endmodule`,
        testbench: `module tb;
  logic [1:0] alu_op;
  logic [2:0] funct3;
  logic       funct7_b5;
  logic [3:0] alu_ctrl;
  int         p = 0, f = 0;

  // DUT instantiation
  alu_control dut (.*);

  task automatic check(input string msg, input logic [3:0] exp);
    #1;
    if (alu_ctrl === exp) begin
      p++;
      $display("PASS: %s", msg);
    end else begin
      f++;
      $display("FAIL: %s", msg);
    end
  endtask

  initial begin
    alu_op = 2'b00; funct3 = 3'b000; funct7_b5 = 0; check("LW = ADD", 4'd0);
    alu_op = 2'b01;                                  check("BR = SUB", 4'd1);
    alu_op = 2'b10; funct3 = 3'b000; funct7_b5 = 0; check("R-ADD",    4'd0);
    funct7_b5 = 1;                                   check("R-SUB",    4'd1);
    funct3    = 3'b111;                              check("R-AND",    4'd2);

    // Summary
    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule`
      };
    }

    if (qId === 'alu3') {
      return {
        solution: `module overflow_detect #(
  parameter W = 32
)(
  input  logic [W-1:0] a,
  input  logic [W-1:0] b,
  input  logic [W-1:0] result,
  input  logic         is_sub,
  output logic         overflow,
  output logic         carry
);
  logic [W:0] ext;

  assign ext      = is_sub ? ({1'b0, a} - {1'b0, b}) : ({1'b0, a} + {1'b0, b});
  assign carry    = ext[W];
  assign overflow = is_sub
    ? (a[W-1] != b[W-1]) && (result[W-1] != a[W-1])
    : (a[W-1] == b[W-1]) && (result[W-1] != a[W-1]);
endmodule`,
        testbench: `module tb;
  logic [31:0] a, b, result;
  logic        is_sub, overflow, carry;
  int          p = 0, f = 0;

  // DUT instantiation
  overflow_detect #(.W(32)) dut (.*);

  initial begin
    // Signed overflow: MAX_INT + 1
    is_sub = 0;
    a      = 32'h7FFF_FFFF;
    b      = 1;
    result = a + b;
    #1;
    if (overflow) begin p++; $display("PASS: MAX+1 overflow"); end
    else begin f++; $display("FAIL: MAX+1 overflow"); end

    // No overflow: 5 + 3
    a      = 5;
    b      = 3;
    result = 8;
    #1;
    if (!overflow) begin p++; $display("PASS: 5+3 no overflow"); end
    else begin f++; $display("FAIL: 5+3 no overflow"); end

    // Negative overflow: MIN_INT + (-1)
    a      = 32'h8000_0000; // -2147483648
    b      = 32'hFFFF_FFFF; // -1
    result = a + b;          // wraps to 0x7FFFFFFF = +2147483647
    #1;
    if (overflow) begin p++; $display("PASS: MIN+(-1) overflow"); end
    else begin f++; $display("FAIL: MIN+(-1) overflow"); end

    // Subtraction overflow: MAX_INT - (-1) = MAX_INT + 1
    is_sub = 1;
    a      = 32'h7FFF_FFFF;
    b      = 32'hFFFF_FFFF; // -1
    result = a - b;          // wraps to 0x80000000
    #1;
    if (overflow) begin p++; $display("PASS: MAX-(-1) sub overflow"); end
    else begin f++; $display("FAIL: MAX-(-1) sub overflow"); end

    // No sub overflow: 10 - 3
    a = 10; b = 3; result = 7; is_sub = 1;
    #1;
    if (!overflow) begin p++; $display("PASS: 10-3 no sub overflow"); end
    else begin f++; $display("FAIL: 10-3 no sub overflow"); end

    // Carry: unsigned overflow 0xFFFFFFFF + 1
    is_sub = 0;
    a      = 32'hFFFF_FFFF;
    b      = 1;
    result = a + b;
    #1;
    if (carry) begin p++; $display("PASS: carry on FFFF+1"); end
    else begin f++; $display("FAIL: carry on FFFF+1"); end

    // Summary
    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule`
      };
    }

    if (qId === 'alu4') {
      return {
        solution: `module barrel_shifter #(
  parameter W = 32
)(
  input  logic [W-1:0]         data_in,
  input  logic [$clog2(W)-1:0] shamt,
  input  logic [1:0]            shift_type,
  output logic [W-1:0]         data_out
);
  always_comb begin
    case (shift_type)
      2'b00: data_out =  data_in  << shamt;          // SLL
      2'b01: data_out =  data_in  >> shamt;          // SRL
      2'b10: data_out = $signed(data_in) >>> shamt;  // SRA
      default: data_out = data_in;
    endcase
  end
endmodule`,
        testbench: `module tb;
  logic [31:0] data_in, data_out;
  logic [4:0]  shamt;
  logic [1:0]  shift_type;
  int          p = 0, f = 0;

  // DUT instantiation
  barrel_shifter #(.W(32)) dut (.*);

  task automatic check(input string msg, input logic [31:0] exp);
    #1;
    if (data_out === exp) begin
      p++;
      $display("PASS: %s", msg);
    end else begin
      f++;
      $display("FAIL: %s  got=%h", msg, data_out);
    end
  endtask

  initial begin
    data_in = 32'h0000_0001; shamt = 4; shift_type = 2'b00; check("SLL",  32'h0000_0010);
    data_in = 32'h0000_0080; shamt = 3; shift_type = 2'b01; check("SRL",  32'h0000_0010);
    data_in = 32'hF000_0000; shamt = 4; shift_type = 2'b10; check("SRA",  32'hFF00_0000);

    // Zero shift: all types should pass data through unchanged
    data_in = 32'hDEAD_BEEF; shamt = 0;
    shift_type = 2'b00; check("SLL shamt=0", 32'hDEAD_BEEF);
    shift_type = 2'b01; check("SRL shamt=0", 32'hDEAD_BEEF);
    shift_type = 2'b10; check("SRA shamt=0", 32'hDEAD_BEEF);

    // Max shift (31 for 32-bit)
    data_in = 32'h0000_0001; shamt = 31;
    shift_type = 2'b00; check("SLL max", 32'h8000_0000);
    data_in = 32'h8000_0000; shamt = 31;
    shift_type = 2'b01; check("SRL max", 32'h0000_0001);
    data_in = 32'h8000_0000; shamt = 31;
    shift_type = 2'b10; check("SRA max", 32'hFFFF_FFFF);  // sign-extended

    // SRA positive: no sign extension
    data_in = 32'h7000_0000; shamt = 4;
    shift_type = 2'b10; check("SRA pos", 32'h0700_0000);

    // Summary
    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule`
      };
    }

    if (qId === 'alu5') {
      return {
        solution: `module multiplier #(
  parameter W = 16
)(
  input  logic            clk,
  input  logic            rst_n,
  input  logic            start,
  input  logic [W-1:0]    a,
  input  logic [W-1:0]    b,
  output logic [2*W-1:0]  product,
  output logic            busy,
  output logic            done
);
  logic [2*W-1:0] acc, b_sh;
  logic [W-1:0]   a_r;
  logic [$clog2(W):0] cnt;

  typedef enum logic [1:0] { IDLE, CALC, FIN } st_t;
  st_t st;

  assign busy = (st == CALC);

  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      st      <= IDLE;
      done    <= 1'b0;
      product <= '0;
      acc     <= '0;
      b_sh    <= '0;
      a_r     <= '0;
      cnt     <= '0;
    end else begin
      done <= 1'b0;
      case (st)
        IDLE: begin
          if (start) begin
            acc  <= '0;
            a_r  <= a;
            b_sh <= {{W{1'b0}}, b};
            cnt  <= '0;
            st   <= CALC;
          end
        end
        CALC: begin
          if (a_r[0]) acc <= acc + b_sh;
          a_r  <= a_r >> 1;
          b_sh <= b_sh << 1;
          cnt  <= cnt + 1'b1;
          if (cnt == W-1) st <= FIN;
        end
        FIN: begin
          product <= acc;
          done    <= 1'b1;
          st      <= IDLE;
        end
      endcase
    end
  end
endmodule`,
        testbench: `module tb;
  logic        clk;
  logic        rst_n, start, busy, done;
  logic [15:0] a, b;
  logic [31:0] product;
  int          p = 0, f = 0;

  initial clk = 0;

  always #5 clk = ~clk;
  multiplier #(.W(16)) dut (.*);

  // Timeout watchdog
  initial begin #500_000; $display("FATAL: timeout"); $fatal; end

  task automatic check(input string msg, input logic [31:0] exp);
    @(negedge clk); start = 1;
    @(posedge clk); @(negedge clk); start = 0;
    if (busy) p++; else begin f++; $display("FAIL: busy not asserted"); end
    wait (done);
    @(negedge clk);
    if (product === exp) begin
      p++;
      $display("PASS: %s", msg);
    end else begin
      f++;
      $display("FAIL: %s got=%0d", msg, product);
    end
  endtask

  initial begin
    rst_n = 0;
    start = 0;
    @(posedge clk);
    @(posedge clk);
    rst_n = 1;
    @(posedge clk);

    a = 7;   b = 6;   check("7*6", 42);
    a = 0;   b = 99;  check("0*99", 0);
    a = 255; b = 255; check("255*255", 65025);

    // Back-to-back: start second multiply immediately after first done
    a = 5; b = 4;
    check("5*4", 20);
    // Immediately start next — check task already returns after done
    a = 6; b = 3;
    check("6*3 b2b", 18);

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule`
      };
    }

    if (qId === 'alu6') {
      return {
        solution: `module divider #(
  parameter W = 16
)(
  input  logic          clk,
  input  logic          rst_n,
  input  logic          start,
  input  logic [W-1:0]  dividend,
  input  logic [W-1:0]  divisor,
  output logic [W-1:0]  quotient,
  output logic [W-1:0]  remainder,
  output logic          busy,
  output logic          done,
  output logic          div_by_zero
);
  logic [W-1:0]       q, d;
  logic [W:0]         r;
  logic [$clog2(W):0] cnt;

  typedef enum logic [1:0] { IDLE, CALC, FIN } st_t;
  st_t st;

  assign busy = (st == CALC);

  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      st          <= IDLE;
      q           <= '0;
      d           <= '0;
      r           <= '0;
      cnt         <= '0;
      quotient    <= '0;
      remainder   <= '0;
      done        <= 1'b0;
      div_by_zero <= 1'b0;
    end else begin
      done        <= 1'b0;
      div_by_zero <= 1'b0;
      case (st)
        IDLE: begin
          if (start) begin
            if (divisor == '0) begin
              quotient    <= '0;
              remainder   <= dividend;
              div_by_zero <= 1'b1;
              done        <= 1'b1;
            end else begin
              q   <= dividend;
              d   <= divisor;
              r   <= '0;
              cnt <= '0;
              st  <= CALC;
            end
          end
        end
        CALC: begin
          logic [W:0]   r_shift;
          logic [W:0]   r_next;
          logic [W-1:0] q_next;
          r_shift = {r[W-1:0], q[W-1]};
          q_next  = {q[W-2:0], 1'b0};
          r_next  = r_shift;
          if (r_shift >= {1'b0, d}) begin
            r_next    = r_shift - {1'b0, d};
            q_next[0] = 1'b1;
          end
          r   <= r_next;
          q   <= q_next;
          cnt <= cnt + 1'b1;
          if (cnt == W-1) st <= FIN;
        end
        FIN: begin
          quotient  <= q;
          remainder <= r[W-1:0];
          done      <= 1'b1;
          st        <= IDLE;
        end
      endcase
    end
  end
endmodule`,
        testbench: `module tb;
  logic        clk;
  logic        rst_n, start, busy, done, div_by_zero;
  logic [15:0] dividend, divisor, quotient, remainder;
  int          p = 0, f = 0;

  initial clk = 0;

  always #5 clk = ~clk;
  divider #(.W(16)) dut (.*);

  // Timeout watchdog
  initial begin #500_000; $display("FATAL: timeout"); $fatal; end

  task automatic check(input string msg, input logic [15:0] eq, input logic [15:0] er);
    @(negedge clk); start = 1;
    @(posedge clk); @(negedge clk); start = 0;
    if (busy) p++; else begin f++; $display("FAIL: busy not asserted"); end
    wait (done);
    @(negedge clk);
    if (quotient === eq && remainder === er) begin
      p++;
      $display("PASS: %s", msg);
    end else begin
      f++;
      $display("FAIL: %s q=%0d r=%0d", msg, quotient, remainder);
    end
  endtask

  initial begin
    rst_n = 0;
    start = 0;
    @(posedge clk);
    @(posedge clk);
    rst_n = 1;
    @(posedge clk);

    dividend = 42; divisor = 6;  check("42/6", 7, 0);
    dividend = 43; divisor = 6;  check("43/6", 7, 1);
    dividend = 3;  divisor = 10; check("3/10", 0, 3);

    // Divide-by-zero behavior: quotient=0, remainder=dividend.
    @(negedge clk); dividend = 7; divisor = 0; start = 1;
    @(posedge clk); @(negedge clk); start = 0;
    if (done && div_by_zero && quotient == 0 && remainder == 7) begin
      p++;
      $display("PASS: div-by-zero");
    end else begin
      f++;
      $display("FAIL: div-by-zero handling");
    end

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule`
      };
    }

    // ─── Pipeline ─────────────────────────────────────────────────────────────

    if (qId === 'pipe1') {
      return {
        solution: `module pipe_reg #(
  parameter W = 64
)(
  input  logic          clk,
  input  logic          rst_n,
  input  logic          stall,
  input  logic          flush,
  input  logic [W-1:0] d,
  output logic [W-1:0] q
);
  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n)      q <= '0;
    else if (flush)  q <= '0;
    else if (!stall) q <= d;
  end
endmodule`,
        testbench: `module tb;
  logic        clk;
  logic        rst_n, stall, flush;
  logic [63:0] d, q;
  int          p = 0, f = 0;

  // Clock generation
  initial clk = 0;
  always #5 clk = ~clk;
  // DUT instantiation
  pipe_reg #(.W(64)) dut (.*);

  task automatic check(input string msg, input logic [63:0] exp);
    @(negedge clk);
    if (q === exp) begin
      p++;
      $display("PASS: %s", msg);
    end else begin
      f++;
      $display("FAIL: %s", msg);
    end
  endtask

  initial begin
    // Reset sequence
    rst_n = 0;
    stall = 0;
    flush = 0;
    d     = 0;
    @(posedge clk);
    @(posedge clk);
    rst_n = 1;

    // Normal load
    d = 64'hCAFE;
    @(posedge clk);
    check("load", 64'hCAFE);

    // Stall holds old value
    stall = 1;
    d     = 64'hDEAD;
    @(posedge clk);
    check("stall holds", 64'hCAFE);

    // Unstall propagates new value
    stall = 0;
    @(posedge clk);
    check("unstall", 64'hDEAD);

    // Flush clears register
    flush = 1;
    @(posedge clk);
    check("flush", 0);
    flush = 0;

    // Simultaneous stall+flush: flush should win (insert bubble)
    d = 64'hBEEF;
    @(posedge clk);
    check("reload", 64'hBEEF);
    stall = 1;
    flush = 1;
    d     = 64'h1234;
    @(posedge clk);
    check("stall+flush: flush wins", 0);
    stall = 0;
    flush = 0;

    // Summary
    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule`
      };
    }

    if (qId === 'pipe2') {
      return {
        solution: `module hazard_detect (
  input  logic [4:0] id_rs1,
  input  logic [4:0] id_rs2,
  input  logic [4:0] ex_rd,
  input  logic       ex_mem_read,
  input  logic       id_uses_rs2,  // 0 for I-type (rs2 field is immediate)
  output logic       stall
);
  assign stall = ex_mem_read
              && (ex_rd != 0)
              && ((ex_rd == id_rs1) || (id_uses_rs2 && ex_rd == id_rs2));
endmodule`,
        testbench: `module tb;
  logic [4:0] id_rs1, id_rs2, ex_rd;
  logic       ex_mem_read, id_uses_rs2, stall;
  int         p = 0, f = 0;

  // DUT instantiation
  hazard_detect dut (.*);

  task automatic check(input string msg, input logic exp);
    #1;
    if (stall === exp) begin
      p++;
      $display("PASS: %s", msg);
    end else begin
      f++;
      $display("FAIL: %s stall=%b exp=%b", msg, stall, exp);
    end
  endtask

  initial begin
    id_uses_rs2 = 1; // R-type uses both sources
    ex_mem_read = 1; ex_rd = 5; id_rs1 = 5; id_rs2 = 0; check("load-use rs1", 1);
    id_rs1 = 0; id_rs2 = 5;                              check("load-use rs2", 1);
    ex_mem_read = 0;                                      check("no mem_read",  0);
    ex_mem_read = 1; ex_rd = 0;                          check("rd = x0",      0);

    // I-type: rs2 field is part of immediate, should not trigger stall
    ex_rd = 5; id_rs1 = 0; id_rs2 = 5; id_uses_rs2 = 0;
    check("I-type no rs2 stall", 0);

    // I-type: rs1 still triggers stall
    id_rs1 = 5; id_uses_rs2 = 0;
    check("I-type rs1 stall", 1);

    // No match at all
    ex_rd = 5; id_rs1 = 3; id_rs2 = 4; id_uses_rs2 = 1;
    check("no match", 0);

    // Summary
    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule`
      };
    }

    if (qId === 'pipe3') {
      return {
        solution: `module forwarding_unit (
  input  logic [4:0] id_ex_rs1,
  input  logic [4:0] id_ex_rs2,
  input  logic [4:0] ex_mem_rd,
  input  logic [4:0] mem_wb_rd,
  input  logic       ex_mem_reg_write,
  input  logic       mem_wb_reg_write,
  output logic [1:0] fwd_a,
  output logic [1:0] fwd_b
);
  // Encoding: 00=no forward, 01=MEM/WB, 10=EX/MEM
  always_comb begin
    fwd_a = 2'b00;
    fwd_b = 2'b00;
    // EX-stage forwarding (higher priority) => 10
    if (ex_mem_reg_write && ex_mem_rd != 0 && ex_mem_rd == id_ex_rs1)
      fwd_a = 2'b10;
    else if (mem_wb_reg_write && mem_wb_rd != 0 && mem_wb_rd == id_ex_rs1)
      fwd_a = 2'b01;
    if (ex_mem_reg_write && ex_mem_rd != 0 && ex_mem_rd == id_ex_rs2)
      fwd_b = 2'b10;
    else if (mem_wb_reg_write && mem_wb_rd != 0 && mem_wb_rd == id_ex_rs2)
      fwd_b = 2'b01;
  end
endmodule`,
        testbench: `module tb;
  logic [4:0] rs1, rs2, ex_rd, mem_rd;
  logic       ex_wr, mem_wr;
  logic [1:0] fwd_a, fwd_b;
  int         p = 0, f = 0;

  // DUT instantiation
  forwarding_unit dut (
    .id_ex_rs1        (rs1),
    .id_ex_rs2        (rs2),
    .ex_mem_rd        (ex_rd),
    .mem_wb_rd        (mem_rd),
    .ex_mem_reg_write (ex_wr),
    .mem_wb_reg_write (mem_wr),
    .fwd_a            (fwd_a),
    .fwd_b            (fwd_b)
  );

  task automatic check(input string msg, input logic [1:0] ea, input logic [1:0] eb);
    #1;
    if (fwd_a === ea && fwd_b === eb) begin
      p++;
      $display("PASS: %s", msg);
    end else begin
      f++;
      $display("FAIL: %s", msg);
    end
  endtask

  initial begin
    // EX/MEM forwards rs1 => fwd_a=10
    rs1 = 5; rs2 = 6; ex_rd = 5; ex_wr = 1; mem_rd = 0; mem_wr = 0;
    check("EX fwd rs1",  2'b10, 2'b00);

    // EX/MEM forwards rs2 => fwd_b=10
    ex_rd = 6;
    check("EX fwd rs2",  2'b00, 2'b10);

    // MEM/WB forwards rs1 => fwd_a=01
    ex_rd = 0; ex_wr = 0; mem_rd = 5; mem_wr = 1;
    check("MEM fwd rs1", 2'b01, 2'b00);

    // Priority: both EX/MEM and MEM/WB match rs1 => EX/MEM wins (10)
    ex_rd = 5; ex_wr = 1; mem_rd = 5; mem_wr = 1;
    check("EX priority",  2'b10, 2'b00);

    // No match => 00
    rs1 = 7; rs2 = 8; ex_rd = 5; ex_wr = 1; mem_rd = 6; mem_wr = 1;
    check("no match", 2'b00, 2'b00);

    // x0 never forwards
    rs1 = 0; ex_rd = 0; ex_wr = 1;
    check("x0 no fwd", 2'b00, 2'b00);

    // Summary
    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule`
      };
    }

    if (qId === 'pipe4') {
      return {
        solution: `module branch_cmp #(
  parameter W = 32
)(
  input  logic [W-1:0] a,
  input  logic [W-1:0] b,
  input  logic [2:0]   funct3,
  output logic          take_branch
);
  always_comb begin
    case (funct3)
      3'b000: take_branch = (a == b);                   // BEQ
      3'b001: take_branch = (a != b);                   // BNE
      3'b100: take_branch = ($signed(a) <  $signed(b)); // BLT
      3'b101: take_branch = ($signed(a) >= $signed(b)); // BGE
      3'b110: take_branch = (a <  b);                   // BLTU
      3'b111: take_branch = (a >= b);                   // BGEU
      default: take_branch = 0;
    endcase
  end
endmodule`,
        testbench: `module tb;
  logic [31:0] a, b;
  logic [2:0]  funct3;
  logic        take_branch;
  int          p = 0, f = 0;

  // DUT instantiation
  branch_cmp #(.W(32)) dut (.*);

  task automatic check(input string msg, input logic exp);
    #1;
    if (take_branch === exp) begin
      p++;
      $display("PASS: %s", msg);
    end else begin
      f++;
      $display("FAIL: %s", msg);
    end
  endtask

  initial begin
    a = 5;            b = 5; funct3 = 3'b000; check("BEQ taken",     1);
    a = 5;            b = 6; funct3 = 3'b000; check("BEQ not taken", 0);
                             funct3 = 3'b001; check("BNE taken",     1);
    a = 32'hFFFF_FFFF; b = 1; funct3 = 3'b100; check("BLT signed",   1);
                              funct3 = 3'b110; check("BLTU unsigned", 0);

    // Summary
    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule`
      };
    }

    if (qId === 'pipe5') {
      return {
        solution: `module instr_decode (
  input  logic [31:0] instr,
  output logic [4:0]  rs1,
  output logic [4:0]  rs2,
  output logic [4:0]  rd,
  output logic [31:0] imm,
  output logic [6:0]  opcode,
  output logic [6:0]  funct7,
  output logic [2:0]  funct3,
  output logic        reg_write,
  output logic        mem_read,
  output logic        mem_write,
  output logic        branch,
  output logic        alu_src,
  output logic        jump,
  output logic        mem_to_reg,
  output logic        illegal_instruction,
  output logic [3:0]  alu_op
);
  assign opcode = instr[6:0];
  assign rd     = instr[11:7];
  assign funct3 = instr[14:12];
  assign rs1    = instr[19:15];
  assign rs2    = instr[24:20];
  assign funct7 = instr[31:25];

  always_comb begin
    case (opcode)
      7'b0010011,
      7'b0000011,
      7'b1100111: imm = {{20{instr[31]}}, instr[31:20]};
      7'b0100011: imm = {{20{instr[31]}}, instr[31:25], instr[11:7]};
      7'b1100011: imm = {{19{instr[31]}}, instr[31], instr[7], instr[30:25], instr[11:8], 1'b0};
      7'b0110111,
      7'b0010111: imm = {instr[31:12], 12'b0};
      7'b1101111: imm = {{11{instr[31]}}, instr[31], instr[19:12], instr[20], instr[30:21], 1'b0};
      default:    imm = 32'b0;
    endcase
  end

  always_comb begin
    reg_write           = 1'b0;
    mem_read            = 1'b0;
    mem_write           = 1'b0;
    branch              = 1'b0;
    alu_src             = 1'b0;
    jump                = 1'b0;
    mem_to_reg          = 1'b0;
    illegal_instruction = 1'b0;
    alu_op              = 4'd0;

    case (opcode)
      7'b0110011: begin // R-type
        reg_write = 1'b1;
        alu_src   = 1'b0;
        case (funct3)
          3'b000: alu_op = funct7[5] ? 4'd1 : 4'd0;
          3'b111: alu_op = 4'd2;
          3'b110: alu_op = 4'd3;
          default: alu_op = 4'd0;
        endcase
      end
      7'b0010011: begin // I-type ALU
        reg_write = 1'b1;
        alu_src   = 1'b1;
        alu_op    = 4'd0;
      end
      7'b0000011: begin // Load
        reg_write  = 1'b1;
        mem_read   = 1'b1;
        alu_src    = 1'b1;
        mem_to_reg = 1'b1;
        alu_op     = 4'd0;
      end
      7'b0100011: begin // Store
        mem_write = 1'b1;
        alu_src   = 1'b1;
        alu_op    = 4'd0;
      end
      7'b1100011: begin // Branch
        branch = 1'b1;
        alu_op = 4'd1;
      end
      7'b1101111,
      7'b1100111: begin // JAL/JALR
        jump      = 1'b1;
        reg_write = 1'b1;
        alu_src   = 1'b1;
      end
      7'b0110111,
      7'b0010111: begin // LUI/AUIPC
        reg_write = 1'b1;
        alu_src   = 1'b1;
      end
      default: begin
        illegal_instruction = 1'b1;
      end
    endcase
  end
endmodule`,
        testbench: `module tb;
  logic [31:0] instr, imm;
  logic [4:0]  rs1, rs2, rd;
  logic [6:0]  opcode, funct7;
  logic [2:0]  funct3;
  logic        reg_write, mem_read, mem_write, branch, alu_src, jump, mem_to_reg, illegal_instruction;
  logic [3:0]  alu_op;
  int          p = 0, f = 0;

  instr_decode dut (.*);

  task automatic check_ctrl(
    input string msg,
    input logic  ew, emr, emw, eb, ej, em2r, eillegal
  );
    #1;
    if (reg_write === ew && mem_read === emr && mem_write === emw &&
        branch === eb && jump === ej && mem_to_reg === em2r && illegal_instruction === eillegal) begin
      p++;
      $display("PASS: %s", msg);
    end else begin
      f++;
      $display("FAIL: %s", msg);
    end
  endtask

  initial begin
    instr = 32'h003100B3; check_ctrl("R-ADD",   1, 0, 0, 0, 0, 0, 0);
    instr = 32'h00412083; check_ctrl("LW",      1, 1, 0, 0, 0, 1, 0);
    instr = 32'h00112423; check_ctrl("SW",      0, 0, 1, 0, 0, 0, 0);
    instr = 32'h00208463; check_ctrl("BEQ",     0, 0, 0, 1, 0, 0, 0);
    instr = 32'h0000006F; check_ctrl("JAL",     1, 0, 0, 0, 1, 0, 0);
    instr = 32'hFFFF_FFFF; check_ctrl("ILLEGAL",0, 0, 0, 0, 0, 0, 1);

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule`
      };
    }

    // ─── Register File & Rename ───────────────────────────────────────────────

    if (qId === 'reg1') {
      return {
        solution: `module regfile #(
  parameter W     = 32,
  parameter DEPTH = 32
)(
  input  logic                      clk,
  input  logic                      we,
  input  logic [$clog2(DEPTH)-1:0] wa,
  input  logic [$clog2(DEPTH)-1:0] ra1,
  input  logic [$clog2(DEPTH)-1:0] ra2,
  input  logic [W-1:0]              wd,
  output logic [W-1:0]              rd1,
  output logic [W-1:0]              rd2
);
  logic [W-1:0] regs [DEPTH];

  // x0 always reads zero
  assign rd1 = (ra1 == 0) ? '0 : regs[ra1];
  assign rd2 = (ra2 == 0) ? '0 : regs[ra2];

  always_ff @(posedge clk) begin
    if (we && wa != 0) regs[wa] <= wd;
  end
endmodule`,
        testbench: `module tb;
  logic        clk;
  logic        we;
  logic [4:0]  wa, ra1, ra2;
  logic [31:0] wd, rd1, rd2;
  int          p = 0, f = 0;

  // Clock generation
  initial clk = 0;
  always #5 clk = ~clk;
  // DUT instantiation
  regfile #(.W(32), .DEPTH(32)) dut (.*);

  initial begin
    // Write to r5 then read it back on port 1
    @(negedge clk); we = 1; wa = 5; wd = 32'hCAFE;
    @(posedge clk); @(negedge clk); we = 0;
    ra1 = 5;
    #1;
    if (rd1 === 32'hCAFE) begin p++; $display("PASS: read r5 port1"); end
    else begin f++; $display("FAIL: read r5 port1 got %h", rd1); end

    // Read same register on both ports
    ra2 = 5;
    #1;
    if (rd1 === 32'hCAFE && rd2 === 32'hCAFE) begin p++; $display("PASS: dual-port same reg"); end
    else begin f++; $display("FAIL: dual-port rd1=%h rd2=%h", rd1, rd2); end

    // Write to r10, read different registers on both ports
    @(negedge clk); we = 1; wa = 10; wd = 32'hBEEF;
    @(posedge clk); @(negedge clk); we = 0;
    ra1 = 5; ra2 = 10;
    #1;
    if (rd1 === 32'hCAFE && rd2 === 32'hBEEF) begin p++; $display("PASS: two-reg read"); end
    else begin f++; $display("FAIL: two-reg rd1=%h rd2=%h", rd1, rd2); end

    // Write to x0 — must remain zero
    @(negedge clk); we = 1; wa = 0; wd = 32'hFFFF;
    @(posedge clk); @(negedge clk); we = 0;
    ra1 = 0;
    #1;
    if (rd1 === 0) begin p++; $display("PASS: x0 = 0"); end
    else begin f++; $display("FAIL: x0 got %h", rd1); end

    // Read-during-write (read-first: should see OLD value)
    @(negedge clk); we = 1; wa = 5; wd = 32'h1234;
    ra1 = 5;
    #1;  // before clock edge, read port sees old value
    if (rd1 === 32'hCAFE) begin p++; $display("PASS: read-first semantics"); end
    else begin f++; $display("FAIL: read-during-write rd1=%h", rd1); end
    @(posedge clk); @(negedge clk);
    we = 0;
    #1;
    if (rd1 === 32'h1234) begin p++; $display("PASS: new value after clk"); end
    else begin f++; $display("FAIL: post-write rd1=%h", rd1); end

    // Summary
    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule`
      };
    }

    if (qId === 'reg2') {
      return {
        solution: `module reg_rename #(
  parameter ARCH = 32,
  parameter PHYS = 64
)(
  input  logic                         clk,
  input  logic                         rst_n,
  input  logic                         rename_req,
  input  logic                         checkpoint_save,
  input  logic                         flush,
  input  logic                         commit_free,
  input  logic [$clog2(ARCH)-1:0]      src1_arch,
  input  logic [$clog2(ARCH)-1:0]      src2_arch,
  input  logic [$clog2(ARCH)-1:0]      dst_arch,
  input  logic [$clog2(PHYS)-1:0]      free_preg,
  output logic [$clog2(PHYS)-1:0]      src1_preg,
  output logic [$clog2(PHYS)-1:0]      src2_preg,
  output logic [$clog2(PHYS)-1:0]      new_preg,
  output logic [$clog2(PHYS)-1:0]      old_preg,
  output logic                         rename_grant,
  output logic                         stall
);
  logic [$clog2(PHYS)-1:0] map_table        [ARCH];
  logic [$clog2(PHYS)-1:0] checkpoint_table [ARCH];
  logic [PHYS-1:0]         free_list;

  assign src1_preg = map_table[src1_arch];
  assign src2_preg = map_table[src2_arch];
  assign old_preg  = map_table[dst_arch];
  assign stall     = (free_list == '0);
  assign rename_grant = rename_req && !stall;

  always_comb begin
    new_preg = '0;
    for (int i = 0; i < PHYS; i++) begin
      if (free_list[i]) begin
        new_preg = i[$clog2(PHYS)-1:0];
        break;
      end
    end
  end

  // Combinational: compute rebuilt free list from checkpoint (synthesizable)
  logic [PHYS-1:0] rebuilt_free_list;
  always_comb begin
    logic [PHYS-1:0] used;
    used = '0;
    for (int a = 0; a < ARCH; a++) begin
      used[checkpoint_table[a]] = 1'b1;
    end
    rebuilt_free_list = ~used;
  end

  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      for (int a = 0; a < ARCH; a++) begin
        map_table[a]        <= a[$clog2(PHYS)-1:0];
        checkpoint_table[a] <= a[$clog2(PHYS)-1:0];
      end
      free_list <= {{(PHYS-ARCH){1'b1}}, {ARCH{1'b0}}};
    end else begin
      if (checkpoint_save) begin
        for (int a = 0; a < ARCH; a++) begin
          checkpoint_table[a] <= map_table[a];
        end
      end

      if (flush) begin
        for (int a = 0; a < ARCH; a++) begin
          map_table[a] <= checkpoint_table[a];
        end
        free_list <= rebuilt_free_list;
      end else begin
        if (rename_req && !stall) begin
          map_table[dst_arch] <= new_preg;
          free_list[new_preg] <= 1'b0;
        end
        if (commit_free) begin
          free_list[free_preg] <= 1'b1;
        end
      end
    end
  end
endmodule`,
        testbench: `module tb;
  logic       clk;
  logic       rst_n, rename_req, checkpoint_save, flush, commit_free, rename_grant, stall;
  logic [1:0] src1_arch, src2_arch, dst_arch;
  logic [2:0] free_preg, src1_preg, src2_preg, new_preg, old_preg;
  int         p = 0, f = 0;

  initial clk = 0;

  always #5 clk = ~clk;
  reg_rename #(.ARCH(4), .PHYS(6)) dut (.*);

  initial begin
    rst_n           = 0;
    rename_req      = 0;
    checkpoint_save = 0;
    flush           = 0;
    commit_free     = 0;
    src1_arch       = 0;
    src2_arch       = 1;
    dst_arch        = 1;
    free_preg       = 0;
    @(posedge clk);
    @(posedge clk);
    rst_n = 1;

    // First rename of r1.
    @(negedge clk); rename_req = 1; dst_arch = 1;
    #1;  // check comb outputs before posedge commits
    if (rename_grant && old_preg == 1 && new_preg >= 4) begin
      p++;
      $display("PASS: first rename");
    end else begin
      f++;
      $display("FAIL: first rename old=%0d new=%0d", old_preg, new_preg);
    end
    @(posedge clk); @(negedge clk); rename_req = 0;
    @(negedge clk); checkpoint_save = 1;
    @(posedge clk); @(negedge clk); checkpoint_save = 0;

    // Second rename of r1 should allocate a different preg and report old mapping.
    rename_req = 1;
    dst_arch   = 1;
    @(posedge clk);
    rename_req = 0;
    if (rename_grant && old_preg != new_preg) begin
      p++;
      $display("PASS: second rename updates mapping");
    end else begin
      f++;
      $display("FAIL: second rename");
    end
    @(posedge clk); @(negedge clk); rename_req = 0;

    // Exhaust free list and check stall.
    @(negedge clk); rename_req = 1; dst_arch = 2;
    @(posedge clk); @(negedge clk); rename_req = 0;
    if (stall) begin
      p++;
      $display("PASS: stall on empty free list");
    end else begin
      f++;
      $display("FAIL: expected stall");
    end

    // Flush restores checkpoint mapping for r1.
    // After checkpoint, map_table[1] was the first-rename preg.
    // Save expected value before flush changes dst_arch context.
    @(negedge clk); flush = 1; dst_arch = 1;  // point old_preg back at r1
    @(posedge clk); @(negedge clk); flush = 0;
    src1_arch = 1;
    #1;
    // src1_preg = map_table[1] (restored from checkpoint)
    // old_preg  = map_table[dst_arch=1] (same thing after flush restore)
    if (src1_preg == old_preg && src1_preg != 1) begin
      p++;
      $display("PASS: flush restored checkpoint (r1 -> p%0d)", src1_preg);
    end else begin
      f++;
      $display("FAIL: flush restore src1=%0d old=%0d", src1_preg, old_preg);
    end

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule`
      };
    }

    if (qId === 'reg3') {
      return {
        solution: `module scoreboard #(
  parameter REGS = 32
)(
  input  logic       clk,
  input  logic       rst_n,
  input  logic       issue_valid,
  input  logic       wb_valid,
  input  logic [4:0] issue_rd,
  input  logic [4:0] wb_rd,
  input  logic [4:0] check_rs1,
  input  logic [4:0] check_rs2,
  output logic       rs1_busy,
  output logic       rs2_busy
);
  logic [REGS-1:0] busy;

  assign rs1_busy = (check_rs1 != 0) && busy[check_rs1];
  assign rs2_busy = (check_rs2 != 0) && busy[check_rs2];

  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      busy <= '0;
    end else begin
      if (issue_valid && issue_rd != 0) busy[issue_rd] <= 1;
      if (wb_valid    && wb_rd    != 0) busy[wb_rd]    <= 0;
    end
  end
endmodule`,
        testbench: `module tb;
  logic       clk;
  logic       rst_n, issue_valid, wb_valid;
  logic       rs1_busy, rs2_busy;
  logic [4:0] issue_rd, wb_rd, check_rs1, check_rs2;
  int         p = 0, f = 0;

  // Clock generation
  initial clk = 0;
  always #5 clk = ~clk;
  // DUT instantiation
  scoreboard #(.REGS(32)) dut (.*);

  initial begin
    // Reset sequence
    rst_n       = 0;
    issue_valid = 0;
    wb_valid    = 0;
    check_rs1   = 0;
    check_rs2   = 0;
    @(posedge clk);
    @(posedge clk);
    rst_n = 1;

    // Issue instruction to r5 — marks it busy
    @(negedge clk); issue_valid = 1; issue_rd = 5;
    @(posedge clk); @(negedge clk); issue_valid = 0;
    check_rs1   = 5;
    @(negedge clk);
    if (rs1_busy) begin
      p++;
      $display("PASS: r5 busy");
    end else begin
      f++;
      $display("FAIL");
    end

    // Writeback to r5 — clears busy
    @(negedge clk); wb_valid = 1; wb_rd = 5;
    @(posedge clk); @(negedge clk); wb_valid = 0;
    @(negedge clk);
    if (!rs1_busy) begin p++; $display("PASS: r5 free after wb"); end
    else begin f++; $display("FAIL: r5 still busy after wb"); end

    // x0 always reads as ready
    check_rs1 = 0;
    @(negedge clk); issue_valid = 1; issue_rd = 0;
    @(posedge clk); @(negedge clk); issue_valid = 0;
    @(negedge clk);
    if (!rs1_busy) begin p++; $display("PASS: x0 always ready"); end
    else begin f++; $display("FAIL: x0 busy"); end

    // Check rs2: issue r10, check rs2=10
    @(negedge clk); issue_valid = 1; issue_rd = 10;
    @(posedge clk); @(negedge clk); issue_valid = 0;
    check_rs2 = 10;
    @(negedge clk);
    if (rs2_busy) begin p++; $display("PASS: rs2 busy for r10"); end
    else begin f++; $display("FAIL: rs2 not busy for r10"); end

    // Same-cycle issue+wb to same register: wb clears first, issue sets
    // (in solution: if both match, issue after wb => net busy=1)
    @(negedge clk); wb_valid = 1; wb_rd = 10; issue_valid = 1; issue_rd = 10;
    @(posedge clk); @(negedge clk); wb_valid = 0; issue_valid = 0;
    @(negedge clk);
    // In the solution, wb is after issue in always_ff,
    // so last NBA wins: wb clears busy[10]=0
    if (!rs2_busy) begin p++; $display("PASS: same-cycle wb wins over issue"); end
    else begin f++; $display("FAIL: same-cycle wb should win busy=%b", dut.busy[10]); end

    // Summary
    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule`
      };
    }

    // ─── GPU / SIMD ───────────────────────────────────────────────────────────

    if (qId === 'gpu1') {
      return {
        solution: `module warp_scheduler #(
  parameter N_WARPS = 8
)(
  input  logic                        clk,
  input  logic                        rst_n,
  input  logic [N_WARPS-1:0]         warp_ready,
  output logic [$clog2(N_WARPS)-1:0] selected_warp,
  output logic                        valid
);
  logic [$clog2(N_WARPS)-1:0] last;

  always_comb begin
    logic [$clog2(N_WARPS)-1:0] idx;

    valid         = 0;
    selected_warp = '0;
    idx           = '0;
    for (int i = 1; i <= N_WARPS; i++) begin
      idx = (last + i) % N_WARPS;
      if (warp_ready[idx]) begin
        selected_warp = idx;
        valid         = 1;
        break;
      end
    end
  end

  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n)     last <= '0;
    else if (valid) last <= selected_warp;
  end
endmodule`,
        testbench: `module tb;
  logic       clk;
  logic       rst_n, valid;
  logic [7:0] warp_ready;
  logic [2:0] selected_warp;
  int         p = 0, f = 0;

  // Clock generation
  initial clk = 0;
  always #5 clk = ~clk;
  // DUT instantiation
  warp_scheduler #(.N_WARPS(8)) dut (.*);

  initial begin
    // Reset sequence
    rst_n      = 0;
    warp_ready = 0;
    @(posedge clk);
    @(posedge clk);
    rst_n = 1;

    // Warps 2 and 5 ready — expect round-robin to pick warp 2 first
    warp_ready = 8'b0010_0100;
    @(posedge clk); @(negedge clk);
    if (valid && selected_warp == 2) begin p++; $display("PASS: selected warp 2"); end
    else begin f++; $display("FAIL: got %0d valid=%b", selected_warp, valid); end

    // After one scheduling update, next choice should advance to warp 5
    @(posedge clk);
    @(negedge clk);
    if (selected_warp == 5) begin p++; $display("PASS: RR advanced to warp 5"); end
    else begin f++; $display("FAIL: expected 5 got %0d", selected_warp); end

    // No warps ready
    warp_ready = 8'b0000_0000;
    @(posedge clk);
    @(negedge clk);
    if (!valid) begin p++; $display("PASS: no warps ready"); end
    else begin f++; $display("FAIL: valid should be 0"); end

    // Single warp ready: always picks it
    warp_ready = 8'b0000_1000; // warp 3
    @(posedge clk);
    @(negedge clk);
    if (valid && selected_warp == 3) begin p++; $display("PASS: single warp 3"); end
    else begin f++; $display("FAIL: single warp got %0d", selected_warp); end

    // Wrap-around: last=3, warps 0 and 1 ready -> picks 0 (wraps)
    @(posedge clk); // last updates to 3
    warp_ready = 8'b0000_0011; // warps 0 and 1
    @(posedge clk);
    @(negedge clk);
    if (valid && selected_warp == 0) begin p++; $display("PASS: wrap-around to 0"); end
    else begin f++; $display("FAIL: wrap got %0d", selected_warp); end

    // Summary
    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule`
      };
    }

    if (qId === 'gpu2') {
      return {
        solution: `module simd_alu #(
  parameter LANES = 4,
  parameter W     = 32
)(
  input  logic [W-1:0]     a      [LANES],
  input  logic [W-1:0]     b      [LANES],
  input  logic [LANES-1:0] mask,
  input  logic [2:0]        op,
  output logic [W-1:0]     result [LANES]
);
  genvar i;
  generate
    for (i = 0; i < LANES; i++) begin : lane
      always_comb begin
        if (!mask[i]) begin
          result[i] = '0;
        end else begin
          case (op)
            3'd0: result[i] = a[i] + b[i];
            3'd1: result[i] = a[i] - b[i];
            3'd2: result[i] = a[i] & b[i];
            3'd3: result[i] = a[i] | b[i];
            3'd4: result[i] = a[i] ^ b[i];
            default: result[i] = '0;
          endcase
        end
      end
    end
  endgenerate
endmodule`,
        testbench: `module tb;
  logic [31:0] a[4], b[4], result[4];
  logic [3:0]  mask;
  logic [2:0]  op;
  int          p = 0, f = 0;

  // DUT instantiation
  simd_alu #(.LANES(4), .W(32)) dut (.*);

  initial begin
    // Initialise inputs: a = [1,2,3,4], b = [10,10,10,10]
    for (int i = 0; i < 4; i++) begin
      a[i] = i + 1;
      b[i] = 10;
    end

    // All lanes active — ADD
    mask = 4'b1111;
    op   = 3'd0;
    #1;
    if (result[0] == 11 && result[3] == 14) begin
      p++;
      $display("PASS: SIMD ADD");
    end else begin
      f++;
      $display("FAIL");
    end

    // Mask lanes 1 and 3 — they should output 0
    mask = 4'b0101;
    #1;
    if (result[1] == 0 && result[3] == 0) begin
      p++;
      $display("PASS: masked lanes = 0");
    end else begin
      f++;
      $display("FAIL: masked lanes r1=%0d r3=%0d", result[1], result[3]);
    end

    // SUB operation: a - b
    mask = 4'b1111;
    op   = 3'd1;
    #1;
    // a[3]=4, b[3]=10, result should be 4-10 (unsigned wrap)
    if (result[0] == 32'hFFFFFFF7) begin
      p++;
      $display("PASS: SIMD SUB");
    end else begin
      f++;
      $display("FAIL: SIMD SUB r0=%h", result[0]);
    end

    // AND operation
    a[0] = 32'hFF00; b[0] = 32'h0F0F;
    op   = 3'd2;
    #1;
    if (result[0] == 32'h0F00) begin
      p++;
      $display("PASS: SIMD AND");
    end else begin
      f++;
      $display("FAIL: SIMD AND r0=%h", result[0]);
    end

    // XOR operation
    op = 3'd4;
    #1;
    if (result[0] == 32'hF00F) begin
      p++;
      $display("PASS: SIMD XOR");
    end else begin
      f++;
      $display("FAIL: SIMD XOR r0=%h", result[0]);
    end

    // Summary
    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule`
      };
    }

    if (qId === 'gpu3') {
      return {
        solution: `module thread_mask #(
  parameter THREADS = 32,
  parameter STACK_D = 4
)(
  input  logic [THREADS-1:0] predicate,
  input  logic               clk,
  input  logic               rst_n,
  input  logic               enter_if,
  input  logic               enter_else,
  input  logic               exit_if,
  output logic [THREADS-1:0] active_mask
);
  logic [THREADS-1:0] stack [STACK_D];
  logic [$clog2(STACK_D+1)-1:0] sp;

  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      active_mask <= {THREADS{1'b1}};
      sp          <= '0;
      for (int i = 0; i < STACK_D; i++) stack[i] <= '0;
    end else begin
      if (enter_if && sp < STACK_D) begin
        stack[sp]   <= active_mask;
        sp          <= sp + 1'b1;
        active_mask <= active_mask & predicate;
      end else if (enter_else && (sp != 0)) begin
        active_mask <= stack[sp-1] & ~predicate;
      end else if (exit_if && (sp != 0)) begin
        active_mask <= stack[sp-1];
        sp          <= sp - 1'b1;
      end
    end
  end
endmodule`,
        testbench: `module tb;
  logic [7:0] predicate, active_mask;
  logic       clk, rst_n, enter_if, enter_else, exit_if;
  int         p = 0, f = 0;

  initial clk = 0;

  always #5 clk = ~clk;
  thread_mask #(.THREADS(8), .STACK_D(4)) dut (.*);

  initial begin
    rst_n = 0;
    enter_if = 0;
    enter_else = 0;
    exit_if = 0;
    predicate = 0;
    @(posedge clk);
    @(posedge clk);
    rst_n = 1;
    #1;
    if (active_mask == 8'hFF) begin p++; $display("PASS: reset all active"); end
    else begin f++; $display("FAIL: reset mask"); end

    // if predicate 10101010
    @(negedge clk); predicate = 8'hAA; enter_if = 1;
    @(posedge clk); @(negedge clk); enter_if = 0;
    if (active_mask == 8'hAA) begin p++; $display("PASS: enter_if"); end
    else begin f++; $display("FAIL: enter_if mask=%h", active_mask); end

    // nested if with 11001100 => 10001000
    @(negedge clk); predicate = 8'hCC; enter_if = 1;
    @(posedge clk); @(negedge clk); enter_if = 0;
    if (active_mask == 8'h88) begin p++; $display("PASS: nested if"); end
    else begin f++; $display("FAIL: nested mask=%h", active_mask); end

    // exit nested if => back to 0xAA
    @(negedge clk); exit_if = 1;
    @(posedge clk); @(negedge clk); exit_if = 0;
    @(posedge clk); @(negedge clk);
    if (active_mask == 8'hAA) begin p++; $display("PASS: pop restore"); end
    else begin f++; $display("FAIL: pop restore mask=%h", active_mask); end

    // enter_else: should give active_mask & ~predicate (using saved mask 0xFF from outer)
    // Currently at outer level with active_mask=0xAA from first enter_if
    // enter_else with predicate 0xAA should give stack[sp-1] & ~pred = 0xFF & ~0xAA = 0x55
    @(negedge clk); predicate = 8'hAA; enter_else = 1;
    @(posedge clk); @(negedge clk); enter_else = 0;
    @(posedge clk); @(negedge clk);
    if (active_mask == 8'h55) begin p++; $display("PASS: enter_else"); end
    else begin f++; $display("FAIL: enter_else mask=%h", active_mask); end

    // exit outer if => back to all active 0xFF
    @(negedge clk); exit_if = 1;
    @(posedge clk); @(negedge clk); exit_if = 0;
    @(posedge clk); @(negedge clk);
    if (active_mask == 8'hFF) begin p++; $display("PASS: exit to all active"); end
    else begin f++; $display("FAIL: exit to all mask=%h", active_mask); end

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule`
      };
    }

    if (qId === 'gpu4') {
      return {
        solution: `module bank_conflict #(
  parameter N_BANKS    = 32,
  parameter THREADS    = 32,
  parameter ADDR_W     = 32,
  parameter BANK_OFFSET = 2
)(
  input  logic [ADDR_W-1:0]                   addr [THREADS],
  input  logic [THREADS-1:0]                  active_mask,
  output logic                                has_conflict,
  output logic [$clog2(N_BANKS)-1:0]          conflict_bank_id,
  output logic                                can_issue,
  output logic [THREADS-1:0]                  conflict_mask
);
  logic [THREADS-1:0] used [N_BANKS];
  logic [$clog2(N_BANKS)-1:0] bank;

  always_comb begin
    has_conflict     = 1'b0;
    conflict_bank_id = '0;
    can_issue        = 1'b1;
    conflict_mask    = '0;
    for (int b = 0; b < N_BANKS; b++) used[b] = '0;

    for (int t = 0; t < THREADS; t++) begin
      if (active_mask[t]) begin
        bank = (addr[t] >> BANK_OFFSET) & (N_BANKS-1);
        if (|used[bank]) begin
          has_conflict      = 1'b1;
          can_issue         = 1'b0;
          conflict_bank_id  = bank;
          conflict_mask     = conflict_mask | used[bank];
          conflict_mask[t]  = 1'b1;
        end
        used[bank][t] = 1'b1;
      end
    end
  end
endmodule`,
        testbench: `module tb;
  logic [31:0] addr [4];
  logic [3:0]  active_mask, conflict_mask;
  logic        has_conflict, can_issue;
  logic [1:0]  conflict_bank_id;
  int          p = 0, f = 0;

  bank_conflict #(.N_BANKS(4), .THREADS(4), .ADDR_W(32), .BANK_OFFSET(2)) dut (.*);

  initial begin
    active_mask = 4'b1111;
    addr[0] = 32'h0;  // bank0
    addr[1] = 32'h4;  // bank1
    addr[2] = 32'h8;  // bank2
    addr[3] = 32'hC;  // bank3
    #1;
    if (!has_conflict && can_issue) begin
      p++;
      $display("PASS: no conflict");
    end else begin
      f++;
      $display("FAIL: no-conflict case");
    end

    // Threads 0 and 1 both bank1.
    addr[0] = 32'h4;
    addr[1] = 32'h14;
    #1;
    if (has_conflict && !can_issue && conflict_bank_id == 1) begin
      p++;
      $display("PASS: conflict bank1");
    end else begin
      f++;
      $display("FAIL: conflict case bank=%0d", conflict_bank_id);
    end

    // Mask out one thread; conflict should disappear.
    active_mask = 4'b0010;
    #1;
    if (!has_conflict) begin
      p++;
      $display("PASS: masked thread ignored");
    end else begin
      f++;
      $display("FAIL: masked thread still conflicts");
    end

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule`
      };
    }

    // ─── Miscellaneous ────────────────────────────────────────────────────────

    if (qId === 'misc1') {
      return {
        solution: `module decoder #(
  parameter N = 3
)(
  input  logic [N-1:0]       in,
  input  logic                en,
  output logic [(1<<N)-1:0]  out
);
  assign out = en ? ({{((1<<N)-1){1'b0}}, 1'b1} << in) : '0;
endmodule`,
        testbench: `module tb;
  logic [2:0] in;
  logic       en;
  logic [7:0] out;
  int         p = 0, f = 0;

  // DUT instantiation
  decoder #(.N(3)) dut (.*);

  task automatic check(input string msg, input logic [7:0] exp);
    #1;
    if (out === exp) begin
      p++;
      $display("PASS: %s", msg);
    end else begin
      f++;
      $display("FAIL: %s  got=%b", msg, out);
    end
  endtask

  initial begin
    en = 1;
    in = 0; check("in=0",     8'b0000_0001);
    in = 3; check("in=3",     8'b0000_1000);
    in = 7; check("in=7",     8'b1000_0000);
    en = 0;
    in = 5; check("disabled", 8'b0000_0000);

    // Full sweep: verify one-hot for all 8 inputs
    en = 1;
    for (int i = 0; i < 8; i++) begin
      in = i[2:0];
      #1;
      if (out === (8'b1 << i)) begin
        p++;
      end else begin
        f++;
        $display("FAIL: sweep in=%0d  exp=%b got=%b", i, (8'b1 << i), out);
      end
    end
    $display("INFO: sweep complete (%0d checked)", 8);

    // Enable toggle: same input, enable transitions
    in = 4;
    en = 1; #1;
    if (out == 8'b0001_0000) begin p++; $display("PASS: en=1 in=4"); end
    else begin f++; $display("FAIL: en=1 in=4"); end
    en = 0; #1;
    if (out == 8'b0000_0000) begin p++; $display("PASS: en=0 in=4"); end
    else begin f++; $display("FAIL: en=0 in=4"); end

    // Summary
    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule`
      };
    }

    if (qId === 'misc2') {
      return {
        solution: `module priority_enc #(
  parameter N = 8
)(
  input  logic [N-1:0]          in,
  output logic [$clog2(N)-1:0] out,
  output logic                   valid
);
  // LSB-first priority: lowest bit index has highest priority
  always_comb begin
    valid = |in;
    out   = '0;
    for (int i = 0; i < N; i++) begin
      if (in[i]) begin
        out = i[$clog2(N)-1:0];
        break;
      end
    end
  end
endmodule`,
        testbench: `module tb;
  logic [7:0] in;
  logic [2:0] out;
  logic       valid;
  int         p = 0, f = 0;

  // DUT instantiation
  priority_enc #(.N(8)) dut (.*);

  task automatic check(input string msg, input logic [2:0] eo, input logic ev);
    #1;
    if (out === eo && valid === ev) begin
      p++;
      $display("PASS: %s", msg);
    end else begin
      f++;
      $display("FAIL: %s", msg);
    end
  endtask

  initial begin
    in = 8'b1010_0000; check("bit5(lsb-first)", 3'd5, 1);
    in = 8'b0000_0001; check("bit0",            3'd0, 1);
    in = 8'b0000_0000; check("none",            3'd0, 0);
    in = 8'b0010_1100; check("lowest=2",        3'd2, 1);
    in = 8'b0000_1000; check("bit3",            3'd3, 1);

    // Summary
    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule`
      };
    }

    if (qId === 'misc3') {
      return {
        solution: `module rr_arbiter #(
  parameter N = 4
)(
  input  logic          clk,
  input  logic          rst_n,
  input  logic [N-1:0] req,
  output logic [N-1:0] grant
);
  logic [$clog2(N)-1:0] last;

  always_comb begin
    logic [$clog2(N)-1:0] idx;

    grant = '0;
    idx   = '0;
    for (int i = 1; i <= N; i++) begin
      idx = (last + i) % N;
      if (req[idx]) begin
        grant[idx] = 1;
        break;
      end
    end
  end

  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      last <= '0;
    end else if (|grant) begin
      for (int i = 0; i < N; i++) begin
        if (grant[i]) last <= i;
      end
    end
  end
endmodule`,
        testbench: `module tb;
  logic       clk;
  logic       rst_n;
  logic [3:0] req, grant;
  int         p = 0, f = 0;

  // Clock generation
  initial clk = 0;
  always #5 clk = ~clk;
  // DUT instantiation
  rr_arbiter #(.N(4)) dut (.*);

  initial begin
    // Reset sequence
    rst_n = 0;
    req   = 0;
    @(posedge clk);
    @(posedge clk);
    rst_n = 1;

    // Requests on channels 1 and 3 — lowest round-robin index from 0 is 1
    @(negedge clk); req = 4'b1010;
    #1;  // comb settle: last=0, search from 1 → grant[1]
    if (grant == 4'b0010) begin p++; $display("PASS: grant1"); end
    else begin f++; $display("FAIL: got %b", grant); end
    @(posedge clk);  // last updates to 1

    // After one grant update, round-robin advances past 1 and picks 3
    @(negedge clk);
    #1;
    if (grant == 4'b1000) begin p++; $display("PASS: RR advanced to 3"); end
    else begin f++; $display("FAIL: got %b", grant); end
    @(posedge clk);  // last updates to 3

    // Full rotation: all 4 requestors active
    @(negedge clk); req = 4'b1111;
    #1;  // last=3, search from 0 → grant[0]
    if (grant == 4'b0001) begin p++; $display("PASS: RR 0"); end
    else begin f++; $display("FAIL: full RR expected 0001 got %b", grant); end
    @(posedge clk);  // last updates to 0

    @(negedge clk); #1;  // last=0, search from 1 → grant[1]
    if (grant == 4'b0010) begin p++; $display("PASS: RR 1"); end
    else begin f++; $display("FAIL: full RR expected 0010 got %b", grant); end
    @(posedge clk);

    @(negedge clk); #1;  // last=1, search from 2 → grant[2]
    if (grant == 4'b0100) begin p++; $display("PASS: RR 2"); end
    else begin f++; $display("FAIL: full RR expected 0100 got %b", grant); end
    @(posedge clk);

    @(negedge clk); #1;  // last=2, search from 3 → grant[3]
    if (grant == 4'b1000) begin p++; $display("PASS: RR 3"); end
    else begin f++; $display("FAIL: full RR expected 1000 got %b", grant); end
    @(posedge clk);

    // No requests: grant should be 0
    @(negedge clk); req = 4'b0000;
    #1;
    if (grant == 4'b0000) begin p++; $display("PASS: no requests"); end
    else begin f++; $display("FAIL: no req got %b", grant); end

    // Single requestor: always gets grant
    @(posedge clk); @(negedge clk); req = 4'b0100;
    #1;
    if (grant == 4'b0100) begin p++; $display("PASS: single req"); end
    else begin f++; $display("FAIL: single req got %b", grant); end

    // Summary
    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule`
      };
    }

    if (qId === 'misc4') {
      return {
        solution: `module rob #(
  parameter ENTRIES = 8,
  parameter W       = 32
)(
  input  logic                          clk,
  input  logic                          rst_n,
  input  logic                          dispatch,
  input  logic                          writeback,
  input  logic                          commit,
  input  logic                          flush,
  input  logic [$clog2(ENTRIES)-1:0]    wb_id,
  input  logic [$clog2(ENTRIES)-1:0]    flush_tail,
  input  logic [4:0]                    dest_arch,
  input  logic [W-1:0]                  wb_value,
  output logic                          full,
  output logic                          empty,
  output logic                          commit_valid,
  output logic [4:0]                    commit_arch,
  output logic [W-1:0]                  commit_value,
  output logic [$clog2(ENTRIES)-1:0]    alloc_id
);
  logic [ENTRIES-1:0]                 valid, ready;
  logic [4:0]                         arch_dest [ENTRIES];
  logic [W-1:0]                       value     [ENTRIES];
  logic [$clog2(ENTRIES)-1:0]         head, tail;

  assign empty       = (head == tail) && !valid[head];
  assign full        = (head == tail) &&  valid[head];
  assign alloc_id    = tail;
  assign commit_valid = valid[head] && ready[head];
  assign commit_arch  = arch_dest[head];
  assign commit_value = value[head];

  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      head <= '0;
      tail <= '0;
      valid <= '0;
      ready <= '0;
      for (int i = 0; i < ENTRIES; i++) begin
        arch_dest[i] <= '0;
        value[i]     <= '0;
      end
    end else begin
      if (dispatch && !full) begin
        valid[tail]     <= 1'b1;
        ready[tail]     <= 1'b0;
        arch_dest[tail] <= dest_arch;
        tail            <= (tail == ENTRIES-1) ? '0 : (tail + 1'b1);
      end

      if (writeback) begin
        ready[wb_id] <= 1'b1;
        value[wb_id] <= wb_value;
      end

      if (commit_valid && commit) begin
        valid[head] <= 1'b0;
        ready[head] <= 1'b0;
        head        <= (head == ENTRIES-1) ? '0 : (head + 1'b1);
      end

      if (flush) begin
        // Invalidate entries in range [flush_tail, tail) with wrap-around.
        // If flush_tail == tail, nothing to invalidate.
        if (flush_tail != tail) begin
          for (int i = 0; i < ENTRIES; i++) begin
            logic in_flush_range;
            if (flush_tail < tail)
              in_flush_range = (i[$clog2(ENTRIES)-1:0] >= flush_tail) &&
                               (i[$clog2(ENTRIES)-1:0] < tail);
            else // flush_tail > tail (wrapped)
              in_flush_range = (i[$clog2(ENTRIES)-1:0] >= flush_tail) ||
                               (i[$clog2(ENTRIES)-1:0] < tail);
            if (in_flush_range) begin
              valid[i] <= 1'b0;
              ready[i] <= 1'b0;
            end
          end
        end
        tail <= flush_tail;
      end
    end
  end
endmodule`,
        testbench: `module tb;
  logic        clk;
  logic        rst_n, dispatch, writeback, commit, flush;
  logic        full, empty, commit_valid;
  logic [2:0]  wb_id, flush_tail, alloc_id;
  logic [4:0]  dest_arch, commit_arch;
  logic [31:0] wb_value, commit_value;
  int          p = 0, f = 0;

  initial clk = 0;

  always #5 clk = ~clk;
  rob #(.ENTRIES(8), .W(32)) dut (.*);

  initial begin
    rst_n = 0;
    dispatch = 0;
    writeback = 0;
    commit = 0;
    flush = 0;
    wb_id = 0;
    flush_tail = 0;
    dest_arch = 0;
    wb_value = 0;
    @(posedge clk);
    @(posedge clk);
    rst_n = 1;

    // Allocate one entry.
    @(negedge clk); dest_arch = 5; dispatch = 1;
    @(posedge clk); @(negedge clk); dispatch = 0;
    if (dut.valid[0]) begin p++; $display("PASS: alloc at tail/head0"); end
    else begin f++; $display("FAIL: allocation missing"); end

    // Not-ready head blocks commit.
    @(negedge clk); commit = 1;
    @(posedge clk); @(negedge clk); commit = 0;
    if (!commit_valid) begin p++; $display("PASS: not-ready blocks commit"); end
    else begin f++; $display("FAIL: commit should block"); end

    // Writeback then commit in-order.
    @(negedge clk); wb_id = 0; wb_value = 32'hBEEF; writeback = 1;
    @(posedge clk); @(negedge clk); writeback = 0;
    if (commit_valid && commit_arch == 5 && commit_value == 32'hBEEF) begin
      p++;
      $display("PASS: writeback marks ready");
    end else begin
      f++;
      $display("FAIL: writeback/ready");
    end

    @(negedge clk); commit = 1;
    @(posedge clk); @(negedge clk); commit = 0;
    @(posedge clk); @(negedge clk);
    if (empty) begin p++; $display("PASS: commit frees head"); end
    else begin f++; $display("FAIL: ROB not empty after commit"); end

    // Flush test: allocate 3 entries, then flush back to 1.
    @(negedge clk); dispatch = 1; dest_arch = 1;
    @(posedge clk); @(negedge clk); dest_arch = 2;
    @(posedge clk); @(negedge clk); dest_arch = 3;
    @(posedge clk); @(negedge clk); dispatch = 0;
    @(posedge clk); @(negedge clk);
    // tail should be at 4 (3 entries: indices 1, 2, 3), head at 1
    // Flush to flush_tail=2 => invalidate entries 2 and 3, keep entry 1
    @(negedge clk); flush_tail = 2; flush = 1;
    @(posedge clk); @(negedge clk); flush = 0;
    @(posedge clk); @(negedge clk);
    if (dut.valid[1] && !dut.valid[2] && !dut.valid[3]) begin
      p++;
      $display("PASS: flush invalidates younger entries");
    end else begin
      f++;
      $display("FAIL: flush v1=%b v2=%b v3=%b", dut.valid[1], dut.valid[2], dut.valid[3]);
    end

    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule`
      };
    }

    if (qId === 'misc5') {
      return {
        solution: `module fu_tracker #(
  parameter N_FU = 4
)(
  input  logic                      clk,
  input  logic                      rst_n,
  input  logic                      issue_req,
  input  logic                      done_req,
  input  logic [$clog2(N_FU)-1:0] issue_fu,
  input  logic [$clog2(N_FU)-1:0] done_fu,
  output logic [N_FU-1:0]         busy,
  output logic                      any_available
);
  assign any_available = ~(&busy);

  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      busy <= '0;
    end else begin
      if (issue_req) busy[issue_fu] <= 1;
      if (done_req)  busy[done_fu]  <= 0;
    end
  end
endmodule`,
        testbench: `module tb;
  logic       clk;
  logic       rst_n, issue_req, done_req, any_available;
  logic [1:0] issue_fu, done_fu;
  logic [3:0] busy;
  int         p = 0, f = 0;

  // Clock generation
  initial clk = 0;
  always #5 clk = ~clk;
  // DUT instantiation
  fu_tracker #(.N_FU(4)) dut (.*);

  initial begin
    // Reset sequence
    rst_n     = 0;
    issue_req = 0;
    done_req  = 0;
    @(posedge clk);
    @(posedge clk);
    rst_n = 1;

    // Issue FU0
    @(negedge clk); issue_req = 1; issue_fu = 0;
    @(posedge clk); @(negedge clk); issue_req = 0;
    @(negedge clk);
    if (busy[0] && any_available) begin
      p++;
      $display("PASS: FU0 busy");
    end else begin
      f++;
      $display("FAIL");
    end

    // Issue remaining FUs
    @(negedge clk); issue_req = 1; issue_fu = 1;
    @(posedge clk); @(negedge clk); issue_fu = 2;
    @(posedge clk); @(negedge clk); issue_fu = 3;
    @(posedge clk); @(negedge clk); issue_req = 0;
    @(negedge clk);
    if (!any_available) begin
      p++;
      $display("PASS: all busy");
    end else begin
      f++;
      $display("FAIL");
    end

    // Free FU2
    @(negedge clk); done_req = 1; done_fu = 2;
    @(posedge clk); @(negedge clk); done_req = 0;
    @(negedge clk);
    if (any_available && !busy[2]) begin
      p++;
      $display("PASS: freed");
    end else begin
      f++;
      $display("FAIL: free FU2");
    end

    // Same-cycle issue+done on same FU: done clears, issue sets => net busy=1
    // FU2 is currently free, issue and free FU1 at the same time
    @(negedge clk); issue_req = 1; issue_fu = 2; done_req = 1; done_fu = 1;
    @(posedge clk); @(negedge clk); issue_req = 0; done_req = 0;
    @(negedge clk);
    if (busy[2] && !busy[1]) begin
      p++;
      $display("PASS: same-cycle issue2+done1");
    end else begin
      f++;
      $display("FAIL: same-cycle busy=%b", busy);
    end

    // Summary
    $display("=== %0d passed %0d failed ===", p, f);
    $finish;
  end
endmodule`
      };
    }

  }
  return null;
};
