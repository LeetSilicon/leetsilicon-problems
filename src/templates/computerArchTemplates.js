/**
 * computerArchTemplates — Code templates for the "computer-architecture" domain.
 * Auto-split from codeTemplates.js
 */

export const computerArchTemplates = (qId, language) => {
  if (language === 'systemverilog') {
    // Cache & Memory related questions
    if (qId === 'cache1') {
      return `
// ============================================================
// True LRU Replacement Policy (4-Way Set-Associative) Template
// ============================================================
// Notes:
// - True LRU means: on replacement, evict the line least recently accessed.
// - Update LRU state on every access (read hit, write hit, and refill).
// - Prefer allocating invalid ways before evicting a valid way.
//
// Reference intuition/example of LRU behavior: A,B,C,D filled; access B;
// next miss evicts A (the least recently used). 

module cache_lru4 #(
  parameter int unsigned NUM_SETS  = 64,
  parameter int unsigned WAY_COUNT = 4
) (
  input  logic                         clk,
  input  logic                         rst_n,
  input  logic                         req_valid,
  input  logic                         hit,
  input  logic                         refill,
  input  logic [$clog2(NUM_SETS)-1:0]  req_set,
  input  logic [$clog2(WAY_COUNT)-1:0] hit_way,
  input  logic [$clog2(WAY_COUNT)-1:0] refill_way,
  input  logic [WAY_COUNT-1:0]         way_valid,
  output logic                         victim_valid,
  output logic [$clog2(WAY_COUNT)-1:0] victim_way
);

  // ----------------------------
  // LRU State (per set)
  // ----------------------------
  // Option A (recommended for true LRU): store a rank/age 0..3 for each way.
  // - rank==3 => MRU, rank==0 => LRU (victim)
  // - Must remain a permutation of {0,1,2,3} for valid ways.
  //
  // (This is a straightforward exact LRU representation; it’s fine if you choose
  // a different exact encoding.)
  logic [1:0] lru_rank   [NUM_SETS-1:0][WAY_COUNT-1:0];

  // ----------------------------
  // Helper function stubs
  // ----------------------------


  // TODO: Return index of any invalid way if exists.
  // Policy can be lowest-index invalid way for determinism.
  // If no invalid ways, return 0 (caller should ignore in that case).


  // TODO: Return 1 if any invalid way exists.

  // TODO: Return the way with the *smallest* rank among valid ways.
  // If multiple ways tie for smallest rank, return lowest index among them for determinism.

  );
  // TODO: True LRU update rule:
  // - The accessed way becomes MRU (rank=3).
  // - Any valid way that had rank > old_rank_of_accessed is decremented by 1.
  // - Ways with rank < old_rank_of_accessed stay the same.
  //
  // This preserves a total order (permutation) and yields exact LRU.

  // ----------------------------
  // Victim selection (combinational)
  // ----------------------------
  always_comb begin
  victim_valid = 1'b0;
  victim_way   = '0;

  if (req_valid) begin
  victim_valid = 1'b1;

  // TODO: Allocation priority:
  // 1) If any invalid way in this set => pick that invalid way.
  // 2) Else => pick true LRU way (oldest / smallest rank).
  if (has_invalid(way_valid)) begin
    victim_way = pick_invalid_way(way_valid);
  end else begin
    logic [1:0] ranks_local [WAY_COUNT-1:0];
    for (int w = 0; w < WAY_COUNT; w++) ranks_local[w] = lru_rank[req_set][w];
    victim_way = pick_lru_way(ranks_local, way_valid);
  end
  end
  end

  // ----------------------------
  // LRU state update (sequential)
  // ----------------------------
  always_ff @(posedge clk or negedge rst_n) begin
  if (!rst_n) begin
  // TODO: Reset behavior
  // - Initialize cache ways invalid elsewhere (tag/valid arrays).
  // - Initialize LRU state to a known permutation (e.g., 0,1,2,3) per set,
  //   or to any deterministic scheme.
  for (int s = 0; s < NUM_SETS; s++) begin
    for (int w = 0; w < WAY_COUNT; w++) begin
      lru_rank[s][w] <= logic'(w[1:0]);
    end
  end
  end else begin
  // TODO: Update rule on every access that *touches* a line:
  // - On hit: update_on_access(..., hit_way, way_valid)
  // - On refill: update_on_access(..., refill_way, updated-valids)
  //
  // If both hit and refill could occur same cycle, define priority/order.
  if (req_valid && hit) begin
    logic [1:0] ranks_tmp [WAY_COUNT-1:0];
    for (int w = 0; w < WAY_COUNT; w++) ranks_tmp[w] = lru_rank[req_set][w];
    update_on_access(ranks_tmp, hit_way, way_valid);
    for (int w = 0; w < WAY_COUNT; w++) lru_rank[req_set][w] <= ranks_tmp[w];
  end

  if (refill) begin
    // NOTE: refill_set is assumed to be req_set in this simplified template.
    // TODO: If refill can target a different set, add refill_set input.
    logic [1:0] ranks_tmp [WAY_COUNT-1:0];
    logic [WAY_COUNT-1:0] v_after;

    for (int w = 0; w < WAY_COUNT; w++) ranks_tmp[w] = lru_rank[req_set][w];

    // TODO: Define v_after = way_valid with refill_way forced valid.
    v_after = way_valid;

    update_on_access(ranks_tmp, refill_way, v_after);
    for (int w = 0; w < WAY_COUNT; w++) lru_rank[req_set][w] <= ranks_tmp[w];
  end
  end
  end

endmodule
`;
    }
    if (qId === 'cache2') {
      return `
// ============================================================
// Tree-Based Pseudo-LRU (PLRU) Replacement Policy Template
// ============================================================
// Semantics (documented convention):
// - Internal nodes store 1 bit each.
// - Victim selection walk: bit==0 => go LEFT, bit==1 => go RIGHT.
// - Update on access: set each node bit on the path so it points AWAY from
//   the accessed leaf (i.e., makes the *other* subtree look "less-recent").
//
// For an N-way set, where N is power-of-2:
// - There are N leaves (ways) and N-1 internal nodes => N-1 bits per set.
// - Updating touches log2(N) nodes along one root-to-leaf path.

module cache_plru #(
  parameter int unsigned NUM_SETS = 64,
  parameter int unsigned N_WAYS   = 4   // must be power of 2
) (
  input  logic                         clk,
  input  logic                         rst_n,
  input  logic                         access_valid,
  input  logic [$clog2(NUM_SETS)-1:0]  access_set,
  input  logic [$clog2(N_WAYS)-1:0]    access_way,
  output logic [$clog2(N_WAYS)-1:0]    victim_way
);

  // ----------------------------
  // Compile-time checks
  // ----------------------------
  localparam int unsigned LEVELS    = $clog2(N_WAYS);   // tree depth to leaf
  localparam int unsigned TREE_BITS = (N_WAYS - 1);     // internal nodes

  // TODO: Enforce N_WAYS is power-of-2 and >=2 (tool-dependent).
  // initial begin
  //   if (N_WAYS < 2) $fatal;
  //   if ((N_WAYS & (N_WAYS-1)) != 0) $fatal; // power-of-2 check
  // end

  // ----------------------------
  // PLRU state: N-1 bits per set
  // ----------------------------
  // We store internal-node bits in an array indexed like a binary heap:
  // node 0 = root
  // left child of i => 2*i + 1
  // right child of i => 2*i + 2
  //
  // Leaves (ways) are not stored; traversal ends after LEVELS decisions.
  logic [TREE_BITS-1:0] plru_bits [NUM_SETS-1:0];

  // ----------------------------
  // Helper: compute path directions
  // ----------------------------
  // We need, for each level from root->leaf, whether access_way is in left(0)/right(1) subtree.
  // A common mapping: treat access_way as a LEVELS-bit index; MSB decides at root, next bit at next level, etc.
  function automatic logic get_dir(input logic [$clog2(N_WAYS)-1:0] way, input int unsigned level);
  // TODO:
  // Return direction bit at "level":
  // - level=0 corresponds to root decision (use MSB of way index).
  // - level increases going down; use descending bits.
  // Example for N_WAYS=8 (LEVELS=3): way[2] is root dir, way[1] next, way[0] last.
  get_dir = 1'b0;
  endfunction

  // ----------------------------
  // Victim selection (combinational)
  // ----------------------------
  always_comb begin
  int unsigned node;
  logic [$clog2(N_WAYS)-1:0] way_accum;
  logic b;

  victim_way = '0;
  node       = 0;
  way_accum  = '0;
  b          = 1'b0;

  if (access_valid) begin

  // Walk from root for LEVELS steps following bits:
  // bit==0 => left, bit==1 => right, until reaching a leaf.
  for (int unsigned level = 0; level < LEVELS; level++) begin
    b = plru_bits[access_set][node];

    // TODO:
    // - Append b into way_accum (so we end with the leaf/way index).
    // - Move node to its child based on b: node = (b==0) ? (2*node+1) : (2*node+2).
    //
    // Hint: building the way index is like shifting in bits:
    // way_accum = (way_accum << 1) | b;
  end

  victim_way = way_accum;
  end
  end

  // ----------------------------
  // Update on access (sequential)
  // ----------------------------
  always_ff @(posedge clk or negedge rst_n) begin
  if (!rst_n) begin
  // Reset to known state (deterministic).
  // TODO: Choose convention; common is all zeros (bias victim to way 0) or any fixed pattern.
  for (int s = 0; s < NUM_SETS; s++) begin
    plru_bits[s] <= '0;
  end
  end else begin
  if (access_valid) begin
    // Update only the nodes along the root->leaf path for access_way.
    int unsigned node;
    node = 0;

    for (int unsigned level = 0; level < LEVELS; level++) begin
      logic dir;
      dir = get_dir(access_way, level); // 0=left subtree, 1=right subtree

      // TODO (tree semantics):
      // Set bit at current node to point AWAY from the accessed subtree.
      // If accessed went left (dir=0), set node bit to 1 (so victim walk would go right next time).
      // If accessed went right (dir=1), set node bit to 0.
      // plru_bits[access_set][node] <= ~dir;

      // TODO: Advance node down the accessed direction:
      // node = (dir==0) ? (2*node+1) : (2*node+2);
    end
  end
  end
  end
endmodule
`}

    if (qId === 'cache3') {
      return `
// ============================================================
// LFU Replacement (Counter-Based) Template
// ============================================================
// Behavior:
// - Per-line counter increments on hit (saturating). 
// - On refill, initialize counter to INIT (commonly 1).
// - On eviction, choose min counter; ties resolved deterministically.

module cache_lfu #(
  parameter int unsigned NUM_SETS    = 64,
  parameter int unsigned N_WAYS      = 4,
  parameter int unsigned CNT_W       = 4,   // counter width
  parameter logic [CNT_W-1:0] INIT   = 'd1  // init on fill (1 or 0; document choice)
) (
  input  logic                        clk,
  input  logic                        rst_n,

  // Access (hit updates)
  input  logic                        req_valid,
  input  logic                        hit,
  input  logic                        refill,
  input  logic [$clog2(NUM_SETS)-1:0] req_set,
  input  logic [$clog2(N_WAYS)-1:0]    hit_way,
  input  logic [$clog2(N_WAYS)-1:0]    refill_way,

  // Valid bits for eviction choice
  input  logic [N_WAYS-1:0]           way_valid,
  output logic [$clog2(N_WAYS)-1:0]    victim_way
);

  localparam logic [CNT_W-1:0] CNT_MAX = {CNT_W{1'b1}};

  logic [CNT_W-1:0] freq [NUM_SETS-1:0][N_WAYS-1:0];

  function automatic logic [CNT_W-1:0] sat_inc(input logic [CNT_W-1:0] x);
  // TODO: Saturating increment: if x<CNT_MAX => x+1 else hold. (No wrap.) 
  sat_inc = x;
  endfunction

  function automatic logic [$clog2(N_WAYS)-1:0]
  pick_lfu_victim(
  input logic [CNT_W-1:0] f [N_WAYS-1:0],
  input logic [N_WAYS-1:0] v
  );
  // TODO:
  // - Consider only valid ways for eviction (or define behavior when all invalid).
  // - Find minimum frequency among candidates.
  // - If tie: apply deterministic rule, such as lowest way index.
  pick_lfu_victim = '0;
  endfunction

  // Victim selection
  always_comb begin
  logic [CNT_W-1:0] f_local [N_WAYS-1:0];

  victim_way = '0;

  if (req_valid) begin

  for (int w=0; w<N_WAYS; w++) begin
    // TODO: Copy the current counters for req_set into f_local.
    //f_local[w] = freq[req_set][w];
  end

  // TODO: If any invalid way exists, you may prefer it (allocation-priority),
  // otherwise choose LFU victim from valid ways.
  //victim_way = pick_lfu_victim(f_local, way_valid);
  end
  end

  // Counter updates
  always_ff @(posedge clk or negedge rst_n) begin
  if (!rst_n) begin
  // TODO: Reset counters to 0 (or INIT) for all sets/ways.
  for (int s=0; s<NUM_SETS; s++)
    for (int w=0; w<N_WAYS; w++)
      freq[s][w] <= '0;
  end else begin
  if (req_valid && hit) begin
    // TODO: Increment hit counter with saturation. 
    freq[req_set][hit_way] <= sat_inc(freq[req_set][hit_way]);
  end

  if (refill) begin
    // TODO: Initialize on fill and/or reset on replacement.
    freq[req_set][refill_way] <= INIT;
  end
  end
  end

endmodule

`}

      if (qId === 'cache4') {
      return `
// ============================================================
// Cache Tag Compare + Hit/Miss Detection Template
// ============================================================

module cache_tag_cmp #(
  parameter int unsigned N_WAYS = 4,
  parameter int unsigned TAG_W  = 20
) (
  input  logic [TAG_W-1:0]        req_tag,
  input  logic [N_WAYS-1:0]        way_valid,
  input  logic [TAG_W-1:0]         way_tag [N_WAYS],

  output logic [N_WAYS-1:0]        way_match,
  output logic                     hit,
  output logic                     miss,
  output logic [$clog2(N_WAYS)-1:0] hit_way,
  output logic                     multi_hit_error
);

  always_comb begin
  // Per-way match: valid AND tags equal. 
  for (int w=0; w<N_WAYS; w++) begin
  way_match[w] = way_valid[w] & (way_tag[w] == req_tag);
  end

  // Hit/miss
  hit  = |way_match;            // OR-reduction 
  miss = ~hit;

  // TODO: Priority encode hit_way (lowest index match for determinism).
  hit_way = '0;
  for (int w=0; w<N_WAYS; w++) begin
  if (way_match[w]) begin
    hit_way = logic'($unsigned(w));
    break;
  end
  end

  // TODO: Multi-hit detection (cache corruption scenario):
  // - Flag error if more than one bit of way_match is set.
  // - Technique: multi_hit_error = |(way_match & (way_match - 1'b1));
  //   This is nonzero iff way_match has 2+ bits set.
  multi_hit_error = 1'b0;  // TODO: Replace with detection logic
  end

endmodule

`}

        if (qId === 'cache5') {
      return `
// ============================================================
// Write-Back Dirty Bit Management Template
// ============================================================

module cache_dirty #(
  parameter int unsigned NUM_SETS = 64,
  parameter int unsigned N_WAYS   = 4,
  parameter int unsigned TAG_W    = 20
) (
  input  logic                        clk,
  input  logic                        rst_n,

  // Events
  input  logic                        write_hit,
  input  logic                        refill_done,
  input  logic                        write_alloc_fill,
  input  logic                        evict_valid,
  input  logic                        wb_done,
  input  logic [$clog2(NUM_SETS)-1:0] hit_set,
  input  logic [$clog2(NUM_SETS)-1:0] refill_set,
  input  logic [$clog2(NUM_SETS)-1:0] evict_set,
  input  logic [$clog2(N_WAYS)-1:0]   hit_way,
  input  logic [$clog2(N_WAYS)-1:0]   refill_way,
  input  logic [$clog2(N_WAYS)-1:0]   evict_way,
  input  logic [TAG_W-1:0]            evict_tag,

  output logic                        evict_dirty,
  output logic                        writeback_req,
  output logic [TAG_W+$clog2(NUM_SETS)-1:0] writeback_addr
);

  logic dirty [NUM_SETS-1:0][N_WAYS-1:0];

  // Combinational: check victim dirty
  always_comb begin
  // TODO: Drive the current victim status.
  //evict_dirty    = dirty[evict_set][evict_way];
  //writeback_req  = evict_valid & evict_dirty;
  //writeback_addr = {evict_tag, evict_set};
  end

  always_ff @(posedge clk or negedge rst_n) begin
  if (!rst_n) begin
  // Reset: all dirty bits cleared. 
  for (int s=0; s<NUM_SETS; s++)
    for (int w=0; w<N_WAYS; w++)
      dirty[s][w] <= 1'b0;
  end else begin
  if (write_hit) begin
    // TODO: On write hit, set dirty. 
  end

  if (refill_done) begin
    // TODO:
    // - On read refill: dirty=0
    // - On write-allocate refill (line filled due to write miss): dirty=1
    dirty[refill_set][refill_way] <= write_alloc_fill;
  end

  if (wb_done) begin
    // TODO: Clear dirty for the line that was written back.
    // Need to know which set/way was in-flight; store evict_set/evict_way in regs.
  end
  end
  end

endmodule

`}

          if (qId === 'cache6') {
      return `
// ============================================================
// Cache Line Refill FSM Template
// ============================================================

module cache_refill_fsm #(
  parameter int unsigned LINE_WORDS = 4
) (
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
  state_t st, st_n;

  logic [$clog2(LINE_WORDS)-1:0] beat_q, beat_d;

  // Outputs
  always_comb begin
  mem_req      = 1'b0;
  stall        = (st != IDLE);
  refill_done  = 1'b0;
  beat_count   = beat_q;
  st_n         = st;
  beat_d       = beat_q;

  case (st)
  IDLE: begin
    if (miss) st_n = REQUEST;
  end

  REQUEST: begin
    mem_req = 1'b1;
    st_n = WAIT;
  end

  WAIT: begin
    if (mem_rvalid) begin
      st_n   = FILL;
      beat_d = '0;
    end
  end

  FILL: begin
    if (mem_rvalid) begin
      // TODO: Increment beat counter when a data beat arrives.
      // TODO: Transition to COMPLETE on mem_rlast or when beat_count reaches LINE_WORDS-1.
    end
  end

  COMPLETE: begin
    refill_done = 1'b1;
    st_n = IDLE;
  end
  endcase
  end

  // State regs
  always_ff @(posedge clk or negedge rst_n) begin
  if (!rst_n) begin
  st     <= IDLE;
  beat_q <= '0;
  end else begin
  // TODO: Register next-state values and clear beat counter on a new miss.
  end
  end

endmodule

`}

            if (qId === 'cache7') {
      return `
// ============================================================
// Simple MSHR Template (Allocate + Merge + Complete)
// ============================================================

module mshr #(
  parameter int unsigned ENTRIES  = 4,
  parameter int unsigned ADDR_W   = 32,
  parameter int unsigned REQS     = 4,
  parameter int unsigned OFFSET_W = 4
) (
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

  typedef struct packed {
  logic              valid;
  logic [ADDR_W-OFFSET_W-1:0] line_addr;
  logic [REQS-1:0]   waiters;
  } mshr_entry_t;

  mshr_entry_t mshr [ENTRIES-1:0];

  // TODO: Matching across all valid entries for same line_addr (merge).
  // TODO: Allocation of a free entry if no match. 
  // TODO: Deallocation on refill_done (clear valid), and wake all waiters. 

  // Placeholders
  always_comb begin
  full           = 1'b0;
  hit            = 1'b0;
  issue_mem_req  = 1'b0;
  alloc_entry    = '0;
  hit_entry      = '0;
  merged_waiters = '0;
  end

  always_ff @(posedge clk or negedge rst_n) begin
  if (!rst_n) begin
  for (int i=0; i<ENTRIES; i++) begin
    mshr[i].valid <= 1'b0;
    mshr[i].line_addr <= '0;
    mshr[i].waiters <= '0;
  end
  end else begin
  if (refill_done) begin
    // TODO: Clear refill_entry and expose its waiter mask on merged_waiters.
  end

  if (alloc_req) begin
    // TODO: (1) search for match to merge, else (2) allocate free entry,
    // else assert full/backpressure.
  end
  end
  end

endmodule

`}


    // ALU / Datapath questions
    if (qId === 'alu1') {
      return `
// ============================================================
// ID: alu1 — Parameterized ALU
// ============================================================
// TODO: Document alu_op encoding here (example only; user must finalize):
// - TODO: ALU_ADD = 3'b000
// - TODO: ALU_SUB = 3'b001
// - TODO: ALU_AND = 3'b010
// - TODO: ALU_OR  = 3'b011
// - TODO: ALU_XOR = 3'b100
// - TODO: ALU_SLT = 3'b101
//
// TODO: Define invalid-op behavior: output zero vs hold last result (choose one).
// TODO: Define which ops update carry/overflow flags (usually add/sub only).
// TODO: Confirm SLT is signed compare and result is 0...0001 or 0...0000.

module alu #(
  parameter int unsigned W = 32
) (
  input  logic [W-1:0] a,
  input  logic [W-1:0] b,
  input  logic [3:0]   op,
  output logic [W-1:0] result,
  output logic         zero,
  output logic         carry,
  output logic         overflow,
  output logic         negative
);

  // ----------------------------
  // TODO: Localparams for opcodes
  // ----------------------------
  // TODO: localparam logic [2:0] OP_ADD = ...;
  // TODO: localparam logic [2:0] OP_SUB = ...;
  // TODO: localparam logic [2:0] OP_AND = ...;
  // TODO: localparam logic [2:0] OP_OR  = ...;
  // TODO: localparam logic [2:0] OP_XOR = ...;
  // TODO: localparam logic [2:0] OP_SLT = ...;

  // ----------------------------
  // TODO: Internal extended sums for carry/borrow
  // ----------------------------
  // TODO: Create WIDTH+1 intermediates for ADD and SUB to capture carry-out.
  // TODO: Decide SUB carry/borrow convention explicitly:
  // - Option A: carry=1 means "no borrow" (common in some ISAs)
  // - Option B: carry=1 means "borrow occurred"
  // TODO: Add comments so testbench knows expected behavior.

  // ----------------------------
  // Combinational ALU
  // ----------------------------
  always_comb begin
  // TODO: Default assignments for all outputs to avoid latches.
  // TODO: result default, flags default.

  // TODO: Implement case(alu_op) selecting:
  // - ADD: result = A + B
  // - SUB: result = A - B
  // - AND/OR/XOR: bitwise ops
  // - SLT (signed): result = (signed(A) < signed(B)) ? 1 : 0, in LSB only
  // TODO: For SLT: ensure only bit 0 may be 1, other bits 0.

  // TODO: Flags:
  // - zero: result == 0
  // - negative: result[WIDTH-1]
  // - carry: from extended add/sub (per your convention)
  // - overflow: signed overflow for add/sub:
  //   overflow = (A[MSB] == B[MSB]) && (A[MSB] != result[MSB]) for ADD
  //   TODO: Provide SUB overflow rule (document, and implement consistently).

  // TODO: WIDTH=1 edge-case: ensure MSB index works (WIDTH-1 == 0).
  // TODO: Invalid alu_op: return safe value (e.g., result='0, flags=0).
  end

endmodule

`;}

    // ALU / Datapath questions
    if (qId === 'alu2') {
      return `
// ============================================================
// ID: alu2 — ALU Control Decoder
// ============================================================
// TODO: Define opcode/funct encodings (ISA-specific) in a table here.
// TODO: Decide split decode style:
// - Option A: One module does full decode (alu_op/funct fields -> final ALU control)
// - Option B: Main decode + separate ALU decode stage
// TODO: Safe defaults for illegal instructions: no writes, no mem ops.

module alu_control (
  input  logic [1:0] alu_op,
  input  logic [2:0] funct3,
  input  logic       funct7_b5,
  output logic [3:0] alu_ctrl
);

  always_comb begin
  // TODO: Assign safe defaults first to avoid inferred latches.
  // TODO: illegal_instruction default = 0, then set to 1 on unknown combinations.

  // TODO: Use unique case / priority case if your style guide prefers.
  // TODO: Decide selector:
  // - case(alu_op)
  // - case({alu_op, funct3, funct7_b5})
  // TODO: For each legal combination, drive alu_ctrl to the encoding expected by your ALU datapath.
  // TODO: Unsupported combinations should fall back to a documented safe alu_ctrl value.
  end

endmodule

`;}

    // ALU / Datapath questions
    if (qId === 'alu3') {
      return `
// ============================================================
// TODO: Signed Addition Overflow Detection
// ============================================================
// Overflow for two's complement add/sub depends on operand/result sign relationships; carry is tracked separately.

module overflow_detect #(
  parameter int unsigned W = 32
) (
  input  logic [W-1:0] a,
  input  logic [W-1:0] b,
  input  logic [W-1:0] result,
  input  logic         is_sub,
  output logic         overflow,
  output logic         carry
);

  // TODO: Implement:
  // For add: overflow = (a[MSB] == b[MSB]) && (a[MSB] != result[MSB]). For subtract, use the equivalent signed-subtract condition.
  // TODO: Parameterization: MSB = W-1.
  // TODO: W=1 corner-case: confirm formula still behaves as intended.
  // TODO: Keep combinational (assign or always_comb).

endmodule

`;}

    // ALU / Datapath questions
    if (qId === 'alu4') {
      return `
// ============================================================
// Barrel Shifter (SLL, SRL, SRA) One-Cycle Combinational
// ============================================================
// TODO: Define shift_type encoding, e.g. 00=SLL, 01=SRL, 10=SRA.
// TODO: Shift amount width should be clog2(W).
// TODO: Define behavior for shamt >= W (common: SLL/SRL => 0; SRA => all sign bits).

module barrel_shifter #(
  parameter int unsigned W = 32
) (
  input  logic [W-1:0]                 data_in,
  input  logic [$clog2(W)-1:0]         shamt,
  input  logic [1:0]                   shift_type,
  output logic [W-1:0]                 data_out
);

  // TODO: Decide implementation approach:
  // - Option A: synthesizable shift operators (<<, >>, >>>)
  // - Option B: classic barrel shifter with log2(W) stages of muxing
  // TODO: Ensure SRA uses sign extension (replicate data_in[W-1]).
  // TODO: Handle W not power-of-2 (still works, but define any constraints).
  // TODO: shamt==0 should pass data_in unchanged.

  always_comb begin
  // TODO: defaults, then case(shift_type)
  end

endmodule

`;}

    // ALU / Datapath questions
    if (qId === 'alu5') {
      return `
// ============================================================
// Multicycle Iterative Multiplier
// ============================================================
// TODO: Choose algorithm: radix-2 shift-and-add or Booth, and document.
// TODO: Expected cycles: typically W cycles for radix-2 (plus optional start/done overhead).

module multiplier #(
  parameter int unsigned W = 16
) (
  input  logic               clk,
  input  logic               rst_n,

  input  logic               start,
  input  logic [W-1:0]       a,
  input  logic [W-1:0]       b,

  output logic [2*W-1:0]     product,
  output logic               busy,
  output logic               done
);

  // TODO: Define FSM states: IDLE, RUN, DONE (or similar).
  // TODO: Latch a/b on start (so inputs may change while busy).
  // TODO: Internal regs:
  // - multiplicand (2*W bits)
  // - multiplier (W bits)
  // - accumulator/product (2*W bits)
  // - iteration counter (0..W-1)
  // TODO: On reset: busy=0, done=0, clear state.
  // TODO: done should be single-cycle pulse; busy deasserts when complete.
  // TODO: Back-to-back operations: allow new start when not busy (or in DONE->IDLE).
  // TODO: Define behavior if start asserted while busy (ignore vs restart vs error flag).

endmodule

`;}

    // ALU / Datapath questions
    if (qId === 'alu6') {
      return `
// ============================================================
// Sequential Divider (Shift-Subtract)
// ============================================================
// TODO: Choose restoring or non-restoring division and document.
// TODO: Cycle count expectation: often W (or W+1) iterations.

module divider #(
  parameter int unsigned W = 16
) (
  input  logic             clk,
  input  logic             rst_n,

  input  logic             start,
  input  logic [W-1:0]     dividend,
  input  logic [W-1:0]     divisor,

  output logic [W-1:0]     quotient,
  output logic [W-1:0]     remainder,
  output logic             busy,
  output logic             done,
  output logic             div_by_zero
);

  // TODO: Define unsigned vs signed (unsigned recommended unless required).
  // TODO: Divide-by-zero behavior:
  // - On start if divisor==0: set div_by_zero=1, define quotient/remainder outputs, done pulse quickly.
  // TODO: Internal regs:
  // - remainder register (W+1 maybe for subtract/restore)
  // - quotient register
  // - divisor reg
  // - dividend shift reg (or direct bit extraction)
  // - iteration counter
  // TODO: FSM: IDLE, CHECK0, RUN, DONE (or similar).
  // TODO: Back-to-back operations: permit new start after done.
  // TODO: Define start while busy behavior (ignore/reject/restart).

endmodule

`;}


    // Register File & Scoreboarding questions
    if (qId === 'reg1' ) {
      return `
// ============================================================
// 2-Read 1-Write Register File
// ============================================================
// Features/requirements checklist:
// - 2 combinational/asynchronous read ports (always reflect selected reg).
// - 1 synchronous write port on rising edge when wr_en=1.
// - TODO: Define read-during-write behavior for same address in same cycle:
//   * write-first (forward new wr_data) OR read-first (old data). Document and test.
// - TODO: Optional hardwired x0 register: reads as 0, writes ignored (RISC-V style).
// - TODO: Reset policy: clear regs to 0 OR leave uninitialized (synthesis choice).
//
// NOTE: This template assumes 1 write port and 2 read ports like classic RF.

module regfile #(
  parameter int unsigned W     = 32,
  parameter int unsigned DEPTH = 32
) (
  input  logic                      clk,
  input  logic                      we,
  input  logic [$clog2(DEPTH)-1:0] wa,
  input  logic [$clog2(DEPTH)-1:0] ra1,
  input  logic [$clog2(DEPTH)-1:0] ra2,
  input  logic [W-1:0]             wd,
  output logic [W-1:0]             rd1,
  output logic [W-1:0]             rd2
);

  // ----------------------------
  // Storage array
  // ----------------------------
  logic [W-1:0] regs [0:DEPTH-1];

  // ----------------------------
  // TODO: Address validity / edge cases
  // ----------------------------
  // TODO: Decide what happens if NUM_REGS is not power-of-2.
  // TODO: Decide behavior if rd_addr* or wr_addr contains X/Z (simulation robustness).
  // TODO: Optionally assert NUM_REGS >= 2.

  // ----------------------------
  // Combinational reads
  // ----------------------------
  always_comb begin
  // TODO: Baseline asynchronous read behavior: rd_data = regs[rd_addr].
  // TODO: If HAS_X0 and rd_addr==0, force rd_data=0.
  // TODO: Read-during-write hazard:
  // - If write-first: if (wr_en && wr_addr==rd_addr) return wr_data (except x0).
  // - If read-first: ignore forwarding and read old regs[] value.
  // TODO: Decide semantics and implement for both read ports consistently.
  // TODO: Document: "same cycle" refers to wr on rising edge and combinational read in that cycle.

  // TODO: Provide safe defaults (e.g., '0) for rd_data1/2 to avoid X-prop if desired.
  end

  // ----------------------------
  // Synchronous write
  // ----------------------------
  always_ff @(posedge clk) begin
  // TODO: Write enable conditions:
  // - If wr_en==1, write regs[wr_addr] <= wr_data.
  // - If HAS_X0==1, ignore writes to address 0.
  end

  // ----------------------------
  // Optional assertions (recommended)
  // ----------------------------
  // TODO: If HAS_X0==1, assert regs[0] stays 0 (if you physically store it).
  // TODO: Assert no out-of-range access when NUM_REGS not power-of-2 (if relevant).

endmodule

`;}

// Register File & Scoreboarding questions
    if (qId === 'reg2' ) {
      return `
// ============================================================
// Register Renaming (Map Table + Free List)
// ============================================================
// High-level rename steps (conceptual):
// - Read map for src regs -> phys srcs.
// - Allocate a new phys reg for dest from free list.
// - Update map[arch_dest] = new_phys.
// - Remember old_phys for commit/recovery.
//
// TODO: Decide recovery scheme:
// - Checkpointed map table per-branch (snapshot) OR
// - ROB-based recovery using old mappings recorded per instruction.

module reg_rename #(
  parameter int unsigned ARCH = 32,
  parameter int unsigned PHYS = 64
) (
  input  logic                    clk,
  input  logic                    rst_n,
  input  logic                    rename_req,
  input  logic                    checkpoint_save,
  input  logic                    flush,
  input  logic                    commit_free,
  input  logic [$clog2(ARCH)-1:0] src1_arch,
  input  logic [$clog2(ARCH)-1:0] src2_arch,
  input  logic [$clog2(ARCH)-1:0] dst_arch,
  input  logic [$clog2(PHYS)-1:0] free_preg,
  output logic [$clog2(PHYS)-1:0] src1_preg,
  output logic [$clog2(PHYS)-1:0] src2_preg,
  output logic [$clog2(PHYS)-1:0] new_preg,
  output logic [$clog2(PHYS)-1:0] old_preg,
  output logic                    rename_grant,
  output logic                    stall
);

  // TODO: Add map-table and free-list state that match the interface above.
  // TODO: Lookup current physical mappings for src1/src2 and track the old destination mapping.
  // TODO: Allocate new physical registers on rename_req, free them on commit_free, and restore on flush.

endmodule

`;}

// Register File & Scoreboarding questions
    if (qId === 'reg3' ) {
      return `
// ============================================================
// Scoreboard for Register Availability Tracking
// ============================================================
// Convention:
// - busy=1 => register not ready (value pending)
// - busy=0 => ready
// Typical behavior: issue sets busy for dest; writeback clears busy.
// TODO: Define same-cycle writeback+issue precedence (often writeback wins so consumers see ready).

module scoreboard #(
  parameter int unsigned REGS = 32
) (
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

  // ----------------------------
  // Combinational readiness
  // ----------------------------
  always_comb begin
  // TODO: Default outputs.
  // TODO: If src==0 => always ready (x0 hardwired zero).
  // TODO: Otherwise, rs_busy = busy[src].
  // TODO: Same-cycle wb+query: if wb_valid && wb_rd==rs, treat as ready.
  end

  // ----------------------------
  // Sequential updates
  // ----------------------------
  always_ff @(posedge clk or negedge rst_n) begin
  if (!rst_n) begin
  // Initialize all ready (busy=0).
  busy <= '0;
  end else begin
  // TODO: On issue_valid && issue_rd != 0: set busy[issue_rd]=1.
  // TODO: On wb_valid && wb_rd != 0: clear busy[wb_rd]=0.
  // TODO: Same-cycle issue+wb to same register: define priority.
  end
  end

endmodule

`;}

    // GPU-Style Functional Blocks questions
    if (qId === 'gpu1') {
      return `
// ============================================================
// Warp Scheduler (Round-Robin or Fixed Priority)
// ============================================================
// Inputs: warp_ready mask (N_WARPS bits).
// Outputs: valid + granted warp id.
//
// TODO: Pick policy and document it clearly:
// - Round-robin: start search at last_grant+1 and wrap (fairness).
// - Fixed priority: lowest warp id wins (simple priority encode).
//
// TODO: Define "grant stability" when no warp is ready (hold last id or drive 0).
// TODO: Define how last_grant initializes on reset and what first grant should be.
// TODO: Define behavior if N_WARPS is not power-of-2 (should still work, but be explicit).

module warp_scheduler #(
  parameter int unsigned N_WARPS = 8
) (
  input  logic                        clk,
  input  logic                        rst_n,
  input  logic [N_WARPS-1:0]          warp_ready,
  output logic [$clog2(N_WARPS)-1:0]  selected_warp,
  output logic                        valid
);

  // Track last granted warp for round-robin fairness.
  logic [$clog2(N_WARPS)-1:0] last_grant;

  // ----------------------------
  // TODO: Helper functions
  // ----------------------------
  function automatic logic [$clog2(N_WARPS)-1:0]
  prio_encode_low(input logic [N_WARPS-1:0] req);
  // TODO: Return lowest index i where req[i]==1.
  // TODO: Define return value when req is all zeros.
  prio_encode_low = '0;
  endfunction

  function automatic logic [N_WARPS-1:0]
  rotate_right(input logic [N_WARPS-1:0] x, input int unsigned sh);
  // TODO: Implement rotate-right by sh (0..N_WARPS-1).
  // TODO: Be careful with sh width and modulo behavior.
  rotate_right = x;
  endfunction

  function automatic logic [N_WARPS-1:0]
  rotate_left(input logic [N_WARPS-1:0] x, input int unsigned sh);
  // TODO: Implement rotate-left by sh.
  rotate_left = x;
  endfunction

  // ----------------------------
  // Combinational grant logic
  // ----------------------------
  always_comb begin
  // TODO: Defaults (no latches)
  // TODO: valid = (|warp_ready)
  // TODO: If no warp_ready: valid=0; selected_warp stable per spec.

  // TODO: If USE_RR:
  // - Compute start = last_grant + 1 (wrap-around).
  // - Rotate warp_ready so that "start" maps to bit 0.
  // - Priority-encode rotated warp_ready to find first warp_ready.
  // - Unrotate resulting index to get actual warp id.
  //
  // TODO: Else fixed priority:
  // - selected_warp = prio_encode_low(warp_ready).
  end

  // ----------------------------
  // Sequential state update
  // ----------------------------
  always_ff @(posedge clk or negedge rst_n) begin
  if (!rst_n) begin
  // TODO: Initialize last_grant to a defined value (e.g., 0 or N_WARPS-1).
  // TODO: Decide whether this biases first RR grant; document it.
  end else begin
  // TODO: Update last_grant only when valid==1.
  // last_grant <= selected_warp;
  end
  end

endmodule

`;}

      if (qId === 'gpu2') {
      return `
// ============================================================
// SIMD Execution Unit (Lane-Parallel)
// ============================================================
// One op broadcast to all lanes; each lane has its own operands.
// Lane masking semantics must be defined:
// - Option A: inactive lanes HOLD previous result (write-masking style).
// - Option B: inactive lanes output ZERO.
// TODO: Pick one and document it.

module simd_alu #(
  parameter int unsigned LANES = 4,
  parameter int unsigned W     = 32
) (
  input  logic [W-1:0]     a      [LANES],
  input  logic [W-1:0]     b      [LANES],
  input  logic [LANES-1:0] mask,
  input  logic [2:0]       op,
  output logic [W-1:0]     result [LANES]
);

  // TODO: Define op meanings (ADD/SUB/MUL/AND/OR/etc.).
  // TODO: Decide whether you want to keep this template purely combinational or add a registered wrapper around it.
  // TODO: If registered output:
  // - Inactive lanes can hold their previous value naturally (per-lane enable).
  // TODO: If combinational output:
  // - Inactive lanes must map to 0 or pass-through old value via an input.

  // Optional: internal result per lane
  logic [W-1:0] Y_lane [LANES-1:0];

  // ----------------------------
  // TODO: Shared control decode
  // ----------------------------
  // TODO: Decode op once into control signals shared by all lanes
  // (e.g., do_add, do_sub, do_and...).

  // ----------------------------
  // TODO: Per-lane datapath
  // ----------------------------
  // TODO: Use generate loop to compute Y_lane[i] from a[i], b[i], control.
  // TODO: Masking:
  // - If "hold previous": implement result regs with per-lane write enable = mask[i].
  // - If "zero": result[i] = mask[i] ? Y_lane[i] : '0.

  // ----------------------------
  // TODO: Drive outputs
  // ----------------------------
  // TODO: result[i] = (masked) per-lane output.

endmodule

`;}

        if (qId === 'gpu3') {
      return `
// ============================================================
// Thread Mask Logic for Predicated Execution
// ============================================================
// active_mask tracks which threads are active.
// For if-branch: new = active & predicate
// For else-branch: new = active & ~predicate
// Nested predicates: push/exit_if mask stack. (vector-thread style discusses mask control)
//
// TODO: Define control signals for "enter_if", "enter_else", "exit_if" (or similar).
// TODO: Define stack depth and behavior on overflow/underflow.

module thread_mask #(
  parameter int unsigned THREADS = 32,
  parameter int unsigned STACK_D = 4
) (
  input  logic [THREADS-1:0]        predicate,
  input  logic                      clk,
  input  logic                      rst_n,
  input  logic                      enter_if,
  input  logic                      enter_else,
  input  logic                      exit_if,
  output logic [THREADS-1:0]        active_mask
);

  // Stack storage for nested masks
  logic [THREADS-1:0] mask_stack [0:STACK_D-1];
  logic [$clog2(STACK_D+1)-1:0] sp; // stack pointer

  // ----------------------------
  // TODO: Reset/initialization
  // ----------------------------
  // TODO: On reset, set active_mask to all 1s (all threads active).
  // TODO: Initialize stack pointer to 0.

  // ----------------------------
  // TODO: Mask update sequencing
  // ----------------------------
  // TODO: Define precedence if multiple controls asserted same cycle:
  // e.g., push happens before enter_if/enter_else, exit_if happens after, etc.
  // TODO: Implement:
  // - enter_if can optionally push the current active_mask before applying the predicate filter
  // - enter_if:   active_mask <= active_mask & predicate
  // - enter_else: active_mask <= active_mask & ~predicate
  // - exit_if: active_mask <= mask_stack[sp-1]; sp--
  // TODO: Underflow/overflow behavior: clamp sp, assert error, or ignore.

  // ----------------------------
  // Side-effect gating
  // ----------------------------
  always_comb begin
  // Inactive threads must not write or issue memory requests.
  // TODO: lane_wr_en[i]  = instr_wr_en  & active_mask[i]
  // TODO: lane_mem_req[i]= instr_mem_req& active_mask[i]
  end

endmodule

`;}

          if (qId === 'gpu4') {
      return `
// ============================================================
// Shared Memory Bank Conflict Detector
// ============================================================
// Given per-thread addresses and active mask, detect if any bank has multiple active accesses.
// TODO: Decide what to output if multiple banks conflict: first-conflicting bank, OR a vector of conflicts.
//
// Bank mapping is typically like bank_id = (address / word_bytes) % N_BANKS.
// TODO: Define BANK_OFFSET based on word size (e.g., 2 for 4B words).

module bank_conflict #(
  parameter int unsigned N_BANKS    = 32,
  parameter int unsigned THREADS    = 32,
  parameter int unsigned ADDR_W     = 32,
  parameter int unsigned BANK_OFFSET = 2
) (
  input  logic [ADDR_W-1:0]                  addr [THREADS],
  input  logic [THREADS-1:0]                 active_mask,
  output logic                               has_conflict,
  output logic [$clog2(N_BANKS)-1:0]         conflict_bank_id,
  output logic                               can_issue,
  output logic [THREADS-1:0]                 conflict_mask
);

  localparam int unsigned BANK_W = $clog2(N_BANKS);

  // Per-thread bank index
  logic [BANK_W-1:0] bank [THREADS-1:0];

  // Per-bank counts (or bitmasks)
  // TODO: Choose histogram counters vs per-bank thread bitmask + popcount.
  // For simplicity, counts can be sized to clog2(THREADS+1).
  logic [$clog2(THREADS+1)-1:0] bank_count [N_BANKS-1:0];

  // ----------------------------
  // TODO: Compute bank index per thread
  // ----------------------------
  // TODO: bank[i] = (addr[i] >> BANK_OFFSET) & (N_BANKS-1);

  // ----------------------------
  // TODO: Build per-bank counts ignoring inactive threads
  // ----------------------------
  // TODO: Initialize all bank_count[b]=0.
  // TODO: For each thread i:
  //   if active_mask[i]: bank_count[bank[i]]++

  // ----------------------------
  // TODO: Conflict detect + choose conflict_bank_id
  // ----------------------------
  // TODO: has_conflict = any bank_count[b] > 1.
  // TODO: conflict_bank_id selection if multiple banks conflict:
  // - lowest bank id, or first found, or output vector (document).
  // TODO: can_issue = ~has_conflict (or allow issue with serialization if implemented).

  // ----------------------------
  // TODO: Optional serialization decision
  // ----------------------------
  // TODO: If has_conflict:
  // - Choose one thread to service first (lowest thread id, or round-robin).
  // - conflict_mask sets exactly one active thread within that conflicting bank.

endmodule

`;}


    // Pipeline & Control Logic
    if (qId === 'pipe1') {
      return `
// ============================================================
// Pipeline Registers with Stall and Flush
// ============================================================
// A pipeline stall holds the current stage register (no update), often by disabling
// PC and IF/ID updates and/or using a clock enable; flush injects a bubble/NOP by
// clearing control signals and/or instruction fields.
//
// TODO: Define priority when stall && flush:
// - Option A: flush wins (common: ensure bubble is inserted)
// - Option B: stall wins (hold state)
// TODO: Document NOP encoding choice: all-zero instruction or explicit NOP opcode.
// TODO: Decide whether to include a valid bit (recommended for debug).

module pipe_reg #(
  parameter int unsigned W = 64
) (
  input  logic             clk,
  input  logic             rst_n,
  input  logic             stall,
  input  logic             flush,
  input  logic [W-1:0]     d,
  output logic [W-1:0]     q
);

  // NOP/bubble value: all zeros (clears all control signals).
  // Flush inserts this bubble; stall holds current value.

  always_ff @(posedge clk or negedge rst_n) begin
  if (!rst_n) begin
  // TODO: Reset to safe NOP state (all zeros).
  //   q <= '0;
  end else begin
  // TODO: Implement simultaneous stall+flush priority.
  // Common choice: flush wins over stall.
  // Suggested structure:
  //   if (flush)       q <= '0;       // insert bubble
  //   else if (!stall) q <= d;        // normal update
  //   // else: stall holds current q (implicit — no assignment needed)
  end
  end

endmodule

`;}

      if (qId === 'pipe2') {
      return `
// ============================================================
// Hazard Detection Unit (Load-Use)
// ============================================================
// Classic load-use stall: if EX-stage instruction is a load (MemRead=1) and
// ID-stage instruction needs the same destination register, stall and insert bubble.
//
// Actions commonly include:
// - PCWrite=0 (freeze PC)
// - IFIDWrite=0 (freeze IF/ID register)
// - ID/EX flush: set control signals to 0 to inject NOP into EX.

module hazard_detect (
  input  logic [4:0] id_rs1,
  input  logic [4:0] id_rs2,
  input  logic [4:0] ex_rd,
  input  logic       ex_mem_read,
  input  logic       id_uses_rs2,  // 0 for I-type (rs2 field is immediate)
  output logic       stall
);

  always_comb begin
  // TODO: Default outputs to safe values (no latches).
  // TODO: Compute stall condition:
  // stall = ex_mem_read
  //          && (ex_rd != 0)
  //          && ( (ex_rd == id_rs1) ||
  //               (id_uses_rs2 && ex_rd == id_rs2) );
  //
  // TODO: Stall actions on stall:
  // pc_write = ~stall
  // ifid_write = ~stall
  // idex_flush_controls = stall (bubble insertion)
  //
  // TODO: Ensure stall duration is exactly one cycle (should happen naturally if signals are combinational
  // and pipeline advances next cycle).
  end

endmodule

`;}

        if (qId === 'pipe3') {
      return `
// ============================================================
// Data Forwarding Unit (EX/MEM and MEM/WB to EX stage)
// ============================================================
// Forwarding selects ALU inputs from:
// - regfile (no forward)
// - EX/MEM (most recent)
// - MEM/WB (older)
// Priority: EX/MEM over MEM/WB when both match.
//
// Outputs ForwardA/ForwardB encoding required:
// 00 = regfile, 01 = MEM/WB, 10 = EX/MEM.

module forwarding_unit (
  input  logic [4:0] id_ex_rs1,
  input  logic [4:0] id_ex_rs2,
  input  logic [4:0] ex_mem_rd,
  input  logic [4:0] mem_wb_rd,
  input  logic       ex_mem_reg_write,
  input  logic       mem_wb_reg_write,
  output logic [1:0] fwd_a,
  output logic [1:0] fwd_b
);

  always_comb begin
  // TODO: Defaults: fwd_a=00, fwd_b=00.
  // TODO: Compute ForwardA:
  // - If EX/MEM writes and ex_mem_rd matches id_ex_rs1 (and not x0), fwd_a=10.
  // - Else if MEM/WB writes and mem_wb_rd matches id_ex_rs1 (and not x0), fwd_a=01,
  //   but only if EX/MEM is not already forwarding that operand (priority).
  //
  // TODO: Compute ForwardB similarly for id_ex_rs2.
  //
  // TODO: Decide whether to gate forwarding when id_ex_rs*==0 (x0 reads constant), if HAS_X0.
  end

endmodule

`;}

          if (qId === 'pipe4') {
      return `
// ============================================================
// Branch Comparator and Control
// ============================================================
// Branch decision uses comparison flags (eq, signed/unsigned lt) and a funct3 select.
// TODO: Decide where branch resolves (ID vs EX). If in ID, consider operand forwarding.

module branch_cmp #(
  parameter int unsigned W = 32
) (
  input  logic [W-1:0] a,
  input  logic [W-1:0] b,
  input  logic [2:0]   funct3,
  output logic         take_branch
);

  // TODO: Compute comparison flags once:
  // - eq = (a == b)
  // - lt_signed = ($signed(a) < $signed(b))
  // - lt_unsigned = (a < b)
  //
  // TODO: Implement take_branch by funct3:
  // - BEQ: eq
  // - BNE: !eq
  // - BLT/BGE, BLTU/BGEU as desired
  //
  // TODO: Gate with 1'b1 (non-branch => not taken).
  // TODO: next_pc_is_branch definition: next_pc_is_branch = 1'b1 && take_branch (or separate next_pc_select).

  // TODO: If branch resolved in ID, add forwarding muxes into a/b:
  // - From EX/MEM, MEM/WB, etc. Similar to pipe3.
endmodule

`;}

            if (qId === 'pipe5') {
      return `
// ============================================================
// Instruction Decode (Main Decoder)
// ============================================================
// Decoder extracts fields and generates control signals, with safe defaults for illegal ops.
// Important: assign defaults before case to avoid inferred latches.

module instr_decode (
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

  // ----------------------------
  // TODO: Field extraction
  // ----------------------------
  // TODO: opcode = instr[6:0], rd/rs1/rs2, funct3/funct7 per ISA.
  // TODO: Immediate extraction per format (R/I/S/B/U/J):
  // - I-type sign-extend instr[31:20]
  // - S-type combine instr[31:25] and instr[11:7]
  // - B-type assemble branch immediate bits
  // - etc.
  //
  // TODO: Define imm for non-imm instructions (0 or don't care).

  // ----------------------------
  // TODO: Control generation
  // ----------------------------
  always_comb begin
  // TODO: Set safe defaults first: all write-enables 0, branch/jump 0, alu_op default, illegal=0.
  
  // TODO: case(opcode)
  // - R-type: reg_write=1, alu_src=0, mem_read/write=0, mem_to_reg=0, uses_rs1=1, uses_rs2=1
  // - Load: mem_read=1, reg_write=1, alu_src=1, mem_to_reg=1, uses_rs1=1, uses_rs2=0
  // - Store: mem_write=1, reg_write=0, alu_src=1, uses_rs1=1, uses_rs2=1
  // - Branch: branch=1, uses_rs1=1, uses_rs2=1
  // - Jump: jump=1, etc.
  // default: illegal_instruction=1, keep safe defaults.
  end

endmodule

`;}

    // Decoders, Arbiters, Misc questions
    if (qId === 'misc1') {
      return `
// ============================================================
// N-to-2^N Binary Decoder (with enable)
// ============================================================
// When en=1: one-hot output where out[in] = 1, all others 0.
// When en=0: out = 0.
// TODO: Decide whether out should be combinational only (typical) or registered.
// TODO: Add one-hot assertions in testbench (e.g., $countones(out) == (en?1:0)).

module decoder #(
  parameter int unsigned N = 3
) (
  input  logic [N-1:0]       in,
  input  logic               en,
  output logic [(1<<N)-1:0]  out
);

  // TODO: Handle edge cases:
  // - N=1 should produce 2-bit output.
  // - Large N grows output exponentially (synthesis size).
  // TODO: Define what happens if in contains X/Z (simulation): out becomes X? or force 0?

  // TODO: Implement decoding:
  // Option A: for-loop compare each index i and set out[i] = en & (in==i).
  // Option B: out = en ? (1 << in) : 0; (be careful with sizing/casting).
  //
  // TODO: Ensure exactly one bit is 1 when en=1 and input is known.

endmodule

`;}

      if (qId === 'misc2') {
      return `
// ============================================================
// Priority Encoder (out + valid)
// ============================================================
// Finds out of highest-priority '1' bit.
// TODO: Choose priority direction: LSB-first or MSB-first and document it.
// When input==0: valid=0 and out held at a defined stable value.

module priority_enc #(
  parameter int unsigned N = 8,
  parameter bit          LSB_FIRST = 1  // TODO: 1 => bit0 highest priority, 0 => MSB highest
) (
  input  logic [N-1:0]             in,
  output logic [$clog2(N)-1:0]     out,
  output logic                     valid
);

  // TODO: Edge cases:
  // - N=1, out width is clog2(1)=0 (tool-dependent); consider guarding with if (N==1).
  // - X/Z handling policy: treat as 0? propagate X? document.

  always_comb begin
  // TODO: Defaults:
  // valid = |in;
  // out = '0 (stable when valid=0)

  // TODO: If valid:
  // - If LSB_FIRST: scan i=0..N-1, first '1' wins.
  // - If MSB_FIRST: scan i=N-1..0, first '1' wins.
  //
  // TODO: Ensure deterministic behavior when multiple bits set.
  end

endmodule

`;}

        if (qId === 'misc3') {
      return `
// ============================================================
// Round-Robin Arbiter (one-hot grant)
// ============================================================
// Common method: rotate requests by pointer, apply fixed priority, unrotate grant.
// Pointer updates only on successful grant; holds when no requests.
//
// TODO: Define pointer meaning precisely:
// - last_grant index vs next_priority pointer (two common conventions).
// TODO: Define grant timing: purely combinational grant from req each cycle, pointer updates on clk.

module rr_arbiter #(
  parameter int unsigned N = 4
) (
  input  logic            clk,
  input  logic            rst_n,

  input  logic [N-1:0]    req,

  output logic [N-1:0]    grant
);

  logic [$clog2(N)-1:0] ptr; // TODO: pointer / last_grant register

  // TODO: Helper: rotate left/right by shift amount
  function automatic logic [N-1:0] rotl(input logic [N-1:0] x, input int unsigned sh);
  rotl = x;
  endfunction
  function automatic logic [N-1:0] rotr(input logic [N-1:0] x, input int unsigned sh);
  rotr = x;
  endfunction

  // TODO: Helper: fixed priority grant (one-hot) from a request vector
  function automatic logic [N-1:0] fixed_pri_grant(input logic [N-1:0] r);
  // TODO: Return one-hot grant for the highest-priority requestor
  // (define priority direction: LSB-first or MSB-first).
  fixed_pri_grant = '0;
  endfunction

  // ----------------------------
  // Combinational arbitration
  // ----------------------------
  always_comb begin
  // TODO: Defaults: grant='0; if any request is present, select exactly one requester.
  // TODO: If any req:
  // - Rotate req by ptr so ptr+1 becomes highest priority position.
  // - Apply fixed priority to rotated req.
  // - Unrotate grant back to original positions.
  // TODO: Ensure at most one grant bit set ($onehot0(grant)).
  end

  // ----------------------------
  // Pointer update
  // ----------------------------
  always_ff @(posedge clk or negedge rst_n) begin
  if (!rst_n) begin
  // TODO: Initialize ptr to defined value.
  end else begin
  // TODO: If a grant is issued: update ptr based on the granted index (document convention).
  // TODO: If no grant: ptr holds.
  end
  end

endmodule

`;}

          if (qId === 'misc4') {
      return `
// ============================================================
// Reorder Buffer (ROB) Entry Management
// ============================================================
// Circular buffer with head/tail pointers; allocate at tail, commit at head in-order.
// Full/empty typically derived from pointer relationship.
//
// TODO: Decide if you want "ptr + wrap bit" scheme (simpler full/empty) vs count-based.
// TODO: Define flush semantics precisely: tail reset vs invalidate loop.

module rob #(
  parameter int unsigned ENTRIES = 8,
  parameter int unsigned W       = 32
) (
  input  logic                        clk,
  input  logic                        rst_n,
  input  logic                        dispatch,
  input  logic                        writeback,
  input  logic                        commit,
  input  logic                        flush,
  input  logic [$clog2(ENTRIES)-1:0]  wb_id,
  input  logic [$clog2(ENTRIES)-1:0]  flush_tail,
  input  logic [4:0]                  dest_arch,
  input  logic [W-1:0]                wb_value,
  output logic                        full,
  output logic                        empty,
  output logic                        commit_valid,
  output logic [4:0]                  commit_arch,
  output logic [W-1:0]                commit_value,
  output logic [$clog2(ENTRIES)-1:0]  alloc_id
);

  typedef struct packed {
  logic             valid;
  logic             ready;
  logic             has_dest;
  logic [5-1:0] dest_tag;
  logic [W-1:0] value;
  // TODO: optional fields: exception, PC, branch tag, etc.
  } rob_entry_t;

  rob_entry_t rob_mem [0:ENTRIES-1];

  logic [$clog2(ENTRIES)-1:0] head, tail;

  // TODO: Full/empty logic:
  // - Empty when head==tail (if using wrap-bit scheme, include wrap)
  // - Full when (tail+1)==head (again, depends on scheme)
  // TODO: If you keep an internal dispatch_ready helper, define it as ~full.

  // TODO: Allocation:
  // - If dispatch && !full: write rob_mem[tail].valid=1, ready=0, store fields, tail++.
  // - Output alloc_id = tail (the allocated id).

  // TODO: Writeback:
  // - If writeback: rob_mem[wb_id].ready=1; rob_mem[wb_id].value=wb_value.

  // TODO: Commit:
  // - If rob_mem[head].valid && rob_mem[head].ready: commit_valid=1 with fields from head.
  // - If commit_valid && commit: free entry (valid=0) and head++.

  // TODO: Flush:
  // - If flush: invalidate younger entries and set tail appropriately (tail=flush_tail),
  //   or loop invalidate entries between flush point and old tail.
  // - Ensure commit/dispatch interactions are well-defined during flush.

endmodule

`;}

            if (qId === 'misc5') {
      return `
// ============================================================
// Functional Unit Busy/Free Tracker
// ============================================================
// Maintain busy vector; free_units = ~busy; any_available = |free_units.
// TODO: Define same-cycle free+allocate ordering (common: free then allocate allows reuse).

module fu_tracker #(
  parameter int unsigned N_FU = 4
) (
  input  logic                    clk,
  input  logic                    rst_n,
  input  logic                    issue_req,
  input  logic                    done_req,
  input  logic [$clog2(N_FU)-1:0] issue_fu,
  input  logic [$clog2(N_FU)-1:0] done_fu,
  output logic [N_FU-1:0]         busy,
  output logic                    any_available
);

  // TODO: Reset => all free (busy=0).
  // TODO: Update busy bits on allocate/done.
  // TODO: Same-cycle allocate+done:
  // - If same unit id, define final busy state (often 1, i.e., immediate reuse).
  // TODO: free_units = ~busy; any_available = |free_units.
  // TODO: next_free_id: priority encode free_units (define LSB-first or MSB-first).

endmodule

`;}

    // Generic Computer Architecture template
    return `// TODO: Implement your computer architecture design`;
            }



  return null;
};
