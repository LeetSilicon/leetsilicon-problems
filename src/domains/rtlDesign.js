/**
 * RTL Design Questions
 * Domains: FIFO/Queue, FSM, Memory/Cache, Counters/Registers, Pipeline/Datapath, Arithmetic, Interfaces/Bus, Basic RTL, Misc Classic RTL
 */

const rtlDesign = {
  'FIFO / Queue': [
    {
      id: 'fifo1',
      shortName: 'Synchronous FIFO with Flags',
      question: 'Design Synchronous FIFO with Full, Empty, Almost-Full, and Almost-Empty Flags',
      description:
        'Implement a synchronous FIFO (single clock domain) with comprehensive status flags and programmable thresholds.\n\n' +
        '**Interface:**\n' +
        '```\nwrite_en + write_data → push (when not full)\nread_en → pop (when not empty)\nFlags: full, empty, almost_full, almost_empty\n```\n\n' +
        '**Constraints:**\n' +
        '- Parameterizable DEPTH (power of 2) and WIDTH\n' +
        '- Simultaneous read+write when neither full nor empty\n' +
        '- Overflow/underflow: ignore operation (no corruption)\n' +
        '- Configurable ALMOST_FULL and ALMOST_EMPTY thresholds',
      difficulty: 'Hard',
      topics: ['FIFO', 'Design', 'Flags'],
      requirements: [
        'PARAMETERIZATION: Support parameters DEPTH (number of entries, power of 2 recommended) and WIDTH (data width in bits).',
        'RESET BEHAVIOR: Define reset type (synchronous or asynchronous). On reset: (1) read/write pointers initialize to 0, (2) occupancy counter initializes to 0, (3) all flags clear (full=0, empty=1, almost flags depend on thresholds).',
        'WRITE OPERATION: Input write_en signal. When write_en=1 and full=0, store write_data at write pointer location and increment write pointer. When full=1, ignore write (data not stored).',
        'READ OPERATION: Input read_en signal. When read_en=1 and empty=0, output data from read pointer location and increment read pointer. When empty=1, ignore read (output can be previous value or don\'t care).',
        'OCCUPANCY TRACKING: Maintain counter tracking number of valid entries. Increment on write (when not full), decrement on read (when not empty). On simultaneous read+write when neither full nor empty, count unchanged.',
        'FLAG GENERATION: (1) full = (count == DEPTH), (2) empty = (count == 0), (3) almost_full = (count >= ALMOST_FULL_THRESHOLD), (4) almost_empty = (count <= ALMOST_EMPTY_THRESHOLD).',
        'THRESHOLD PARAMETERS: ALMOST_FULL_THRESHOLD (default: DEPTH-1) and ALMOST_EMPTY_THRESHOLD (default: 1). Must satisfy: 0 <= ALMOST_EMPTY_THRESHOLD < ALMOST_FULL_THRESHOLD <= DEPTH.',
        'SIMULTANEOUS READ+WRITE: When read_en=1 and write_en=1 and FIFO is neither full nor empty: perform both operations in same cycle. Net occupancy change is zero.',
        'OVERFLOW/UNDERFLOW: Define behavior: (1) Option A: ignore operation (recommended), (2) Option B: assert error flag. Document chosen behavior.',
        'Test Case 1 - Basic FIFO Operation: DEPTH=8, WIDTH=8. Push values [0xAA, 0xBB, 0xCC]. Then pop 3 times. Expected: outputs are [0xAA, 0xBB, 0xCC] in order (FIFO property).',
        'Test Case 2 - Full Flag Boundary: DEPTH=8. Write 8 entries. Expected: full=1 after 8th write. Attempt 9th write with write_en=1. Expected: write ignored, full remains 1, count=8.',
        'Test Case 3 - Empty Flag Boundary: Start with 3 entries. Read 3 times. Expected: empty=1 after 3rd read. Attempt 4th read with read_en=1. Expected: read ignored, empty remains 1, count=0.',
        'Test Case 4 - Almost-Full Threshold: DEPTH=8, ALMOST_FULL_THRESHOLD=6. Write 6 entries. Expected: almost_full=1, full=0. Write 7th entry. Expected: almost_full=1, full=0. Write 8th entry. Expected: full=1.',
        'Test Case 5 - Almost-Empty Threshold: DEPTH=8, ALMOST_EMPTY_THRESHOLD=2, start with 3 entries. Read 1 entry (count=2). Expected: almost_empty=1, empty=0. Read another (count=1). Expected: almost_empty=1. Read last (count=0). Expected: empty=1.',
        'Test Case 6 - Simultaneous Read+Write: FIFO has 4 entries (not full, not empty). Assert read_en=1 and write_en=1 in same cycle. Expected: oldest entry read out, new entry written in, count remains 4.'
      ],
      hints: [
        'Counter method: increment on write, decrement on read, unchanged on both.',
        'Alternative: pointer comparison (full when write_ptr+1 == read_ptr).',
        'Almost flags: simple threshold comparison on count.',
      ],
    },
    {
      id: 'fifo2',
      shortName: 'Asynchronous FIFO',
      question: 'Implement Asynchronous FIFO with Clock Domain Crossing',
      description:
        'Design an asynchronous FIFO with independent read and write clocks. Use Gray code pointers and multi-stage synchronizers for metastability-safe CDC.\n\n' +
        '**Key CDC mechanism:**\n' +
        '```\nBinary ptr → Gray code → 2-stage sync → compare\nFull:  write_gray_next matches read_gray_sync (MSB inverted)\nEmpty: read_gray == write_gray_sync\n```\n\n' +
        '**Constraints:**\n' +
        '- DEPTH must be power of 2 (Gray code requirement)\n' +
        '- No phase/frequency relationship assumed between clocks\n' +
        '- N+1 bit pointers (extra bit disambiguates full vs empty)',
      difficulty: 'Hard',
      topics: ['FIFO', 'CDC', 'Metastability'],
      requirements: [
        'DUAL CLOCK DOMAINS: Two independent, asynchronous clocks: write_clk (write side) and read_clk (read side). No phase or frequency relationship assumed.',
        'PARAMETERIZATION: DEPTH (must be power of 2 for Gray code simplicity), WIDTH (data width).',
        'GRAY CODE POINTERS: Maintain binary read/write pointers in respective domains. Convert to Gray code before crossing domains. Gray code ensures only 1 bit changes per increment (glitch-free CDC).',
        'SYNCHRONIZERS: Use 2-stage (or 3-stage) synchronizer flip-flops to safely cross Gray pointers between domains. Write Gray pointer synchronized into read domain; read Gray pointer synchronized into write domain.',
        'FULL DETECTION (WRITE DOMAIN): Full when next write pointer (Gray coded) would equal synchronized read pointer with MSB inverted. Formula: full = (write_gray_next[N:N-1] == {~read_gray_sync[N], read_gray_sync[N-1:0]}).',
        'EMPTY DETECTION (READ DOMAIN): Empty when read pointer (Gray coded) equals synchronized write pointer. Formula: empty = (read_gray == write_gray_sync).',
        'MEMORY WRITE: In write_clk domain, when write_en=1 and full=0, write data to memory at write pointer (binary address).',
        'MEMORY READ: In read_clk domain, when read_en=1 and empty=0, read data from memory at read pointer (binary address). Memory can be dual-port or single-port with careful consideration.',
        'RESET STRATEGY: Separate resets for each domain (write_rst, read_rst) OR single asynchronous reset. On reset: pointers=0, synchronizer chains cleared. Both domains must reset to achieve empty state.',
        'METASTABILITY HANDLING: Synchronizer flip-flops must have no combinational logic between stages. Add timing constraints in synthesis to ensure metastability settling time.',
        'Test Case 1 - Independent Clock Frequencies: write_clk=100MHz, read_clk=75MHz. Write 10 entries at full write rate. Then read at full read rate. Expected: all 10 entries read correctly in FIFO order, no data loss, no duplicates.',
        'Test Case 2 - Full Flag Correctness: Write continuously until full flag asserts in write domain. Expected: full=1 prevents further writes. Verify no overflow. Start reading; full should eventually clear.',
        'Test Case 3 - Empty Flag Correctness: Read continuously until empty flag asserts in read domain. Expected: empty=1 prevents further reads. Verify no underflow. Start writing; empty should eventually clear.',
        'Test Case 4 - Simultaneous Operation: Write at max rate on write_clk while reading at different rate on read_clk. Expected: FIFO occupancy adjusts correctly, no corruption, flags reflect actual state.',
        'Test Case 5 - Reset Recovery: Assert reset (asynchronous or both domain resets). Release reset. Expected: both pointers at 0, empty=1, full=0. FIFO operational immediately.',
        'Test Case 6 - Gray Code Property: Instrument design to observe Gray pointer values crossing domains. Verify successive Gray values differ by exactly 1 bit (Hamming distance = 1).'
      ],
      hints: [
        'Binary to Gray: gray = (binary >> 1) ^ binary.',
        'Synchronizer: two back-to-back flip-flops, no logic between stages.',
        'Pointer width: N+1 bits for N-entry FIFO.',
      ],
    },
    {
      id: 'fifo3',
      shortName: 'FIFO with Width Conversion',
      question: 'Design FIFO with Asymmetric Read and Write Data Widths',
      description:
        'Implement a FIFO with different data widths on read and write interfaces (width conversion).\n\n' +
        '**Example:**\n' +
        '```\nWRITE_WIDTH=32, READ_WIDTH=8\nWrite 0xA1B2C3D4 → Read 4 times: [0xD4, 0xC3, 0xB2, 0xA1]\n\nWRITE_WIDTH=8, READ_WIDTH=32\nWrite [0x11, 0x22, 0x33, 0x44] → Read once: 0x44332211\n```\n\n' +
        '**Constraints:**\n' +
        '- Widths must have integer ratio\n' +
        '- Document packing order (LSB-first or MSB-first)\n' +
        '- Partial word blocking for read-wide from write-narrow',
      difficulty: 'Hard',
      topics: ['FIFO', 'Width Conversion', 'Design'],
      requirements: [
        'ASYMMETRIC WIDTHS: Write data width WRITE_WIDTH and read data width READ_WIDTH. Widths must have integer ratio: WRITE_WIDTH/READ_WIDTH = integer OR READ_WIDTH/WRITE_WIDTH = integer.',
        'WIDTH RATIO: Define RATIO. If WRITE_WIDTH > READ_WIDTH: RATIO = WRITE_WIDTH/READ_WIDTH (one write produces RATIO reads). If READ_WIDTH > WRITE_WIDTH: RATIO = READ_WIDTH/WRITE_WIDTH (RATIO writes produces one read).',
        'STORAGE GRANULARITY: Choose smallest unit as storage granularity (typically min(WRITE_WIDTH, READ_WIDTH)). Track occupancy in units of this granularity.',
        'PACKING ORDER: Define bit ordering clearly. Common: LSB-first (little-endian). For write-wide: write_data[7:0] is first byte out, write_data[15:8] is second byte. Document chosen order.',
        'WRITE-WIDE TO READ-NARROW: Example: WRITE_WIDTH=32, READ_WIDTH=8. One write stores 4 bytes. Subsequent reads return bytes in documented order (e.g., [7:0], [15:8], [23:16], [31:24]).',
        'READ-WIDE FROM WRITE-NARROW: Example: WRITE_WIDTH=8, READ_WIDTH=32. Buffer 4 writes before one complete read available. Track partial word accumulation.',
        'FULL CONDITION: Full when cannot accept another write. For write-wide: when remaining capacity < WRITE_WIDTH bits. For write-narrow: when remaining capacity < WRITE_WIDTH bits.',
        'EMPTY CONDITION: Empty when cannot provide complete read. For read-wide: when available data < READ_WIDTH bits. For read-narrow: when available data < READ_WIDTH bits.',
        'PARTIAL WORD HANDLING: When READ_WIDTH > WRITE_WIDTH and insufficient writes accumulated, read blocks (empty=1 for that read) until enough data available.',
        'FLAG GENERATION: Almost-full/almost-empty based on byte/bit occupancy, accounting for width conversion boundaries.',
        'Test Case 1 - Write-Wide to Read-Narrow: WRITE_WIDTH=32, READ_WIDTH=8. Write 0xA1B2C3D4 (one 32-bit write). Read 4 times. Expected outputs (LSB-first): [0xD4, 0xC3, 0xB2, 0xA1]. Verify order matches documented packing.',
        'Test Case 2 - Write-Narrow to Read-Wide: WRITE_WIDTH=8, READ_WIDTH=32. Write four bytes: [0x11, 0x22, 0x33, 0x44]. Read once. Expected: 0x44332211 (if LSB-first packing). Verify correct assembly.',
        'Test Case 3 - Partial Read Blocking: WRITE_WIDTH=8, READ_WIDTH=32. Write only 3 bytes [0xAA, 0xBB, 0xCC]. Attempt read. Expected: empty=1, read blocks. Write 4th byte 0xDD. Now read succeeds with 0xDDCCBBAA.',
        'Test Case 4 - Full Condition with Width Conversion: DEPTH=8 bytes, WRITE_WIDTH=32 (4 bytes). Write twice (8 bytes total). Expected: full=1. Attempt 3rd write. Expected: write blocked.',
        'Test Case 5 - Mixed Operations: Write 32-bit word, read 8-bit byte, write another 32-bit word, read three 8-bit bytes. Verify FIFO order maintained correctly across width boundaries.',
        'Test Case 6 - Alignment: WRITE_WIDTH=16, READ_WIDTH=8, DEPTH=16 bytes. Fill with 16-bit writes, drain with 8-bit reads. Verify all data retrieved correctly and flags consistent.'
      ],
      hints: [
        'Storage granularity: min(WRITE_WIDTH, READ_WIDTH).',
        'Write-wide: break into storage units, write sequentially.',
        'Read-wide: accumulate writes in shift register until complete.',
      ],
    },
  ],

  'Sequence Detectors / FSM': [
    {
      id: 'fsm1',
      shortName: 'Sequence Detector (1011)',
      question: 'Design Overlapping Sequence Detector for Pattern 1011',
      description:
        'Implement an FSM to detect binary sequence "1011" in a serial input stream with overlapping support.\n\n' +
        '**Example:**\n' +
        '```\nInput:  0 1 0 1 1 0 1 0 1 1\nDetect: _ _ _ _ ^ _ _ _ _ ^\n```\n\n' +
        '**Constraints:**\n' +
        '- Support overlapping detection\n' +
        '- Moore or Mealy (document choice)\n' +
        '- All states must have transitions for both in=0 and in=1',
      difficulty: 'Medium',
      topics: ['FSM', 'Sequence Detection', 'Design'],
      requirements: [
        'PATTERN: Detect binary sequence "1011" (four bits).',
        'OVERLAPPING SUPPORT: After detecting "1011", immediately continue looking for the next occurrence starting from the longest valid suffix. Example: input "1011011" should detect two matches (positions ending at bits 3 and 6).',
        'FSM TYPE: Can implement as Moore (output depends only on state) or Mealy (output depends on state and input). Document choice. For Mealy: detect pulse on transition. For Moore: detect asserted in detection state.',
        'INPUT: Serial input signal "in" (1 bit per clock cycle).',
        'OUTPUT: Detection signal "detect" (1-bit pulse or level depending on Moore/Mealy).',
        'RESET: Synchronous or asynchronous reset (document choice). On reset, FSM returns to initial state IDLE, detect=0.',
        'STATE ENCODING: Define states clearly. Example states: IDLE (no match), S1 (seen "1"), S10 (seen "10"), S101 (seen "101"), S1011 (complete match).',
        'COMPLETE TRANSITIONS: Every state must have defined transitions for in=0 and in=1. No incomplete state diagrams (prevents latches).',
        'Test Case 1 - Single Match: Input sequence: 0 1 0 1 1 0. Expected: detect pulses (or asserts) at cycle 4 when "1011" completes.',
        'Test Case 2 - Overlapping Sequences: Input: 1 0 1 1 1. After first "1011" at bit 3, bit 4 (another "1") should create potential for overlap. However, "10111" contains "1011" followed by "1", not another complete "1011". Verify detect pulse occurs exactly once at correct position.',
        'Test Case 3 - Multiple Non-Overlapping Matches: Input: 1 0 1 1 0 1 0 1 1. Expected: detect pulses at two positions (after 4th and 9th bits).',
        'Test Case 4 - No Match: Input: 0 0 0 1 1 0 0 (no "1011"). Expected: detect never asserts.',
        'Test Case 5 - Reset During Sequence: Input "1 0 1", then assert reset. Expected: FSM returns to IDLE, detect=0. Continue with "1 0 1 1". Expected: detect pulses at completion.',
        'Test Case 6 - Fallback Transitions: Input "1 0 1 0" (breaks sequence at 4th bit). Expected: FSM falls back to appropriate state (S10) and continues looking.'
      ],
      hints: [
        'State design for overlapping: After matching "1011", next input "1" should transition to S1 (start of potential new match), not back to IDLE.',
        'State transition table: IDLE: in=1 → S1, in=0 → IDLE. S1: in=0 → S10, in=1 → S1. S10: in=1 → S101, in=0 → IDLE. S101: in=1 → S1011 (match), in=0 → S10. S1011: in=1 → S1, in=0 → S10.',
        'Output logic (Mealy): detect = (state==S101 && in==1); Pulsed for one cycle when match completes.',
        'Output logic (Moore): Add separate DETECT state; detect = (state==DETECT); Stay for one cycle then transition based on input.',
        'Overlapping key insight: When you match "1011" and the next bit is "1", you\'ve already started matching the first "1" of the next potential sequence.',
        'Test with long input streams containing multiple overlaps: "101011011" should be carefully traced.',
        'Ensure all states reachable and no deadlocks. Draw state diagram and verify all transitions.'
      ]
    },

    {
      id: 'fsm2',
      shortName: 'Traffic Light Controller',
      question: 'Implement Traffic Light Controller Using Moore FSM',
      description:
        'Design a traffic light controller for a two-way intersection using a Moore FSM with timers.\n\n' +
        '**State sequence:**\n' +
        '```\nNS_GREEN(10cy) → NS_YELLOW(2cy) → EW_GREEN(10cy) → EW_YELLOW(2cy) → repeat\n```\n\n' +
        '**Constraints:**\n' +
        '- Moore FSM: outputs depend only on current state\n' +
        '- Never both directions green simultaneously\n' +
        '- Always transition through yellow (safety)',
      difficulty: 'Medium',
      topics: ['FSM', 'Moore Machine', 'Design'],
      requirements: [
        'MOORE FSM: Outputs (light states) depend only on current state, not on inputs. Outputs change only on state transitions (synchronous to clock).',
        'TRAFFIC DIRECTIONS: Two directions: North-South (NS) and East-West (EW). Each direction has three lights: RED, YELLOW, GREEN.',
        'STATES: Define at least 4 states: (1) NS_GREEN (NS green, EW red), (2) NS_YELLOW (NS yellow, EW red), (3) EW_GREEN (EW green, NS red), (4) EW_YELLOW (EW yellow, NS red).',
        'TIMING: Each state has a duration controlled by a timer/counter. Example: NS_GREEN lasts 10 seconds, NS_YELLOW lasts 2 seconds, EW_GREEN lasts 10 seconds, EW_YELLOW lasts 2 seconds. Parameterize or define durations.',
        'TIMER IMPLEMENTATION: Maintain a counter that counts down (or up to threshold) in each state. When timer expires, transition to next state and reset timer.',
        'STATE SEQUENCE: Normal cycle: NS_GREEN → NS_YELLOW → EW_GREEN → EW_YELLOW → (repeat). Never go directly from GREEN to RED (always through YELLOW for safety).',
        'RESET BEHAVIOR: On reset, enter a safe initial state (e.g., NS_GREEN with EW_RED, or an ALL_RED state). Timer initializes to state duration.',
        'OUTPUTS: Generate signals for each light: ns_red, ns_yellow, ns_green, ew_red, ew_yellow, ew_green. Exactly one light per direction asserted (except during all-red if implemented).',
        'NO GLITCHES: Outputs change only on clock edges (Moore property). No combinational hazards in output logic.',
        'Test Case 1 - Normal Cycle: After reset, observe state sequence: NS_GREEN (10 cycles) → NS_YELLOW (2 cycles) → EW_GREEN (10 cycles) → EW_YELLOW (2 cycles) → repeat. Verify light outputs match states.',
        'Test Case 2 - Reset Mid-Cycle: Start in NS_GREEN, wait 5 cycles. Assert reset. Expected: FSM returns to initial state (NS_GREEN or defined reset state), timer resets, correct outputs.',
        'Test Case 3 - Output Stability (Moore Property): During a state, even if there were inputs (e.g., sensor), outputs remain constant until next clock edge when state changes. Verify no glitches.',
        'Test Case 4 - Timer Boundaries: Verify timer counts correctly and transitions occur at exact cycle count. For NS_YELLOW with duration=2, verify transition happens after exactly 2 cycles.',
        'Test Case 5 - Illegal Light Combinations: Verify never both directions green simultaneously, never both directions yellow simultaneously. Only one active light per direction.'
      ],
      hints: [
        'Timer implementation: Maintain counter register. Decrement each cycle (or increment to threshold). When counter reaches 0 (or threshold), transition to next state and reload counter with next state duration.',
        'State encoding: Can use binary (2 bits for 4 states) or one-hot (4 bits). One-hot makes output decode simpler.',
        'Output assignment (Moore): In separate always_comb or assign statements, decode current state to light signals. Example: assign {ns_red, ns_yellow, ns_green} = (state==NS_GREEN) ? 3\'b001 : (state==NS_YELLOW) ? 3\'b010 : 3\'b100;',
        'State register: always_ff @(posedge clk or posedge rst) if (rst) state <= NS_GREEN; else if (timer==0) state <= next_state; Next state logic: case(state) NS_GREEN: next_state = NS_YELLOW; ...',
        'Parameterize durations: parameter NS_GREEN_TIME = 10; ... For each state transition, reload timer: timer <= (next_state==NS_GREEN) ? NS_GREEN_TIME : ...;',
        'Safety: Add assertions to check only one light per direction. Add all-red state if implementing pedestrian crossing or emergency mode.',
        'Test with different timer durations to verify correct sequence. Test reset at each state.'
      ]
    },

    

    {
      id: 'fsm3',
      shortName: 'Vending Machine FSM',
      question: 'Design Vending Machine FSM with Coin Input and Change Output',
      description:
        'Implement a vending machine FSM that accepts coins, accumulates credit, dispenses items, and provides change.\n\n' +
        '**Example:**\n' +
        '```\nItem price = 25 cents\nInsert 10c (credit=10) → Insert 25c (credit=35)\n→ Dispense + change=10c + credit=0\n```\n\n' +
        '**Constraints:**\n' +
        '- Multiple coin denominations (5c, 10c, 25c)\n' +
        '- Support multiple purchases per session\n' +
        '- Handle overpayment and invalid coins',
      difficulty: 'Hard',
      topics: ['FSM', 'State Machine', 'Design'],
      requirements: [
        'COIN INPUTS: Support multiple coin denominations (define supported coins, e.g., 5 cents, 10 cents, 25 cents). Input interface: coin_value (encoded value of inserted coin) and coin_valid (pulse indicating coin inserted).',
        'ITEM PRICE: Define item price (parameterize or fixed, e.g., 25 cents). Only one item type for simplicity, or extend to multiple items with price selection.',
        'CREDIT ACCUMULATION: Maintain internal credit register. On coin insertion (coin_valid=1), add coin_value to credit.',
        'DISPENSE LOGIC: When credit >= item_price, assert dispense output (single-cycle pulse or level until acknowledged). Reduce credit by item_price.',
        'CHANGE CALCULATION: After dispense, remaining credit becomes change. Assert change_valid and output change_amount. Change can be returned immediately or held until user requests.',
        'MULTIPLE PURCHASES: Support multiple purchases in one session. After dispensing, if credit still >= item_price, can dispense again.',
        'CREDIT REFUND (OPTIONAL): Provide mechanism to refund accumulated credit without purchase (e.g., refund button).',
        'INVALID COIN HANDLING: Define behavior for invalid coin_value (e.g., coin_value=0 or unsupported denomination). Options: ignore coin, assert error. Document choice.',
        'SIMULTANEOUS COIN INPUTS: Define behavior if coin_valid asserted for multiple cycles or with different coin_value in consecutive cycles. Typically: process each coin separately.',
        'FSM TYPE: Can be Moore or Mealy. Document: if Mealy, dispense/change may pulse on transition. If Moore, create specific DISPENSE and CHANGE states.',
        'RESET: On reset, clear credit to 0, deassert all outputs.',
        'Test Case 1 - Exact Payment: Item price = 25 cents. Insert 25-cent coin (coin_valid=1, coin_value=25). Expected: dispense=1 (single cycle or until ack), change_amount=0, credit returns to 0.',
        'Test Case 2 - Overpayment: Item price = 25 cents. Insert 10-cent coin, then insert 25-cent coin (total credit=35 cents). Expected: dispense=1, change_amount=10, credit=0 after change returned.',
        'Test Case 3 - Underpayment: Item price = 25 cents. Insert 10-cent coin (credit=10). Expected: dispense=0, credit=10, wait for more coins.',
        'Test Case 4 - Multiple Purchases: Item price = 25 cents. Insert 50-cent coin (credit=50). Expected: dispense=1 (first), credit=25, then dispense=1 (second), credit=0.',
        'Test Case 5 - Invalid Coin: Insert coin with coin_value=0 or unsupported value (e.g., 17 cents). Expected: behavior per specification (ignored, error flag, etc.).',
        'Test Case 6 - Sequential Coin Insertion: Insert 5-cent coin (credit=5), then 10-cent coin (credit=15), then 10-cent coin (credit=25). Expected: dispense after third coin, credit=0.'
      ],
      hints: [
        'Credit as state vs register: For small denominations, can use states (STATE_0, STATE_5, STATE_10, ...). For general case, use credit register (more flexible).',
        'Credit register approach: reg [CREDIT_BITS-1:0] credit; always_ff @(posedge clk) if (rst) credit <= 0; else if (coin_valid) credit <= credit + coin_value; else if (dispense) credit <= credit - ITEM_PRICE;',
        'Dispense condition: assign dispense_ready = (credit >= ITEM_PRICE); Dispense occurs when dispense_ready and in IDLE state.',
        'Change calculation: assign change = credit - ITEM_PRICE; (when dispensing) Or: when credit >= ITEM_PRICE, dispense first, then change = remaining credit.',
        'FSM states example: IDLE (waiting for coins), DISPENSE (pulsing dispense output), CHANGE (outputting change), REFUND (optional). Or simpler: single IDLE state with combinational outputs.',
        'Mealy output: assign dispense = (state==IDLE && credit>=ITEM_PRICE); assign change_valid = (state==IDLE && credit>ITEM_price && dispense); This creates pulses.',
        'Moore output: Create DISPENSE state. On credit>=ITEM_PRICE, transition to DISPENSE. In DISPENSE: assert dispense output, subtract ITEM_PRICE from credit, transition back to IDLE or CHANGE state.',
        'Multiple purchases: After dispense, re-check credit. If still >= ITEM_PRICE, dispense again (loop).',
        'Test edge cases: coin_value > ITEM_PRICE (single coin purchase), exact multiples (50 cents for 25-cent item = 2 purchases), credit accumulation over many small coins.'
      ]
    }
  ],

  'Memory / Cache': [
    {
      id: 'mem1',
      shortName: 'Single-Port Synchronous RAM',
      question: 'Implement Single-Port Synchronous RAM with Read/Write Control',
      description:
        'Design a single-port synchronous RAM with parameterizable depth and width.\n\n' +
        '**Interface:**\n' +
        '```\nWrite: write_en=1 + address + write_data → store on posedge\nRead:  read_en=1 + address → read_data (define latency)\n```\n\n' +
        '**Constraints:**\n' +
        '- Parameterizable DEPTH and WIDTH\n' +
        '- Define read latency (0-cycle or 1-cycle)\n' +
        '- Define read-during-write behavior (write-first or read-first)',
      difficulty: 'Medium',
      topics: ['Memory', 'RAM', 'Design'],
      requirements: [
        'PARAMETERIZATION: Parameters DEPTH (number of words) and WIDTH (bits per word). Address width = ceil(log2(DEPTH)).',
        'SINGLE PORT: One address port, one data input port, one data output port. Cannot read and write different addresses simultaneously (single port limitation).',
        'CONTROL SIGNALS: (1) write_en (write enable, when high with clock edge, write occurs), (2) read_en (read enable, when high, read operation occurs), (3) Optional: chip_enable (enable entire module).',
        'WRITE OPERATION: On rising clock edge when write_en=1, store write_data at address location. Write is synchronous.',
        'READ OPERATION: Define read latency. Option 1: Synchronous read (1-cycle latency): Register output. On cycle N with read_en=1, read_data valid on cycle N+1. Option 2: Combinational read (0-cycle latency): read_data updates combinationally with address. Document chosen implementation.',
        'READ-DURING-WRITE (SAME ADDRESS): Define behavior when write_en=1 and read_en=1 to same address in same cycle. Options: (1) Write-first: read returns new written data (requires forwarding), (2) Read-first: read returns old data before write, (3) Undefined: explicitly document as undefined. Common choice: write-first or read-first.',
        'RESET: Optional. If implemented, can clear memory to known state or leave undefined (faster synthesis). Document behavior.',
        'MEMORY ARRAY: Implement as reg array: reg [WIDTH-1:0] mem [0:DEPTH-1];',
        'Test Case 1 - Write Then Read: Write data=0xAA to addr=3 (cycle N). Next cycle (N+1): read addr=3 with read_en=1. If 1-cycle read latency: data valid at cycle N+2 with value 0xAA.',
        'Test Case 2 - Read Latency: For 1-cycle latency: assert read_en=1 at cycle N with addr=5. Expected: read_data valid at cycle N+1 with value from mem[5]. For 0-cycle: read_data valid same cycle.',
        'Test Case 3 - Same-Address Read-During-Write: Cycle N: write_en=1, read_en=1, addr=7, write_data=0xBB. If write-first: read_data at appropriate cycle = 0xBB. If read-first: read_data = old value of mem[7].',
        'Test Case 4 - Multiple Writes: Write addr=0 with 0x11, addr=1 with 0x22, addr=2 with 0x33. Read each back. Expected: values match written data.',
        'Test Case 5 - Address Boundaries: Write and read at addr=0 (minimum) and addr=DEPTH-1 (maximum). Verify correct operation.'
      ],
      hints: [
        'Array: reg [WIDTH-1:0] mem [0:DEPTH-1];',
        'Synchronous read: register output for 1-cycle latency.',
        'Write-first forwarding mux for same-address access.',
      ],
    },
    {
      id: 'mem2',
      shortName: 'Dual-Port RAM',
      question: 'Design Dual-Port RAM with Simultaneous Read and Write Capability',
      description:
        'Implement a dual-port RAM allowing two independent simultaneous accesses.\n\n' +
        '**Types:**\n' +
        '```\nSimple dual-port: Port A write-only, Port B read-only\nTrue dual-port:   Both ports can read or write\n```\n\n' +
        '**Constraints:**\n' +
        '- Define collision behavior (same-address R+W, W+W)\n' +
        '- Document priority for write-write collision\n' +
        '- Parameterizable DEPTH and WIDTH',
      difficulty: 'Medium',
      topics: ['Memory', 'Dual-Port', 'Design'],
      requirements: [
        'DUAL-PORT TYPES: (1) Simple Dual-Port: Port A write-only, Port B read-only. (2) True Dual-Port: Both ports can read or write independently. Document which type is implemented.',
        'PARAMETERIZATION: DEPTH (number of words), WIDTH (bits per word).',
        'PORT A INTERFACE: addr_a, write_data_a, write_en_a, read_data_a (if true dual-port), read_en_a (if true dual-port).',
        'PORT B INTERFACE: addr_b, write_data_b (if true dual-port), write_en_b (if true dual-port), read_data_b, read_en_b.',
        'INDEPENDENT OPERATION: Both ports operate independently on same clock. Can access different addresses simultaneously without conflict.',
        'SAME ADDRESS READ+WRITE: Define behavior when one port writes and other port reads same address in same cycle. Options: (1) Read returns old value (read-first), (2) Read returns new written value (write-first), (3) Undefined. Document and implement consistently.',
        'WRITE-WRITE COLLISION (TRUE DUAL-PORT ONLY): Define behavior when both ports write to same address simultaneously. Options: (1) Port A has priority (Port B write ignored), (2) Port B has priority, (3) Bitwise OR/AND (rare), (4) Assert error flag. Common: define priority and document.',
        'READ LATENCY: Define per port. Typically 1-cycle synchronous read for both ports (registered outputs).',
        'RESET: Optional. Can clear memory or leave undefined.',
        'Test Case 1 - Simultaneous R/W Different Addresses: Port A writes addr=1 with data=0xAA. Port B reads addr=2. Expected: Both operations succeed independently. Port B reads whatever is in mem[2]. No conflict.',
        'Test Case 2 - Same Address One Write One Read: Port A writes addr=3 with data=0xBB. Port B reads addr=3 simultaneously. Expected: Per documented behavior: if write-first, Port B read (after latency) returns 0xBB. If read-first, returns old value.',
        'Test Case 3 - Write-Write Collision (True Dual-Port): Both Port A and Port B write to addr=5 with different data (Port A: 0xCC, Port B: 0xDD). Expected: Memory at addr=5 contains value per priority rule (e.g., Port A priority → 0xCC stored). Optionally collision flag asserted.',
        'Test Case 4 - Independent Reads: Both ports read different addresses simultaneously. Expected: Both return correct data from respective addresses.',
        'Test Case 5 - Simple Dual-Port: Port A writes addr=7 with 0xEE. Port B reads addr=7 next cycle. Expected: Port B reads 0xEE (after write completes).'
      ],
      hints: [
        'Collision detection: wire collision = (addr_a == addr_b) && write_en_a && write_en_b;',
        'Simple dual-port is more common and resource-efficient.',
      ],
    },
    {
      id: 'mem3',
      shortName: 'Direct-Mapped Cache',
      question: 'Implement Direct-Mapped Cache with Tag, Valid, and Data Storage',
      description:
        'Design a direct-mapped cache with tag comparison for hit/miss detection.\n\n' +
        '**Address breakdown:**\n' +
        '```\n[  TAG  |  INDEX  |  OFFSET  ]\nTag: stored for comparison\nIndex: selects cache line\nOffset: selects byte within line\n```\n\n' +
        '**Constraints:**\n' +
        '- Hit: valid[index]=1 AND tag[index]=addr_tag\n' +
        '- Choose write policy (write-through or write-back)\n' +
        '- No replacement choice (direct-mapped)',
      difficulty: 'Hard',
      topics: ['Cache', 'Memory', 'Design'],
      requirements: [
        'CACHE ORGANIZATION: Direct-mapped: each memory address maps to exactly one cache line (set). Cache has NUM_LINES lines. Each line contains: (1) valid bit, (2) tag bits, (3) data block.',
        'ADDRESS BREAKDOWN: Split incoming address into three fields: (1) Offset: selects byte/word within cache line (low bits), (2) Index: selects cache line/set (middle bits), (3) Tag: stored with line for comparison (high bits). Index_bits = log2(NUM_LINES). Offset_bits = log2(LINE_SIZE). Tag_bits = ADDR_WIDTH - Index_bits - Offset_bits.',
        'HIT/MISS DETECTION: Access cache line at Index. Check: valid[Index]==1 AND tag[Index]==Address_Tag. If both true: HIT, return data. Else: MISS.',
        'CACHE LINE FILL (ON MISS): On miss, allocate cache line: (1) Set valid[Index]=1, (2) Store tag[Index]=Address_Tag, (3) Fetch data from memory and store in data[Index]. For simplicity, can implement single-word lines (LINE_SIZE=1 word) to avoid burst transfers.',
        'WRITE POLICY: Define and implement: (1) Write-Through: On write hit, update cache and immediately write to memory. On write miss, write directly to memory (with or without allocation to cache). (2) Write-Back: On write hit, update cache and set dirty bit (implement dirty bit). On eviction of dirty line, write back to memory. Document chosen policy.',
        'WRITE-ALLOCATE POLICY: On write miss: (1) Write-Allocate: Fetch line into cache then write, (2) No-Write-Allocate: Write directly to memory, don\'t allocate a cache line. Document choice.',
        'REPLACEMENT: Direct-mapped has no choice - always replace the line at computed index on miss.',
        'RESET: On reset, clear all valid bits to 0 (invalidate entire cache). Tags and data can be undefined.',
        'Test Case 1 - Cold Miss Then Hit: Access address A (maps to index I, tag T). First access: valid[I]=0, MISS. Fill cache: valid[I]=1, tag[I]=T, data[I]=memory[A]. Second access to same address A: valid[I]=1, tag[I]==T, HIT, return data[I].',
        'Test Case 2 - Conflict Miss: Access address A (index I, tag T1), fills cache. Access address B (same index I, different tag T2). Result: MISS (tag mismatch), evict A, fill with B. Access A again: MISS (tag mismatch), evict B, fill with A.',
        'Test Case 3 - Write Hit (Write-Through): Write to cached address C. Expected: cache data updated, write request to memory issued. Both cache and memory have new value.',
        'Test Case 4 - Write Miss (Write-Allocate): Write to uncached address D. Expected: MISS, fetch line from memory into cache (allocate), then write to cache. If write-through, also write to memory.',
        'Test Case 5 - Multiple Accesses: Read addr 0x100, 0x104, 0x108 (assuming they map to different indices). Each should be independent miss then hit on re-access.'
      ],
      hints: [
        'Address parsing: wire [TAG_BITS-1:0] tag = address[ADDR_WIDTH-1:ADDR_WIDTH-TAG_BITS]; wire [INDEX_BITS-1:0] index = address[ADDR_WIDTH-TAG_BITS-1:OFFSET_BITS]; wire [OFFSET_BITS-1:0] offset = address[OFFSET_BITS-1:0];',
        'Cache storage arrays: reg valid [0:NUM_LINES-1]; reg [TAG_BITS-1:0] tag_array [0:NUM_LINES-1]; reg [DATA_WIDTH-1:0] data_array [0:NUM_LINES-1];',
        'Hit detection: wire hit = valid[index] && (tag_array[index] == tag);',
        'On miss (simplified): if (!hit && access) begin valid[index] <= 1; tag_array[index] <= tag; data_array[index] <= memory_data; end',
        'Write-through: On write hit: data_array[index] <= write_data; memory_write(address, write_data);',
        'Write-back: Add dirty bit array: reg dirty [0:NUM_LINES-1]; On write hit: data_array[index] <= write_data; dirty[index] <= 1; On eviction: if (dirty[index]) memory_write(evict_addr, data_array[index]);',
        'Start with read-only cache for simplicity, then add writes. Test read-only thoroughly before adding write complexity.',
        'For multi-word lines: Implement burst fetch from memory, store multiple words per cache line, use offset to select word within line.'
      ]
    },
    {
      id: 'mem4',
      shortName: 'Write-Back Cache with Replacement',
      question: 'Design Write-Back Set-Associative Cache with LRU or FIFO Replacement',
      description:
        'Implement a set-associative cache with write-back policy, dirty bit tracking, and configurable replacement.\n\n' +
        '**Operations:**\n' +
        '```\nWrite hit:  update cache + set dirty (no memory write)\nClean eviction: no writeback needed\nDirty eviction: writeback to memory before refill\n```\n\n' +
        '**Constraints:**\n' +
        '- Set-associative with parallel tag comparison\n' +
        '- LRU or FIFO replacement (document choice)\n' +
        '- Dirty bit management for write-back',
      difficulty: 'Hard',
      topics: ['Cache', 'Replacement Policy', 'Design'],
      requirements: [
        'SET-ASSOCIATIVE: Cache divided into sets, each set has multiple ways (associativity). Example: 4-way set-associative. Address maps to set; all ways in set checked in parallel.',
        'METADATA PER LINE: Each cache line (way within set) contains: (1) valid bit, (2) dirty bit, (3) tag, (4) data, (5) replacement state (LRU bits or FIFO pointer).',
        'ADDRESS MAPPING: Index selects set. Tag compared against all ways in set. Offset selects data within line.',
        'HIT DETECTION: Hit if any way in selected set is valid and has matching tag. Identify which way hit (hit_way).',
        'WRITE-BACK POLICY: On write hit: (1) Update data in cache, (2) Set dirty bit for that line, (3) Do NOT write to memory immediately. On read/write miss with clean eviction: No writeback needed. On read/write miss with dirty eviction: Generate writeback request before refilling.',
        'DIRTY BIT MANAGEMENT: Set dirty=1 on write hit. Clear dirty=0 on line fill (new data). On eviction, if dirty=1, writeback required.',
        'REPLACEMENT POLICY: Choose LRU or FIFO, document clearly. LRU: Track access order per set, evict least recently used way. FIFO: Track insertion order per set, evict oldest inserted way.',
        'LRU IMPLEMENTATION: For each set, maintain LRU state. On hit: Update accessed way to MRU (Most Recently Used). On miss: Select LRU way as victim, update to MRU after fill.',
        'FIFO IMPLEMENTATION: For each set, maintain FIFO pointer indicating next way to replace. On fill: Use FIFO pointer way, increment pointer (circular).',
        'WRITEBACK GENERATION: On eviction of dirty line: (1) Assert writeback request, (2) Provide writeback address (victim_tag + index + offset), (3) Provide data to write back, (4) Wait for memory acknowledgment before reusing line.',
        'WRITE-ALLOCATE: On write miss, allocate line in cache (fetch from memory if needed, or just allocate), then write. Document if write-allocate or no-write-allocate.',
        'RESET: Clear all valid and dirty bits. LRU/FIFO state can reset to known initial state.',
        'Test Case 1 - Dirty Eviction: Fill set S with 4 lines (all ways occupied). Write to line in way 0 (dirty[S][0]=1). Access new address mapping to set S with different tag (miss, requires eviction). Expected: Way selected per LRU/FIFO. If victim is way 0 (dirty), writeback request generated with victim address and data. After writeback ack, new line fills way 0.',
        'Test Case 2 - Clean Eviction: Fill set S, all lines clean (dirty=0). Access new address causing eviction. Expected: Victim way selected per policy. No writeback request (clean). New line fills immediately.',
        'Test Case 3 - Replacement Determinism (LRU): Fill 4-way set with A, B, C, D in order. Access A (hit, A becomes MRU). Access new E (miss). Expected: LRU victim is B (oldest among B,C,D). E replaces B.',
        'Test Case 4 - Replacement Determinism (FIFO): Fill 4-way set with A, B, C, D in order. Access A (hit, no change to FIFO order). Access new E (miss). Expected: FIFO victim is A (first inserted). E replaces A.',
        'Test Case 5 - Write-Allocate: Write to uncached address X. Expected: MISS, allocate line in cache (may require eviction if set full), mark dirty, store written data.',
        'Test Case 6 - Multiple Writebacks: Fill set, write to multiple ways (multiple dirty). Sequential misses evict all dirty ways. Expected: Writeback requests generated for each dirty victim in correct order.'
      ],
      hints: [
        'Metadata structure: For N-way set-associative, each set has N ways. Per way: reg valid[SET][WAY]; reg dirty[SET][WAY]; reg [TAG_BITS-1:0] tag[SET][WAY]; reg [DATA_BITS-1:0] data[SET][WAY];',
        'Parallel tag comparison: For each way in set, compare tag. Generate hit vector: hit[way] = valid[set][way] && (tag[set][way] == address_tag);',
        'LRU state: For 4-way, need 2-bit counter per way (or LRU matrix). On access to way W: Set way W counter to 0 (MRU), increment others. Victim: way with max counter.',
        'FIFO pointer: reg [LOG2_WAYS-1:0] fifo_ptr[SET]; On fill to set S: victim_way = fifo_ptr[S]; fifo_ptr[S] <= (fifo_ptr[S] + 1) % NUM_WAYS;',
        'Writeback FSM: State machine to handle writeback. States: IDLE, WB_REQ (request writeback), WB_WAIT (wait for memory ack), WB_DONE. Only after WB_DONE can new line be filled.',
        'Eviction address: Construct from victim tag + set index: evict_addr = {tag[set][victim_way], set_index, offset};',
        'Integration: Build in layers: (1) Basic hit/miss without writes, (2) Add writes and dirty bits, (3) Add replacement logic, (4) Add writeback FSM.',
        'Test replacement policy thoroughly: Create access patterns that exercise LRU/FIFO victim selection. Verify deterministic behavior matches policy.'
      ]
    }
  ],

  'Counters / Registers / Shift Registers': [
    {
      id: 'counter1',
      shortName: 'N-bit Synchronous Counter',
      question: 'Design N-bit Synchronous Counter with Enable and Reset',
      description:
        'Implement a parameterizable N-bit up counter with enable and reset.\n\n' +
        '**Behavior:**\n' +
        '```\nenable=1 → count increments each cycle\nenable=0 → count holds\nWraps from 2^N-1 to 0 automatically\n```\n\n' +
        '**Constraints:**\n' +
        '- Parameterizable N (counter width)\n' +
        '- Synchronous or asynchronous reset (document choice)\n' +
        '- Modulo 2^N wraparound',
      difficulty: 'Easy',
      topics: ['Counter', 'Sequential', 'Design'],
      requirements: [
        'PARAMETERIZATION: Parameter N defines counter width (number of bits). Counter range: 0 to 2^N - 1.',
        'ENABLE CONTROL: Input signal "enable". When enable=1, counter increments on rising clock edge. When enable=0, counter holds current value.',
        'INCREMENT: Counter increments by 1 each enabled clock cycle: count <= count + 1.',
        'WRAPAROUND: When counter reaches maximum value (2^N - 1) and increments, wraps to 0 naturally (modulo 2^N arithmetic).',
        'RESET: Define reset type (synchronous or asynchronous). On reset assertion, counter initializes to 0 (or parameterizable RESET_VALUE).',
        'OUTPUT: Counter value "count" (N bits).',
        'Test Case 1 - Counting with Enable: N=4 (4-bit counter, range 0-15). Assert enable=1. After 3 clock cycles, count=3. After 10 cycles total, count=10.',
        'Test Case 2 - Hold on Disable: Count at value 5. Deassert enable (enable=0) for 2 cycles. Expected: count remains 5. Re-enable, count increments to 6.',
        'Test Case 3 - Wraparound: N=4. Count at 15 (0xF, maximum). Enable=1. Next cycle: count wraps to 0.',
        'Test Case 4 - Reset: Count at arbitrary value (e.g., 7). Assert reset. Expected: count becomes 0 (or RESET_VALUE). Release reset and enable, counting resumes from 0.',
        'Test Case 5 - Continuous Counting: Enable always high. Observe count sequence: 0,1,2,3,...,15,0,1,... for N=4.'
      ],
      hints: [
        'Synchronous counter with enable: always_ff @(posedge clk or posedge rst) if (rst) count <= 0; else if (enable) count <= count + 1;',
        'Wraparound is automatic with fixed-width arithmetic. When count=2^N-1, adding 1 results in 0 due to overflow (wraps modulo 2^N).',
        'For parameterizable reset value: parameter RESET_VALUE = 0; ... if (rst) count <= RESET_VALUE;',
        'Output: assign count_out = count; or count is directly output if register.',
        'Optional: Add terminal_count output: assign terminal_count = (count == (2**N - 1)); Pulses when counter at maximum.',
        'Test extensively: Start at reset, count through full range including wraparound, disable and re-enable at various points.'
      ]
    },

    {
      id: 'counter2',
      shortName: 'Gray-Code Counter',
      question: 'Implement Gray Code Counter',
      description:
        'Design a counter where successive values differ by exactly one bit (Hamming distance = 1).\n\n' +
        '**Conversion:**\n' +
        '```\ngray = (binary >> 1) ^ binary\n4-bit sequence: 0000,0001,0011,0010,0110,...\n```\n\n' +
        '**Constraints:**\n' +
        '- Parameterizable N-bit width\n' +
        '- Successive values differ by exactly 1 bit\n' +
        '- Useful for CDC (clock domain crossing)',
      difficulty: 'Medium',
      topics: ['Counter', 'Gray Code', 'Design'],
      requirements: [
        'GRAY CODE PROPERTY: Successive values differ by exactly 1 bit. For example, 4-bit Gray: 0000, 0001, 0011, 0010, 0110, 0111, 0101, 0100, 1100, 1101, 1111, 1110, 1010, 1011, 1001, 1000, (wrap to 0000).',
        'PARAMETERIZATION: Parameter N defines counter width.',
        'IMPLEMENTATION APPROACH: Option 1 (Recommended): Maintain binary counter internally, convert to Gray code each cycle. Option 2: Directly implement Gray sequence (complex). Document chosen approach.',
        'BINARY TO GRAY CONVERSION: Formula: gray = (binary >> 1) ^ binary; Apply to binary counter value to produce Gray output.',
        'ENABLE CONTROL: When enable=1, counter advances. When enable=0, holds current value.',
        'RESET: On reset, counter initializes to 0 (Gray code 0000...0).',
        'WRAPAROUND: After maximum Gray value, wraps back to 0.',
        'OUTPUT: Gray code counter value "gray_count" (N bits).',
        'Test Case 1 - Gray Conversion Correctness: For N=3, binary sequence 0-7 converts to Gray: 000, 001, 011, 010, 110, 111, 101, 100. Verify conversion formula produces correct Gray values.',
        'Test Case 2 - Single-Bit Change Property: Enable counter continuously. For each transition, compute Hamming distance between successive gray_count values. Expected: Hamming distance = 1 for all transitions (exactly one bit changes).',
        'Test Case 3 - Wraparound: N=4. Count through full sequence (16 values). After gray_count=1000 (Gray for binary 15), next value is 0000 (Gray for binary 0). Verify transition 1000→0000 also has Hamming distance 1.',
        'Test Case 4 - Enable Control: Count to Gray value 0011. Disable (enable=0) for 3 cycles. Expected: gray_count remains 0011. Re-enable, advances to next Gray value 0010.',
        'Test Case 5 - Reset: At arbitrary Gray count. Assert reset. Expected: gray_count=0.'
      ],
      hints: [
        'Recommended structure: Binary counter + Gray conversion. reg [N-1:0] binary_count; wire [N-1:0] gray_count = (binary_count >> 1) ^ binary_count;',
        'Binary counter: always_ff @(posedge clk) if (rst) binary_count <= 0; else if (enable) binary_count <= binary_count + 1;',
        'Gray conversion is purely combinational: assign gray = (bin >> 1) ^ bin;',
        'Why Gray code useful: In asynchronous FIFO, pointer crossing clock domains. Gray ensures if metastability occurs during transition, only 1 bit uncertain (minimizes error).',
        'Hamming distance check in testbench: function int hamming; input [N-1:0] a, b; hamming = $countones(a ^ b); endfunction Verify hamming(prev_gray, curr_gray) == 1.',
        'Alternative direct Gray counter: Use lookup table or state machine. More complex, not recommended unless specific reason.',
        'Test full cycle: For N=4, run for 16 cycles and verify complete Gray sequence.'
      ]
    },

    {
      id: 'counter3',
      shortName: 'Shift Register with Parallel Load',
      question: 'Design Shift Register with Parallel Load and Serial Output',
      description:
        'Implement a shift register supporting parallel load and serial shift with configurable direction.\n\n' +
        '**Operations:**\n' +
        '```\nload=1  → register = data_in (parallel)\nshift=1 → shift one position (serial_out = shifted bit)\nBoth=1  → load takes priority\n```\n\n' +
        '**Constraints:**\n' +
        '- Parameterizable WIDTH\n' +
        '- Define shift direction (left or right)\n' +
        '- Define load vs shift priority',
      difficulty: 'Medium',
      topics: ['Shift Register', 'Sequential', 'Design'],
      requirements: [
        'PARAMETERIZATION: Parameter WIDTH defines register width (number of bits).',
        'PARALLEL LOAD: Input "load" signal (control) and "data_in" (WIDTH bits). When load=1, entire register loaded with data_in in one clock cycle.',
        'SERIAL SHIFT: Input "shift" signal (control). When shift=1 and load=0, register shifts by one position. Define shift direction: left or right. Document choice.',
        'SHIFT DIRECTION: If shift right: LSB shifted out, MSB filled (with 0 or serial input). If shift left: MSB shifted out, LSB filled. Choose and document.',
        'SERIAL OUTPUT: Output "serial_out" (1 bit). Provides bit shifted out each shift cycle. For right shift: serial_out = register[0] (LSB). For left shift: serial_out = register[WIDTH-1] (MSB).',
        'SERIAL INPUT (OPTIONAL): Input "serial_in" (1 bit). Bit shifted into register during shift. For right shift: fills MSB. For left shift: fills LSB. If not implemented, fill with 0.',
        'CONTROL PRIORITY: Define behavior when both load=1 and shift=1 asserted simultaneously. Options: (1) Load has priority (shift ignored), (2) Shift has priority (load ignored), (3) Undefined (error). Common: load priority. Document clearly.',
        'RESET: On reset, register initializes to 0.',
        'PARALLEL OUTPUT (OPTIONAL): Output entire register value for parallel readout.',
        'Test Case 1 - Parallel Load: Load=1, data_in=0b1011 (WIDTH=4). Next cycle: register = 0b1011.',
        'Test Case 2 - Serial Shift Out: Register=0b1011, shift right. Shift=1 for 4 cycles. Expected serial_out sequence: 1, 1, 0, 1 (bits shifted out from LSB). After 4 shifts, register=0b0000 (if serial_in=0).',
        'Test Case 3 - Load Priority: Register=0b0101. Assert load=1 with data_in=0b1100 and shift=1 simultaneously. Expected: load takes priority, register=0b1100, no shift occurs.',
        'Test Case 4 - Shift with Serial Input: Register=0b0011, shift right with serial_in=1. Expected: serial_out=1 (LSB out), register becomes 0b1001 (serial_in fills MSB).',
        'Test Case 5 - Multiple Loads and Shifts: Load 0b1010, shift once (right), load 0b0110, shift twice. Verify register values at each step match expected sequence.'
      ],
      hints: [
        'Register declaration: reg [WIDTH-1:0] shift_reg;',
        'Control priority (load first): always_ff @(posedge clk) if (rst) shift_reg <= 0; else if (load) shift_reg <= data_in; else if (shift) shift_reg <= shifted_value;',
        'Shift right: shifted_value = {serial_in, shift_reg[WIDTH-1:1]}; serial_out = shift_reg[0];',
        'Shift left: shifted_value = {shift_reg[WIDTH-2:0], serial_in}; serial_out = shift_reg[WIDTH-1];',
        'If no serial_in: Use 0. shifted_value = {1\'b0, shift_reg[WIDTH-1:1]}; (shift right)',
        'Parallel output: assign parallel_out = shift_reg;',
        'Test load priority explicitly: Simultaneous load+shift case is critical corner case.',
        'Application: Serial communication (UART, SPI), data serialization/deserialization.'
      ]
    },

    {
      id: 'counter4',
      shortName: 'Parameterizable Barrel Shifter',
      question: 'Implement Parameterizable Barrel Shifter for Shift Operations',
      description:
        'Design a single-cycle barrel shifter for SLL, SRL, and SRA operations.\n\n' +
        '**Example (WIDTH=8):**\n' +
        '```\nSRL: 0x80, shift=1 → 0x40 (zero-fill MSB)\nSRA: 0x80, shift=1 → 0xC0 (sign-extend MSB)\nSLL: 0x01, shift=3 → 0x08 (zero-fill LSB)\n```\n\n' +
        '**Constraints:**\n' +
        '- Parameterizable WIDTH, shift amount = log2(WIDTH) bits\n' +
        '- Single-cycle combinational design\n' +
        '- log2(WIDTH) stages, each shifts by power-of-2',
      difficulty: 'Hard',
      topics: ['Barrel Shifter', 'Combinational', 'Design'],
      requirements: [
        'PARAMETERIZATION: Parameter WIDTH defines operand width. Shift amount width = log2(WIDTH) bits.',
        'SHIFT OPERATIONS: (1) SLL (Shift Left Logical): Fill vacated LSB positions with 0. (2) SRL (Shift Right Logical): Fill vacated MSB positions with 0. (3) SRA (Shift Right Arithmetic): Fill vacated MSB positions with sign bit (MSB of input). Document which operations implemented.',
        'SHIFT AMOUNT: Input "shift_amt" (log2(WIDTH) bits). Valid range: 0 to WIDTH-1. Define behavior for shift_amt >= WIDTH (typically: result = 0 for SLL/SRL, all sign bits for SRA).',
        'OPERATION SELECT: Input "shift_op" to select operation. Encoding example: 2\'b00=SLL, 2\'b01=SRL, 2\'b10=SRA.',
        'SINGLE CYCLE: All shift operations complete in one clock cycle (combinational logic). No multi-cycle shifting.',
        'BARREL SHIFTER STRUCTURE: Implement using staged conditional shifts (log2(WIDTH) stages). Each stage shifts by power-of-2 (1, 2, 4, 8, ...) conditioned on shift amount bits.',
        'INPUTS: data_in (WIDTH bits), shift_amt (log2(WIDTH) bits), shift_op (operation select).',
        'OUTPUT: data_out (WIDTH bits, shifted result).',
        'Test Case 1 - SLL: WIDTH=8, data_in=0b00000001 (0x01), shift_amt=3. Expected: data_out=0b00001000 (0x08, shifted left 3 positions).',
        'Test Case 2 - SRL: WIDTH=8, data_in=0b10000000 (0x80), shift_amt=1. Expected: data_out=0b01000000 (0x40, shifted right 1, MSB filled with 0).',
        'Test Case 3 - SRA: WIDTH=8, data_in=0b10000000 (0x80, -128 signed), shift_amt=1. Expected: data_out=0b11000000 (0xC0, shifted right 1, MSB filled with sign bit 1).',
        'Test Case 4 - Zero Shift: shift_amt=0 for all operations. Expected: data_out = data_in (no change).',
        'Test Case 5 - Maximum Shift: WIDTH=8, shift_amt=7. SLL: data_out=0x00 (if data_in[0]=0) or 0x80 (if data_in[0]=1). SRL: data_out=0x00 (if data_in[7]=0) or 0x01 (if data_in[7]=1). SRA: data_out=0xFF (if sign bit=1) or 0x00 (if sign bit=0).',
        'Test Case 6 - Shift Amount Boundary: WIDTH=8, shift_amt=8 (out of range). Expected: Defined behavior (all zeros for SLL/SRL, all sign for SRA, or handle as error).'
      ],
      hints: [
        'Barrel shifter stages: For WIDTH=8, need log2(8)=3 stages. Stage 0 shifts by 1 (if shift_amt[0]), stage 1 shifts by 2 (if shift_amt[1]), stage 2 shifts by 4 (if shift_amt[2]).',
        'Stage implementation example (SLL): wire [WIDTH-1:0] stage0 = shift_amt[0] ? {data_in[WIDTH-2:0], 1\'b0} : data_in; wire [WIDTH-1:0] stage1 = shift_amt[1] ? {stage0[WIDTH-3:0], 2\'b00} : stage0; wire [WIDTH-1:0] stage2 = shift_amt[2] ? {stage1[WIDTH-5:0], 4\'b0000} : stage1; assign data_out = stage2;',
        'SRL stages: Similar but shift right. Stage example: stage0 = shift_amt[0] ? {1\'b0, data_in[WIDTH-1:1]} : data_in;',
        'SRA sign extension: For SRA, fill with sign bit. sign_bit = data_in[WIDTH-1]; stage0 = shift_amt[0] ? {sign_bit, data_in[WIDTH-1:1]} : data_in;',
        'Alternative: Use Verilog shift operators if synthesizable. SLL: data_out = data_in << shift_amt; SRL: data_out = data_in >> shift_amt; SRA: data_out = $signed(data_in) >>> shift_amt;',
        'Operation select: Use case statement or mux: case(shift_op) 2\'b00: data_out = sll_result; 2\'b01: data_out = srl_result; 2\'b10: data_out = sra_result; endcase',
        'Test all shift amounts: 0, 1, WIDTH/2, WIDTH-1, WIDTH (if handling). Test all operations. Test edge cases: shift 0x00, shift 0xFF, shift with sign bit set/clear.',
        'Synthesis: Barrel shifter synthesizes to muxes. Can be area-intensive for large WIDTH. Some architectures have native barrel shifter support.'
      ]
    }
  ],

  'Pipelining / Datapath': [
    {
      id: 'pipe1',
      shortName: 'Pipelined ALU',
      question: 'Design Pipelined ALU with Hazard Detection and Forwarding',
      description:
        'Implement a multi-stage pipelined ALU with valid bit propagation, data forwarding for RAW hazards, and optional stall/flush.\n\n' +
        '**Pipeline stages:**\n' +
        '```\nStage 1 (EX): Execute operation\nStage 2 (WB): Write back result\nThroughput: 1 op/cycle after fill\n```\n\n' +
        '**Constraints:**\n' +
        '- Forwarding resolves RAW hazards without stalling\n' +
        '- Valid bit propagates through stages\n' +
        '- Flush invalidates in-flight operations',
      difficulty: 'Hard',
      topics: ['Pipeline', 'ALU', 'Hazards'],
      requirements: [
        'PIPELINE STAGES: Define number of stages (e.g., 2-stage: EX, WB or 3-stage: ID, EX, WB). Document operation of each stage. Example: Stage 1 (EX): Execute operation, Stage 2 (WB): Write back result.',
        'OPERATIONS SUPPORTED: Basic ALU ops: ADD, SUB, AND, OR, XOR, etc. Define opcode encoding.',
        'LATENCY: For N-stage pipeline, latency is N cycles (result available N cycles after input).',
        'THROUGHPUT: After pipeline fill, accept new operation every cycle (throughput = 1 operation/cycle).',
        'VALID BIT PROPAGATION: Each pipeline stage has valid bit. Input valid propagates through stages. Output result valid when WB stage valid=1.',
        'RAW HAZARD: Read-After-Write hazard occurs when later instruction reads register being written by earlier in-flight instruction.',
        'FORWARDING: Implement data forwarding (bypassing). Compare current instruction source registers against pipeline stage destination registers. If match and stage valid, forward result from later stage to earlier stage input.',
        'STALLING (OPTIONAL): If forwarding insufficient (e.g., load-use hazard), implement stall. Freeze pipeline registers until hazard resolved.',
        'FLUSH (OPTIONAL): On branch misprediction or exception, invalidate in-flight operations. Set valid bits to 0 for flushed stages.',
        'RESET: On reset, clear all valid bits and pipeline registers.',
        'Test Case 1 - Throughput: Issue independent operations back-to-back (no dependencies). After pipeline fill (N cycles), expected: one result output per cycle. For 2-stage pipeline: input ops at cycle 0,1,2,3,... Results at cycle 2,3,4,5,...',
        'Test Case 2 - RAW Hazard with Forwarding: Cycle 0: R1 = R2 + R3 (in EX). Cycle 1: R4 = R1 + R5 (in EX, needs R1 from previous). Expected: Forward R1 from WB stage to EX stage. R4 computes correctly without stall.',
        'Test Case 3 - No Hazard: Cycle 0: R1 = R2 + R3. Cycle 1: R6 = R7 + R8 (no dependency on R1). Expected: No forwarding needed, both operations complete normally.',
        'Test Case 4 - Flush: Issue op at cycle 0. At cycle 1, assert flush. Expected: Valid bits for in-flight op cleared, no result produced, pipeline ready for new input.',
        'Test Case 5 - Back-to-Back Dependent Operations: R1=A+B, R2=R1+C, R3=R2+D (chain dependency). Expected: Forwarding resolves all dependencies, operations complete with correct results at expected latency.'
      ],
      hints: [
        'Pipeline registers: For 2-stage: reg [WIDTH-1:0] ex_result, wb_result; reg ex_valid, wb_valid; reg [REG_ADDR-1:0] ex_dest, wb_dest;',
        'Valid propagation: always_ff @(posedge clk) if (rst) begin ex_valid <= 0; wb_valid <= 0; end else begin ex_valid <= input_valid; wb_valid <= ex_valid; end',
        'Forwarding logic: For operand A: if (wb_valid && wb_dest==src_a && wb_dest!=0) operand_a = wb_result; else if (ex_valid && ex_dest==src_a && ex_dest!=0) operand_a = ex_result; else operand_a = regfile[src_a];',
        'Forwarding priority: Later stages (closer to writeback) have priority (more recent data).',
        'Stall implementation: Stall signal freezes pipeline registers (clock enable=0) and prevents new input acceptance.',
        'Flush implementation: Set stage valid bits to 0. Can selectively flush stages after flush point.',
        'Test pipeline fill: First N-1 cycles produce no output (pipeline filling). Cycle N onwards: one output per cycle.',
        'Test extensively: All forwarding paths, no forwarding cases, flush during different stages, stall scenarios.'
      ]
    },

    {
      id: 'pipe2',
      shortName: 'Pipeline Registers with Flush/Stall',
      question: 'Implement Pipeline Stage Registers with Flush and Stall Controls',
      description:
        'Design pipeline registers supporting stall (hold) and flush (NOP injection).\n\n' +
        '**Behavior:**\n' +
        '```\nStall=1 → hold current value\nFlush=1 → load NOP (all writes disabled)\nBoth=1  → defined priority (document choice)\n```\n\n' +
        '**Constraints:**\n' +
        '- Define simultaneous stall+flush priority\n' +
        '- NOP: valid=0, all control writes=0\n' +
        '- Reset to safe NOP state',
      difficulty: 'Medium',
      topics: ['Pipeline', 'Control', 'Design'],
      requirements: [
        'PIPELINE REGISTER CONTENTS: Typical fields: (1) data/instruction, (2) control signals, (3) valid bit, (4) other metadata (e.g., PC, destination register).',
        'STALL OPERATION: Input "stall" signal. When stall=1, pipeline register holds current value (does not update from input). Implement as clock enable: enable = !stall. Register retains value for stall duration.',
        'FLUSH OPERATION: Input "flush" signal. When flush=1, pipeline register loads NOP/bubble values instead of input. NOP typically: valid=0, control signals=0 (no side effects).',
        'SIMULTANEOUS STALL+FLUSH: Define priority when both stall=1 and flush=1 asserted. Options: (1) Flush takes priority (overrides stall), (2) Stall takes priority (ignores flush). Common: flush priority (flush always wins). Document clearly.',
        'VALID BIT HANDLING: On normal operation: valid passes through. On flush: valid=0 (invalidate stage). On stall: valid holds.',
        'RESET: On reset, initialize register to NOP/safe state (valid=0, controls inactive).',
        'PARAMETERIZATION: Support parameterizable data width and control signal width.',
        'Test Case 1 - Stall Holds Values: Load register with instruction A and control signals. Assert stall=1 for 3 cycles. Expected: Register outputs unchanged for all 3 cycles (holds instruction A).',
        'Test Case 2 - Flush Inserts Bubble: Load register with valid instruction B. Next cycle, assert flush=1. Expected: Register outputs become NOP (valid=0, controls=0). Valid bit cleared.',
        'Test Case 3 - Normal Operation: Load instruction C into register without stall or flush. Next cycle: register outputs instruction C (passed through normally).',
        'Test Case 4 - Simultaneous Stall+Flush: Load instruction D. Assert both stall=1 and flush=1. Expected: Behavior matches documented priority. If flush priority: output is NOP. If stall priority: output is held instruction D.',
        'Test Case 5 - Sequential Operations: Load instruction E, stall for 2 cycles, flush, load instruction F. Verify correct sequence: E held, then NOP, then F.'
      ],
      hints: [
        'Pipeline register structure: reg [DATA_WIDTH-1:0] data; reg [CTRL_WIDTH-1:0] controls; reg valid;',
        'Stall implementation (clock enable): always_ff @(posedge clk) if (rst) ... else if (!stall) data <= input_data; // Only update when not stalled',
        'Flush implementation (mux before register): wire [DATA_WIDTH-1:0] reg_input = flush ? NOP_DATA : normal_input; always_ff @(posedge clk) if (rst) data <= NOP_DATA; else if (!stall) data <= reg_input;',
        'Combined stall+flush (flush priority): always_ff @(posedge clk) if (rst) begin data <= NOP; valid <= 0; end else if (flush) begin data <= NOP; valid <= 0; end else if (!stall) begin data <= input_data; valid <= input_valid; end // else: stall, retain current value',
        'NOP values: Define clearly. Typically: all control signals that cause state changes set to 0. valid=0. Data can be don\'t care or 0.',
        'Alternative (stall priority): Swap order of flush and stall checks in always_ff block.',
        'Test priority explicitly: This is a common source of bugs in pipeline control. Create testbench case specifically for stall=1 and flush=1.',
        'Document behavior: Add comments in code explaining chosen priority and NOP definition.'
      ]
    },

    {
      id: 'pipe3',
      shortName: 'Priority Encoder',
      question: 'Build Priority Encoder for Pipeline Resource Selection',
      description:
        'Implement a priority encoder selecting the highest-priority asserted bit from an N-bit request vector.\n\n' +
        '**Example (LSB-first):**\n' +
        '```\nrequest=0b00101100 → index=2, valid=1\nrequest=0b00000000 → index=0, valid=0\n```\n\n' +
        '**Constraints:**\n' +
        '- Parameterizable N-bit input\n' +
        '- Document priority direction (MSB or LSB first)\n' +
        '- Purely combinational',
      difficulty: 'Medium',
      topics: ['Priority Encoder', 'Combinational', 'Design'],
      requirements: [
        'INPUT: Request vector (N bits). Each bit represents a request. request[i]=1 means requester i is requesting.',
        'PRIORITY DIRECTION: Define priority direction clearly. Common: (1) LSB has highest priority (index 0 highest), (2) MSB has highest priority (index N-1 highest). Document choice.',
        'OUTPUTS: (1) index (log2(N) bits): Index of highest-priority asserted request, (2) valid (1 bit): Indicates at least one request present. valid=1 if any request bit set, valid=0 if all zero.',
        'ZERO INPUT: When request vector is all zeros (no requests), valid=0. Index output should be a defined value (typically 0) or don\'t care. Document behavior.',
        'MULTIPLE REQUESTS: When multiple requests asserted, select highest-priority according to defined direction. Lower-priority requests ignored.',
        'COMBINATIONAL LOGIC: Priority encoder is purely combinational (no clock, no state).',
        'PARAMETERIZATION: Parameter N for number of requesters.',
        'Test Case 1 - Single Request: request = 0b00001000 (bit 3 set), priority=LSB-first. Expected: index=3, valid=1.',
        'Test Case 2 - Multiple Requests LSB Priority: request = 0b00101100 (bits 2,3,5 set), priority=LSB-first (bit 0 highest). Expected: index=2 (lowest set bit), valid=1.',
        'Test Case 3 - Multiple Requests MSB Priority: request = 0b00101100 (bits 2,3,5 set), priority=MSB-first (bit N-1 highest). Expected: index=5 (highest set bit), valid=1.',
        'Test Case 4 - All Zeros: request = 0b00000000. Expected: valid=0, index=0 (or defined value).',
        'Test Case 5 - All Ones: request = 0b11111111, priority=LSB-first. Expected: index=0, valid=1.'
      ],
      hints: [
        'LSB-first priority encoder: for (i=0; i<N; i++) if (request[i]) begin index=i; valid=1; break; end Scan from LSB to MSB, take first set bit.',
        'MSB-first priority encoder: for (i=N-1; i>=0; i--) if (request[i]) begin index=i; valid=1; break; end Scan from MSB to LSB.',
        'SystemVerilog implementation (LSB): always_comb begin index = 0; valid = 0; for (int i=0; i<N; i++) if (request[i]) begin index = i; valid = 1; break; end end',
        'Alternative (casez): casez (request) 8\'b???????1: index = 0; 8\'b??????10: index = 1; 8\'b?????100: index = 2; ... endcase (LSB priority)',
        'Valid flag: assign valid = |request; (OR reduction)',
        'One-hot grant output (optional): reg [N-1:0] grant; always_comb grant = (valid) ? (1 << index) : 0; Converts index to one-hot.',
        'Test all patterns: single bit, multiple bits, no bits, all bits. Verify priority direction is correct.',
        'Application: Use in arbiters (select which requester gets grant), issue queues (select ready instruction), functional unit allocation.'
      ]
    }
  ],

  'Arithmetic Modules': [
    {
      id: 'arith1',
      shortName: 'N-bit Adder/Subtractor',
      question: 'Design Parameterizable N-bit Adder/Subtractor with Overflow Detection',
      description:
        'Implement a combinational adder/subtractor with optional overflow and carry flags.\n\n' +
        '**Operation:**\n' +
        '```\nsub=0: result = A + B\nsub=1: result = A + ~B + 1 (two\'s complement)\n```\n\n' +
        '**Constraints:**\n' +
        '- Parameterizable WIDTH\n' +
        '- Signed overflow: (A_sign == B_sign) && (A_sign != result_sign)\n' +
        '- Carry/borrow flag from MSB addition',
      difficulty: 'Medium',
      topics: ['Arithmetic', 'Adder', 'Design'],
      requirements: [
        'PARAMETERIZATION: Parameter WIDTH defines operand width (N bits).',
        'OPERATION CONTROL: Input "sub" (1 bit). sub=0: perform addition (A+B). sub=1: perform subtraction (A-B).',
        'ADDITION: result = A + B. Straightforward addition.',
        'SUBTRACTION: Implement using two\'s complement. result = A + (~B + 1) = A + (~B) + carry_in. Set carry_in=1 for subtraction.',
        'OUTPUTS: (1) result (WIDTH bits): sum or difference, (2) Optional: carry_out (1 bit): carry from MSB addition, (3) Optional: overflow (1 bit): signed overflow detection.',
        'CARRY/BORROW: For addition: carry_out is carry from MSB. For subtraction: carry_out interpretation as borrow (inverted logic). Document meaning.',
        'SIGNED OVERFLOW: Overflow occurs for signed operations when: (1) Adding two positive numbers yields negative result, (2) Adding two negative numbers yields positive result. Overflow formula: overflow = (A_sign == B_sign) && (A_sign != result_sign).',
        'UNSIGNED OVERFLOW: Detected by carry_out. For addition: overflow if carry_out=1. For subtraction: underflow if carry_out=0 (borrow occurred).',
        'Test Case 1 - Addition: WIDTH=8, A=10 (0x0A), B=3 (0x03), sub=0. Expected: result=13 (0x0D), carry_out=0 (no carry).',
        'Test Case 2 - Subtraction: WIDTH=8, A=10 (0x0A), B=3 (0x03), sub=1. Expected: result=7 (0x07), carry_out=1 (no borrow in unsigned).',
        'Test Case 3 - Signed Overflow Addition: WIDTH=8 (signed range -128 to +127), A=127 (0x7F), B=1 (0x01), sub=0. Expected: result=128 (0x80, wraps to -128), overflow=1.',
        'Test Case 4 - Signed Overflow Subtraction: WIDTH=8, A=-128 (0x80), B=1 (0x01), sub=1. Expected: result=-129 (wraps to +127, 0x7F), overflow=1.',
        'Test Case 5 - No Overflow: WIDTH=8, A=50 (0x32), B=20 (0x14), sub=0. Expected: result=70 (0x46), overflow=0, carry_out=0.'
      ],
      hints: [
        'Addition: assign {carry_out, result} = A + B; Use WIDTH+1 bits to capture carry.',
        'Subtraction: assign {carry_out, result} = A + (~B) + 1; Equivalent to A - B.',
        'Combined adder/subtractor: wire [WIDTH-1:0] B_mux = sub ? ~B : B; wire carry_in = sub ? 1\'b1 : 1\'b0; assign {carry_out, result} = A + B_mux + carry_in;',
        'Overflow detection (signed): wire overflow = (A[WIDTH-1] == B_mux[WIDTH-1]) && (A[WIDTH-1] != result[WIDTH-1]);',
        'Carry meaning: For add, carry_out=1 means unsigned overflow. For sub, carry_out=0 means unsigned underflow (borrow). Can invert for subtraction: borrow = ~carry_out.',
        'Test signed and unsigned cases separately: Signed overflow with positive/negative operands. Unsigned overflow with max values.',
        'Application: Used in ALUs, address calculation, loop counters.'
      ]
    },

    {
      id: 'arith2',
      shortName: 'Multiplier',
      question: 'Implement Multiplier using Sequential or Combinational Method',
      description:
        'Design a multiplier producing 2*WIDTH-bit result from two WIDTH-bit operands.\n\n' +
        '**Options:**\n' +
        '```\nSequential: shift-and-add, ~WIDTH cycles, small area\nCombinational: single-cycle, larger area\nPipelined: multi-stage, high throughput\n```\n\n' +
        '**Constraints:**\n' +
        '- Result is 2*WIDTH bits (no truncation)\n' +
        '- Handshake interface for sequential: start, busy, done\n' +
        '- Support back-to-back operations',
      difficulty: 'Hard',
      topics: ['Arithmetic', 'Multiplier', 'Design'],
      requirements: [
        'PARAMETERIZATION: Parameter WIDTH defines operand width. Result width is 2*WIDTH to hold full product without truncation.',
        'IMPLEMENTATION CHOICE: Choose method and document: (1) Sequential: Multi-cycle, uses shift-and-add algorithm, (2) Combinational: Single-cycle, larger area (Wallace tree, array), (3) Pipelined: Multi-stage, combines area and throughput. Document chosen method.',
        'SEQUENTIAL MULTIPLIER: If chosen: (1) Inputs: A, B (WIDTH bits each), start (begin multiplication), (2) Outputs: result (2*WIDTH bits), done (completion signal), busy (operation in progress), (3) Latency: Typically WIDTH cycles for radix-2 shift-and-add.',
        'COMBINATIONAL MULTIPLIER: If chosen: (1) Inputs: A, B (WIDTH bits), (2) Output: result (2*WIDTH bits), (3) Latency: 0 cycles (combinational), result available same cycle.',
        'HANDSHAKE (SEQUENTIAL): Start signal initiates operation. Busy asserted during computation. Done pulses for one cycle when result valid. Support back-to-back operations.',
        'ALGORITHM (SEQUENTIAL): Shift-and-add: Initialize accumulator=0. For each bit of multiplier B (LSB to MSB): if bit=1, add multiplicand A to accumulator. Shift accumulator and multiplicand. Repeat WIDTH times.',
        'RESULT SIZE: Must be 2*WIDTH bits to avoid overflow. For WIDTH=8: 255*255=65025 requires 16 bits.',
        'RESET: For sequential: On reset, clear busy, done, internal state. For combinational: Not applicable.',
        'Test Case 1 - Basic Multiplication: WIDTH=8, A=3, B=7. Expected: result=21 (0x0015). For sequential: after ~8 cycles, done=1, result valid.',
        'Test Case 2 - Zero Operand: A=0, B=any value (or vice versa). Expected: result=0. For sequential: completes in defined cycle count.',
        'Test Case 3 - Maximum Values: WIDTH=8, A=255 (0xFF), B=255. Expected: result=65025 (0xFE01, fits in 16 bits, no overflow).',
        'Test Case 4 - Back-to-Back (Sequential): Start first multiply (A=5, B=4). After done, immediately start second multiply (A=6, B=3) next cycle. Expected: Both results correct (20, 18), timing proper.',
        'Test Case 5 - Power of Two: A=16 (0x10), B=4 (0x04). Expected: result=64 (0x0040). Verify shift-based patterns work correctly.'
      ],
      hints: [
        'Sequential shift-and-add: reg [2*WIDTH-1:0] accumulator; reg [WIDTH-1:0] multiplicand, multiplier; reg [CTR_BITS-1:0] count; On start: multiplicand=A, multiplier=B, accumulator=0, count=0, busy=1. Each cycle: if (multiplier[0]) accumulator += multiplicand; multiplicand <<= 1; multiplier >>= 1; count++; If count==WIDTH: done=1, busy=0.',
        'Accumulator size: Must be 2*WIDTH to hold full product. Partial products accumulate without overflow.',
        'Combinational (simple): assign result = A * B; Let synthesis tool infer multiplier. Works for moderate WIDTH. Large WIDTH may not meet timing.',
        'Wallace tree: Reduces partial products using carry-save adders in tree structure. Complex to hand-code, usually generated.',
        'Pipelined: Break multiplication into stages (partial product generation, reduction, final addition). Increases throughput, maintains area efficiency.',
        'Test edge cases: 0*X, X*0, 1*X, X*1 (identity), maximum values, powers of two.',
        'Signed vs unsigned: Default unsigned. For signed, use Booth encoding or convert to unsigned (sign-magnitude), multiply, adjust sign.',
        'Application: Used in DSP, graphics, cryptography. Sequential for area-constrained, combinational/pipelined for high-performance.'
      ]
    },

    {
      id: 'arith3',
      shortName: 'Sequential Divider',
      question: 'Design Sequential Divider using Restoring or Non-Restoring Algorithm',
      description:
        'Implement a sequential divider computing quotient and remainder.\n\n' +
        '**Example (WIDTH=8):**\n' +
        '```\n20 / 5 → quotient=4, remainder=0\n22 / 5 → quotient=4, remainder=2\n7 / 0  → divide_by_zero=1\n```\n\n' +
        '**Constraints:**\n' +
        '- Typically WIDTH+1 cycles\n' +
        '- Handshake: start, busy, done\n' +
        '- Define divide-by-zero behavior',
      difficulty: 'Hard',
      topics: ['Arithmetic', 'Divider', 'Design'],
      requirements: [
        'PARAMETERIZATION: Parameter WIDTH defines operand width. Dividend and divisor are WIDTH bits. Quotient and remainder are WIDTH bits.',
        'ALGORITHM: Choose restoring division or non-restoring division. Document choice. Restoring is simpler and recommended. Typical cycle count: WIDTH+1 cycles.',
        'INPUTS: dividend (WIDTH bits), divisor (WIDTH bits), start (initiate division).',
        'OUTPUTS: quotient (WIDTH bits), remainder (WIDTH bits), done (completion pulse), divide_by_zero (error flag).',
        'DIVIDE-BY-ZERO: When divisor=0, division undefined. Define behavior: (1) Assert divide_by_zero flag=1, (2) Set quotient and remainder to defined values (e.g., quotient=all 1s, remainder=dividend), (3) Complete operation without computing (don\'t hang).',
        'SIGNED VS UNSIGNED: Choose and document. Unsigned is simpler. Signed requires handling signs separately, dividing absolute values, adjusting sign of quotient/remainder at end.',
        'HANDSHAKE: Start initiates operation. Busy during computation. Done pulses when complete. Support back-to-back operations.',
        'RESTORING DIVISION ALGORITHM: (1) Initialize remainder=0, quotient=0. (2) For each bit position (MSB to LSB of quotient): Shift remainder left, bring in next dividend bit from MSB. Subtract divisor from remainder. If result >= 0: set quotient bit=1, keep new remainder. Else: restore remainder (add divisor back), set quotient bit=0. (3) Repeat WIDTH times.',
        'CYCLE COUNT: Typically WIDTH iterations + overhead = WIDTH+1 to WIDTH+2 cycles.',
        'Test Case 1 - Exact Division: WIDTH=8, dividend=20 (0x14), divisor=5 (0x05). Expected: quotient=4, remainder=0, divide_by_zero=0.',
        'Test Case 2 - Non-Exact Division: dividend=22 (0x16), divisor=5 (0x05). Expected: quotient=4, remainder=2.',
        'Test Case 3 - Divide by Zero: dividend=7, divisor=0. Expected: divide_by_zero=1, quotient and remainder per defined spec (e.g., quotient=0xFF, remainder=0x07).',
        'Test Case 4 - Divisor Greater Than Dividend: dividend=3, divisor=10. Expected: quotient=0, remainder=3.',
        'Test Case 5 - Maximum Dividend: dividend=255 (0xFF), divisor=1. Expected: quotient=255, remainder=0.',
        'Test Case 6 - Back-to-Back Operations: First: 20/5. After done, immediately start 22/5. Verify both results correct.'
      ],
      hints: [
        'Restoring division state machine: States: IDLE, COMPUTE, DONE. In COMPUTE: Iterate WIDTH times, performing shift-subtract-restore steps. Track iteration with counter.',
        'Registers: reg [WIDTH-1:0] quotient, remainder, divisor_reg, dividend_reg; reg [CTR_BITS-1:0] count; On start: divisor_reg=divisor, dividend_reg=dividend, remainder=0, quotient=0, count=0, busy=1.',
        'Iteration step: remainder = {remainder[WIDTH-2:0], dividend_reg[WIDTH-1]}; // Shift left and bring in next dividend bit dividend_reg <<= 1; wire [WIDTH:0] sub_result = {1\'b0, remainder} - {1\'b0, divisor_reg}; if (!sub_result[WIDTH]) begin // No borrow, result positive remainder = sub_result[WIDTH-1:0]; quotient = {quotient[WIDTH-2:0], 1\'b1}; end else begin quotient = {quotient[WIDTH-2:0], 1\'b0}; // Remainder already restored (unchanged) end count++;',
        'Divide-by-zero check: At start, if (divisor==0) set divide_by_zero=1, skip computation, set quotient/remainder to defined values, assert done.',
        'Signed division: Determine signs of inputs. If dividend or divisor negative, convert to positive (two\'s complement). Divide absolute values. Adjust quotient sign: negative if signs differ. Adjust remainder sign: same as dividend.',
        'Test small values and edge cases: 0/X (quotient=0, remainder=0), X/1 (quotient=X, remainder=0), X/X (quotient=1, remainder=0), 1/X where X>1 (quotient=0, remainder=1).',
        'Application: Integer division in CPUs, fixed-point arithmetic, modulo operations.'
      ]
    }
  ],

  'Interfaces / Bus / AXI / APB': [
    {
      id: 'bus1',
      shortName: 'Memory-Mapped GPIO',
      question: 'Implement Memory-Mapped GPIO Module with Direction Control',
      description:
        'Design a memory-mapped GPIO peripheral with register-based control.\n\n' +
        '**Register map:**\n' +
        '```\n0x00: GPIO_OUT  (output data)\n0x04: GPIO_IN   (input data, read-only)\n0x08: GPIO_DIR  (direction: 1=output, 0=input per bit)\n```\n\n' +
        '**Constraints:**\n' +
        '- Parameterizable GPIO_WIDTH\n' +
        '- Output pins driven when dir=1, high-Z when dir=0\n' +
        '- Define invalid address behavior',
      difficulty: 'Medium',
      topics: ['GPIO', 'Memory-Mapped', 'Design'],
      requirements: [
        'REGISTER MAP: Define memory-mapped registers with specific addresses. Example: (1) GPIO_OUT (offset 0x00): Output data register (write to drive outputs), (2) GPIO_IN (offset 0x04): Input data register (read to sample inputs), (3) GPIO_DIR (offset 0x08): Direction control register (1=output, 0=input per bit).',
        'NUMBER OF PINS: Parameterize GPIO_WIDTH (number of GPIO pins, e.g., 8, 16, 32).',
        'BUS INTERFACE: Simple memory-mapped interface: (1) address (input), (2) write_data (input), (3) write_en (input), (4) read_en (input), (5) read_data (output).',
        'WRITE OPERATION: When write_en=1, decode address to determine target register. Update corresponding register with write_data.',
        'READ OPERATION: When read_en=1, decode address to determine source register. Output register value on read_data.',
        'DIRECTION CONTROL: Each GPIO pin has direction bit in GPIO_DIR. If dir[i]=1, pin i is output (driven by GPIO_OUT[i]). If dir[i]=0, pin i is input (GPIO_IN[i] samples external pin).',
        'OUTPUT DRIVE: For output pins (dir[i]=1), drive gpio_pins[i] with GPIO_OUT[i]. For input pins (dir[i]=0), gpio_pins[i] is high-Z or input (don\'t drive).',
        'INPUT SAMPLING: GPIO_IN register samples gpio_pins values. For input pins (dir[i]=0), GPIO_IN[i] = gpio_pins[i]. For output pins, GPIO_IN can be don\'t care or loopback (GPIO_IN[i] = GPIO_OUT[i]).',
        'INVALID ADDRESS: Define behavior for access to unmapped address. Options: (1) Return 0 on read, ignore write, (2) Assert error signal. Document choice.',
        'RESET: On reset, initialize registers: GPIO_OUT=0, GPIO_DIR=0 (all inputs), GPIO_IN=sampled values.',
        'Test Case 1 - Write Then Readback: Write 0x5A to GPIO_OUT (address 0x00). Read from address 0x00. Expected: read_data=0x5A.',
        'Test Case 2 - Direction Control: Set GPIO_DIR=0xFF (all outputs). Write GPIO_OUT=0xAA. Expected: gpio_pins outputs driven with 0xAA (on output-enabled pins).',
        'Test Case 3 - Input Sampling: Set GPIO_DIR=0x00 (all inputs). External gpio_pins driven with 0x33. Read GPIO_IN. Expected: read_data=0x33.',
        'Test Case 4 - Mixed Direction: GPIO_DIR=0xF0 (upper 4 bits output, lower 4 input). GPIO_OUT=0xA5. External gpio_pins[3:0]=0x3. Expected: gpio_pins[7:4] driven with 0xA. GPIO_IN read returns 0xA3.',
        'Test Case 5 - Invalid Address: Write to address 0x0C (unmapped). Read from address 0x0C. Expected: Write ignored, read returns 0 (or error flag per spec).'
      ],
      hints: [
        'Register declarations: reg [GPIO_WIDTH-1:0] gpio_out, gpio_dir; wire [GPIO_WIDTH-1:0] gpio_in;',
        'Address decode (write): always_ff @(posedge clk) if (write_en) case (address) ADDR_GPIO_OUT: gpio_out <= write_data[GPIO_WIDTH-1:0]; ADDR_GPIO_DIR: gpio_dir <= write_data[GPIO_WIDTH-1:0]; endcase',
        'Address decode (read): always_comb case (address) ADDR_GPIO_OUT: read_data = gpio_out; ADDR_GPIO_IN: read_data = gpio_in; ADDR_GPIO_DIR: read_data = gpio_dir; default: read_data = 0; // Invalid address endcase',
        'GPIO pin direction: for (i=0; i<GPIO_WIDTH; i++) assign gpio_pins[i] = gpio_dir[i] ? gpio_out[i] : 1\'bz; // Output if dir=1, else high-Z',
        'Input sampling: assign gpio_in = gpio_pins; // Sample external pins',
        'Byte enables (optional): Support write_byte_en for partial register writes. Example: if (write_byte_en[0]) gpio_out[7:0] <= write_data[7:0];',
        'Read latency: Can be combinational (read_data updates same cycle) or registered (1-cycle latency). Document.',
        'Application: GPIO used for LED control, button input, external peripheral interfacing in embedded systems.'
      ]
    },

    {
      id: 'bus2',
      shortName: 'APB Slave Peripheral',
      question: 'Design APB Slave Peripheral Following AMBA APB Protocol',
      description:
        'Implement an APB slave compliant with AMBA APB two-phase transfer protocol.\n\n' +
        '**Transfer phases:**\n' +
        '```\nSetup:  PSEL=1, PENABLE=0 (decode address)\nEnable: PSEL=1, PENABLE=1 (transfer when PREADY=1)\n```\n\n' +
        '**Constraints:**\n' +
        '- Two-phase transfer: setup + enable\n' +
        '- PREADY for wait states\n' +
        '- PSLVERR for error response',
      difficulty: 'Hard',
      topics: ['APB', 'Protocol', 'Design'],
      requirements: [
        'APB SIGNALS: Implement required APB slave signals: (1) PSEL (slave select), (2) PENABLE (enable phase), (3) PWRITE (write=1, read=0), (4) PADDR (address), (5) PWDATA (write data), (6) PRDATA (read data output), (7) PREADY (ready output, slave controls), (8) PSLVERR (error response output, optional).',
        'TWO-PHASE TRANSFER: APB uses two phases: (1) Setup phase: PSEL=1, PENABLE=0. Slave decodes address, prepares for transfer. (2) Enable phase: PSEL=1, PENABLE=1. Transfer completes when PREADY=1.',
        'WRITE TRANSFER: Setup: PSEL=1, PENABLE=0, PWRITE=1, PADDR valid, PWDATA valid. Enable: PENABLE=1. Slave samples PWDATA when PSEL=1, PENABLE=1, PREADY=1.',
        'READ TRANSFER: Setup: PSEL=1, PENABLE=0, PWRITE=0, PADDR valid. Enable: PENABLE=1. Slave drives PRDATA. Transfer completes when PSEL=1, PENABLE=1, PREADY=1.',
        'PREADY CONTROL: Slave asserts PREADY=1 when ready to complete transfer. Can hold PREADY=0 to insert wait states (extend enable phase). Master waits until PREADY=1.',
        'PSLVERR: Slave asserts PSLVERR=1 to indicate error (e.g., invalid address, write to read-only register). PSLVERR sampled on final transfer cycle (PSEL=1, PENABLE=1, PREADY=1).',
        'REGISTER MAP: Define internal registers with addresses. Example: REG0 (read/write), REG1 (read-only), REG2 (write-only).',
        'ADDRESS DECODE: In setup phase, decode PADDR to determine target register. Prepare data for read or register write for write.',
        'ZERO WAIT STATE: If slave always ready, assert PREADY=1 continuously. Transfer completes in 2 cycles (setup + enable).',
        'MULTI-CYCLE: If slave needs time (e.g., memory access), hold PREADY=0 in enable phase until ready, then assert PREADY=1.',
        'RESET: On reset, deassert PREADY, PSLVERR. Internal registers reset to defined values.',
        'Test Case 1 - APB Write (Zero Wait): Cycle 0: PSEL=1, PENABLE=0, PWRITE=1, PADDR=0x00, PWDATA=0xAA (setup). Cycle 1: PENABLE=1, PREADY=1 (enable completes). Expected: REG0 updated to 0xAA after cycle 1.',
        'Test Case 2 - APB Read (Zero Wait): Cycle 0: PSEL=1, PENABLE=0, PWRITE=0, PADDR=0x00 (setup). Cycle 1: PENABLE=1, PREADY=1, PRDATA valid with REG0 value. Expected: Master samples PRDATA at cycle 1.',
        'Test Case 3 - Wait States: Cycle 0: setup phase. Cycle 1: PENABLE=1, PREADY=0 (wait). Cycle 2: PREADY=0 (wait). Cycle 3: PREADY=1 (complete). Expected: Transfer completes at cycle 3.',
        'Test Case 4 - Error Response: Write to invalid address 0xFF. Expected: PSLVERR=1 asserted when transfer completes (PENABLE=1, PREADY=1).',
        'Test Case 5 - Back-to-Back Transfers: Write to REG0, then immediately read from REG1 (no idle cycles). Expected: Both transfers complete correctly with proper setup/enable phases.'
      ],
      hints: [
        'APB slave FSM: States not strictly required, but can use: IDLE, SETUP, ENABLE. Or handle with combinational logic based on PSEL and PENABLE.',
        'Transfer completion condition: (PSEL && PENABLE && PREADY) is the condition for actual data transfer (write sample or read valid).',
        'Write logic: always_ff @(posedge clk) if (PSEL && PENABLE && PREADY && PWRITE) case(PADDR) ADDR_REG0: reg0 <= PWDATA; ... endcase',
        'Read logic: always_comb case(PADDR) ADDR_REG0: PRDATA = reg0; ADDR_REG1: PRDATA = reg1; default: PRDATA = 0; endcase',
        'PREADY generation: If always ready: assign PREADY = 1; If multi-cycle: Use counter or FSM to control PREADY timing.',
        'PSLVERR: Generate based on address decode. wire addr_valid = (PADDR == ADDR_REG0) || (PADDR == ADDR_REG1) || ...; assign PSLVERR = PSEL && PENABLE && !addr_valid;',
        'PSLVERR timing: Only meaningful when PSEL=1 and PENABLE=1 (enable phase). Should be low otherwise.',
        'Important: PRDATA must be driven during read transfers (PWRITE=0). Can be don\'t care during writes.',
        'Test protocol thoroughly: Verify setup phase precedes enable, verify PREADY wait states work, verify back-to-back transfers.',
        'APB specification: Refer to ARM AMBA APB Protocol Specification for detailed timing diagrams.'
      ]
    },

    {
      id: 'bus3',
      shortName: 'AXI-Lite Single Register',
      question: 'Build AXI-Lite Single Register Slave',
      description:
        'Implement an AXI-Lite slave with one 32-bit register at address 0x00.\n\n' +
        '**Channels:**\n' +
        '```\nWrite: AW(addr) + W(data) → B(response)\nRead:  AR(addr) → R(data+response)\nAW and W may arrive in any order\n```\n\n' +
        '**Constraints:**\n' +
        '- All five AXI-Lite channels with VALID/READY handshake\n' +
        '- AW and W are independent (may arrive in either order)\n' +
        '- Hold BVALID/RVALID until accepted',
      difficulty: 'Medium',
      topics: ['AXI', 'RTL', 'Registers'],
      requirements: [
      'AXI-LITE CHANNELS: Implement AW, W, B, AR, and R channels with VALID/READY handshaking.',
      'SINGLE REGISTER: Support one 32-bit register mapped at address 0x00.',
      'WRITE TRANSACTION: Accept AW and W in any order. Perform register write only after both address and data are received.',
      'READ TRANSACTION: On AR handshake, return register value on R channel.',
      'WRITE RESPONSE: After successful write, assert BVALID with BRESP=2\'b00.',
      'READ RESPONSE: After successful read, assert RVALID with RRESP=2\'b00.',
      'CHANNEL INDEPENDENCE: AW and W channels are independent and may arrive in different cycles.',
      'BACKPRESSURE: Hold BVALID until BREADY is asserted. Hold RVALID until RREADY is asserted.',
      'RESET: Clear register and deassert all response valids on reset.',
      'Test Case 1 - Simple Write: Write 0x12345678 to address 0x00. Expected: internal register updates correctly.',
      'Test Case 2 - Simple Read: Read from address 0x00 after write. Expected: RDATA returns stored register value.',
      'Test Case 3 - AW before W: Address arrives first, data arrives later. Expected: write still completes correctly.',
      'Test Case 4 - W before AW: Data arrives first, address arrives later. Expected: write still completes correctly.',
      'Test Case 5 - Backpressure on R: Slave asserts RVALID but master delays RREADY. Expected: RVALID remains asserted until handshake.'
      ],
      hints: [
      'Track address and data reception separately using flags like aw_done and w_done.',
      'Latch AWADDR when AWVALID && AWREADY, latch WDATA when WVALID && WREADY.',
      'Perform write only when both address and data have been accepted.',
      'For reads, latch ARADDR on handshake and drive RDATA from register.',
      'Keep BVALID high until BREADY, and RVALID high until RREADY.',
      'Use simple decode: only address 0x00 is valid.'
    ]
    },
    {
      id: 'bus4',
      shortName: 'AXI GPIO',
      question: 'Build AXI-Lite GPIO Peripheral',
      description:
        'Implement an AXI-Lite GPIO with output register (0x00) and input register (0x04).\n\n' +
        '**Register map:**\n' +
        '```\n0x00: gpio_out (read/write)\n0x04: gpio_in  (read-only, write returns error or ignored)\n```\n\n' +
        '**Constraints:**\n' +
        '- AXI-Lite protocol with all five channels\n' +
        '- gpio_in samples external pins\n' +
        '- Reset clears gpio_out to 0',
      difficulty: 'Medium',
      topics: ['AXI', 'GPIO', 'Peripheral'],
      requirements: [
      'REGISTER MAP: Address 0x00 = GPIO output register, address 0x04 = GPIO input register.',
      'WRITE OUTPUT: Writes to 0x00 update gpio_out.',
      'READ INPUT: Reads from 0x04 return current gpio_in value.',
      'READ OUTPUT: Reads from 0x00 return current output register value.',
      'WRITE TO INPUT REGISTER: Writes to 0x04 should return error response or be ignored based on design choice.',
      'AXI-LITE PROTOCOL: Implement all five AXI-Lite channels with correct handshake behavior.',
      'BACKPRESSURE: BVALID and RVALID must remain asserted until accepted.',
      'RESET: Clear gpio_out register on reset.',
      'Test Case 1 - Output Write: Write 0xA5A5A5A5 to 0x00. Expected: gpio_out updates to written value.',
      'Test Case 2 - Input Read: gpio_in=0x0000000F, read 0x04. Expected: RDATA=0x0000000F.',
      'Test Case 3 - Output Readback: Write to 0x00, then read from 0x00. Expected: read returns written output value.',
      'Test Case 4 - Invalid Write: Write to 0x04. Expected: error or ignored behavior per spec.',
      'Test Case 5 - Reset: Assert reset. Expected: gpio_out clears to 0.'
      ],
      hints: [
      'Use one register for output storage and a direct wire/input for gpio_in.',
      'Decode address 0x00 for output and 0x04 for input.',
      'For invalid writes, return SLVERR on B channel if desired.',
      'Read logic can use a case statement on ARADDR.',
      'This problem is mainly register decode plus AXI-Lite handshake.'
    ]
    },
    {
      id: 'bus5',
      shortName: 'AXI Register File',
      question: 'Build AXI-Lite 4-Register File',
      description:
        'Implement an AXI-Lite slave with four 32-bit registers at 0x00, 0x04, 0x08, 0x0C.\n\n' +
        '**Register map:**\n' +
        '```\n0x00=reg0, 0x04=reg1, 0x08=reg2, 0x0C=reg3\nInvalid address → SLVERR/DECERR\n```\n\n' +
        '**Constraints:**\n' +
        '- All four registers readable and writable\n' +
        '- Invalid address returns error response\n' +
        '- Reset clears all registers',
      difficulty: 'Medium',
      topics: ['AXI', 'Register File', 'RTL'],
      requirements: [
      'REGISTER MAP: 0x00=reg0, 0x04=reg1, 0x08=reg2, 0x0C=reg3.',
      'WRITE SUPPORT: Writes to valid addresses update corresponding register.',
      'READ SUPPORT: Reads from valid addresses return corresponding register value.',
      'INVALID ADDRESS: Access to unsupported address should return SLVERR or DECERR.',
      'AXI-LITE CHANNELS: Implement AW, W, B, AR, and R channels correctly.',
      'WRITE ORDERING: AW and W may arrive in any order.',
      'READ DATA HOLDING: Once RVALID is asserted, hold RDATA stable until RREADY.',
      'WRITE RESPONSE HOLDING: Once BVALID is asserted, hold BRESP stable until BREADY.',
      'RESET: Clear all registers on reset.',
      'Test Case 1 - Write reg0: Write 0x11 to 0x00. Expected: reg0=0x11.',
      'Test Case 2 - Write reg3: Write 0xDEADBEEF to 0x0C. Expected: reg3 updates correctly.',
      'Test Case 3 - Read reg1: Preload reg1, then read 0x04. Expected: RDATA=reg1.',
      'Test Case 4 - Invalid Read: Read from 0x10. Expected: error response.',
      'Test Case 5 - Reset: After writing all registers, assert reset. Expected: all registers clear to 0.'
      ],
      hints: [
      'Use address bits [3:2] for simple register decode.',
      'Implement four 32-bit registers internally.',
      'Case statements are the easiest way to handle read and write decode.',
      'You can reuse the same AXI-Lite control structure from a single-register slave.',
      'For invalid addresses, return an error response instead of updating any register.'
    ]
    },
    {
      id: 'bus6',
      shortName: 'AXI Read-Only Status',
      question: 'Build AXI-Lite Read-Only Status Block',
      description:
        'Implement a read-only AXI-Lite peripheral exposing version and status registers.\n\n' +
        '**Register map:**\n' +
        '```\n0x00: version (hardcoded constant)\n0x04: status  (driven from input)\nAny write → error response\n```\n\n' +
        '**Constraints:**\n' +
        '- Reads return register contents\n' +
        '- Writes always return error on B channel\n' +
        '- Version is constant, status from input port',
      difficulty: 'Easy',
      topics: ['AXI', 'Status', 'Peripheral'],
      requirements: [
      'REGISTER MAP: 0x00 = version register, 0x04 = status register.',
      'READ-ONLY DESIGN: Reads from valid addresses return register contents.',
      'WRITE ERROR: Any write attempt should generate an error response on B channel.',
      'AXI-LITE HANDSHAKE: Implement proper VALID/READY protocol for all channels.',
      'CONSTANT VERSION: Version register can be hardcoded to a constant value.',
      'STATUS INPUT: Status register may be driven from an input signal.',
      'RESET: Deassert response valid signals on reset.',
      'Test Case 1 - Read Version: Read 0x00. Expected: fixed version value returned.',
      'Test Case 2 - Read Status: Read 0x04. Expected: current status value returned.',
      'Test Case 3 - Write Attempt: Write to 0x00. Expected: BRESP indicates error.',
      'Test Case 4 - Invalid Read: Read 0x08. Expected: error or zero based on design choice.',
      'Test Case 5 - Backpressure: Hold RREADY low after read response. Expected: RVALID stays high until accepted.'
      ],
      hints: [
      'This is simpler than a normal AXI-Lite slave because no internal writeable register is needed.',
      'Use a case statement for read address decode.',
      'On any write handshake completion, return SLVERR on B channel.',
      'Keep version as a localparam or constant register.',
      'Status can come from an input port and be sampled during read.'
    ]
    },
    {
      id: 'bus7',
      shortName: 'AXI Write-Only Control',
      question: 'Build AXI-Lite Write-Only Control Block',
      description:
        'Implement a write-only AXI-Lite peripheral with enable and mode control registers.\n\n' +
        '**Register map:**\n' +
        '```\n0x00: enable register (write-only)\n0x04: mode register   (write-only)\nAny read → error response\n```\n\n' +
        '**Constraints:**\n' +
        '- Writes update control registers\n' +
        '- Reads always return error on R channel\n' +
        '- Reset clears enable and mode',
      difficulty: 'Easy',
      topics: ['AXI', 'Control', 'RTL'],
      requirements: [
      'REGISTER MAP: 0x00 = enable register, 0x04 = mode register.',
      'WRITE SUPPORT: Writes to valid addresses update corresponding control registers.',
      'READ ERROR: Any read attempt should return an error response on R channel.',
      'AXI-LITE PROTOCOL: Support proper AW, W, B, AR, and R handshake behavior.',
      'RESET: Clear enable and mode registers on reset.',
      'WRITE ORDERING: Accept AW and W in any order.',
      'WRITE RESPONSE: Return OKAY for valid writes and error for invalid writes.',
      'Test Case 1 - Enable Write: Write 1 to 0x00. Expected: enable register becomes 1.',
      'Test Case 2 - Mode Write: Write 3 to 0x04. Expected: mode register becomes 3.',
      'Test Case 3 - Read Attempt: Read 0x00. Expected: RRESP indicates error.',
      'Test Case 4 - Invalid Write: Write to 0x08. Expected: BRESP indicates error.',
      'Test Case 5 - Reset: After writing registers, assert reset. Expected: enable and mode clear to 0.'
      ],
      hints: [
      'Implement two internal registers for enable and mode.',
      'Writes behave like a normal AXI-Lite register slave.',
      'For reads, return RVALID with an error response code.',
      'Use address decode to select which control register to update.',
      'This is a good starter problem for learning AXI-Lite write flow.'
    ]
  },

    {
      id: 'bus8',
      shortName: 'Bus Arbiter',
      question: 'Implement Multi-Master Bus Arbiter with Priority or Round-Robin',
      description:
        'Design an arbiter for a shared bus with multiple masters.\n\n' +
        '**Example (round-robin):**\n' +
        '```\nrequest=0b111 → grants rotate: 0→1→2→0→...\nrequest=0b000 → grant_valid=0, pointer unchanged\n```\n\n' +
        '**Constraints:**\n' +
        '- One-hot grant output\n' +
        '- Fixed-priority or round-robin (document choice)\n' +
        '- Parameterizable NUM_MASTERS',
      difficulty: 'Hard',
      topics: ['Arbiter', 'Bus', 'Design'],
      requirements: [
        'NUMBER OF MASTERS: Parameterize NUM_MASTERS (number of masters requesting bus access).',
        'INPUTS: request vector (NUM_MASTERS bits). request[i]=1 means master i requesting bus.',
        'OUTPUTS: grant vector (NUM_MASTERS bits, one-hot encoding). grant[i]=1 means master i granted bus access. Only one grant bit can be 1 per cycle.',
        'ARBITRATION POLICY: Choose and implement: (1) Fixed-Priority: Master 0 has highest priority, master NUM_MASTERS-1 lowest. Grant lowest-index requesting master. (2) Round-Robin: Rotate priority among masters fairly. Last granted master has lowest priority next cycle. Document chosen policy.',
        'ROUND-ROBIN POINTER: Maintain last_grant register storing index of last granted master. On next arbitration, search for requests starting from (last_grant+1) with wraparound. Update last_grant on successful grant.',
        'ACCEPT CONDITION: Define when to update last_grant pointer. Common: update when grant_valid=1 (grant asserted). Alternatively: update when grant accepted by master (requires accept signal from master).',
        'NO REQUESTS: When request vector is all zeros, no grant asserted (grant=0). last_grant pointer holds current value (no update).',
        'GRANT STABILITY: Grant signal should be stable for the cycle. Avoid glitches in grant generation.',
        'RESET: On reset, clear grant vector. For round-robin: reset last_grant pointer to initial value (e.g., 0 or NUM_MASTERS-1).',
        'Test Case 1 - Fixed-Priority Contention: request = 0b0110 (masters 1 and 2 requesting). Expected: grant = 0b0010 (master 1 granted, lower index).',
        'Test Case 2 - Round-Robin Fairness: request = 0b0111 (masters 0,1,2 always requesting). Initially last_grant=-1 or 0. Expected: grants rotate: grant[0], grant[1], grant[2], grant[0], grant[1], ... each cycle.',
        'Test Case 3 - Sparse Requests: request changes each cycle: 0b0100, 0b0010, 0b1000. Expected: grant follows requests, pointer updates correctly in round-robin.',
        'Test Case 4 - Single Master: Only request[3]=1 continuously. Expected: grant[3]=1 every cycle (no contention).',
        'Test Case 5 - No Requests: request = 0b0000 for several cycles. Expected: grant = 0b0000, last_grant unchanged.',
        'Test Case 6 - Grant One-Hot Property: For all Test Cases, verify at most one grant bit is 1 each cycle (one-hot or all-zero).'
      ],
      hints: [
        'Fixed-priority arbiter: Use priority encoder on request vector. Grant lowest index with request=1. grant = (1 << first_request_index);',
        'Round-robin arbiter: (1) Rotate request vector to place last_grant at LSB: rotated_req = {request[last_grant-1:0], request[NUM_MASTERS-1:last_grant]}; (2) Priority encode rotated_req to find next grant offset. (3) Unrotate to get actual grant index: grant_index = (offset + last_grant) % NUM_MASTERS; (4) Generate one-hot grant: grant = (1 << grant_index);',
        'Alternative round-robin: Iterate from (last_grant+1) to NUM_MASTERS-1, then wrap to 0 to last_grant. Find first request=1.',
        'last_grant update: always_ff @(posedge clk) if (rst) last_grant <= 0; else if (grant_valid) last_grant <= granted_index; where grant_valid = |grant; granted_index = log2(grant);',
        'One-hot grant generation: function [NUM_MASTERS-1:0] index_to_onehot; input [LOG2_MASTERS-1:0] index; index_to_onehot = (1 << index); endfunction',
        'One-hot assertion (testbench): assert ($countones(grant) <= 1); Ensures at most one bit set.',
        'Grant valid signal: assign grant_valid = |grant; Indicates at least one grant asserted.',
        'Round-robin edge case: When last_grant points to last master (NUM_MASTERS-1) and wraps to 0, verify correct behavior.',
        'Test fairness: Run round-robin arbiter with all masters requesting continuously for many cycles. Count grants per master. Should be approximately equal (fair distribution).',
        'Application: Shared bus arbitration in multi-master systems (SoC interconnects, memory controllers).'
      ]
    }
  ],

  'Basic RTL': [
    {
      id: 'rtl1',
      shortName: 'Edge / Toggle Detector',
      question: 'Detect Rising, Falling, and Any Transition',
      description:
        'Design synchronous RTL detecting transitions of a 1-bit input.\n\n' +
        '**Outputs:**\n' +
        '```\nrise_pulse:   1 cycle on 0→1\nfall_pulse:   1 cycle on 1→0\ntoggle_pulse: 1 cycle on any change\n```\n\n' +
        '**Constraints:**\n' +
        '- Uses previous-cycle register for comparison\n' +
        '- Single-cycle pulse on each detection',
      difficulty: 'Easy',
      topics: ['RTL', 'Sequential Logic'],
      requirements: [
    'INPUTS: clk, rst_n (optional), sig_in.',
    'OUTPUTS: rise_pulse, fall_pulse, toggle_pulse.',
    'REGISTER: Capture previous value of sig_in each cycle.',
    'TOGGLE: toggle_pulse asserts for 1 cycle when sig_in != sig_prev.',
    'RISING: rise_pulse asserts for 1 cycle when sig_in=1 and sig_prev=0.',
    'FALLING: fall_pulse asserts for 1 cycle when sig_in=0 and sig_prev=1.',
    'Test Case - Rising: 0→1 transition produces rise_pulse=1 for one cycle.',
    'Test Case - Falling: 1→0 transition produces fall_pulse=1 for one cycle.',
    'Test Case - No Toggle: constant input produces no pulses.'
      ],
    hints: [
    'Use always_ff for sig_prev register.',
    'Use combinational compares for pulse generation.'
    ]
    },
    {
      id: 'rtl2',
      shortName: '1-Cycle Pulse Detector',
      question: 'Detect a One-Cycle High Pulse (0→1→0)',
      description:
        'Assert output when input is high for exactly one clock cycle (pattern 0,1,0 in consecutive samples).\n\n' +
        '**Constraints:**\n' +
        '- Keep 2-cycle history\n' +
        '- Two-cycle high (0,1,1,0) does NOT trigger',
      difficulty: 'Easy',
      topics: ['RTL', 'Sequential Logic'],
      requirements: [
    'INPUTS: clk, rst_n (optional), sig_in.',
    'OUTPUT: onecycle_pulse.',
    'HISTORY: Keep 2-cycle history using two registers.',
    'DETECT: Assert onecycle_pulse for 1 cycle when pattern 0,1,0 is observed in consecutive samples.',
    'Test Case - Valid: ...0,1,0... triggers onecycle_pulse once.',
    'Test Case - Two-cycle high: ...0,1,1,0... does not trigger.',
    'Test Case - Stuck high: ...1,1,1... does not trigger.'
      ],
      hints: ['Pipeline: d1<=sig_in, d2<=d1; detect using (d2, d1, sig_in).'],
    },
    {
      id: 'rtl3',
      shortName: 'Sequence Detector FSM',
      question: 'FSM Sequence Detector for 1,0,1,1,0',
      description:
        'Implement an FSM detecting serial pattern `10110` with a 1-cycle match pulse.\n\n' +
        '**Constraints:**\n' +
        '- States represent progress through matching\n' +
        '- Define overlapping support\n' +
        '- Reset returns to IDLE',
      difficulty: 'Medium',
      topics: ['RTL', 'FSM'],
      requirements: [
    'INPUTS: clk, rst_n, bit_in.',
    'OUTPUT: match_pulse (1 cycle).',
    'FSM: States represent progress through matching 10110.',
    'OVERLAP: Define whether overlapping matches are supported and implement consistently.',
    'RESET: Return to IDLE state.',
    'Test Case - Match: stream contains 10110 → match_pulse asserted on final bit.',
    'Test Case - No match: stream without 10110 → match_pulse never asserts.'
      ],
      hints: ['Use enum for states and always_ff for state register.'],
    },
    {
      id: 'rtl4',
      shortName: 'Pattern in Last N',
      question: 'Detect Pattern 10110 Anywhere in Last N Samples',
      description:
        'Use an N-bit shift register and combinational decode to detect a K-bit pattern at any alignment in the window.\n\n' +
        '**Constraints:**\n' +
        '- Parameterizable N (window), K=5, PATTERN=10110\n' +
        '- Compare each K-bit slice, OR all matches\n' +
        '- found=0 once pattern shifts out of window',
      difficulty: 'Medium',
      topics: ['RTL', 'Shift Register'],
      requirements: [
    'PARAM: N (window size), K=5, PATTERN=5b10110.',
    'INPUTS: clk, rst_n, bit_in.',
    'OUTPUT: found.',
    'SHIFT: Maintain last N samples in a shift register.',
    'DECODE: Compare each K-bit slice to PATTERN and OR matches.',
    'Test Case - Found: pattern appears within last N → found=1.',
    'Test Case - Shift out: once pattern moves out of window → found=0.'
      ],
      hints: ['Generate compares with a for-generate loop.'],
    },
    {
      id: 'rtl5',
      shortName: 'Debounce + Sync',
      question: 'Debounce an Asynchronous Input (2-cycle stable) + Rising Pulse',
      description:
        'Synchronize async input, filter glitches (require 2 consecutive stable highs), and generate debounced rising-edge pulse.\n\n' +
        '**Constraints:**\n' +
        '- 2-flop synchronizer for async input\n' +
        '- Accept high only after 2 stable samples\n' +
        '- Output: debounced_level + debounced_rise_pulse',
      difficulty: 'Medium',
      topics: ['RTL', 'CDC', 'Debounce'],
      requirements: [
    'INPUTS: clk, rst_n, async_in.',
    'OUTPUTS: debounced_level, debounced_rise_pulse.',
    'SYNC: 2-flop synchronizer for async_in.',
    'FILTER: Accept high only after 2 consecutive synchronized high samples.',
    'PULSE: debounced_rise_pulse asserted for 1 cycle on 0→1 of debounced_level.',
    'Test Case - Glitch: short high glitch rejected.',
    'Test Case - Stable high: stable high accepted and pulse generated once.'
      ],
      hints: ['Filter using 2-bit shift history or small saturating counter.'],
    },
    {
      id: 'rtl6',
      shortName: 'Binary to Gray',
      question: 'Generate Gray Code from a Binary Counter',
      description:
        'Implement a binary counter and output Gray code equivalent each cycle.\n\n' +
        '**Conversion:** `gray = bin ^ (bin >> 1)`\n\n' +
        '**Constraints:**\n' +
        '- Parameterizable W (counter width)\n' +
        '- Binary counter registered, Gray derived combinationally',
      difficulty: 'Easy',
      topics: ['RTL', 'Counter', 'Gray Code'],
      requirements: [
    'PARAM: W (counter width).',
    'INPUTS: clk, rst_n, enable (optional).',
    'OUTPUTS: bin_count[W-1:0], gray_count[W-1:0].',
    'UPDATE: If enabled, bin_count increments each cycle.',
    'CONVERT: gray_count derived from bin_count.',
    'Test Case - Reset: bin=0 => gray=0.',
    'Test Case - Sequence: verify first few gray outputs.'
      ],
      hints: ['Keep bin_count registered; compute gray combinationally.'],
    },
    {
      id: 'rtl7',
      shortName: 'Divisible by 3',
      question: 'FSM for Divisibility by 3 with Serial Bit Input',
      description:
        'Implement an FSM with 3 remainder states that updates on each incoming bit and asserts output when remainder is 0.\n\n' +
        '**Constraints:**\n' +
        '- 3 states representing remainder mod 3\n' +
        '- Track only remainder, not the full number\n' +
        '- Start at remainder 0',
      difficulty: 'Medium',
      topics: ['RTL', 'FSM', 'Arithmetic'],
      requirements: [
    'INPUTS: clk, rst_n, bit_in.',
    'OUTPUT: div_by_3.',
    'FSM: 3 states represent remainder modulo 3.',
    'UPDATE: On each bit, transition to next remainder state.',
    'RESET: Start at remainder 0.',
    'Test Case - Divisible value: serial stream representing 3, 6, or 9 eventually drives div_by_3=1 when remainder returns to 0.',
    'Test Case - Non-divisible value: serial stream representing 1, 2, 4, or 5 leaves div_by_3=0.',
    'Test Case - Reset: immediately after reset, the FSM is in remainder-0 state and div_by_3 reflects that state per the documented convention.'
      ],
      hints: ['Track only remainder, not the full number.'],
    },
    {
      id: 'rtl8',
      shortName: 'Fibonacci Generator',
      question: 'Fibonacci Sequence Generator with Enable',
      description:
        'Implement a Fibonacci generator advancing only when enable is asserted.\n\n' +
        '**State:** `a, b registers; next = a + b`\n\n' +
        '**Constraints:**\n' +
        '- Parameterizable output width W\n' +
        '- enable=0 holds output\n' +
        '- Reset initializes to produce 0, 1, 1, 2, 3, 5, ...',
      difficulty: 'Medium',
      topics: ['RTL', 'Datapath', 'Registers'],
      requirements: [
    'PARAM: W (output width).',
    'INPUTS: clk, rst_n, enable.',
    'OUTPUT: fib_out.',
    'STATE: Two registers a,b; next=a+b.',
    'UPDATE: If enable, a<=b, b<=a+b.',
    'RESET: Initialize to produce sequence starting 0,1,... (define exact first outputs).',
    'Test Case - Hold: enable=0 holds outputs.',
    'Test Case - Resume: enable=1 continues sequence.'
      ],
      hints: ['Use two always_ff regs and one combinational add.'],
    },
    {
      id: 'rtl9',
      shortName: 'ms to sec/min/hr',
      question: 'Generate Second/Minute/Hour Pulses from 1 ms Tick',
      description:
        'Use counters driven by a 1 ms pulse to generate derived timebase pulses.\n\n' +
        '**Conversion:** `1000 ticks → sec, 60 sec → min, 60 min → hr`\n\n' +
        '**Constraints:**\n' +
        '- Each pulse is 1 cycle wide at rollover\n' +
        '- Cascaded counters',
      difficulty: 'Easy',
      topics: ['RTL', 'Counters'],
      requirements: [
    'INPUTS: clk, rst_n, tick_1ms.',
    'OUTPUTS: sec_pulse, min_pulse, hour_pulse.',
    'COUNT: 1000 ticks => 1 second, 60 seconds => 1 minute, 60 minutes => 1 hour.',
    'PULSE WIDTH: 1 cycle asserted at rollover event.',
    'Test Case - 1000 ticks produce one sec_pulse.',
    'Test Case - 60 sec_pulse events produce one min_pulse.'
      ],
      hints: ['Use tick_1ms as clock-enable for cascaded counters.'],
    },
    {
      id: 'rtl10',
      shortName: 'Clock Divide by 2',
      question: 'Divide-by-2 Clock Divider',
      description:
        'Implement divide-by-2 clock using a toggling flip-flop.\n\n' +
        '**Constraints:**\n' +
        '- Output toggles on each rising edge of clk\n' +
        '- 50% duty cycle\n' +
        '- Define initial state on reset',
      difficulty: 'Easy',
      topics: ['RTL', 'Clock Divider'],
      requirements: [
    'INPUTS: clk, rst_n.',
    'OUTPUT: clk_div2.',
    'TOGGLE: clk_div2 toggles on each rising edge of clk.',
    'RESET: Define initial output state.',
    'Test Case - Frequency: output frequency is clk/2.',
    'Test Case - Reset: after reset, clk_div2 returns to the documented initial state before toggling resumes.'
      ],
      hints: ['clk_div2 <= ~clk_div2 in always_ff.'],
    },
    {
      id: 'rtl11',
      shortName: 'Clock Divide by 3 (50%)',
      question: 'Divide-by-3 with ~50% Duty Cycle (Glitch-Free)',
      description:
        'Implement a divide-by-3 clock divider with approximately 50% duty cycle using both edges and glitch-free construction.\n\n' +
        '**Constraints:**\n' +
        '- Output frequency = clk/3\n' +
        '- ~50% duty cycle\n' +
        '- No runt pulses (glitch-free)',
      difficulty: 'Hard',
      topics: ['RTL', 'Clock Divider'],
      requirements: [
    'INPUTS: clk, rst_n.',
    'OUTPUT: clk_div3_50.',
    'DIVIDE: Output frequency = clk/3.',
    'DUTY: Approximately 50% duty.',
    'GLITCH FREE: Output must not generate runt pulses.',
    'Test Case - Output period equals 3 input cycles.',
    'Test Case - Glitch-free enable/reset behavior: transitions occur only at intended clock boundaries with no runt pulses.'
      ],
      hints: ['Common approach: posedge counter + negedge capture + OR/AND combine.'],
    },
    {
      id: 'rtl12',
      shortName: 'Clock Divide by N',
      question: 'Generic Divide-by-N with ~50% Duty Cycle',
      description:
        'Implement programmable or parameterized divide-by-N clock divider handling even and odd N.\n\n' +
        '**Constraints:**\n' +
        '- Even N: toggle every N/2 cycles\n' +
        '- Odd N: use dual-edge method or define duty strategy\n' +
        '- Parameterizable or runtime-configurable N',
      difficulty: 'Medium',
      topics: ['RTL', 'Clock Divider', 'Parameterization'],
      requirements: [
    'PARAM or INPUT: N/div_value.',
    'INPUTS: clk, rst_n.',
    'OUTPUT: clk_divN.',
    'EVEN: Toggle every N/2 cycles.',
    'ODD: Use dual-edge method (or define duty-cycle strategy).',
    'Test Case - N=4 gives clk/4 with 50% duty.',
    'Test Case - N=5 gives clk/5 with defined duty characteristics.'
      ],
      hints: ['Separate counter/state generation from output register.'],
    },
    {
      id: 'rtl13',
      shortName: 'Glitch-Free Clock Gate',
      question: 'Glitch-Free Clock Gating Cell with Enable',
      description:
        'Implement a latch-based glitch-free clock gating cell (ICG style).\n\n' +
        '**Operation:** `clk_gated = clk_in & enable_latched`\n\n' +
        '**Constraints:**\n' +
        '- Sample enable when clk_in is low (latch)\n' +
        '- Hold when clk_in is high\n' +
        '- Enable toggle while clk high must not glitch output',
      difficulty: 'Medium',
      topics: ['RTL', 'Clock Gating'],
      requirements: [
    'INPUTS: clk_in, enable.',
    'OUTPUT: clk_gated.',
    'LATCH: Sample enable when clk_in is low; hold when clk_in is high.',
    'GATE: clk_gated = clk_in & enable_latched.',
    'Test Case - Disabled gate: when enable=0, clk_gated stays low.',
    'Test Case - Enabled gate: when enable=1 and sampled during clk low, clk_gated follows clk_in.',
    'Test Case - enable toggles while clk_in high does not glitch clk_gated.'
      ],
      hints: ['Model latch with always_latch; use synthesis-safe coding style.'],
    },
    {
      id: 'rtl14',
      shortName: 'Reset Sync',
      question: 'Async Assert, Sync Deassert Reset',
      description:
        'Implement reset circuitry that asserts asynchronously but deasserts synchronously using a 2-flop synchronizer chain.\n\n' +
        '**Constraints:**\n' +
        '- Assert: immediately when async_rst_n goes low\n' +
        '- Deassert: only on clock edge(s) after release\n' +
        '- 2-flop chain for synchronous deassert',
      difficulty: 'Medium',
      topics: ['RTL', 'Reset'],
      requirements: [
    'INPUTS: clk, async_rst_n.',
    'OUTPUT: rst_n_sync.',
    'ASSERT: rst_n_sync asserts immediately when async_rst_n goes low.',
    'DEASSERT: rst_n_sync deasserts after synchronizer delay (e.g., 2 cycles).',
    'Test Case - Assert: pulling async_rst_n low immediately forces rst_n_sync active.',
    'Test Case - Deassert: releasing async_rst_n only deasserts rst_n_sync on clock edge(s) after the synchronizer delay.'
      ],
      hints: ['Use flops with async clear, shift in 1s after release.'],
    },
    {
      id: 'rtl15',
      shortName: 'CDC Slow→Fast (1-bit)',
      question: '2-FF Synchronizer for 1-bit CDC (Slow to Fast)',
      description:
        'Implement a classic 2-flop synchronizer in destination domain for a 1-bit signal.\n\n' +
        '**Constraints:**\n' +
        '- Two serial flip-flops in dst_clk domain\n' +
        '- Output changes after 2 flops latency\n' +
        '- No combinational logic between stages',
      difficulty: 'Medium',
      topics: ['RTL', 'CDC'],
      requirements: [
    'INPUTS: dst_clk, dst_rst_n, async_sig_in.',
    'OUTPUT: sig_sync.',
    'SYNC: Two serial always_ff flops in dst_clk domain.',
    'RESET: Reset clears both synchronizer stages and the synchronized output.',
    'Test Case - Rising input: async input toggle propagates to sig_sync only after the 2-flop latency.',
    'Test Case - Falling input: deassertion also propagates with the same two-stage latency.'
      ],
      hints: ['Mark synchronizer flops with attributes if desired.'],
    },
    {
      id: 'rtl16',
      shortName: 'CDC Fast→Slow Handshake',
      question: 'Handshake CDC for Fast Domain to Slow Domain',
      description:
        'Implement a request/ack handshake for reliable event communication from fast to slow domain.\n\n' +
        '**Signals:**\n' +
        '```\nreq (fast→slow): held until slow captures\nack (slow→fast): synchronized back\n```\n\n' +
        '**Constraints:**\n' +
        '- req held until acknowledged\n' +
        '- Both req and ack must be synchronized into receiving domain',
      difficulty: 'Hard',
      topics: ['RTL', 'CDC', 'Handshake'],
      requirements: [
    'DOMAINS: fast_clk and slow_clk.',
    'SIGNALS: req (fast→slow) and ack (slow→fast).',
    'HOLD: req must be held until slow side captures it.',
    'SYNC: req and ack must each be synchronized into the receiving domain.',
    'BUSY/IDLE: Define whether the fast side exposes a busy indication while a request is outstanding.',
    'Test Case - Single request produces single acknowledge.',
    'Test Case - Outstanding request: fast side remains busy until the synchronized acknowledge returns.'
      ],
      hints: ['Use small FSMs in each domain and synchronizers on req/ack.'],
    },
    {
      id: 'rtl17',
      shortName: 'Gray Pointer for CDC',
      question: 'Gray Code Pointers for CDC (FIFO-style)',
      description:
        'Implement binary pointer + Gray pointer generation suitable for async FIFO pointer synchronization.\n\n' +
        '**Constraints:**\n' +
        '- Gray pointer changes by 1 bit per increment\n' +
        '- Binary pointer for internal use, Gray for CDC\n' +
        '- Validate: gray = bin ^ (bin >> 1)',
      difficulty: 'Medium',
      topics: ['RTL', 'CDC', 'Gray Code'],
      requirements: [
    'INPUTS: clk, rst_n, inc.',
    'OUTPUTS: bin_ptr, gray_ptr.',
    'BINARY PTR: bin_ptr increments only when inc=1 and wraps naturally at the pointer width.',
    'GRAY: gray_ptr changes by 1 bit per increment.',
    'Test Case - Reset: bin_ptr and gray_ptr both clear to 0.',
    'Test Case - Formula: validate gray_ptr = bin_ptr ^ (bin_ptr >> 1) across several increments.',
    'Test Case - One-bit change: successive Gray values differ by exactly one bit when inc=1.'
      ],
      hints: ['Use registered binary pointer; compute gray combinationally.'],
    },
  ],

  'Miscellaneous Classic RTL': [
    {
      id: 'misc1',
      shortName: 'Edge Detector',
      question: 'Implement Rising and Falling Edge Detector',
      description:
        'Design an edge detector generating single-cycle pulses on rising (0→1) and falling (1→0) transitions.\n\n' +
        '**Logic:**\n' +
        '```\nrise_pulse = sig_in & ~sig_prev\nfall_pulse = ~sig_in & sig_prev\n```\n\n' +
        '**Constraints:**\n' +
        '- Single-cycle pulse per detection\n' +
        '- No re-triggering while input holds steady\n' +
        '- Reset: sig_prev = 0',
      difficulty: 'Easy',
      topics: ['Edge Detection', 'Sequential', 'Design'],
      requirements: [
    'INPUT: Signal to monitor for edges "sig_in" (1 bit).',
    'OUTPUTS: (1) rise_pulse (1 bit): Pulses high for one cycle on rising edge, (2) fall_pulse (1 bit): Pulses high for one cycle on falling edge.',
    'RISING EDGE DETECTION: Rising edge occurs when signal transitions from 0 to 1. Detect by comparing current value with previous (sampled last cycle). Condition: sig_in=1 AND sig_prev=0.',
    'FALLING EDGE DETECTION: Falling edge occurs when signal transitions from 1 to 0. Condition: sig_in=0 AND sig_prev=1.',
    'PREVIOUS SAMPLE REGISTER: Maintain register "sig_prev" storing value of sig_in from previous clock cycle. Updated every cycle.',
    'SINGLE-CYCLE PULSE: Edge pulses asserted for exactly one clock cycle on detection, then deassert (even if input remains at new value).',
    'NO RE-TRIGGERING: If input holds high or low, no repeated pulses. Only transitions generate pulses.',
    'RESET: On reset, initialize sig_prev to known value (typically 0). No pulses generated at reset.',
    'Test Case 1 - Rising Edge: sig_in sequence: 0, 0, 1, 1, 1. Expected: rise_pulse=1 at cycle 2 (transition 0→1). rise_pulse=0 at cycles 0,1,3,4.',
    'Test Case 2 - Falling Edge: sig_in sequence: 1, 1, 0, 0, 0. Expected: fall_pulse=1 at cycle 2 (transition 1→0). fall_pulse=0 at cycles 0,1,3,4.',
    'Test Case 3 - Multiple Edges: sig_in sequence: 0, 1, 0, 1, 0. Expected: rise_pulse at cycles 1,3. fall_pulse at cycles 2,4.',
    'Test Case 4 - No Edges: sig_in holds 0 for 5 cycles, then holds 1 for 5 cycles. Expected: rise_pulse=1 at transition cycle only. No repeated pulses.',
    'Test Case 5 - Reset: Assert reset with sig_in=1. Expected: sig_prev=0 after reset. If sig_in remains 1, next cycle: rise_pulse=1 (detects 0→1 transition from reset state).'
      ],
      hints: [
    'Previous sample register: reg sig_prev; always_ff @(posedge clk) if (rst) sig_prev <= 0; else sig_prev <= sig_in;',
    'Rising edge detection: assign rise_pulse = sig_in & ~sig_prev; Combinational logic.',
    'Falling edge detection: assign fall_pulse = ~sig_in & sig_prev;',
    'Both edges: assign rise_pulse = sig_in & ~sig_prev; assign fall_pulse = ~sig_prev & sig_in; Wait, thats wrong for fall. Correct: assign fall_pulse = ~sig_in & sig_prev;',
    'Initialization: On reset, sig_prev=0 ensures first sample of sig_in is compared against 0. If sig_in=1 at reset release, rise_pulse will detect it.',
    'Alternative: Use posedge/negedge in always block (not synthesizable in all tools): always @(posedge sig_in) rise_pulse <= 1; But this is not recommended for RTL. Use comparison method.',
    'Applications: Detecting button presses, synchronizing asynchronous signals, triggering on signal transitions.',
    'Synchronization: If sig_in is asynchronous to clock, add synchronizer (2-stage flip-flop) before edge detector to prevent metastability.'
  ]
},

    {
      id: 'misc2',
      shortName: 'Top-K or Max-Value Tracker',
      question: 'Implement Top-K or Maximum Value Tracker Module',
      description:
        'Design a hardware module tracking the top K maximum values from a streaming input.\n\n' +
        '**Example (K=3):**\n' +
        '```\nStream: [5, 8, 3, 9, 2]\nAfter 5: top=[5,0,0]\nAfter 8: top=[8,5,0]\nAfter 9: top=[9,8,5] (3 evicted)\nAfter 2: top=[9,8,5] (2 not in top 3)\n```\n\n' +
        '**Constraints:**\n' +
        '- Parameterizable DATA_WIDTH and K\n' +
        '- Maintain sorted descending order\n' +
        '- Compare-and-swap insertion for small K',
      difficulty: 'Hard',
      topics: ['Tracking', 'Design', 'Optimization'],
      requirements: [
    'PARAMETERIZATION: (1) DATA_WIDTH (bits per value), (2) K (number of top values to track, e.g., K=1 for max only, K=3 for top-3).',
    'STREAMING INPUT: Input "in_data" (DATA_WIDTH bits) and "in_valid" (1 bit). When in_valid=1, new data sample arrives.',
    'TOP-K STORAGE: Maintain K registers storing current top K values. For K=1: single max register. For K>1: array of K registers sorted in descending order (top[0]=largest, top[K-1]=smallest of top K).',
    'UPDATE LOGIC: On new input (in_valid=1): Compare in_data with stored top K values. If in_data > any of top K, insert in_data at appropriate position, evict smallest of top K.',
    'INSERTION SORT: For small K (e.g., K≤4), use compare-and-swap network to insert new value and maintain sorted order. For large K, more complex logic needed.',
    'OUTPUT: Continuously output top K values "top_values" (array of K values). Or provide output_valid signal when top K updated.',
    'DUPLICATE HANDLING: Define policy for duplicate values. Options: (1) Keep all duplicates (top K can have repeated values), (2) Keep unique only (skip duplicates). Document choice.',
    'RESET: On reset, initialize top K values to minimum possible (e.g., 0 or -infinity for signed) so any input will update.',
    'SIGNED/UNSIGNED: Define whether comparisons are signed or unsigned. Document.',
    'Test Case 1 - Max Only (K=1): Stream: [3, 1, 5, 2, 4]. Expected: max = 3 after first, 3 after second, 5 after third, 5 after fourth, 5 after fifth.',
    'Test Case 2 - Top-2: Stream: [4, 9, 1, 7, 3]. Expected: After stream, top[0]=9, top[1]=7.',
    'Test Case 3 - Sorted Insertion: K=3, stream: [5, 8, 3, 9, 2]. Expected: After 5: top=[5,0,0] (assuming init to 0). After 8: top=[8,5,0]. After 3: top=[8,5,3]. After 9: top=[9,8,5] (3 evicted). After 2: top=[9,8,5] (2 not in top 3).',
    'Test Case 4 - Duplicate Values: K=2, stream: [5, 5, 2, 5]. If keeping duplicates: top=[5,5]. If unique only: top=[5,2].',
    'Test Case 5 - All Same Value: K=3, stream: [7, 7, 7, 7]. Expected: top=[7,7,7] (if keeping duplicates).'
      ],
      hints: [
        'K=1: simple max register.',
        'K=2: if (in > top[0]) shift down, insert at 0; else if (in > top[1]) top[1] = in.',
        'Generalize with K-stage comparison and shift.',
      ],
    },
    {
      id: 'misc3',
      shortName: 'Sliding Window Min/Max',
      question: 'Design Sliding Window Min/Max Module for Stream Processing',
      description:
        'Compute minimum and maximum over a sliding window of the last W samples from an input stream.\n\n' +
        '**Example (W=3):**\n' +
        '```\nStream: [4, 2, 12, 3, 1]\nAfter [4,2,12]: min=2, max=12\nAfter [2,12,3]: min=2, max=12\nAfter [12,3,1]: min=1, max=12\n```\n\n' +
        '**Constraints:**\n' +
        '- Parameterizable WINDOW_SIZE and DATA_WIDTH\n' +
        '- Warm-up period: output valid after W samples\n' +
        '- Naive: comparator tree each cycle',
      difficulty: 'Hard',
      topics: ['Sliding Window', 'Stream Processing', 'Design'],
      requirements: [
    'PARAMETERIZATION: (1) DATA_WIDTH (bits per sample), (2) WINDOW_SIZE (W, number of samples in window).',
    'STREAMING INPUT: Input "in_data" (DATA_WIDTH bits) and "in_valid" (1 bit pulse indicating new sample).',
    'WINDOW BUFFER: Maintain buffer storing last W samples. Implement as circular buffer (FIFO) or shift register.',
    'MIN/MAX COMPUTATION: Each cycle, compute minimum and maximum across all samples currently in window.',
    'WARM-UP PERIOD: Window initially empty. First W-1 samples fill window. Output valid only after W samples received (window full).',
    'OUTPUT: (1) min_out (minimum value in current window), (2) max_out (maximum value in current window), (3) out_valid (1 when output valid, i.e., window has W samples).',
    'WINDOW UPDATE: On each new sample (in_valid=1): Add new sample to window, evict oldest sample (if window full). Recompute min/max.',
    'COMPUTATION METHOD: (1) Naive: Compare all W samples each cycle (W-1 comparators for min, W-1 for max). (2) Optimized: Use monotonic deque or incremental update (complex).',
    'RESET: On reset, clear window buffer and set out_valid=0.',
    'Test Case 1 - Warm-Up: W=4, stream: [4, 2, 12]. After 3 samples, out_valid=0 (window not full). After 4th sample, out_valid=1.',
    'Test Case 2 - Moving Window: W=3, stream: [4, 2, 12, 3, 1]. After 3 samples: min=2, max=12. After 4th (window=[2,12,3]): min=2, max=12. After 5th (window=[12,3,1]): min=1, max=12.',
    'Test Case 3 - Constant Input: W=4, stream: [7, 7, 7, 7, 7]. Expected: min=7, max=7 after warm-up and continuously.',
    'Test Case 4 - Descending Input: W=3, stream: [9, 8, 7, 6, 5]. Expected: After [9,8,7]: min=7, max=9. After [8,7,6]: min=6, max=8. After [7,6,5]: min=5, max=7.',
    'Test Case 5 - Reset Mid-Stream: Stream 5 samples, then reset. Continue with new stream. Expected: Window clears, out_valid=0 until W new samples received.'
      ],
      hints: [
        'Naive: W-1 comparators for min, W-1 for max (tree structure).',
        'Shift register: shift all samples, new sample enters at position 0.',
        'Start with small WINDOW_SIZE (2-3) for verification.',
      ],
    },
    {
      id: 'misc4',
      shortName: 'PWM Generator',
      question: 'Build Parameterizable Pulse Width Modulation (PWM) Generator',
      description:
        'Implement a PWM generator with configurable duty cycle using counter-based approach.\n\n' +
        '**Operation:**\n' +
        '```\npwm_out = (counter < DUTY) ? 1 : 0\ncounter wraps at PERIOD-1\nDUTY=0 → always low, DUTY=PERIOD → always high\n```\n\n' +
        '**Constraints:**\n' +
        '- Parameterizable PERIOD and DUTY\n' +
        '- Handle 0% and 100% duty edge cases\n' +
        '- PWM frequency = f_clk / PERIOD',
      difficulty: 'Medium',
      topics: ['PWM', 'Signal Generation', 'Design'],
      requirements: [
    'PARAMETERIZATION: (1) COUNTER_WIDTH (bits for counter, determines maximum period), (2) Optional: PERIOD and DUTY as parameters or runtime inputs.',
    'PWM PRINCIPLE: PWM signal is periodic with defined period. Within each period, signal is high for duty_cycle portion, low for remainder. Duty cycle = (high_time / period) * 100%.',
    'COUNTER: Maintain counter that counts from 0 to (PERIOD-1), then wraps to 0 (modulo PERIOD).',
    'PWM OUTPUT GENERATION: Compare counter with duty threshold. If counter < DUTY, pwm_out=1 (high). Else, pwm_out=0 (low).',
    'PERIOD: Total number of clock cycles per PWM period. Example: PERIOD=100 means 100 clock cycles per period.',
    'DUTY: Number of clock cycles per period that output is high. Must satisfy 0 ≤ DUTY ≤ PERIOD.',
    'DUTY CYCLE EDGE CASES: (1) DUTY=0: Output always low (0% duty). (2) DUTY=PERIOD: Output always high (100% duty). Define and test these explicitly.',
    'RUNTIME CONFIGURABILITY (OPTIONAL): Allow PERIOD and DUTY to be inputs (runtime configurable). Changes take effect on next period boundary or immediately (document).',
    'RESET: On reset, counter=0, pwm_out=0 (or initial state).',
    'OUTPUT: pwm_out (1 bit), the PWM signal.',
    'Test Case 1 - 25% Duty: PERIOD=8, DUTY=2 (25% duty). Expected: Within each 8-cycle period, pwm_out high for 2 cycles, low for 6 cycles. Pattern repeats: 11000000, 11000000, ...',
    'Test Case 2 - 50% Duty: PERIOD=10, DUTY=5. Expected: Pattern: 1111100000 repeating.',
    'Test Case 3 - 0% Duty: DUTY=0. Expected: pwm_out always 0 (never high).',
    'Test Case 4 - 100% Duty: DUTY=PERIOD (e.g., 8). Expected: pwm_out always 1 (never low).',
    'Test Case 5 - Duty Change (if runtime configurable): Start with DUTY=2, PERIOD=8. After several periods, change DUTY=6. Expected: Duty cycle updates, new pattern 11111100 repeating.'
      ],
      hints: [
        'Counter: if (counter == PERIOD-1) 0 else counter+1.',
        'DUTY=0: always false → output 0. DUTY=PERIOD: always true → output 1.',
        'Runtime update: apply at period boundary to avoid glitches.',
      ],
    },
  ],
};

export default rtlDesign;
