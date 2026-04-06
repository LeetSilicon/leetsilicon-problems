# UVM RAL Register Access

**Domain:** design-verification — Constraints  
**Difficulty:** Hard  
**Topics:** Assertions, UVM, RAL

---

## Problem Statement

Write UVM RAL Assertion for Register Reads and Writes

Write assertions for UVM Register Abstraction Layer (RAL) to verify register read/write access policies (RO/WO/RW) and mirror value updates. Ensure register behavior correct.

---

## Requirements

1. ACCESS POLICY: Verify read/write access restrictions. RO: read-only (writes ignored). WO: write-only (reads return 0 or undefined). RW: read-write.

2. MIRROR VALUE: Verify RAL mirror value updated correctly after read/write.

3. RESET VALUE: Check register resets to default value after reset.

4. PREDICTED VALUE: After write, predicted value should match written value (for RW registers).

5. CALLBACKS: Hook into uvm_reg_cbs or monitor to sample register transactions.

6. Test Case 1 - RW Register: Write value to RW register. Read back. Verify value matches.

7. Test Case 2 - RO Register: Write to RO register. Verify write has no effect. Read returns original value.

8. Test Case 3 - WO Register: Write to WO register. Verify write accepted. Read returns 0 or undefined (per spec).

9. Test Case 4 - Reset Value: After reset, verify register value equals default from RAL model.

10. Test Case 5 - Mirror Update: After write, verify RAL mirror reflects new value. After read, mirror matches read value.

---

## Hints

<details>
<summary>Hint 1</summary>
RAL callbacks: class reg_cb extends uvm_reg_cbs; virtual task post_write(uvm_reg_item rw); assert(rw.status == UVM_IS_OK) else `uvm_error(...) endtask endclass
</details>

<details>
<summary>Hint 2</summary>
Access policy check: In callback: if(rw.element_kind == UVM_REG) begin uvm_reg r = rw.element; if(r.get_rights() == 
</details>

<details>
<summary>Hint 3</summary>
) assert(!rw.kind == UVM_WRITE) else `uvm_error(...) end
</details>

<details>
<summary>Hint 4</summary>
Mirror check: After write: assert(reg.get() == written_value) else `uvm_error(...)
</details>

<details>
<summary>Hint 5</summary>
Reset check: After reset: assert(reg.get() == reg.get_reset()) else `uvm_error(...)
</details>

<details>
<summary>Hint 6</summary>
Monitor-based: In bus monitor: On write transaction: if(addr == REG_ADDR) assert(access_allowed(addr, WRITE)) else `uvm_error(...)
</details>

<details>
<summary>Hint 7</summary>
Immediate assertion: In sequence after read: reg.read(status, rdata); assert(status == UVM_IS_OK && rdata == reg.get()) else `uvm_error(...)
</details>

<details>
<summary>Hint 8</summary>
Test: Use RAL backdoor/frontdoor access. Test all access types (RO/WO/RW). Verify assertions catch violations.
</details>
