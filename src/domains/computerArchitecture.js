/**
 * Computer Architecture Questions
 * Domains: Cache & Memory, ALU & Datapath, Pipeline, Register File, GPU, Decoders/Arbiters/Misc
 */

const computerArchitecture = {
  'Cache & Memory': [
    {
      id: 'cache1',
      shortName: 'LRU Replacement Policy',
      question: 'Implement True LRU Replacement for 4-Way Set-Associative Cache',
      description:
        'Design a 4-way set-associative cache implementing true Least Recently Used (LRU) replacement policy.\n\n' +
        'Track access order for each cache set. On cache miss with all ways occupied, evict the least recently used way. Update LRU state on every access (hit or refill). The LRU module does not distinguish read vs write — it simply tracks the order of accesses.\n\n' +
        '**Example:**\n' +
        '```\nFill set with tags A, B, C, D (in order)\nAccess B (hit) → B becomes MRU\nAccess new tag E (miss) → Evicts A (true LRU)\n```\n\n' +
        '**Constraints:**\n' +
        '- 4-way set-associative\n' +
        '- Prefer invalid ways before evicting valid ones\n' +
        '- Update LRU on every access type',
      difficulty: 'Hard',
      topics: ['Cache', 'Replacement Policy', 'RTL'],
      requirements: [
        'CORRECTNESS: Update LRU ordering state on every cache access (read hit, write hit, miss with refill).',
        'ALLOCATION PRIORITY: On cache miss, if any way in the set is invalid (free), allocate that invalid way before evicting any valid way.',
        'EVICTION POLICY: On cache miss with all ways valid, select and evict the way with the oldest access timestamp (true LRU).',
        'STATE MANAGEMENT: Maintain per-set LRU state using either timestamps (one per way) or a ranking/ordering scheme that clearly identifies the LRU way.',
        'EDGE CASES: Handle reset (initialize all ways as invalid), concurrent accesses, and invalid inputs gracefully.',
        'Test Case 1 - Cold Miss: Starting from empty cache, access set S with tag A (read operation). Expected: miss detected, allocate any invalid way, mark valid, set that way as Most Recently Used (MRU).',
        'Test Case 2 - LRU Update on Hit: Fill cache set with tags A, B, C, D in order. Access tag B (hit). Expected: B becomes MRU. Then access new tag E (miss). Expected: E evicts the true LRU (not B), which should be A.',
        'Test Case 3 - Write Hit Updates: After filling set with A, B, C, D, perform write to tag C. Expected: C becomes MRU. Verify LRU victim selection excludes C on next miss (victim should be A or whichever is true LRU).'
      ],
      hints: [
        'Implement using: (1) timestamp counter per way, (2) LRU ordering matrix, or (3) LRU stack.',
        'On each access, update accessed way to MRU and shift others down.',
        'Check all ways for invalid status before evicting any valid way.',
      ],
    },
    {
      id: 'cache2',
      shortName: 'Pseudo-LRU Tree-Based',
      question: 'Implement Pseudo-LRU Using Binary Tree Structure',
      description:
        'Design a pseudo-LRU (PLRU) replacement policy using a binary tree structure for an N-way set-associative cache (N is power of 2).\n\n' +
        'Use `N-1` bits per set for tree node states. On access, update only the tree nodes along the path from root to the accessed way. For victim selection, traverse root to leaf following node bits.\n\n' +
        '**Example (4-way):**\n' +
        '```\nTree has 3 nodes: 1 root, 2 children\nAccess way 0 → flip path bits away from way 0\nVictim selection → follow bits root-to-leaf\n```\n\n' +
        '**Constraints:**\n' +
        '- N must be a power of 2\n' +
        '- Tree uses N-1 bits per set\n' +
        '- Support parameterizable N',
      difficulty: 'Hard',
      topics: ['Cache', 'Replacement Policy', 'RTL'],
      requirements: [
        'PARAMETERIZATION: Support parameterizable N-way associativity where N must be a power of 2. Calculate tree bits required as N-1.',
        'PATH UPDATE: On cache access to way W, update only the log2(N) tree node bits along the path from root to that way. Do not update nodes on other paths.',
        'TREE SEMANTICS: Each tree node bit indicates which subtree was less recently used. 0 points to left subtree, 1 points to right subtree (or document your convention clearly).',
        'VICTIM SELECTION: To find victim way, start at root and follow tree bits: if bit=0 go left, if bit=1 go right, until reaching a leaf node representing the victim way.',
        'EDGE CASES: Handle reset (initialize tree to known state), invalid inputs, and support different N values.',
        'Test Case 1 - 4-Way Tree Update: For 4-way cache, access way 0, then way 3. Verify tree bits flip correctly along each path (3 bits total: root, left/right children).',
        'Test Case 2 - Victim Selection: Set tree to known state (e.g., bits = 0b101). Perform victim walk from root following bit values. Verify selected victim way matches expected leaf.',
        'Test Case 3 - Parameterized 8-Way: Synthesize/simulate with N=8 parameter. Verify tree uses 7 bits per set and victim selection works correctly for all 8 ways.'
      ],
      hints: [
        'For N=4: root points to LRU half, children point to LRU quarter.',
        'Path update: flip each node bit to point AWAY from accessed subtree.',
        'Way mapping: way 0 = left-left, way 1 = left-right, way 2 = right-left, way 3 = right-right.',
      ],
    },
    {
      id: 'cache3',
      shortName: 'LFU Cache Design',
      question: 'Design LFU Cache with Counter-Based Replacement',
      description:
        'Implement a Least Frequently Used (LFU) cache with per-line frequency counters.\n\n' +
        'Increment the counter on each hit. On miss, evict the line with lowest frequency. Handle counter saturation and define a tie-breaking strategy.\n\n' +
        '**Example:**\n' +
        '```\nFill lines A (freq=3) and B (freq=1)\nMiss on C → Evicts B (lower frequency)\n```\n\n' +
        '**Constraints:**\n' +
        '- Configurable counter width (e.g., 4 bits)\n' +
        '- Counters saturate at max, do not wrap\n' +
        '- Deterministic tie-breaking required',
      difficulty: 'Hard',
      topics: ['Cache', 'Replacement Policy', 'RTL'],
      requirements: [
        'COUNTER MANAGEMENT: Maintain one frequency counter per cache line. Define counter width (e.g., 4 bits) and saturation behavior at maximum value (hold at max, do not wrap).',
        'INCREMENT POLICY: On cache hit, increment the frequency counter for the accessed line. On cache miss with refill, initialize new line counter to 1 (or 0, document your choice).',
        'EVICTION SELECTION: On cache miss requiring eviction, find the line with minimum frequency count. If multiple lines have the same minimum frequency, apply tie-breaking rule.',
        'TIE-BREAKING: Define deterministic tie-breaker when multiple lines have minimum frequency. Options: (1) use LRU timestamp among tied lines, (2) select lowest way index, (3) other documented policy.',
        'COUNTER RESET: On line invalidation or replacement, reset counter to initial value. On line fill, set counter appropriately.',
        'EDGE CASES: Handle all-invalid cache (cold start), counter saturation, all counters at same value.',
        'Test Case 1 - Frequency-Based Eviction: Fill lines A and B. Hit A three times (freq=3), hit B once (freq=1). Miss on C requiring eviction. Expected: B evicted (lower frequency).',
        'Test Case 2 - Counter Saturation: Use 2-bit counter (max=3). Hit line A repeatedly. Expected: counter saturates at 3, does not wrap to 0.',
        'Test Case 3 - Tie-Breaking: Lines A and B both have freq=1 but different timestamps/indices. Miss on C. Expected: evict older line (or lower index) per documented tie-break policy.'
      ],
      hints: [
        'Saturation: use conditional increment (if counter < MAX).',
        'Always define tie-break rule explicitly.',
        'Consider periodic global decay (right-shift all counters) to prevent saturation.',
      ],
    },
    {
      id: 'cache4',
      shortName: 'Cache Tag Comparison',
      question: 'Implement Cache Tag Comparison and Hit/Miss Detection Logic',
      description:
        'Design the tag comparison logic for a set-associative cache.\n\n' +
        'Compare incoming address tag against all valid ways using parallel comparators. Generate hit/miss signals and identify matching way.\n\n' +
        '**Example:**\n' +
        '```\nSet has 4 ways, way 2 valid with matching tag\nOthers invalid or non-matching\n→ hit=1, hit_way=2\n```\n\n' +
        '**Constraints:**\n' +
        '- Invalid ways must never generate false hits\n' +
        '- Match condition: (tag == request_tag) AND valid\n' +
        '- Define multi-hit behavior',
      difficulty: 'Medium',
      topics: ['Cache', 'Comparison', 'RTL'],
      requirements: [
        'PARALLEL COMPARISON: For each way in the set, compare request tag against stored tag AND check valid bit. Generate per-way match signal.',
        'HIT DETECTION: Combine all way matches with OR to generate overall hit signal. Generate miss signal as NOT(hit).',
        'WAY IDENTIFICATION: Generate hit_way output indicating which way matched. Use priority encoder or one-hot encoding.',
        'MULTI-HIT HANDLING: Define behavior if multiple ways match same tag (cache corruption scenario). Options: (1) select lowest way index, (2) assert error flag, (3) other documented behavior.',
        'VALID BIT INTEGRATION: Ensure invalid ways never generate false hits. Match condition: (tag[way] == request_tag) AND valid[way].',
        'EDGE CASES: Handle all-invalid set (all miss), all-valid but no match (miss), exactly one match (normal hit).',
        'Test Case 1 - Single Hit: Set has 4 ways. Way 2 is valid with matching tag. Ways 0,1,3 are invalid or non-matching. Expected: hit=1, hit_way=2.',
        'Test Case 2 - Miss Scenarios: (a) All ways invalid - hit=0. (b) All ways valid but no tag match - hit=0, miss=1.',
        'Test Case 3 - Multi-Hit Error: Two ways (1 and 3) are valid with identical matching tag. Expected: hit=1, hit_way follows documented resolution (e.g., way 1), optionally assert multi_hit_error flag.'
      ],
      hints: [
        'Per-way: match[w] = valid[w] & (tag[w] == request_tag).',
        'hit = |match; hit_way via priority encoder.',
        'Multi-hit detection: check if match is one-hot.',
      ],
    },
    {
      id: 'cache5',
      shortName: 'Write-Back Dirty Bit Management',
      question: 'Implement Dirty Bit Logic for Write-Back Cache',
      description:
        'Design dirty bit management for a write-back cache.\n\n' +
        'Set dirty on write hit, clear after writeback completes. Generate writeback requests when evicting dirty lines. Clean lines are replaced without writeback.\n\n' +
        '**Example:**\n' +
        '```\nRead miss fills line A → dirty=0\nWrite hit to A → dirty=1\nEvict A → writeback request generated\n```\n\n' +
        '**Constraints:**\n' +
        '- Dirty bit stored per cache line alongside tag and valid\n' +
        '- Writeback address = victim tag + cache index\n' +
        '- Clean eviction requires no memory traffic',
      difficulty: 'Medium',
      topics: ['Cache', 'Write-Back', 'RTL'],
      requirements: [
        'DIRTY BIT UPDATE: On write hit to cache line, set dirty bit for that line to 1. On cache miss with refill (read), initialize dirty bit to 0 for newly filled line.',
        'WRITE-ALLOCATE: If cache uses write-allocate policy and write occurs on refill, set dirty=1. Otherwise keep dirty=0 on read refill.',
        'EVICTION CHECK: On cache line eviction (replacement), check victim line dirty bit. If dirty=1, must writeback before reusing line. If dirty=0, can immediately reuse.',
        'WRITEBACK REQUEST: When evicting dirty line, assert writeback request signal with victim address (tag + index). Provide victim data for writeback.',
        'DIRTY BIT CLEAR: After writeback completes (acknowledgment from memory), clear dirty bit for that line. Line can now be safely reused.',
        'EDGE CASES: Handle reset (all dirty bits cleared), line invalidation (clear dirty), concurrent write and eviction.',
        'Test Case 1 - Write Hit Sets Dirty: Read miss fills line A (dirty=0). Write hit to line A. Expected: dirty bit for A becomes 1.',
        'Test Case 2 - Clean Eviction: Line B is victim for replacement, dirty=0. Expected: no writeback request generated, line immediately reusable.',
        'Test Case 3 - Dirty Eviction Writeback: Line C is victim, dirty=1. Expected: (1) writeback request asserted with address from tag+index of C, (2) writeback data provided, (3) after memory ack, dirty bit cleared.'
      ],
      hints: [
        'Update dirty in same cycle as write commit.',
        'Writeback FSM: IDLE → WB_REQ → WB_WAIT → WB_DONE → clear dirty.',
        'Separate need_writeback from writeback_in_flight to avoid double-issue.',
      ],
    },
    {
      id: 'cache6',
      shortName: 'Cache Line Refill FSM',
      question: 'Design Finite State Machine for Cache Line Refill from Memory',
      description:
        'Implement an FSM to manage cache line refills from main memory.\n\n' +
        'States: `IDLE → REQUEST → WAIT → FILL → COMPLETE`. Handle burst transfers, update cache data and metadata, and manage pipeline stalls.\n\n' +
        '**Example:**\n' +
        '```\nCache miss → IDLE→REQUEST→WAIT→FILL(beat0)→...→FILL(last)→COMPLETE→IDLE\nTag and valid updated only at COMPLETE\n```\n\n' +
        '**Constraints:**\n' +
        '- Cache line = N bytes, bus = M bytes wide → N/M beats\n' +
        '- Do not mark valid until all beats received\n' +
        '- Stall pipeline while FSM is not IDLE',
      difficulty: 'Hard',
      topics: ['Cache', 'FSM', 'RTL'],
      requirements: [
        'STATE MACHINE: Define FSM with states: IDLE (no refill), REQUEST (issue memory request), WAIT (wait for memory response), FILL (receive data beats), COMPLETE (finalize metadata updates).',
        'STATE TRANSITIONS: IDLE→REQUEST (on cache miss), REQUEST→WAIT (after request sent), WAIT→FILL (on first data beat), FILL→FILL (for each beat except last), FILL→COMPLETE (on last beat), COMPLETE→IDLE.',
        'BURST HANDLING: Cache line is N bytes, memory bus is M bytes wide, requiring N/M beats. Track beat counter (0 to beats-1). Write each beat to correct word offset within cache line.',
        'METADATA UPDATE: Only set valid bit and update tag after receiving complete cache line (all beats). Avoid partial-valid bug where line is marked valid before all data arrives.',
        'PIPELINE STALL: While FSM is not IDLE, assert cache stall signal to prevent new requests. Release stall only after returning to IDLE.',
        'RESET HANDLING: On reset assertion during refill, immediately return to IDLE. Do not leave partially filled line marked as valid.',
        'Test Case 1 - Basic Refill: Cache miss triggers FSM. States: IDLE→REQUEST→WAIT→FILL(beat0)→FILL(beat1)→...→FILL(last_beat)→COMPLETE→IDLE. Verify tag updated, valid=1, data array filled.',
        'Test Case 2 - Reset Mid-Refill: Assert reset while FSM in WAIT or FILL state. Expected: FSM returns to IDLE immediately. Cache line remains invalid (valid=0), no partial data visible.',
        'Test Case 3 - Back-to-Back Misses: First miss starts refill (FSM busy). Second miss occurs before first completes. Expected: second miss stalls until first refill reaches COMPLETE/IDLE.'
      ],
      hints: [
        'Beat counter: 0 to (line_size/bus_width - 1), increment on each data_valid.',
        'Tag and valid update in COMPLETE state, not during FILL.',
        'Test memory latency variations and reset mid-refill.',
      ],
    },
    {
      id: 'cache7',
      shortName: 'MSHR Implementation',
      question: 'Implement Miss Status Holding Register (MSHR) for Non-Blocking Cache',
      description:
        'Design MSHR structure to track outstanding cache misses and enable non-blocking operation.\n\n' +
        'Each entry stores miss address and requester info. Support merging multiple requests to the same cache line. Implement allocation, deallocation, and matching logic.\n\n' +
        '**Example:**\n' +
        '```\nCPU0 misses on addr A → allocates MSHR[0]\nCPU1 misses on addr A → merges into MSHR[0]\nRefill completes → both CPUs served, MSHR[0] freed\n```\n\n' +
        '**Constraints:**\n' +
        '- Configurable number of MSHR entries\n' +
        '- Backpressure when all entries occupied\n' +
        '- Match on cache line address (ignore block offset)',
      difficulty: 'Hard',
      topics: ['Cache', 'MSHR', 'RTL'],
      requirements: [
        'ENTRY STRUCTURE: Each MSHR entry contains: (1) valid bit, (2) cache line address (tag + index), (3) requester ID(s) or waiter list, (4) request type (read/write), (5) optional: pending write data.',
        'CONFIGURABLE SIZE: Parameterize number of MSHR entries. Define full/empty conditions and backpressure policy when all entries occupied.',
        'ALLOCATION: On cache miss, allocate free MSHR entry. Store miss address (line address, not byte address). If no free entry, stall/backpressure cache pipeline.',
        'MATCHING/MERGING: On subsequent miss, check all valid MSHR entries for matching line address. If match found, merge request with existing entry (add requester to waiter list) instead of allocating new entry or issuing duplicate memory request.',
        'DEALLOCATION: When memory refill completes for an MSHR entry, deallocate that entry (clear valid bit). Wake up all merged requesters waiting on that entry.',
        'REQUESTER TRACKING: Support multiple requesters per entry (bitmask or list). On refill completion, signal all waiting requesters.',
        'Test Case 1 - Allocate and Complete: CPU miss to address A allocates MSHR[0]. Memory returns data. MSHR[0] deallocated, CPU request completes.',
        'Test Case 2 - Merge Same Line: CPU0 misses on address A (allocates MSHR[0]). CPU1 misses on same address A before refill completes. Expected: MSHR[0] records both CPU0 and CPU1 as waiters. Only one memory request issued. On refill, both CPUs served.',
        'Test Case 3 - MSHR Full Backpressure: Fill all N MSHR entries. New miss occurs on different address. Expected: cache pipeline stalls/backpressures until an MSHR entry is freed by completing refill.'
      ],
      hints: [
        'Match on (tag + index), ignore block offset.',
        'Waiter structure: bitmask for small requester IDs, or linked list.',
        'Free entry: priority encoder to find first invalid entry.',
      ],
    },
  ],

  'ALU / Datapath Blocks': [
    {
      id: 'alu1',
      shortName: 'Parameterized ALU',
      question: 'Design Parameterized ALU with Multiple Arithmetic and Logic Operations',
      description:
        'Implement a parameterized ALU supporting add, subtract, bitwise AND/OR/XOR, and signed less-than (SLT). Generate optional status flags.\n\n' +
        '**Example (WIDTH=8):**\n' +
        '```\nADD: A=10, B=3 → result=13\nSLT: A=0xFF(-1), B=0x01(+1) → result=1 (true)\nAND: A=0xAA, B=0x0F → result=0x0A\n```\n\n' +
        '**Constraints:**\n' +
        '- Parameterizable WIDTH (8, 16, 32, 64 bits)\n' +
        '- Operation selected via `alu_op` input\n' +
        '- Optional flags: zero, negative, carry, overflow',
      difficulty: 'Medium',
      topics: ['ALU', 'Datapath', 'RTL'],
      requirements: [
        'PARAMETERIZATION: Support parameter WIDTH for operand and result width. Typical values: 8, 16, 32, 64 bits.',
        'OPERATIONS SUPPORTED: (1) ADD: result = A + B, (2) SUB: result = A - B, (3) AND: result = A & B, (4) OR: result = A | B, (5) XOR: result = A ^ B, (6) SLT (signed less-than): result = (signed(A) < signed(B)) ? 1 : 0.',
        'SLT BEHAVIOR: Output 1 in LSB if A < B (signed comparison), all other bits zero. For WIDTH=8, result range is 0x00 or 0x01.',
        'OPERATION SELECTION: Input signal alu_op (3-bit or as needed) selects operation. Define encoding clearly (e.g., 000=ADD, 001=SUB, 010=AND, 011=OR, 100=XOR, 101=SLT).',
        'OUTPUT FLAGS (OPTIONAL): (1) zero: result == 0, (2) negative: result[WIDTH-1] == 1, (3) carry: carry-out from MSB for add/sub, (4) overflow: signed overflow for add/sub.',
        'EDGE CASES: Handle invalid alu_op (output zeros or last valid result), WIDTH=1, maximum/minimum values.',
        'Test Case 1 - Add/Subtract: WIDTH=8, A=10 (0x0A), B=3 (0x03). ADD: result=13 (0x0D). SUB: result=7 (0x07).',
        'Test Case 2 - Bitwise Operations: WIDTH=8, A=0xAA (10101010), B=0x0F (00001111). AND: result=0x0A. OR: result=0xAF. XOR: result=0xA5.',
        'Test Case 3 - SLT Signed Comparison: WIDTH=8, A=0xFF (-1 signed), B=0x01 (+1 signed). SLT: result=0x01 (true, -1 < 1).'
      ],
      hints: [
        'Use case statement on alu_op.',
        'For SLT: $signed(A) < $signed(B).',
        'Overflow: (A[MSB] == B[MSB]) && (A[MSB] != result[MSB]).',
      ],
    },
    {
      id: 'alu2',
      shortName: 'ALU Control Decoder',
      question: 'Design ALU Control Signal Decoder',
      description:
        'Implement a decoder that converts instruction opcode/function fields into ALU control signals.\n\n' +
        'Takes opcode, funct3, funct7 as inputs. Produces ALU operation select and operand controls. Handles illegal opcodes with safe defaults.\n\n' +
        '**Example:**\n' +
        '```\nR-type ADD: opcode=0110011, funct3=000, funct7=0000000\n→ alu_op=ADD, alu_src=reg, reg_write=1\n\nIllegal opcode=0xFF\n→ alu_op=ADD, reg_write=0, illegal=1\n```\n\n' +
        '**Constraints:**\n' +
        '- Complete mapping from opcode/funct to control signals\n' +
        '- Safe defaults for undefined opcodes (no writes)\n' +
        '- Assign defaults before case to prevent latches',
      difficulty: 'Medium',
      topics: ['ALU', 'Decoder', 'RTL'],
      requirements: [
        'INPUT SIGNALS: (1) opcode (e.g., 7 bits), (2) funct3 (3 bits), (3) funct7 (7 bits) or similar encoding per ISA. Define input encoding clearly.',
        'OUTPUT SIGNALS: (1) alu_op (operation select for ALU), (2) alu_src (select immediate vs register), (3) optional: reg_write enable, mem_read, mem_write, branch control.',
        'ENCODING DEFINITION: Document complete mapping from opcode/funct to control signals in comment block or specification.',
        'DEFAULT/ILLEGAL HANDLING: For undefined or illegal opcode combinations, output safe defaults (e.g., alu_op=ADD, reg_write=0, no memory access).',
        'LATCH AVOIDANCE: Assign default values to all outputs before case statement, then override specific cases. Prevents inferred latches.',
        'OPTIONAL ILLEGAL FLAG: Generate illegal_instruction output flag when opcode is not recognized.',
        'Test Case 1 - Known Opcodes: Provide opcode mapping table. For each entry, verify decoder produces correct control signal combination.',
        'Test Case 2 - Illegal Opcode: Input opcode=0xFF (undefined). Expected: outputs are safe defaults (no writes, no memory access), optional illegal_instruction=1.',
        'Test Case 3 - One-Hot Control Check: If using one-hot encoding for certain controls, verify exactly one bit is set for all legal opcodes.'
      ],
      hints: [
        'Truth table: (opcode, funct3, funct7) → controls.',
        'Default: alu_op=ADD, reg_write=0, mem_write=0.',
        'Separate main decode from ALU decode for cleaner design.',
      ],
    },
    {
      id: 'alu3',
      shortName: 'Overflow Detection',
      question: 'Implement Signed Addition Overflow Detection Logic',
      description:
        'Design overflow detection for signed two\'s complement addition.\n\n' +
        'Overflow occurs when adding two same-sign numbers produces an opposite-sign result. Must be independent of carry-out.\n\n' +
        '**Example (WIDTH=8, range -128 to +127):**\n' +
        '```\nA=127, B=1 → sum=128(0x80=-128) → overflow=1\nA=-128, B=-1 → sum=-129(0x7F=+127) → overflow=1\nA=50, B=20 → sum=70 → overflow=0\n```\n\n' +
        '**Constraints:**\n' +
        '- Parameterizable WIDTH\n' +
        '- Purely combinational logic on sign bits\n' +
        '- Independent of carry-out',
      difficulty: 'Easy',
      topics: ['ALU', 'Overflow', 'RTL'],
      requirements: [
        'OVERFLOW CONDITION: Overflow occurs when: (1) Adding two positive numbers produces negative result, OR (2) Adding two negative numbers produces positive result.',
        'FORMULA: overflow = (A[MSB] == B[MSB]) && (A[MSB] != sum[MSB]), where MSB = WIDTH-1.',
        'INDEPENDENCE FROM CARRY: Overflow detection must work correctly regardless of carry-out value. Carry and overflow are distinct conditions.',
        'NO OVERFLOW CASES: (1) Adding positive and negative never overflows, (2) Result has same sign as inputs means no overflow.',
        'PARAMETERIZATION: Support parameterizable WIDTH. MSB position = WIDTH-1.',
        'Test Case 1 - Positive Overflow: WIDTH=8 (range -128 to +127), A=127 (0x7F), B=1 (0x01). sum=128 (0x80 = -128 in signed). Expected: overflow=1.',
        'Test Case 2 - Negative Overflow: WIDTH=8, A=-128 (0x80), B=-1 (0xFF). sum=-129 (wraps to 0x7F = +127). Expected: overflow=1.',
        'Test Case 3 - No Overflow: WIDTH=8, A=50 (0x32), B=20 (0x14). sum=70 (0x46). Expected: overflow=0.'
      ],
      hints: [
        'Alternative: overflow = (A[MSB] & B[MSB] & ~sum[MSB]) | (~A[MSB] & ~B[MSB] & sum[MSB]).',
        'Test corner values: max positive, min negative.',
      ],
    },
    {
      id: 'alu4',
      shortName: 'Barrel Shifter',
      question: 'Design Barrel Shifter Supporting Logical and Arithmetic Shifts',
      description:
        'Implement a barrel shifter for SLL (shift left logical), SRL (shift right logical), and SRA (shift right arithmetic). Must complete in one cycle.\n\n' +
        '**Example (WIDTH=8):**\n' +
        '```\nSRL: A=0x80, shift=1 → 0x40\nSRA: A=0x80(-128), shift=1 → 0xC0 (sign-extended)\nSLL: A=0x01, shift=3 → 0x08\n```\n\n' +
        '**Constraints:**\n' +
        '- Parameterizable WIDTH\n' +
        '- Shift amount: log2(WIDTH) bits\n' +
        '- Single-cycle combinational design',
      difficulty: 'Hard',
      topics: ['Shifter', 'Datapath', 'RTL'],
      requirements: [
        'SHIFT OPERATIONS: (1) SLL (shift left logical): fill with zeros from right, (2) SRL (shift right logical): fill with zeros from left, (3) SRA (shift right arithmetic): fill with sign bit (MSB) from left.',
        'PARAMETERIZATION: Support parameter WIDTH for data width. Shift amount width = log2(WIDTH) bits. For WIDTH=8, shift amount is 3 bits (0-7).',
        'SHIFT AMOUNT RANGE: Valid shift amounts are 0 to WIDTH-1. Define behavior for shift amount >= WIDTH (typically: result = 0 for SRL/SLL, result = all sign bits for SRA).',
        'OPERATION SELECTION: Input signal shift_op (2 bits) selects operation. Define encoding (e.g., 00=SLL, 01=SRL, 10=SRA).',
        'COMBINATIONAL DESIGN: Entire shift must complete in one cycle using barrel shifter structure (multi-stage muxing) or synthesizable shift operators.',
        'SIGN EXTENSION: For SRA, replicate sign bit A[WIDTH-1] into shifted-in positions.',
        'Test Case 1 - SRL: WIDTH=8, A=0b10000000 (0x80), shift_amount=1. Expected: result=0b01000000 (0x40).',
        'Test Case 2 - SRA: WIDTH=8, A=0b10000000 (0x80, -128 signed), shift_amount=1. Expected: result=0b11000000 (0xC0, sign-extended).',
        'Test Case 3 - SLL: WIDTH=8, A=0b00000001 (0x01), shift_amount=3. Expected: result=0b00001000 (0x08).',
        'Test Case 4 - Zero Shift: shift_amount=0 for all operations. Expected: result=A (unchanged).',
        'Test Case 5 - Maximum Shift: WIDTH=8, shift_amount=7. Verify correct behavior for all three operations.'
      ],
      hints: [
        'Classic barrel shifter: log2(WIDTH) stages, each shifts by power-of-2.',
        'Stage i: if shamt[i], shift by 2^i, else pass through.',
        'For SRA: use >>> or manually replicate sign bit.',
      ],
    },
    {
      id: 'alu5',
      shortName: 'Multicycle Multiplier',
      question: 'Design Multicycle Iterative Multiplier',
      description:
        'Implement a multicycle multiplier using shift-and-add. Takes two WIDTH-bit operands, produces a 2*WIDTH-bit result over multiple cycles.\n\n' +
        '**Example (WIDTH=8):**\n' +
        '```\nA=3, B=7 → result=21 (after ~8 cycles)\nA=255, B=255 → result=65025 (fits in 16 bits)\n```\n\n' +
        '**Constraints:**\n' +
        '- Handshake: start, busy, done signals\n' +
        '- Result is 2*WIDTH bits (no truncation)\n' +
        '- Typically WIDTH cycles for radix-2',
      difficulty: 'Hard',
      topics: ['Multiplier', 'Datapath', 'RTL'],
      requirements: [
        'ALGORITHM: Implement iterative multiplication (e.g., shift-and-add, Booth encoding). Document algorithm clearly (e.g., "radix-2 shift-and-add").',
        'HANDSHAKE INTERFACE: (1) start input: initiates multiplication on rising edge, (2) busy output: asserted during computation, (3) done output: pulsed for one cycle when result ready.',
        'OPERANDS AND RESULT: Inputs A and B are WIDTH bits each. Output result is 2*WIDTH bits (to hold full product without truncation).',
        'CYCLE COUNT: Define expected number of cycles (typically WIDTH cycles for radix-2). Document in specification.',
        'BACK-TO-BACK OPERATIONS: Support starting new multiplication immediately after done pulse (on next cycle).',
        'RESET HANDLING: On reset, clear busy/done signals and internal state (accumulator, counter).',
        'Test Case 1 - Simple Multiply: WIDTH=8, A=3, B=7. After ~8 cycles, result=21 (0x0015). Verify done pulse and busy timing.',
        'Test Case 2 - Zero Operand: A=0, B=any value. Expected: result=0, completes in defined cycle count.',
        'Test Case 3 - Maximum Values: WIDTH=8, A=255, B=255. Expected: result=65025 (0xFE01), no overflow (fits in 16 bits).',
        'Test Case 4 - Back-to-Back: Start first multiply (A=5, B=4). After done, immediately start second multiply (A=6, B=3) next cycle. Verify both results correct and timing proper.'
      ],
      hints: [
        'Initialize accumulator=0. For each multiplier bit: if bit=1, add A to accumulator. Shift appropriately.',
        'Accumulator must be 2*WIDTH bits.',
        'FSM: IDLE → COMPUTE → DONE.',
        'Latch inputs on start to avoid corruption during computation.',
      ],
    },
    {
      id: 'alu6',
      shortName: 'Sequential Divider',
      question: 'Implement Sequential Divider Using Shift-Subtract Algorithm',
      description:
        'Design a sequential divider computing quotient and remainder using restoring or non-restoring division.\n\n' +
        '**Example (WIDTH=8):**\n' +
        '```\n20 / 5 → quotient=4, remainder=0\n22 / 5 → quotient=4, remainder=2\n7 / 0 → divide_by_zero flag=1\n```\n\n' +
        '**Constraints:**\n' +
        '- Handshake: start, busy, done\n' +
        '- Typically WIDTH+1 cycles\n' +
        '- Define divide-by-zero behavior',
      difficulty: 'Hard',
      topics: ['Divider', 'Datapath', 'RTL'],
      requirements: [
        'ALGORITHM: Implement restoring division or non-restoring division (document which). Typical cycle count: WIDTH+1 cycles for WIDTH-bit operands.',
        'OUTPUTS: (1) quotient (WIDTH bits), (2) remainder (WIDTH bits), (3) done signal (1-cycle pulse when complete).',
        'DIVIDE-BY-ZERO: Define behavior when divisor=0. Options: (1) assert divide_by_zero flag and set quotient/remainder to defined values (e.g., all 1s), (2) quotient=0, remainder=dividend.',
        'HANDSHAKE: (1) start input initiates division, (2) busy output indicates computation in progress, (3) done output pulses when result ready.',
        'SIGNED VS UNSIGNED: Document whether divider is signed or unsigned. Unsigned is simpler. Signed requires additional sign handling.',
        'BACK-TO-BACK OPERATIONS: Support starting new division immediately after done.',
        'Test Case 1 - Exact Division: WIDTH=8, dividend=20, divisor=5. Expected: quotient=4, remainder=0.',
        'Test Case 2 - Non-Exact Division: dividend=22, divisor=5. Expected: quotient=4, remainder=2.',
        'Test Case 3 - Divide by Zero: dividend=7, divisor=0. Expected: divide_by_zero flag=1, quotient and remainder defined per spec (e.g., quotient=0xFF, remainder=0x07).',
        'Test Case 4 - Divisor Greater Than Dividend: dividend=3, divisor=10. Expected: quotient=0, remainder=3.'
      ],
      hints: [
        'Restoring: shift remainder left, subtract divisor, restore if negative.',
        'Divide-by-zero: check on start, skip computation, assert error flag.',
        'For signed: divide absolute values, adjust signs at end.',
      ],
    },
  ],

  'Pipeline & Control Logic': [
    {
      id: 'pipe1',
      shortName: 'Pipeline Registers',
      question: 'Implement Pipeline Registers with Stall and Flush Controls',
      description:
        'Design pipeline stage registers supporting stall (hold current value) and flush (insert NOP/bubble).\n\n' +
        '**Behavior:**\n' +
        '```\nStall=1 → register holds current value\nFlush=1 → register overwritten with NOP\nBoth=1 → defined priority (document choice)\n```\n\n' +
        '**Constraints:**\n' +
        '- Define stall+flush simultaneous priority\n' +
        '- Reset initializes to safe NOP state\n' +
        '- Fields: instruction, PC, control signals, decoded registers, immediates',
      difficulty: 'Hard',
      topics: ['Pipeline', 'Control', 'RTL'],
      requirements: [
        'STALL BEHAVIOR: When stall=1, pipeline register holds its current value (do not update from input). Typically implemented as clock enable = ~stall.',
        'FLUSH BEHAVIOR: When flush=1, pipeline register is overwritten with NOP/bubble values. All control signals that cause state changes (RegWrite, MemWrite, etc.) are set to 0. Instruction field can be set to NOP encoding or all zeros.',
        'SIMULTANEOUS STALL+FLUSH: Define priority when both stall=1 and flush=1 are asserted. Common choice: flush takes priority (flush always wins), or stall takes priority. Document chosen behavior clearly.',
        'RESET BEHAVIOR: On reset, initialize register to safe NOP state (all control signals inactive).',
        'REGISTER CONTENTS: Typical fields: (1) instruction bits, (2) PC value, (3) control signals (RegWrite, MemRead, MemWrite, ALUOp, etc.), (4) decoded source/destination registers, (5) immediate values.',
        'VALID BIT: Optional: include valid bit that is set on normal update, cleared on flush.',
        'Test Case 1 - Stall Holds State: Load registers with instruction A and control signals. Assert stall=1 for 3 cycles. Expected: register outputs remain unchanged for all 3 cycles.',
        'Test Case 2 - Flush Inserts Bubble: Load registers with valid instruction. Assert flush=1 for 1 cycle. Expected: control signals become 0 (NOP semantics), valid bit cleared (if present).',
        'Test Case 3 - Simultaneous Stall+Flush: Load instruction A. Assert both stall=1 and flush=1. Expected: behavior matches documented priority (e.g., if flush wins, output is NOP; if stall wins, output is unchanged A).'
      ],
      hints: [
        'Combine: if (flush) reg <= NOP; else if (!stall) reg <= input;',
        'NOP: RegWrite=0, MemWrite=0, MemRead=0, Branch=0.',
        'Test priority explicitly — most pipeline bugs occur here.',
      ],
    },
    {
      id: 'pipe2',
      shortName: 'Hazard Detection Unit',
      question: 'Design Hazard Detection Unit for Load-Use Data Hazard',
      description:
        'Implement hazard detection for load-use data hazards in a pipelined processor.\n\n' +
        'Detect when an instruction in decode depends on a load in execute. Generate stall and bubble signals.\n\n' +
        '**Detection condition:**\n' +
        '```\nID_EX.MemRead == 1 AND\n(ID_EX.Rd == IF_ID.Rs1 OR ID_EX.Rd == IF_ID.Rs2) AND\nID_EX.Rd != 0\n```\n\n' +
        '**Constraints:**\n' +
        '- Stall for exactly 1 cycle\n' +
        '- Do not stall for hardwired zero register\n' +
        '- Gate Rs2 check for immediate instructions',
      difficulty: 'Hard',
      topics: ['Pipeline', 'Hazards', 'RTL'],
      requirements: [
        'LOAD-USE HAZARD DEFINITION: Occurs when: (1) Instruction in EX stage is a load (ID_EX.MemRead=1), (2) Instruction in ID stage uses the load destination register as source operand, (3) ID_EX.Rd matches IF_ID.Rs1 or IF_ID.Rs2.',
        'HAZARD DETECTION LOGIC: Check if (ID_EX.MemRead==1) AND ((ID_EX.Rd == IF_ID.Rs1) OR (ID_EX.Rd == IF_ID.Rs2)). If true, assert hazard.',
        'ZERO REGISTER EXCEPTION: If ISA has hardwired zero register (e.g., x0 in RISC-V), do NOT treat it as dependency. Add condition: AND (ID_EX.Rd != 0).',
        'SOURCE REGISTER USAGE: Only compare Rs1/Rs2 if they are actually used by the instruction. For immediate instructions (no Rs2), ignore Rs2 comparison. Use instruction format decode or control signals.',
        'STALL ACTIONS: On hazard detection: (1) Prevent PC update (PCWrite=0), (2) Prevent IF/ID update (IFIDWrite=0), (3) Insert NOP into EX stage by clearing ID/EX control signals (set RegWrite=0, MemWrite=0, etc.).',
        'STALL DURATION: Stall for exactly 1 cycle to allow load to complete. After 1 cycle, data forwarding can resolve remaining dependencies.',
        'Test Case 1 - Load-Use Hazard Detected: EX stage: lw x1, 0(x2) (MemRead=1, Rd=x1). ID stage: add x3, x1, x4 (Rs1=x1). Expected: hazard detected, stall asserted for 1 cycle.',
        'Test Case 2 - No Hazard Different Registers: EX stage: lw x1, 0(x2). ID stage: add x3, x5, x6 (does not use x1). Expected: no hazard, no stall.',
        'Test Case 3 - Source Not Used (Immediate Instruction): EX stage: lw x1, 0(x2). ID stage: addi x3, x1, 10 (uses Rs1=x1, but Rs2 is immediate). Expected: hazard detected for Rs1, not for Rs2.'
      ],
      hints: [
        'Hazard = ID_EX.MemRead & (ID_EX.Rd == IF_ID.Rs1 | ID_EX.Rd == IF_ID.Rs2) & (ID_EX.Rd != 0).',
        'PCWrite = ~hazard; IFIDWrite = ~hazard.',
        'Gate Rs2 check using instruction format decode.',
      ],
    },
    {
      id: 'pipe3',
      shortName: 'Data Forwarding Logic',
      question: 'Implement Data Forwarding Unit for Pipeline Hazard Mitigation',
      description:
        'Design a forwarding unit that detects RAW hazards and forwards results from EX/MEM and MEM/WB stages to ALU inputs.\n\n' +
        '**Forwarding priority:**\n' +
        '```\nEX/MEM forward (most recent) takes priority over MEM/WB\nForwardA/B: 00=no fwd, 01=MEM/WB, 10=EX/MEM\n```\n\n' +
        '**Constraints:**\n' +
        '- EX/MEM has priority over MEM/WB for same register\n' +
        '- Never forward for zero register (x0)\n' +
        '- Only forward when source RegWrite=1',
      difficulty: 'Hard',
      topics: ['Pipeline', 'Forwarding', 'RTL'],
      requirements: [
        'FORWARDING SOURCES: (1) EX/MEM stage: result from previous instruction just computed, (2) MEM/WB stage: result from instruction two cycles ago (from memory or ALU).',
        'FORWARDING TARGETS: ALU operand A and operand B in EX stage. Insert muxes before ALU inputs to select between register file data, EX forwarding, or MEM forwarding.',
        'FORWARD CONDITION FOR EX HAZARD: Forward from EX/MEM when: (1) EX_MEM.RegWrite=1, (2) EX_MEM.Rd != 0, (3) EX_MEM.Rd == ID_EX.Rs1 (for operand A) or EX_MEM.Rd == ID_EX.Rs2 (for operand B).',
        'FORWARD CONDITION FOR MEM HAZARD: Forward from MEM/WB when: (1) MEM_WB.RegWrite=1, (2) MEM_WB.Rd != 0, (3) MEM_WB.Rd == ID_EX.Rs1 or MEM_WB.Rd == ID_EX.Rs2, (4) NOT already forwarding from EX/MEM (EX has priority).',
        'FORWARDING PRIORITY: If both EX/MEM and MEM/WB can forward to same operand, EX/MEM takes priority (it has more recent data).',
        'ZERO REGISTER: If ISA has hardwired zero (x0), never forward for Rd=0 or Rs=0.',
        'FORWARD SELECT SIGNALS: Generate 2-bit select signals (ForwardA, ForwardB) for each ALU operand: 00=no forward (use register file), 01=forward from MEM/WB, 10=forward from EX/MEM.',
        'Test Case 1 - EX Forward: Cycle N: add x1, x2, x3 (writes x1 in EX/MEM). Cycle N+1: sub x4, x1, x5 (needs x1 in EX). Expected: ForwardA=10 (forward from EX/MEM stage).',
        'Test Case 2 - MEM Forward: Cycle N: add x1, x2, x3 (writes x1). Cycle N+1: nop. Cycle N+2: and x6, x1, x7 (needs x1). Expected: ForwardA=01 (forward from MEM/WB stage).',
        'Test Case 3 - Priority Resolution: Cycle N: add x1, ... (in MEM/WB). Cycle N: sub x1, ... (in EX/MEM). Cycle N+1: or x2, x1, x3. Expected: ForwardA=10 (EX/MEM wins over MEM/WB).'
      ],
      hints: [
        'ForwardA: if (EX_MEM matches) 10; else if (MEM_WB matches) 01; else 00.',
        'Mux at ALU: case(ForwardA) 00: reg_data; 01: MEM_WB_data; 10: EX_MEM_data.',
        'Priority is critical: always check EX/MEM before MEM/WB.',
      ],
    },
    {
      id: 'pipe4',
      shortName: 'Branch Comparator',
      question: 'Design Branch Comparator and Control Logic',
      description:
        'Implement branch comparison logic evaluating BEQ, BNE, BLT, BGE conditions. Generate branch-taken signal and next-PC selection.\n\n' +
        '**Example:**\n' +
        '```\nBEQ: Rs1=5, Rs2=5 → taken=1\nBLT: Rs1=-1(0xFF), Rs2=+1(0x01) → taken=1\nBLTU: Rs1=255(0xFF), Rs2=1(0x01) → taken=0\n```\n\n' +
        '**Constraints:**\n' +
        '- Support BEQ, BNE, BLT, BGE, BLTU, BGEU\n' +
        '- Consider forwarding into comparator\n' +
        '- Output: branch_taken, PC_src',
      difficulty: 'Medium',
      topics: ['Pipeline', 'Branch', 'RTL'],
      requirements: [
        'BRANCH TYPES SUPPORTED: Document which branch types are implemented. Minimum: (1) BEQ (branch if equal), (2) BNE (branch if not equal). Optional: (3) BLT (less than, signed), (4) BGE (greater or equal, signed), (5) BLTU, BGEU (unsigned versions).',
        'COMPARISON LOGIC: Compare two register operands (typically Rs1 and Rs2). Generate comparison flags: (1) eq (equal), (2) lt_signed (less than, signed), (3) lt_unsigned (less than, unsigned).',
        'BRANCH DECISION: Based on branch_type input and comparison flags, generate branch_taken output. BEQ: taken = eq. BNE: taken = !eq. BLT: taken = lt_signed. BGE: taken = !lt_signed.',
        'CONTROL OUTPUTS: (1) branch_taken (1-bit), (2) next_pc_select or PC_src to choose between PC+4 and branch_target.',
        'OPERAND FORWARDING: If branch comparator is in ID stage, operands may need forwarding from EX, MEM, or WB stages. Define forwarding muxes for branch operands.',
        'BRANCH TYPE ENCODING: Define branch_type encoding clearly (e.g., 3-bit: 000=BEQ, 001=BNE, 010=BLT, 011=BGE, 100=BLTU, 101=BGEU).',
        'Test Case 1 - BEQ Taken: Rs1=5, Rs2=5, branch_type=BEQ. Expected: branch_taken=1.',
        'Test Case 2 - BNE Not Taken: Rs1=3, Rs2=3, branch_type=BNE. Expected: branch_taken=0.',
        'Test Case 3 - BLT Signed: Rs1=0xFF (-1 signed, 8-bit), Rs2=0x01 (+1), branch_type=BLT. Expected: branch_taken=1 (since -1 < 1).',
        'Test Case 4 - BLTU Unsigned: Rs1=0xFF (255 unsigned), Rs2=0x01 (1), branch_type=BLTU. Expected: branch_taken=0 (255 > 1 unsigned).'
      ],
      hints: [
        'eq = (Rs1 == Rs2); lt_signed = ($signed(Rs1) < $signed(Rs2));',
        'Branch mux: case(type) BEQ: eq; BNE: !eq; BLT: lt_signed; ...',
        'PC_src = branch_taken & is_branch_instruction.',
      ],
    },
    {
      id: 'pipe5',
      shortName: 'Instruction Decode',
      question: 'Implement Instruction Decode Logic',
      description:
        'Design the main instruction decoder extracting fields from a 32-bit instruction and generating pipeline control signals.\n\n' +
        '**Example:**\n' +
        '```\nR-type ADD: → RegWrite=1, ALUSrc=reg, MemRead=0\nLoad LW:    → RegWrite=1, ALUSrc=imm, MemRead=1\nStore SW:   → RegWrite=0, MemWrite=1\nIllegal:    → all writes=0, illegal_instruction=1\n```\n\n' +
        '**Constraints:**\n' +
        '- Support R/I/S/B/U/J instruction formats\n' +
        '- Sign-extend immediates per format\n' +
        '- Safe defaults for illegal opcodes',
      difficulty: 'Medium',
      topics: ['Pipeline', 'Decode', 'RTL'],
      requirements: [
        'INPUT: 32-bit instruction word (or other defined width).',
        'INSTRUCTION FIELD EXTRACTION: Extract fields based on ISA encoding: (1) opcode, (2) Rd (destination register), (3) Rs1, Rs2 (source registers), (4) funct3, funct7 (function fields), (5) immediate values (sign-extended).',
        'CONTROL SIGNAL OUTPUTS: Generate signals for all pipeline stages: (1) RegWrite (write to register file), (2) MemRead, MemWrite (memory access), (3) ALUSrc (ALU operand from register or immediate), (4) ALUOp (ALU operation type), (5) Branch (branch instruction), (6) Jump, (7) MemToReg (write back from memory or ALU), (8) others as needed.',
        'INSTRUCTION FORMAT DECODE: Identify instruction type (R/I/S/B/U/J) from opcode. Extract and sign-extend immediate based on format.',
        'ILLEGAL INSTRUCTION HANDLING: For undefined opcodes: (1) Set all write enables (RegWrite, MemWrite) to 0 (prevent state changes), (2) Optionally assert illegal_instruction flag, (3) Can also trigger exception in later design.',
        'LATCH AVOIDANCE: Assign default values to all control signals, then override in case statement for legal opcodes.',
        'Test Case 1 - R-Type Decode: Instruction: add x3, x1, x2. Expected: RegWrite=1, ALUSrc=0 (use register), MemRead=0, MemWrite=0, ALUOp=ADD.',
        'Test Case 2 - Load Decode: Instruction: lw x5, 8(x2). Expected: MemRead=1, RegWrite=1, ALUSrc=1 (use immediate), MemToReg=1 (write from memory), ALUOp=ADD (for address calc).',
        'Test Case 3 - Store Decode: Instruction: sw x6, 12(x3). Expected: MemWrite=1, RegWrite=0, ALUSrc=1, MemToReg=X',
        'Test Case 4 - Illegal Instruction: Opcode: 0x7F (undefined). Expected: RegWrite=0, MemWrite=0, MemRead=0, illegal_instruction=1.'
      ],
      hints: [
        'Case on opcode: 0110011 → R-type, 0000011 → Load, 0100011 → Store.',
        'I-type immediate: {20{inst[31]}, inst[31:20]}.',
        'Keep decode purely combinational for timing.',
      ],
    },
  ],

  'Register File & Scoreboarding': [
    {
      id: 'reg1',
      shortName: '2-Read 1-Write Register File',
      question: 'Implement 2-Read 1-Write Register File',
      description:
        'Design a register file with two asynchronous read ports and one synchronous write port.\n\n' +
        '**Interface:**\n' +
        '```\nRead: rd_addr1, rd_addr2 → rd_data1, rd_data2 (combinational)\nWrite: wr_addr, wr_data, wr_en → write on posedge clk\n```\n\n' +
        '**Constraints:**\n' +
        '- Parameterizable NUM_REGS and DATA_WIDTH\n' +
        '- Define read-during-write semantics (write-first or read-first)\n' +
        '- Optional: hardwired zero register (x0)',
      difficulty: 'Medium',
      topics: ['Register File', 'RTL'],
      requirements: [
        'PARAMETERIZATION: Support parameters: (1) NUM_REGS (number of registers, e.g., 32), (2) DATA_WIDTH (width per register, e.g., 32 bits).',
        'READ PORTS: Two asynchronous/combinational read ports. Inputs: rd_addr1, rd_addr2 (log2(NUM_REGS) bits each). Outputs: rd_data1, rd_data2 (DATA_WIDTH bits each).',
        'WRITE PORT: One synchronous write port. Inputs: wr_addr (log2(NUM_REGS) bits), wr_data (DATA_WIDTH bits), wr_en (write enable). Write occurs on rising clock edge when wr_en=1.',
        'READ-DURING-WRITE SEMANTICS: Define behavior when reading same address being written in same cycle. Options: (1) Write-first (read sees new data), (2) Read-first (read sees old data). Document chosen behavior and implement consistently.',
        'HARDWIRED ZERO REGISTER (OPTIONAL): If implementing RISC-V style: register 0 always reads as 0. Writes to register 0 are ignored (wr_en for reg[0] always disabled).',
        'RESET: On reset, optionally initialize all registers to 0 (or leave undefined for faster synthesis).',
        'Test Case 1 - Independent Reads: Write value 0x55 to register 3. Read register 3 on both read ports. Expected: rd_data1=0x55, rd_data2=0x55.',
        'Test Case 2 - Same-Cycle Read/Write: Write value 0xAA to register 5. In same cycle, read register 5. Expected: rd_data follows chosen semantics (write-first: 0xAA; read-first: old value).',
        'Test Case 3 - Zero Register (if applicable): Write 0xFF to register 0. Read register 0. Expected: rd_data=0x00 (hardwired zero). Register 0 unchanged.'
      ],
      hints: [
        'Array: reg [DATA_WIDTH-1:0] registers [0:NUM_REGS-1];',
        'Write-first forwarding: rd_data = (addr == wr_addr && wr_en) ? wr_data : registers[addr];',
        'Zero register: if (wr_addr != 0) registers[wr_addr] <= wr_data;',
      ],
    },
    {
      id: 'reg2',
      shortName: 'Register Renaming',
      question: 'Design Register Renaming Logic with Map Table and Free List',
      description:
        'Implement register renaming for out-of-order execution.\n\n' +
        'Maintain a map table (architectural → physical) and a free list of available physical registers.\n\n' +
        '**Operations:**\n' +
        '```\nRename: read map table for sources, allocate new phys for dest\nCommit: return old physical register to free list\nFlush:  restore map table to checkpoint\n```\n\n' +
        '**Constraints:**\n' +
        '- Stall when free list is empty\n' +
        '- Save old mapping for recovery\n' +
        '- Support misspeculation recovery',
      difficulty: 'Hard',
      topics: ['Register File', 'Renaming', 'RTL'],
      requirements: [
        'MAP TABLE: Array mapping architectural register ID to physical register ID. Size: NUM_ARCH_REGS entries. Each entry stores current physical register ID for that architectural register.',
        'FREE LIST: List/FIFO of available physical register IDs. Initially contains all physical registers except those reserved for initial architectural state.',
        'RENAME OPERATION: On instruction rename: (1) Read map table for source architectural registers → get source physical registers. (2) Allocate new physical register from free list for destination. (3) Update map table: arch_dest → new_phys_reg. (4) Save old physical register mapping for recovery.',
        'FREE LIST EMPTY: When free list is empty, stall rename (cannot allocate new physical register). Assert stall/backpressure signal.',
        'COMMIT/DEALLOCATION: On instruction commit (in-order): return old physical register (that was overwritten in map table) to free list. This physical register is no longer needed.',
        'RECOVERY (OPTIONAL): On branch mispredict or exception: restore map table to checkpoint state and return speculative physical registers to free list.',
        'OUTPUTS: (1) new_phys_reg (allocated physical register), (2) old_phys_reg (previous mapping, for recovery), (3) rename_grant (allocation successful), (4) stall (free list empty).',
        'Test Case 1 - Simple Rename: Rename architectural register r1 twice in sequence. Expected: map table for r1 updates to new physical register each time. Two different physical registers allocated.',
        'Test Case 2 - Free List Empty: Allocate physical registers until free list exhausted. Next rename request. Expected: rename_grant=0, stall asserted, no allocation.',
        'Test Case 3 - Commit Frees Physical Register: Rename r1 (allocates p5, old mapping was p2). Later commit instruction. Expected: p2 returned to free list and becomes available for reallocation.'
      ],
      hints: [
        'old_pr = map_table[arch_dest]; new_pr = free_list.pop(); map_table[arch_dest] = new_pr;',
        'Checkpoint-based recovery: save map table copy at branches.',
        'ROB-based: track old physical registers in ROB for flush recovery.',
      ],
    },
    {
      id: 'reg3',
      shortName: 'Scoreboard',
      question: 'Implement Scoreboard for Register Availability Tracking',
      description:
        'Design a scoreboard tracking whether each register is busy (pending) or ready (available).\n\n' +
        '**Operations:**\n' +
        '```\nIssue:     scoreboard[dest] = 1 (busy)\nWriteback: scoreboard[dest] = 0 (ready)\nCheck:     can_issue = (scoreboard[src1]==0 && scoreboard[src2]==0)\n```\n\n' +
        '**Constraints:**\n' +
        '- Bit-vector: 1=busy, 0=ready\n' +
        '- Define same-cycle writeback+issue precedence\n' +
        '- Zero register always ready',
      difficulty: 'Hard',
      topics: ['Scoreboard', 'OOO', 'RTL'],
      requirements: [
        'SCOREBOARD STATE: Bit-vector or array indicating busy/ready for each register. Size: NUM_REGS bits. 1=busy (not ready), 0=ready.',
        'ISSUE OPERATION: On instruction issue, mark destination register as busy: scoreboard[dest_reg] = 1.',
        'WRITEBACK OPERATION: On instruction writeback completion, mark destination register as ready: scoreboard[dest_reg] = 0.',
        'DEPENDENCY CHECK: Before issuing instruction, check scoreboard for source registers. Instruction can issue only if all source registers are ready (scoreboard[src1]==0 AND scoreboard[src2]==0).',
        'WAKEUP: When writeback clears busy bit, all instructions waiting on that register become issuable (if other dependencies also satisfied).',
        'SAME-CYCLE WRITEBACK+ISSUE: Define precedence when register is written back and new instruction issues using it in same cycle. Common: writeback completes before issue check (new instruction sees ready state).',
        'ZERO REGISTER (OPTIONAL): If register 0 is hardwired zero, it should always be marked ready (scoreboard[0]=0).',
        'Test Case 1 - Mark Busy on Issue: Issue instruction writing to register r4. Expected: scoreboard[4]=1 (busy). Dependent instruction cannot issue.',
        'Test Case 2 - Clear Busy on Writeback: Writeback to register r4. Expected: scoreboard[4]=0 (ready). Dependent instruction becomes issuable.',
        'Test Case 3 - Multiple Dependents: Two instructions wait for register r4. Writeback r4. Expected: both instructions become issuable simultaneously.'
      ],
      hints: [
        'reg [NUM_REGS-1:0] scoreboard; Initialize to 0.',
        'Issue: scoreboard[dest] <= 1; Writeback: scoreboard[wb_reg] <= 0;',
        'Same-cycle: if wb_reg matches src, treat as ready.',
      ],
    },
  ],

  'GPU-Style Functional Blocks': [
    {
      id: 'gpu1',
      shortName: 'Warp Scheduler',
      question: 'Implement Warp Scheduler with Round-Robin or Priority Selection',
      description:
        'Design a warp scheduler selecting one ready warp from multiple warps each cycle.\n\n' +
        '**Example:**\n' +
        '```\nready=0b0111 (warps 0,1,2 ready)\n→ grants rotate: 0→1→2→0→1→2...\n\nready=0b0000 → grant_valid=0\n```\n\n' +
        '**Constraints:**\n' +
        '- Round-robin fairness or priority-based\n' +
        '- Track last granted warp\n' +
        '- No grant when no warps ready',
      difficulty: 'Hard',
      topics: ['GPU', 'Scheduler', 'RTL'],
      requirements: [
        'INPUT: Ready mask (bit-vector indicating which warps are ready). Size: NUM_WARPS bits. ready[i]=1 means warp i can execute.',
        'OUTPUT: (1) grant_valid (1 if a warp is granted, 0 if none ready), (2) grant_warp_id (log2(NUM_WARPS) bits, which warp is selected).',
        'SCHEDULING POLICY: Document policy. Options: (1) Round-robin: rotate among ready warps starting from last_grant+1. (2) Priority: fixed priority, lowest warp ID wins.',
        'ROUND-ROBIN BEHAVIOR: Maintain last_grant register. On grant, search for next ready warp starting from (last_grant+1) with wrap-around. Update last_grant to granted warp.',
        'NO READY WARPS: When ready mask is all zeros, grant_valid=0. Do not issue any warp. grant_warp_id can be dont care or held stable.',
        'GRANT STABILITY: When no valid grant (grant_valid=0), grant_warp_id should remain stable (hold last value or defined value).',
        'Test Case 1 - Round-Robin Fairness: Ready mask = 0b0111 (warps 0,1,2 ready continuously). Expected: grants rotate 0→1→2→0→1→2... each cycle.',
        'Test Case 2 - Sparse Readiness: Only warp 2 is ready (ready=0b0100). Expected: grant_warp_id=2 every cycle when granted.',
        'Test Case 3 - No Ready Warps: Ready mask = 0b0000. Expected: grant_valid=0, no warp selected.'
      ],
      hints: [
        'Rotate ready mask to place last_grant at LSB, priority encode, rotate back.',
        'Update: if (grant_valid) last_grant <= grant_warp_id;',
      ],
    },
    {
      id: 'gpu2',
      shortName: 'SIMD Execution Unit',
      question: 'Design SIMD Execution Unit for Parallel Lane Processing',
      description:
        'Implement a SIMD unit performing the same operation across multiple data lanes with per-lane masking.\n\n' +
        '**Example (4 lanes):**\n' +
        '```\nADD: A=[1,2,3,4], B=[10,10,10,10], mask=1111\n→ result=[11,12,13,14]\n\nmask=0101 → only lanes 0,2 updated\n```\n\n' +
        '**Constraints:**\n' +
        '- Parameterizable NUM_LANES and DATA_WIDTH\n' +
        '- Single opcode shared across all lanes\n' +
        '- Inactive lanes hold previous value or output zero',
      difficulty: 'Hard',
      topics: ['GPU', 'SIMD', 'RTL'],
      requirements: [
        'PARAMETERIZATION: (1) NUM_LANES (number of parallel lanes, e.g., 32 for warp size), (2) DATA_WIDTH (bits per lane, e.g., 32).',
        'INPUTS: (1) operation opcode (shared across all lanes), (2) operand A (NUM_LANES * DATA_WIDTH bits, A[0], A[1], ..., A[NUM_LANES-1]), (3) operand B (similar), (4) lane_mask (NUM_LANES bits, 1=active, 0=inactive).',
        'OUTPUT: result (NUM_LANES * DATA_WIDTH bits), one result per lane.',
        'OPERATION: All active lanes execute the same opcode (e.g., ADD, SUB, MUL, AND, OR). Each lane processes its own operands independently.',
        'LANE MASKING: Inactive lanes (lane_mask[i]=0) should: (1) Not update their result (hold previous value), OR (2) Output zero (document choice).',
        'CONTROL SHARING: Single control logic decodes opcode and generates operation signals for all lanes. Each lane has its own datapath (ALU).',
        'Test Case 1 - Vector Add: NUM_LANES=4, opcode=ADD, A=[1,2,3,4], B=[10,10,10,10], mask=1111. Expected: result=[11,12,13,14].',
        'Test Case 2 - Lane Masking: NUM_LANES=4, opcode=ADD, A=[1,2,3,4], B=[10,10,10,10], mask=0b0101 (lanes 0 and 2 active). Expected: result lanes 0,2 updated to [11, ?, 13, ?]. Lanes 1,3 hold previous/zero per spec.',
        'Test Case 3 - Overflow Wrap: DATA_WIDTH=8, opcode=ADD, A[0]=255, B[0]=1. Expected: result[0]=0 (wraps, standard unsigned add).'
      ],
      hints: [
        'Generate loop to instantiate NUM_LANES scalar ALUs.',
        'Masking: wr_en[i] = lane_mask[i]; result[i] = mask ? alu_result : prev.',
      ],
    },
    {
      id: 'gpu3',
      shortName: 'Thread Mask Logic',
      question: 'Implement Thread Mask Logic for Predicated Execution',
      description:
        'Design thread masking logic for GPU-style predicated execution.\n\n' +
        '**Operations:**\n' +
        '```\nif-branch:   new_mask = active_mask & predicate\nelse-branch: new_mask = active_mask & ~predicate\nnested:      push/pop mask stack\n```\n\n' +
        '**Constraints:**\n' +
        '- Inactive threads must not write registers or issue memory ops\n' +
        '- Support push/pop stack for nesting\n' +
        '- Initialize to all active on reset',
      difficulty: 'Medium',
      topics: ['GPU', 'Predication', 'RTL'],
      requirements: [
        'ACTIVE MASK: Bit-vector indicating which threads are currently active. Size: NUM_THREADS bits. active_mask[i]=1 means thread i is active.',
        'PREDICATE EVALUATION: Input predicate mask (result of condition evaluation per thread). Combine with current active_mask to produce new active_mask.',
        'MASK UPDATE SEMANTICS: For if-statement: new_mask = active_mask & predicate. For else-statement: new_mask = active_mask & ~predicate. Document combining logic clearly.',
        'NESTED PREDICATES: Support push/pop stack of masks for nested if-else. On entering if: push current mask, apply new mask. On exiting if: pop mask to restore previous level.',
        'SIDE EFFECT GATING: Inactive threads (active_mask[i]=0) must not: (1) Write to registers (gate write enable), (2) Issue memory requests (gate mem_req[i]), (3) Update any architectural state.',
        'INITIALIZATION: On reset or kernel launch, active_mask initializes to all 1s (all threads active).',
        'Test Case 1 - Basic Predication: Initial active_mask=1111, predicate=1010. After if-statement. Expected: new active_mask=1010 (threads 0,2 active).',
        'Test Case 2 - No Active Threads: active_mask=1111, predicate=0000. Expected: new active_mask=0000 (all inactive). Verify no writes or memory requests from any thread.',
        'Test Case 3 - Nested Predicates: active_mask=1111, apply pred1=1100 → active=1100. Then apply pred2=1010 (AND with 1100). Expected: active=1000 (only thread 3 active in nested region).'
      ],
      hints: [
        'Stack for nesting: push(active_mask); active_mask = new_mask; On endif: pop().',
        'Side effect gating: write_en[i] = instr_write & active_mask[i].',
      ],
    },
    {
      id: 'gpu4',
      shortName: 'Bank Conflict Detector',
      question: 'Design Shared Memory Bank Conflict Detector',
      description:
        'Implement a bank conflict detector for GPU shared memory.\n\n' +
        'Given thread addresses and active mask, detect if multiple active threads access the same memory bank.\n\n' +
        '**Example (4 banks):**\n' +
        '```\nactive=1111, banks=[0,1,2,3] → no conflict\nactive=1111, banks=[1,1,2,3] → conflict on bank 1\nactive=0110, banks=[1,1,1,3] → no conflict (threads 0,2 masked)\n```\n\n' +
        '**Constraints:**\n' +
        '- NUM_BANKS is power of 2\n' +
        '- Bank index = (addr >> offset) & (NUM_BANKS-1)\n' +
        '- Masked threads excluded from detection',
      difficulty: 'Hard',
      topics: ['GPU', 'Memory', 'RTL'],
      requirements: [
        'INPUTS: (1) addresses (NUM_THREADS * ADDR_WIDTH bits, one address per thread), (2) active_mask (NUM_THREADS bits), (3) NUM_BANKS parameter (number of memory banks, power of 2).',
        'BANK EXTRACTION: For each thread, compute bank index: bank[i] = (address[i] >> BANK_OFFSET) & (NUM_BANKS-1). BANK_OFFSET depends on word size (e.g., 2 for 4-byte words).',
        'CONFLICT DETECTION: For each bank, count how many active threads access it. If count > 1 for any bank, conflict exists.',
        'INACTIVE THREAD EXCLUSION: Threads with active_mask[i]=0 must not contribute to conflict detection (ignore their addresses).',
        'OUTPUTS: (1) conflict_detected (1 if any bank has multiple active accesses), (2) conflict_bank_id (which bank has conflict, if multiple conflicts, report one or all), (3) can_issue (0 if conflict, requires serialization).',
        'SERIALIZATION (OPTIONAL): Decide which access to service first. Can use priority scheme (lowest thread ID) or round-robin.',
        'Test Case 1 - No Conflict: NUM_BANKS=4, active_mask=1111, addresses map to banks [0,1,2,3] (all different). Expected: conflict_detected=0, can_issue=1.',
        'Test Case 2 - Conflict Detected: NUM_BANKS=4, active_mask=1111, addresses map to banks [1,1,2,3] (threads 0 and 1 → bank 1). Expected: conflict_detected=1, conflict_bank_id=1.',
        'Test Case 3 - Masked Thread Ignored: NUM_BANKS=4, active_mask=0110, addresses map to banks [1,1,1,3]. Threads 0,2 inactive. Only threads 1,3 active → banks [1,3]. Expected: conflict_detected=0.'
      ],
      hints: [
        'Bank index: (addr >> log2(bytes_per_bank)) % NUM_BANKS.',
        'Per-bank bitmask of accessing threads, popcount > 1 = conflict.',
        'Serialization: priority encode among conflicting threads.',
      ],
    },
  ],

  'Decoders, Arbiters, Misc': [
    {
      id: 'misc1',
      shortName: 'N-to-2^N Decoder',
      question: 'Design N-to-2^N Binary Decoder',
      description:
        'Implement a parameterizable binary decoder converting N-bit input to 2^N one-hot output with enable control.\n\n' +
        '**Example (N=3):**\n' +
        '```\ninput=5, enable=1 → output=0b00100000 (bit 5 high)\ninput=3, enable=0 → output=0b00000000\n```\n\n' +
        '**Constraints:**\n' +
        '- Parameterizable N\n' +
        '- Output is one-hot when enabled, all-zero when disabled\n' +
        '- Exactly one output bit high when enabled',
      difficulty: 'Medium',
      topics: ['Decoder', 'RTL'],
      requirements: [
        'PARAMETERIZATION: Parameter N defines input width. Output width is 2^N.',
        'DECODING LOGIC: For input value i (0 to 2^N-1), output[i]=1 and all other outputs=0.',
        'ENABLE CONTROL: Input enable signal. When enable=1, perform decoding. When enable=0, all outputs=0.',
        'ONE-HOT OUTPUT: Exactly one output bit is 1 when enabled. Verify one-hot property.',
        'EDGE CASES: Handle N=1 (2 outputs), large N values, enable transitions.',
        'Test Case 1 - N=3 Decode: Input=5 (101 binary), enable=1. Expected: output=0b00100000 (bit 5 high, all others low).',
        'Test Case 2 - Enable Low: Input=3, enable=0. Expected: output=0b00000000 (all zeros).',
        'Test Case 3 - Sweep All Inputs: For N=3, iterate input from 0 to 7 with enable=1. Verify each output is one-hot and matches input index.'
      ],
      hints: [
        'output = enable ? (1 << input) : 0;',
        'Generate loop: for (i=0; i<2**N; i++) assign out[i] = en & (in==i);',
        'Assertion: $countones(output) == enable.',
      ],
    },
    {
      id: 'misc2',
      shortName: 'Priority Encoder',
      question: 'Implement Priority Encoder',
      description:
        'Design a priority encoder finding the index of the highest-priority asserted bit.\n\n' +
        '**Example (LSB-first priority):**\n' +
        '```\ninput=0b001000 → index=3, valid=1\ninput=0b101100 → index=2 (lowest set bit)\ninput=0b000000 → index=0, valid=0\n```\n\n' +
        '**Constraints:**\n' +
        '- Parameterizable N-bit input\n' +
        '- LSB-first priority (bit 0 = highest priority)\n' +
        '- valid=0 when no bits set',
      difficulty: 'Medium',
      topics: ['Encoder', 'RTL'],
      requirements: [
        'INPUT: N-bit vector (e.g., request bits, ready bits).',
        'OUTPUTS: (1) index (log2(N) bits, index of highest-priority 1), (2) valid (1 if any input bit is 1, 0 if all zeros).',
        'PRIORITY DIRECTION: Document priority. Common choices: (1) MSB has highest priority (index returns highest bit position), (2) LSB has highest priority (index returns lowest bit position).',
        'ZERO INPUT: When input=0 (all zeros), valid=0. Index can be 0 or dont care (document choice).',
        'STABILITY: When valid=0, index output should be stable (held at defined value, e.g., 0).',
        'PARAMETERIZATION: Support parameter N for input width.',
        'Test Case 1 - Single Bit: Input=0b001000, priority=LSB-first. Expected: index=3, valid=1.',
        'Test Case 2 - Multiple Bits: Input=0b101100, priority=LSB-first. Expected: index=2 (lowest set bit). Priority=MSB-first: index=5 (highest set bit).',
        'Test Case 3 - All Zeros: Input=0b000000. Expected: valid=0, index=0 (or defined value).'
      ],
      hints: [
        'LSB-first: scan from bit 0 to N-1, return first set.',
        'MSB-first: scan from N-1 to 0.',
        'Use casez or priority if-else chain.',
      ],
    },
    {
      id: 'misc3',
      shortName: 'Round-Robin Arbiter',
      question: 'Design Round-Robin Arbiter for Fair Request Arbitration',
      description:
        'Implement a round-robin arbiter granting one requestor per cycle with rotating priority.\n\n' +
        '**Example:**\n' +
        '```\nrequest=111 → grants rotate: 0→1→2→0→1→2...\nrequest=010 → always grants requestor 1\nrequest=000 → grant_valid=0, pointer unchanged\n```\n\n' +
        '**Constraints:**\n' +
        '- One-hot grant output\n' +
        '- Maintain last_grant pointer for fairness\n' +
        '- Fair share over time for continuous requestors',
      difficulty: 'Hard',
      topics: ['Arbiter', 'RTL'],
      requirements: [
        'INPUTS: request vector (N bits, request[i]=1 means requestor i wants grant).',
        'OUTPUTS: (1) grant vector (N bits, one-hot encoding of granted requestor), (2) grant_valid (1 if grant issued, 0 if no requests).',
        'ONE-HOT GRANT: At most one grant bit is asserted per cycle. Use one-hot encoding (only grant[i]=1 for granted requestor i).',
        'ROUND-ROBIN PRIORITY: Maintain last_grant pointer (register storing last granted index). On next grant, search for requests starting from (last_grant+1) with wrap-around.',
        'POINTER UPDATE: On successful grant, update last_grant to granted index. If no grant (no requests), last_grant unchanged.',
        'NO REQUESTS: When request vector is all zeros, grant_valid=0, grant vector all zeros, last_grant unchanged.',
        'FAIRNESS: Over time, if all requestors continuously request, each gets grant in rotating order (fair share).',
        'Test Case 1 - Continuous Requests: request[0:2]=111 (all request continuously). Expected: grants rotate: grant[0], grant[1], grant[2], grant[0], ... each cycle.',
        'Test Case 2 - Sparse Requests: request changes dynamically (e.g., 110, 010, 101, ...). Expected: arbiter grants next eligible requestor after last_grant in round-robin order.',
        'Test Case 3 - Single Requestor: Only request[2]=1. Expected: grant[2]=1 every cycle (no competition).'
      ],
      hints: [
        'Rotate request to place last_grant at LSB, priority encode, rotate back.',
        'Update: if (grant_valid) last_grant <= granted_index;',
        'Assertion: $onehot0(grant).',
      ],
    },
    {
      id: 'misc4',
      shortName: 'Reorder Buffer Entry',
      question: 'Implement Reorder Buffer (ROB) Entry Management Logic',
      description:
        'Design ROB entry management for an out-of-order processor.\n\n' +
        '**Operations:**\n' +
        '```\nAllocate: store instruction at tail, increment tail\nWriteback: mark entry ready, store result\nCommit: retire from head if valid+ready, increment head\nFlush: invalidate entries between flush point and tail\n```\n\n' +
        '**Constraints:**\n' +
        '- Circular buffer with head/tail pointers\n' +
        '- Commit only in-order from head\n' +
        '- Full when (tail+1) % size == head',
      difficulty: 'Hard',
      topics: ['ROB', 'OOO', 'RTL'],
      requirements: [
        'ROB ENTRY FIELDS: Each entry contains: (1) valid (entry occupied), (2) ready (instruction completed), (3) dest_reg (destination register tag), (4) value (result value or pointer to physical register), (5) exception flags (optional), (6) PC (optional, for debugging).',
        'CIRCULAR BUFFER: ROB is circular buffer with head and tail pointers. Size: NUM_ENTRIES. Head points to oldest instruction (commit candidate). Tail points to next free entry (allocation).',
        'ALLOCATION (DISPATCH): On instruction dispatch, allocate entry at tail. Store instruction info. Increment tail pointer. If full (tail+1 == head), stall dispatch.',
        'WRITEBACK (MARK READY): When instruction completes, find its ROB entry (by ROB ID), mark ready=1, store result value.',
        'COMMIT (RETIRE): Commit instructions in-order from head. Only commit if head entry is valid and ready. Increment head pointer. Free entry (valid=0).',
        'FLUSH: On mispredict or exception, invalidate all younger entries (between flush point and tail). Options: (1) Reset tail to flush point, (2) Invalidate entries individually.',
        'FULL/EMPTY STATUS: Full when (tail+1) % NUM_ENTRIES == head. Empty when tail == head.',
        'Test Case 1 - Allocate, Writeback, Commit: Allocate instruction at tail. Later, mark ready. Then commit from head. Verify head increments, entry freed.',
        'Test Case 2 - Not-Ready Blocks Commit: Head entry not ready (ready=0). Younger entry is ready. Expected: commit stalls at head, does not skip to younger entry.',
        'Test Case 3 - Flush on Mispredict: Allocate several instructions. Mispredict detected. Flush entries after mispredict point. Expected: tail updated, flushed entries invalid.'
      ],
      hints: [
        'Allocate: rob[tail] <= entry; tail <= (tail+1) % SIZE;',
        'Commit: if (rob[head].valid && rob[head].ready) head <= (head+1) % SIZE;',
        'Full: (tail+1) % SIZE == head.',
      ],
    },
    {
      id: 'misc5',
      shortName: 'Functional Unit Tracker',
      question: 'Design Functional Unit Busy/Free Tracking Module',
      description:
        'Implement a tracker for functional unit availability in a multi-issue processor.\n\n' +
        '**Interface:**\n' +
        '```\nAllocate unit i → busy[i]=1\nDone unit i    → busy[i]=0\navailable = ~busy, any_available = |available\n```\n\n' +
        '**Constraints:**\n' +
        '- Bit-vector tracking: 1=busy, 0=free\n' +
        '- Define same-cycle allocate+free precedence\n' +
        '- Reset: all units free',
      difficulty: 'Medium',
      topics: ['Functional Unit', 'Tracking', 'RTL'],
      requirements: [
        'BUSY VECTOR: Bit-vector indicating status of each functional unit. Size: NUM_UNITS bits. busy[i]=1 means unit i is occupied.',
        'AVAILABILITY: available[i] = ~busy[i]. Scheduler uses available vector to select free unit.',
        'ALLOCATION: On instruction issue to unit i, set busy[i]=1. Provide allocate interface: allocate_valid, allocate_unit_id.',
        'DEALLOCATION: On instruction completion from unit i, clear busy[i]=0. Provide done interface: done_valid, done_unit_id.',
        'SAME-CYCLE ALLOCATE+FREE: Define behavior when same unit is freed and allocated in same cycle. Common: free takes effect first, then allocate (allows immediate reuse).',
        'INITIALIZATION: On reset, all units free (busy=0).',
        'OUTPUTS: (1) available vector (which units are free), (2) any_available flag (at least one unit free), (3) optional: suggested unit (lowest free unit ID).',
        'Test Case 1 - Allocate Unit: All units initially free. Allocate unit 0. Expected: busy[0]=1, available[0]=0.',
        'Test Case 2 - Free Unit: Unit 0 busy. Done signal for unit 0. Expected: busy[0]=0, available[0]=1, unit becomes available.',
        'Test Case 3 - All Busy: Allocate all units. New request arrives. Expected: any_available=0, scheduler must stall.'
      ],
      hints: [
        'available = ~busy; any_available = |available;',
        'Suggested unit: priority encoder on available vector.',
        'Same-cycle: if both, allocate takes precedence (or document free-then-allocate).',
      ],
    },
  ],
};

export default computerArchitecture;
