// ============================================================
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
