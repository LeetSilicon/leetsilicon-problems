# Bus Protocol Address Alignment

**Domain:** design-verification — Constraints  
**Difficulty:** Hard  
**Topics:** Assertions, UVM, Bus Protocol

---

## Problem Statement

Write UVM Assertion: Bus Address and Data Alignment

Write assertion to verify bus protocol address and data alignment during transactions. Ensure address is properly aligned for data width. Integrate with UVM monitor.

---

## Requirements

1. BUS PROTOCOL: Define protocol (e.g., AXI, AHB, custom). Specify address and data widths.

2. ALIGNMENT RULE: Address must be aligned to data size. Example: For 32-bit (4-byte) data, address[1:0] == 0.

3. DATA BEAT SIZE: If protocol supports variable beat sizes (HSIZE, AxSIZE), alignment varies. addr % (2^SIZE) == 0.

4. HANDSHAKE: Check alignment only on valid transfers. Condition: (valid && ready) or protocol-specific handshake.

5. UVM INTEGRATION: Place assertion in interface (bind) or monitor. Use virtual interface in UVM components.

6. RESET: disable iff (rst).

7. Test Case 1 - Aligned Access: addr=0x100 (aligned to 4 bytes), data_size=4. Assertion passes.

8. Test Case 2 - Misaligned Access: addr=0x102 (misaligned), data_size=4. Assertion fails.

9. Test Case 3 - Variable Sizes: addr=0x104, size=2 (16-bit transfer). Alignment: addr%2==0. Passes.

10. Test Case 4 - Handshake Gating: valid=1, ready=0. No transfer, assertion not checked.

11. Test Case 5 - Coverage: Cover aligned and various misaligned patterns to ensure assertion tested.

---

## Hints


