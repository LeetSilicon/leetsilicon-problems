# Split-Beat Driver

**Domain:** design-verification — Constraints  
**Difficulty:** Medium  
**Topics:** UVM, Driver, Split Transactions

---

## Problem Statement

Implement Driver that Splits 64-bit Transaction into Two 32-bit Beats

Design UVM driver for 32-bit data interface that receives 64-bit transactions from sequencer and splits each into two 32-bit beats. First beat transmits lower 32 bits [31:0], second beat transmits upper 32 bits [63:32]. Handle ready/valid handshake with backpressure. Support configurable inter-beat gap. Call item_done() only after both beats transmitted.

---

## Requirements

1. CLASS STRUCTURE: Extend uvm_driver#(my_transaction_64bit). Transaction has 64-bit data field.

2. INTERFACE: 32-bit data bus, valid signal (driver asserts), ready signal (DUT asserts for backpressure).

3. BEAT SPLITTING: For each 64-bit transaction: (1) First beat: drive data[31:0], assert valid, (2) Wait for ready, (3) Second beat: drive data[63:32], assert valid, (4) Wait for ready.

4. BACKPRESSURE: Before each beat, wait for ready signal. If ready=0, hold valid and data until ready=1.

5. INTER-BEAT GAP (Optional): Configurable cycles between beats. If gap=0, back-to-back. If gap>0, deassert valid for gap cycles.

6. ITEM DONE: Call seq_item_port.item_done() only after second beat completes (ready seen for second beat).

7. TRANSACTION INTEGRITY: Both beats belong to same transaction. If transaction has ID field, maintain same ID for both beats (if ID sent on bus).

8. RESET HANDLING: If reset asserts mid-transaction, abort current transaction and restart.

9. Test Case 1 - No Backpressure: ready always high. 64-bit transaction split into two consecutive beats. Verify both halves transmitted correctly.

10. Test Case 2 - Backpressure on First Beat: ready=0 for 3 cycles after first valid. Driver waits, then transmits first beat when ready=1. Then second beat.

11. Test Case 3 - Backpressure on Second Beat: First beat transmitted immediately. ready=0 for second beat. Driver waits, transmits when ready.

12. Test Case 4 - Inter-Beat Gap: gap=2 cycles. After first beat, valid=0 for 2 cycles, then second beat. Verify gap respected.

13. Test Case 5 - Multiple Transactions: Send 3 transactions back-to-back. Verify all 6 beats (2 per transaction) transmitted in order.

14. Test Case 6 - Reset During Transaction: First beat transmitted, reset asserts before second beat. Driver aborts, resets state.

---

## Hints


