/**
 * RTL Debug Waveform Challenges
 * Buggy RTL designs with testbenches for waveform-based debugging practice.
 */

const RTL_DEBUG_WAVEFORM_CHALLENGES = [
  {
    id: 'rtl-debug-fsm-reset',
    title: 'FSM Sequence Detector — Late Detect Pulse',
    category: 'FSM',
    difficulty: 'Medium',
    bugType: 'state/output timing',
    summary: 'Debug a 1011 sequence detector where detect pulse is asserted one cycle late after reset release.',
    signals: ['clk', 'rst', 'in_bit', 'state', 'next_state', 'detect'],
    expectedBehavior: [
      'detect should pulse exactly when sequence 1011 completes.',
      'Reset should initialize state machine deterministically.',
      'No extra detect pulse on reset deassertion or idle cycles.'
    ],
    hiddenChecks: [
      'Reset sequence + immediate traffic',
      'Overlapping pattern 1011011',
      'Back-to-back patterns with idle gaps'
    ],
    hints: [
      'Check whether detect is derived from current state or next state.',
      'Compare nonblocking updates of state and detect in the same clocked block.',
      'A common fix is computing detect combinationally from next_state / input or registering it in the proper cycle.'
    ],
    buggyRtl: `module seq1011_debug (
  input  logic clk,
  input  logic rst,
  input  logic in_bit,
  output logic detect
);
  typedef enum logic [1:0] {S0, S1, S10, S101} state_t;
  state_t state, next_state;

  always_comb begin
  next_state = state;
  case (state)
    S0: begin
      if (in_bit) next_state = S1;
      else        next_state = S0;
    end
    S1: begin
      if (in_bit) next_state = S1;
      else        next_state = S10;
    end
    S10: begin
      if (in_bit) next_state = S101;
      else        next_state = S0;
    end
    S101: begin
      if (in_bit) next_state = S1;
      else        next_state = S10;
    end
    default: next_state = S0;
  endcase
end

  // BUG
  always_ff @(posedge clk or posedge rst) begin
    if (rst) begin
      state  <= S0;
      detect <= 1'b0;
    end else begin
      state  <= next_state;
      detect <= (state == S101 && in_bit == 1'b1); // intended sequence 1011
    end
  end
endmodule`,
    testbench: `module tb_seq1011_debug;
  logic clk, rst, in_bit;
  logic detect;

  seq1011_debug dut(.clk(clk), .rst(rst), .in_bit(in_bit), .detect(detect));

  always #5 clk = ~clk;

  task drive(input logic b);
    begin
      in_bit = b;
      @(posedge clk);
      #1;
      $display("t=%0t in=%0b detect=%0b", $time, in_bit, detect);
    end
  endtask

  initial begin
    clk = 0; rst = 1; in_bit = 0;
    repeat (2) @(posedge clk);
    rst = 0;

    // pattern: 1 0 1 1 => detect should pulse at final bit
    drive(1); drive(0); drive(1); drive(1);

    // overlap pattern
    drive(0); drive(1); drive(1);

    #20 $finish;
  end

  initial begin
    $dumpfile("dump.vcd");
    $dumpvars(0, tb_seq1011_debug);
  end
endmodule`
  },
  {
    id: 'rtl-debug-fifo-flags',
    title: 'Synchronous FIFO — Full Flag Off-by-One',
    category: 'FIFO',
    difficulty: 'Hard',
    bugType: 'pointer / flag logic',
    summary: 'Fix a synchronous FIFO whose full flag asserts too early, causing usable entries to be lost.',
    signals: ['clk', 'rst', 'wr_en', 'rd_en', 'wptr', 'rptr', 'count', 'full', 'empty'],
    expectedBehavior: [
      'full must assert only when FIFO reaches DEPTH entries.',
      'empty must assert only when FIFO has 0 entries.',
      'Simultaneous read+write should preserve count (when both legal).'
    ],
    hiddenChecks: [
      'Fill to DEPTH and verify final write acceptance',
      'Pointer wraparound after multiple cycles',
      'Simultaneous read/write near boundaries'
    ],
    hints: [
      'Look at count update order when wr_en and rd_en happen together.',
      'Check full assignment threshold against DEPTH.',
      'Flags should be derived from next count or carefully ordered sequential updates.'
    ],
    buggyRtl: `module fifo_debug #(
  parameter int DEPTH = 4,
  parameter int WIDTH = 8
) (
  input  logic             clk,
  input  logic             rst,
  input  logic             wr_en,
  input  logic             rd_en,
  input  logic [WIDTH-1:0] din,
  output logic [WIDTH-1:0] dout,
  output logic             full,
  output logic             empty
);
  logic [WIDTH-1:0] mem [0:DEPTH-1];
  logic [$clog2(DEPTH)-1:0] wptr, rptr;
  logic [$clog2(DEPTH+1)-1:0] count;

  always_ff @(posedge clk or posedge rst) begin
    if (rst) begin
      wptr  <= '0;
      rptr  <= '0;
      count <= '0;
      dout  <= '0;
    end else begin
      if (wr_en && !full) begin
        mem[wptr] <= din;
        wptr <= (wptr == DEPTH-1) ? '0 : wptr + 1'b1;
        count <= count + 1'b1;
      end
      if (rd_en && !empty) begin
        dout <= mem[rptr];
        rptr <= (rptr == DEPTH-1) ? '0 : rptr + 1'b1;
        count <= count - 1'b1;
      end
    end
  end

  // BUG
  assign full  = (count == DEPTH-1);
  assign empty = (count == 0);
endmodule`,
    testbench: `module tb_fifo_debug;
  logic clk, rst, wr_en, rd_en;
  logic [7:0] din, dout;
  logic full, empty;

  fifo_debug #(.DEPTH(4), .WIDTH(8)) dut(
    .clk(clk), .rst(rst), .wr_en(wr_en), .rd_en(rd_en),
    .din(din), .dout(dout), .full(full), .empty(empty)
  );

  always #5 clk = ~clk;

  task do_write(input [7:0] v);
    begin
      @(negedge clk);
      wr_en = 1; rd_en = 0; din = v;
      @(negedge clk);
      wr_en = 0;
      $display("WRITE %0d full=%0b empty=%0b", v, full, empty);
    end
  endtask

  initial begin
    clk=0; rst=1; wr_en=0; rd_en=0; din='0;
    repeat (2) @(posedge clk);
    rst=0;

    do_write(8'h11);
    do_write(8'h22);
    do_write(8'h33);
    do_write(8'h44); // should still be accepted before full=1

    #20 $finish;
  end

  initial begin
    $dumpfile("dump.vcd");
    $dumpvars(0, tb_fifo_debug);
  end
endmodule`
  },
  {
    id: 'rtl-debug-valid-ready',
    title: 'Valid/Ready Handshake — Data Instability',
    category: 'Protocol',
    difficulty: 'Medium',
    bugType: 'handshake stability',
    summary: 'Data changes while valid remains asserted and ready is low. Fix producer-side holding behavior.',
    signals: ['clk', 'rst', 'src_valid', 'src_ready', 'src_data', 'load_new'],
    expectedBehavior: [
      'When valid=1 and ready=0, src_data must remain stable.',
      'Data may change only on a successful transfer or when idle.',
      'Reset should clear valid cleanly.'
    ],
    hiddenChecks: [
      'Backpressure for 3+ cycles',
      'Random ready toggles with repeated loads',
      'Reset during backpressure'
    ],
    hints: [
      'Check whether src_data is updated whenever load_new is high, regardless of backpressure.',
      'Hold valid/data until a handshake occurs (valid && ready).',
      'Think in terms of “accept new request” vs “present current request”.'
    ],
    buggyRtl: `module handshake_debug (
  input  logic       clk,
  input  logic       rst,
  input  logic       load_new,
  input  logic [7:0] load_data,
  input  logic       src_ready,
  output logic       src_valid,
  output logic [7:0] src_data
);
  always_ff @(posedge clk or posedge rst) begin
    if (rst) begin
      src_valid <= 1'b0;
      src_data  <= 8'h00;
    end else begin
      if (load_new) begin
        src_valid <= 1'b1;
        src_data  <= load_data; // BUG
      end else if (src_valid && src_ready) begin
        src_valid <= 1'b0;
      end
    end
  end
endmodule`,
    testbench: `module tb_handshake_debug;
  logic clk, rst, load_new, src_ready, src_valid;
  logic [7:0] load_data, src_data;

  handshake_debug dut(
    .clk(clk), .rst(rst), .load_new(load_new), .load_data(load_data),
    .src_ready(src_ready), .src_valid(src_valid), .src_data(src_data)
  );

  always #5 clk = ~clk;

  initial begin
    clk=0; rst=1; load_new=0; load_data=0; src_ready=0;
    repeat (2) @(posedge clk);
    rst=0;

    @(negedge clk); load_new=1; load_data=8'hA1;
    @(negedge clk); load_new=0;

    // Backpressure: data should remain A1
    repeat (2) begin
      @(negedge clk); load_new=1; load_data = load_data + 8'h11;
      @(negedge clk); load_new=0;
    end

    @(negedge clk); src_ready=1;
    @(negedge clk); src_ready=0;

    #20 $finish;
  end

  initial begin
    $dumpfile("dump.vcd");
    $dumpvars(0, tb_handshake_debug);
  end
endmodule`
  },
  {
    id: 'rtl-debug-counter-termcount',
    title: 'Counter — Terminal Count Glitch',
    category: 'Counter',
    difficulty: 'Easy',
    bugType: 'combinational output timing',
    summary: 'Terminal-count pulse is generated from the current count and appears one cycle late for a mod-10 counter.',
    signals: ['clk', 'rst', 'en', 'count', 'tc_pulse'],
    expectedBehavior: [
      'tc_pulse should assert exactly when count transitions from 9 back to 0.',
      'Pulse width should be one cycle only.',
      'Counter should restart cleanly after reset.'
    ],
    hiddenChecks: [
      'Continuous enable for >20 cycles',
      'Enable pauses near terminal count',
      'Reset asserted close to wraparound'
    ],
    hints: [
      'Check whether tc_pulse is computed using current count or next count.',
      'A terminal-count pulse is often easiest to derive from the same condition that causes wrap.',
      'Make sure tc_pulse deasserts on non-wrap cycles.'
    ],
    buggyRtl: `module mod10_counter_debug (
  input  logic       clk,
  input  logic       rst,
  input  logic       en,
  output logic [3:0] count,
  output logic       tc_pulse
);
  always_ff @(posedge clk or posedge rst) begin
    if (rst) begin
      count     <= 4'd0;
      tc_pulse  <= 1'b0;
    end else if (en) begin
      if (count == 4'd9) count <= 4'd0;
      else               count <= count + 4'd1;

      // BUG
      tc_pulse <= (count == 4'd0);
    end else begin
      tc_pulse <= 1'b0;
    end
  end
endmodule`,
    testbench: `module tb_mod10_counter_debug;
  logic clk, rst, en;
  logic [3:0] count;
  logic tc_pulse;

  mod10_counter_debug dut(.clk(clk), .rst(rst), .en(en), .count(count), .tc_pulse(tc_pulse));

  always #5 clk = ~clk;

  initial begin
    clk=0; rst=1; en=0;
    repeat (2) @(posedge clk);
    rst=0; en=1;
    repeat (15) begin
      @(posedge clk); #1;
      $display("t=%0t count=%0d tc=%0b", $time, count, tc_pulse);
    end
    #10 $finish;
  end

  initial begin
    $dumpfile("dump.vcd");
    $dumpvars(0, tb_mod10_counter_debug);
  end
endmodule`
  },
  {
    id: 'rtl-debug-shiftreg-load',
    title: 'Shift Register — Parallel Load Priority Bug',
    category: 'Shift Register',
    difficulty: 'Medium',
    bugType: 'control priority',
    summary: 'When load and shift are asserted together, the register shifts instead of taking the parallel load.',
    signals: ['clk', 'rst', 'load', 'shift_en', 'ser_in', 'par_in', 'q'],
    expectedBehavior: [
      'Parallel load should have higher priority than shift.',
      'Shift should occur only when load=0 and shift_en=1.',
      'Reset should clear q to 0.'
    ],
    hiddenChecks: [
      'load and shift_en high in same cycle',
      'Back-to-back load then shift',
      'Reset between operations'
    ],
    hints: [
      'Review if/else ordering in the sequential block.',
      'Interviewers often expect an explicit control priority comment and implementation.',
      'Simulate a cycle where load=1 and shift_en=1 to see the wrong behavior.'
    ],
    buggyRtl: `module shiftreg_debug (
  input  logic       clk,
  input  logic       rst,
  input  logic       load,
  input  logic       shift_en,
  input  logic       ser_in,
  input  logic [7:0] par_in,
  output logic [7:0] q
);
  always_ff @(posedge clk or posedge rst) begin
    if (rst) begin
      q <= 8'h00;
    end else if (shift_en) begin
      q <= {q[6:0], ser_in}; // BUG
    end else if (load) begin
      q <= par_in;
    end
  end
endmodule`,
    testbench: `module tb_shiftreg_debug;
  logic clk, rst, load, shift_en, ser_in;
  logic [7:0] par_in, q;

  shiftreg_debug dut(.clk(clk), .rst(rst), .load(load), .shift_en(shift_en), .ser_in(ser_in), .par_in(par_in), .q(q));

  always #5 clk = ~clk;

  initial begin
    clk=0; rst=1; load=0; shift_en=0; ser_in=0; par_in=8'h00;
    repeat (2) @(posedge clk); rst=0;

    @(negedge clk); par_in=8'hA5; load=1; shift_en=1; ser_in=1'b1; // load should win
    @(negedge clk); load=0; shift_en=0;
    @(posedge clk); #1; $display("q=%h (expected A5)", q);

    @(negedge clk); shift_en=1; ser_in=1'b1;
    @(negedge clk); shift_en=0;
    @(posedge clk); #1; $display("q after shift=%h", q);

    #20 $finish;
  end

  initial begin
    $dumpfile("dump.vcd");
    $dumpvars(0, tb_shiftreg_debug);
  end
endmodule`
  },
  {
    id: 'rtl-debug-arbiter-starvation',
    title: 'Arbiter — Priority Starvation in Round-Robin Wrapper',
    category: 'Arbiter',
    difficulty: 'Hard',
    bugType: 'fairness / pointer update',
    summary: 'A 2-request round-robin arbiter wrapper forgets to advance priority after a grant, causing repeated grants to the same requester.',
    signals: ['clk', 'rst', 'req', 'grant', 'rr_ptr'],
    expectedBehavior: [
      'With both requests asserted continuously, grants should alternate.',
      'rr_ptr should advance only on successful grants.',
      'Reset should initialize arbitration pointer deterministically.'
    ],
    hiddenChecks: [
      'Both req bits held high for 10 cycles',
      'One requester toggles while other remains high',
      'Reset in middle of contention'
    ],
    hints: [
      'Watch rr_ptr in waveform when grants are issued.',
      'If grants repeat to req[0], check pointer update condition.',
      'Round-robin fairness often breaks when pointer update is missing or gated incorrectly.'
    ],
    buggyRtl: `module rr_arbiter_debug (
  input  logic       clk,
  input  logic       rst,
  input  logic [1:0] req,
  output logic [1:0] grant
);
  logic rr_ptr;

  always_ff @(posedge clk or posedge rst) begin
    if (rst) begin
      rr_ptr <= 1'b0;
      grant  <= 2'b00;
    end else begin
      grant <= 2'b00;
      if (!rr_ptr) begin
        if (req[0])      grant <= 2'b01;
        else if (req[1]) grant <= 2'b10;
      end else begin
        if (req[1])      grant <= 2'b10;
        else if (req[0]) grant <= 2'b01;
      end
      // BUG
      if (grant[1]) rr_ptr <= ~rr_ptr;
    end
  end
endmodule`,
    testbench: `module tb_rr_arbiter_debug;
  logic clk, rst;
  logic [1:0] req, grant;

  rr_arbiter_debug dut(.clk(clk), .rst(rst), .req(req), .grant(grant));

  always #5 clk = ~clk;

  initial begin
    clk=0; rst=1; req=2'b00;
    repeat (2) @(posedge clk); rst=0;
    req=2'b11;
    repeat (8) begin
      @(posedge clk); #1;
      $display("t=%0t req=%b grant=%b rr_ptr=%0b", $time, req, grant, dut.rr_ptr);
    end
    #20 $finish;
  end

  initial begin
    $dumpfile("dump.vcd");
    $dumpvars(0, tb_rr_arbiter_debug);
  end
endmodule`
  },
  {
    id: 'rtl-debug-apb-ready',
    title: 'APB Slave — PREADY Asserted in Setup Phase',
    category: 'APB',
    difficulty: 'Medium',
    bugType: 'protocol phase timing',
    summary: 'APB slave asserts PREADY during setup instead of access phase, creating protocol timing violations.',
    signals: ['PCLK', 'PRESETn', 'PSEL', 'PENABLE', 'PWRITE', 'PREADY', 'PRDATA'],
    expectedBehavior: [
      'PREADY should only assert in the access phase (PSEL=1 and PENABLE=1).',
      'Read data should be valid when transfer completes.',
      'Reset should deassert PREADY.'
    ],
    hiddenChecks: [
      'Read transfer with wait-state insertion',
      'Write transfer timing',
      'Back-to-back APB accesses'
    ],
    hints: [
      'APB has setup and access phases — check PENABLE usage carefully.',
      'If PREADY rises with PSEL before PENABLE, the slave is responding too early.',
      'Gate PREADY and data completion logic to the access phase.'
    ],
    buggyRtl: `module apb_slave_debug (
  input  logic       PCLK,
  input  logic       PRESETn,
  input  logic       PSEL,
  input  logic       PENABLE,
  input  logic       PWRITE,
  input  logic [7:0] PWDATA,
  output logic       PREADY,
  output logic [7:0] PRDATA
);
  logic [7:0] reg0;

  always_ff @(posedge PCLK or negedge PRESETn) begin
    if (!PRESETn) begin
      reg0   <= 8'h00;
      PRDATA <= 8'h00;
      PREADY <= 1'b0;
    end else begin
      PREADY <= 1'b0;
      if (PSEL) begin
        PREADY <= 1'b1; // BUG
        if (PWRITE) reg0 <= PWDATA;
        else        PRDATA <= reg0;
      end
    end
  end
endmodule`,
    testbench: `module tb_apb_slave_debug;
  logic PCLK, PRESETn, PSEL, PENABLE, PWRITE, PREADY;
  logic [7:0] PWDATA, PRDATA;

  apb_slave_debug dut(
    .PCLK(PCLK), .PRESETn(PRESETn), .PSEL(PSEL), .PENABLE(PENABLE),
    .PWRITE(PWRITE), .PWDATA(PWDATA), .PREADY(PREADY), .PRDATA(PRDATA)
  );

  always #5 PCLK = ~PCLK;

  initial begin
    PCLK=0; PRESETn=0; PSEL=0; PENABLE=0; PWRITE=0; PWDATA=8'h00;
    repeat (2) @(posedge PCLK); PRESETn=1;
    @(negedge PCLK); PSEL=1; PENABLE=0; PWRITE=0;
    @(posedge PCLK); #1; $display("setup phase PREADY=%0b (should be 0)", PREADY);
    @(negedge PCLK); PENABLE=1;
    @(posedge PCLK); #1; $display("access phase PREADY=%0b", PREADY);
    @(negedge PCLK); PSEL=0; PENABLE=0;
    #20 $finish;
  end

  initial begin
    $dumpfile("dump.vcd");
    $dumpvars(0, tb_apb_slave_debug);
  end
endmodule`
  }
,

  {
    id: 'rtl-debug-edge-detector',
    title: 'Edge Detector — Double Pulse on Held Input',
    category: 'Pulse Logic',
    difficulty: 'Medium',
    bugType: 'pulse generation / ordering',
    summary: 'Rising-edge detector incorrectly behaves like level detect and keeps pulsing while input stays high.',
    signals: ['clk', 'rst', 'sig_in', 'prev_in', 'pulse'],
    expectedBehavior: [
      'pulse should be high for exactly one cycle on a rising edge only.',
      'Holding sig_in high for multiple cycles must not generate repeated pulses.',
      'Reset should clear pulse and previous-sample state.'
    ],
    hiddenChecks: [
      'Long high hold',
      'Rapid toggle 010101',
      'Reset during asserted input'
    ],
    hints: [
      'A pulse output usually needs a default deassert every cycle.',
      'Compare edge-detect expression with level-detect expression.',
      'Check how prev_in is updated relative to pulse generation.'
    ],
    buggyRtl: `module edge_detector_debug(
  input  logic clk,
  input  logic rst,
  input  logic sig_in,
  output logic pulse
);
  logic prev_in;

  always_ff @(posedge clk or posedge rst) begin
    if (rst) begin
      prev_in <= 1'b0;
      pulse   <= 1'b0;
    end else begin
      prev_in <= sig_in;
      pulse   <= sig_in & ~prev_in;
      if (sig_in) pulse <= 1'b1; // BUG
    end
  end
endmodule`,
    testbench: `module tb_edge_detector_debug;
  logic clk, rst, sig_in;
  logic pulse;

  edge_detector_debug dut(.clk(clk), .rst(rst), .sig_in(sig_in), .pulse(pulse));

  always #5 clk = ~clk;

  initial begin
    clk=0; rst=1; sig_in=0;
    repeat (2) @(posedge clk);
    rst=0;

    @(negedge clk); sig_in=1;
    repeat (3) @(posedge clk); // pulse should be 1 for only first cycle
    @(negedge clk); sig_in=0;
    @(posedge clk);

    @(negedge clk); sig_in=1;
    @(posedge clk);
    @(negedge clk); sig_in=0;
    @(posedge clk);

    #20 $finish;
  end

  initial begin
    $dumpfile("dump.vcd");
    $dumpvars(0, tb_edge_detector_debug);
  end
endmodule`
  },
  {
    id: 'rtl-debug-ram-samecycle',
    title: 'Single-Port RAM — Read-After-Write Mismatch',
    category: 'Memory',
    difficulty: 'Medium',
    bugType: 'read/write timing semantics',
    summary: 'Synchronous RAM read data is captured from the wrong source during write cycles, causing confusing read-after-write behavior.',
    signals: ['clk', 'we', 'addr', 'wdata', 'rdata'],
    expectedBehavior: [
      'Writes should update memory contents only when we is asserted.',
      'Reads should return stored data for the selected address on the expected cycle.',
      'Behavior should be consistent and deterministic across repeated accesses.'
    ],
    hiddenChecks: [
      'Write/read same address on consecutive cycles',
      'Multiple address writes',
      'Read untouched address'
    ],
    hints: [
      'Check what rdata is assigned during write cycles.',
      'Decide the intended RAM semantics and implement one consistently.',
      'Waveform should show memory update first, then readback matching stored value.'
    ],
    buggyRtl: `module ram_sp_debug(
  input  logic       clk,
  input  logic       we,
  input  logic [1:0] addr,
  input  logic [7:0] wdata,
  output logic [7:0] rdata
);
  logic [7:0] mem [0:3];

  always_ff @(posedge clk) begin
    if (we) begin
      mem[addr] <= wdata;
      rdata <= mem[addr]; // BUG:
    end else begin
      rdata <= mem[addr];
    end
  end
endmodule`,
    testbench: `module tb_ram_sp_debug;
  logic clk, we;
  logic [1:0] addr;
  logic [7:0] wdata, rdata;

  ram_sp_debug dut(.clk(clk), .we(we), .addr(addr), .wdata(wdata), .rdata(rdata));

  always #5 clk = ~clk;

  initial begin
    clk=0; we=0; addr=0; wdata=8'h00;
    @(posedge clk);

    @(negedge clk); we=1; addr=2'd1; wdata=8'hAA;
    @(posedge clk);
    @(negedge clk); we=0; addr=2'd1;
    @(posedge clk); #1; $display("read @1 = %h (expect AA)", rdata);

    @(negedge clk); we=1; addr=2'd2; wdata=8'h55;
    @(posedge clk);
    @(negedge clk); we=0; addr=2'd2;
    @(posedge clk); #1; $display("read @2 = %h (expect 55)", rdata);

    #20 $finish;
  end

  initial begin
    $dumpfile("dump.vcd");
    $dumpvars(0, tb_ram_sp_debug);
  end
endmodule`
  },
  {
    id: 'rtl-debug-reqack-sticky-ack',
    title: 'Req/Ack Handshake — ACK Stuck High',
    category: 'Handshake',
    difficulty: 'Easy',
    bugType: 'ack pulse width',
    summary: 'ACK should be a pulse, but buggy logic keeps ACK high when REQ remains asserted.',
    signals: ['clk', 'rst', 'req', 'ack', 'busy'],
    expectedBehavior: [
      'ack should pulse for one cycle when a request is accepted.',
      'ack must deassert even if req stays high.',
      'busy should return low after service.'
    ],
    hiddenChecks: [
      'REQ held high',
      'Back-to-back requests',
      'Reset while busy'
    ],
    hints: [
      'Pulse outputs need an explicit default low or tightly scoped assertion condition.',
      'Check for extra assignments to ack later in the always_ff block.',
      'Differentiate request level from request acceptance event.'
    ],
    buggyRtl: `module req_ack_debug(
  input  logic clk,
  input  logic rst,
  input  logic req,
  output logic ack
);
  logic busy;

  always_ff @(posedge clk or posedge rst) begin
    if (rst) begin
      ack  <= 1'b0;
      busy <= 1'b0;
    end else begin
      if (req && !busy) begin
        ack  <= 1'b1;
        busy <= 1'b1;
      end else if (busy) begin
        busy <= 1'b0;
      end
      if (req) ack <= 1'b1; // BUG
    end
  end
endmodule`,
    testbench: `module tb_req_ack_debug;
  logic clk, rst, req, ack;
  req_ack_debug dut(.clk(clk), .rst(rst), .req(req), .ack(ack));

  always #5 clk = ~clk;

  initial begin
    clk=0; rst=1; req=0;
    repeat (2) @(posedge clk);
    rst=0;

    @(negedge clk); req=1;
    repeat (4) @(posedge clk); // ack should not stay high all 4 cycles
    @(negedge clk); req=0;
    @(posedge clk);

    @(negedge clk); req=1;
    @(posedge clk);
    @(negedge clk); req=0;
    @(posedge clk);

    #20 $finish;
  end

  initial begin
    $dumpfile("dump.vcd");
    $dumpvars(0, tb_req_ack_debug);
  end
endmodule`
  },
  {
    id: 'rtl-debug-onehot-fsm-nextstate',
    title: 'One-Hot FSM — Missing Default Next-State',
    category: 'FSM',
    difficulty: 'Medium',
    bugType: 'always_comb stale next_state',
    summary: 'One-hot FSM misses a default next_state assignment in combinational logic, causing stale transitions and hard-to-read waveforms.',
    signals: ['clk', 'rst', 'start', 'done', 'state', 'next_state'],
    expectedBehavior: [
      'next_state should be fully assigned in every combinational evaluation.',
      'FSM should transition IDLE->BUSY on start and BUSY->IDLE on done.',
      'Reset must return to IDLE one-hot encoding.'
    ],
    hiddenChecks: [
      'No-start idle cycles',
      'Done pulse without busy state',
      'Repeated start/done activity'
    ],
    hints: [
      'Check always_comb for a default assignment such as next_state = state.',
      'Missing assignments can infer latches or stale combinational values.',
      'Waveforms often show next_state stuck at a previous value when no branch executes.'
    ],
    buggyRtl: `module onehot_fsm_debug(
  input  logic clk,
  input  logic rst,
  input  logic start,
  input  logic done,
  output logic [1:0] state
);
  logic [1:0] next_state;
  localparam logic [1:0] IDLE = 2'b01, BUSY = 2'b10;

  always_comb begin
    // BUG
    case (state)
      IDLE: if (start) next_state = BUSY;
      BUSY: if (done)  next_state = IDLE;
    endcase
  end

  always_ff @(posedge clk or posedge rst) begin
    if (rst) state <= IDLE;
    else     state <= next_state;
  end
endmodule`,
    testbench: `module tb_onehot_fsm_debug;
  logic clk, rst, start, done;
  logic [1:0] state;

  onehot_fsm_debug dut(.clk(clk), .rst(rst), .start(start), .done(done), .state(state));

  always #5 clk = ~clk;

  initial begin
    clk=0; rst=1; start=0; done=0;
    repeat (2) @(posedge clk);
    rst=0;

    @(negedge clk); start=1;
    @(posedge clk);
    @(negedge clk); start=0;
    repeat (2) @(posedge clk);

    @(negedge clk); done=1;
    @(posedge clk);
    @(negedge clk); done=0;
    repeat (2) @(posedge clk);

    #20 $finish;
  end

  initial begin
    $dumpfile("dump.vcd");
    $dumpvars(0, tb_onehot_fsm_debug);
  end
endmodule`
  }];


export default RTL_DEBUG_WAVEFORM_CHALLENGES;
