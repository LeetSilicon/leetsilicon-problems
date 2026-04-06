/**
 * rtlDebugSolutions.js — Fixed RTL solutions for RTL Debug Waveform Challenges
 * Only the corrected module is provided; testbenches are already given.
 * Each entry maps challenge id → { fixedRtl, bugExplained }
 */

export const rtlDebugSolutions = {

  // ─── 1. FSM Sequence Detector — Late Detect Pulse ─────────────────────────
  // BUG:  detect is registered using the CURRENT state, so it is visible
  //       one cycle after the pattern completes.
  // FIX:  Compute detect combinationally from next_state and in_bit so it
  //       asserts in the SAME cycle the final bit arrives.
  'rtl-debug-fsm-reset': {
    bugExplained: `
detect was registered inside always_ff using (state == S101 && in_bit).
Because state only updates on the NEXT posedge, the assignment
"detect <= (state == S101 && in_bit)" becomes visible one clock after
the matching bit arrives — one cycle late.
Fix: derive detect combinationally from next_state so it is visible
in the same cycle that the sequence completes.`,

    fixedRtl: `module seq1011_debug (
  input  logic clk,
  input  logic rst,
  input  logic in_bit,
  output logic detect
);
  typedef enum logic [1:0] {S0, S1, S10, S101} state_t;
  state_t state, next_state;

  // Next-state logic (unchanged)
  always_comb begin
    next_state = state;
    case (state)
      S0:   next_state = in_bit ? S1   : S0;
      S1:   next_state = in_bit ? S1   : S10;
      S10:  next_state = in_bit ? S101 : S0;
      S101: next_state = in_bit ? S1   : S10;
      default: next_state = S0;
    endcase
  end

  // FIX: detect is now combinational — asserts the same cycle
  //      the final '1' of "1011" is sampled.
  assign detect = (state == S101) && in_bit;

  // State register (detect removed from here)
  always_ff @(posedge clk or posedge rst) begin
    if (rst) state <= S0;
    else     state <= next_state;
  end
endmodule`
  },

  // ─── 2. Synchronous FIFO — Full Flag Off-by-One ────────────────────────────
  // BUG1: full = (count == DEPTH-1) triggers one entry too early.
  // BUG2: Simultaneous wr_en + rd_en both execute sequentially in one
  //       always_ff block; the second assignment to count clobbers the
  //       first, so only the decrement takes effect.
  // FIX:  full = (count == DEPTH). For simultaneous R+W, compute the
  //       net count update in one expression so count stays correct.
  'rtl-debug-fifo-flags': {
    bugExplained: `
BUG 1 — Off-by-one in full flag:
  assign full = (count == DEPTH-1) fires when there is still one slot
  free, blocking the last legal write.
  Fix: assign full = (count == DEPTH).

BUG 2 — Simultaneous read + write clobbers count:
  The two sequential statements
      count <= count + 1;   // write path
      count <= count - 1;   // read path
  both targeting count in the same always_ff block mean only the
  LAST nonblocking assignment wins (the decrement).
  Fix: compute the net delta in a single conditional expression.`,

    fixedRtl: `module fifo_debug #(
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
  logic [WIDTH-1:0]        mem   [0:DEPTH-1];
  logic [$clog2(DEPTH)-1:0] wptr, rptr;
  logic [$clog2(DEPTH+1)-1:0] count;

  // FIX: correct thresholds
  assign full  = (count == DEPTH);
  assign empty = (count == 0);

  always_ff @(posedge clk or posedge rst) begin
    if (rst) begin
      wptr  <= '0;
      rptr  <= '0;
      count <= '0;
      dout  <= '0;
    end else begin
      // FIX: single count update handles all cases correctly
      unique case ({wr_en && !full, rd_en && !empty})
        2'b10: count <= count + 1'b1;
        2'b01: count <= count - 1'b1;
        default: count <= count;   // both or neither — net zero
      endcase

      if (wr_en && !full) begin
        mem[wptr] <= din;
        wptr      <= (wptr == DEPTH-1) ? '0 : wptr + 1'b1;
      end

      if (rd_en && !empty) begin
        dout <= mem[rptr];
        rptr <= (rptr == DEPTH-1) ? '0 : rptr + 1'b1;
      end
    end
  end
endmodule`
  },

  // ─── 3. Valid/Ready Handshake — Data Instability ───────────────────────────
  // BUG:  src_data (and src_valid) are updated whenever load_new is high,
  //       even while valid=1 and ready=0 (backpressure active).
  //       This violates the AXI/handshake rule: once valid is asserted,
  //       data must not change until the handshake completes.
  // FIX:  Only accept a new request when the channel is idle
  //       (src_valid == 0) OR a transfer just completed (src_valid && src_ready).
  'rtl-debug-valid-ready': {
    bugExplained: `
The original code updates src_data unconditionally whenever load_new=1:
    if (load_new) begin
        src_valid <= 1'b1;
        src_data  <= load_data;   // overwrites held data during backpressure
    end
This corrupts in-flight data while the receiver is not ready.
Fix: gate the acceptance of a new item so it only happens when
the bus is free (not valid) or a successful handshake just occurred.`,

    fixedRtl: `module handshake_debug (
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
      // FIX: only accept new data when channel is free or handshake completes
      if (load_new && (!src_valid || src_ready)) begin
        src_valid <= 1'b1;
        src_data  <= load_data;
      end else if (src_valid && src_ready) begin
        // Transfer completed, no new load — go idle
        src_valid <= 1'b0;
      end
    end
  end
endmodule`
  },

  // ─── 4. Counter — Terminal Count Glitch ────────────────────────────────────
  // BUG:  tc_pulse <= (count == 4'd0) reads count BEFORE the wrap update,
  //       so the pulse fires when count is already 0 (the cycle after wrap)
  //       instead of when count transitions from 9 → 0.
  // FIX:  Compute tc_pulse from the CURRENT count being 9 (the wrap condition),
  //       so the pulse is registered exactly when count goes 9 → 0.
  'rtl-debug-counter-termcount': {
    bugExplained: `
tc_pulse <= (count == 4'd0) samples count at the clock edge.
At the wrap clock edge, count is still 9 (the new value 0 is the
nonblocking update not yet visible), so the condition is false.
On the NEXT cycle count == 0, so tc_pulse fires one cycle late
and stays high for the entire time count remains 0 (i.e. one full cycle).
Fix: assert tc_pulse when count == 9 AND en is high — that is exactly
the cycle the counter wraps — so tc_pulse rises one cycle earlier
and reflects the transition, not the arrived state.`,

    fixedRtl: `module mod10_counter_debug (
  input  logic       clk,
  input  logic       rst,
  input  logic       en,
  output logic [3:0] count,
  output logic       tc_pulse
);
  always_ff @(posedge clk or posedge rst) begin
    if (rst) begin
      count    <= 4'd0;
      tc_pulse <= 1'b0;
    end else if (en) begin
      // FIX: pulse when count is AT the terminal value (about to wrap)
      tc_pulse <= (count == 4'd9);

      if (count == 4'd9) count <= 4'd0;
      else               count <= count + 4'd1;
    end else begin
      tc_pulse <= 1'b0;
    end
  end
endmodule`
  },

  // ─── 5. Shift Register — Parallel Load Priority Bug ────────────────────────
  // BUG:  shift_en is checked before load in the if-else chain, so when
  //       both are asserted the register shifts instead of loading.
  // FIX:  Swap the priority: check load first, shift second.
  'rtl-debug-shiftreg-load': {
    bugExplained: `
The original priority order is:
    else if (shift_en) { shift }
    else if (load)     { load  }
When load=1 and shift_en=1 simultaneously, shift_en wins because it
appears first in the if-else ladder.
Fix: place load before shift_en so parallel load has higher priority.`,

    fixedRtl: `module shiftreg_debug (
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
    // FIX: load has priority over shift_en
    end else if (load) begin
      q <= par_in;
    end else if (shift_en) begin
      q <= {q[6:0], ser_in};
    end
  end
endmodule`
  },

  // ─── 6. Arbiter — Priority Starvation in Round-Robin Wrapper ───────────────
  // BUG:  The pointer update uses the NEW (nonblocking) grant:
  //         if (grant[1]) rr_ptr <= ~rr_ptr;
  //       Because grant was just written with a nonblocking assignment in
  //       the same always_ff block, grant[1] still reads the OLD value
  //       (2'b00 from the default clear at the top of the block).
  //       So rr_ptr NEVER advances and req[0] always wins.
  // FIX:  Derive the pointer advance from the combinational grant result,
  //       not the registered value. Use a wire for the combinational grant
  //       and update rr_ptr from that wire.
  'rtl-debug-arbiter-starvation': {
    bugExplained: `
grant is updated with a nonblocking assignment earlier in the block:
    grant <= 2'b00;
    ...
    if (req[0]) grant <= 2'b01;
Then the pointer check reads the SAME registered signal:
    if (grant[1]) rr_ptr <= ~rr_ptr;
Because nonblocking assignments do not take effect until end-of-timeslot,
grant[1] is still 2'b00 (cleared by the default at the top), so
rr_ptr never toggles and req[0] is always favoured.
Fix: compute grant combinationally in an always_comb block and
update rr_ptr from the combinational signal in the always_ff block.`,

    fixedRtl: `module rr_arbiter_debug (
  input  logic       clk,
  input  logic       rst,
  input  logic [1:0] req,
  output logic [1:0] grant
);
  logic rr_ptr;

  // FIX: compute grant combinationally so rr_ptr can observe it
  logic [1:0] grant_next;

  always_comb begin
    grant_next = 2'b00;
    if (!rr_ptr) begin
      if      (req[0]) grant_next = 2'b01;
      else if (req[1]) grant_next = 2'b10;
    end else begin
      if      (req[1]) grant_next = 2'b10;
      else if (req[0]) grant_next = 2'b01;
    end
  end

  always_ff @(posedge clk or posedge rst) begin
    if (rst) begin
      rr_ptr <= 1'b0;
      grant  <= 2'b00;
    end else begin
      grant <= grant_next;
      // FIX: advance pointer using combinational grant_next, not registered grant
      if (grant_next[1]) rr_ptr <= ~rr_ptr;
    end
  end
endmodule`
  },

  // ─── 7. APB Slave — PREADY Asserted in Setup Phase ─────────────────────────
  // BUG:  PREADY is raised whenever PSEL=1, including during the setup
  //       phase (PSEL=1, PENABLE=0). APB spec requires PREADY to be
  //       meaningful only during the access phase (PSEL=1 AND PENABLE=1).
  // FIX:  Gate PREADY, data capture, and register write on PENABLE as well.
  'rtl-debug-apb-ready': {
    bugExplained: `
The original code gates only on PSEL:
    if (PSEL) begin
        PREADY <= 1'b1;   // fires in setup phase too
        ...
    end
APB protocol: PREADY is only sampled when PSEL=1 AND PENABLE=1 (access
phase). Asserting it during the setup phase (PSEL=1, PENABLE=0) is a
protocol violation and can cause the master to complete the transfer
prematurely.
Fix: require both PSEL and PENABLE before asserting PREADY.`,

    fixedRtl: `module apb_slave_debug (
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
      // FIX: only assert PREADY (and transfer data) in the ACCESS phase
      if (PSEL && PENABLE) begin
        PREADY <= 1'b1;
        if (PWRITE) reg0   <= PWDATA;
        else        PRDATA <= reg0;
      end
    end
  end
endmodule`
  },

  // ─── 8. Edge Detector — Double Pulse on Held Input ─────────────────────────
  // BUG:  A second assignment `if (sig_in) pulse <= 1'b1` appears AFTER
  //       the correct edge-detect assignment inside the same always_ff block.
  //       Because the later nonblocking assignment wins, pulse becomes a
  //       level signal (high whenever sig_in is high) rather than a 1-cycle pulse.
  // FIX:  Remove the erroneous second assignment. The single correct line
  //       `pulse <= sig_in & ~prev_in` is sufficient.
  'rtl-debug-edge-detector': {
    bugExplained: `
Inside the always_ff block there are TWO assignments to pulse:
    pulse <= sig_in & ~prev_in;   // correct: rising-edge detect
    if (sig_in) pulse <= 1'b1;   // BUG: overwrites with level detect
The second (last) nonblocking assignment wins, turning pulse into a
level signal that stays high for the entire duration sig_in is asserted.
Fix: delete the second assignment entirely. The first line alone produces
the correct single-cycle pulse on the rising edge.`,

    fixedRtl: `module edge_detector_debug(
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
      // FIX: removed the erroneous "if (sig_in) pulse <= 1'b1" override
      pulse   <= sig_in & ~prev_in;
    end
  end
endmodule`
  },

  // ─── 9. Single-Port RAM — Read-After-Write Mismatch ────────────────────────
  // BUG:  During a write cycle, rdata is assigned from mem[addr] BEFORE
  //       the nonblocking write mem[addr] <= wdata takes effect.
  //       So the read returns the OLD contents — not the value being written.
  //       This is neither clean "write-first" nor "read-first" semantics.
  // FIX:  For write-first (new-data) semantics, return wdata directly when
  //       we is asserted and addr matches. For read-first, simply always
  //       read mem[addr] without the forwarding mux during writes.
  //       Here we implement write-first (most common expectation).
  'rtl-debug-ram-samecycle': {
    bugExplained: `
The buggy code:
    if (we) begin
        mem[addr] <= wdata;
        rdata     <= mem[addr];   // reads OLD value (nonblocking not yet applied)
    end
Because nonblocking assignments take effect at end-of-timeslot, mem[addr]
still holds its old value when rdata is assigned — giving stale read data
on write cycles.
Fix (write-first): when we=1, return wdata directly as rdata so the
read reflects the value being written in the same cycle.`,

    fixedRtl: `module ram_sp_debug(
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
      // FIX: write-first — return the new data being written
      rdata     <= wdata;
    end else begin
      rdata <= mem[addr];
    end
  end
endmodule`
  },

  // ─── 10. Req/Ack Handshake — ACK Stuck High ────────────────────────────────
  // BUG:  After the conditional block that correctly generates a one-cycle ack,
  //       a standalone `if (req) ack <= 1'b1` re-asserts ack every cycle
  //       req remains high, overwriting the intended clear.
  // FIX:  Remove the extra assignment. The first if/else-if block is already
  //       correct: ack pulses for one cycle then busy deasserts on the next.
  'rtl-debug-reqack-sticky-ack': {
    bugExplained: `
The always_ff block first correctly pulses ack for one cycle:
    if (req && !busy) begin
        ack  <= 1'b1;
        busy <= 1'b1;
    end else if (busy) begin
        busy <= 1'b0;
        // ack is implicitly 0 here via reset default
    end
But immediately after, an unconditional override fires:
    if (req) ack <= 1'b1;   // BUG — keeps ack high while req is held
This last nonblocking assignment wins every clock that req=1, so ack
never deasserts as long as req is asserted.
Fix: delete the extra if (req) ack assignment entirely.`,

    fixedRtl: `module req_ack_debug(
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
      // Default: deassert ack every cycle unless explicitly set below
      ack <= 1'b0;

      if (req && !busy) begin
        // FIX: accept new request — one-cycle ack pulse
        ack  <= 1'b1;
        busy <= 1'b1;
      end else if (busy) begin
        // Service complete — clear busy (ack stays 0 from default)
        busy <= 1'b0;
      end
      // FIX: removed  "if (req) ack <= 1'b1"  that was overriding the deassert
    end
  end
endmodule`
  }

};
