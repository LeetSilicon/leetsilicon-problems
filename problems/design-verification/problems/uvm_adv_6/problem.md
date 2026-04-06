# Functional Coverage Subscriber

**Domain:** design-verification — Constraints  
**Difficulty:** Medium  
**Topics:** UVM, Coverage, Subscriber

---

## Problem Statement

Implement UVM Subscriber with Covergroup for Transaction Coverage

Create UVM subscriber component that receives transactions via TLM analysis export and samples functional coverage using covergroup. Subscriber automatically connected to monitor analysis port. Covergroup includes coverpoints for transaction fields and crosses for corner case coverage. Report coverage statistics at end of test.

---

## Requirements

1. CLASS STRUCTURE: Extend uvm_subscriber#(my_transaction). Subscriber has built-in analysis_export (no need to declare).

2. COVERGROUP DECLARATION: Declare covergroup with relevant coverpoints and crosses. Include in class.

3. COVERPOINTS: Cover key transaction fields. Example: address ranges, data values, transaction types, burst lengths.

4. BINS: Define bins for coverpoints. Use explicit bins, ranges, or transitions.

5. CROSSES: Create cross coverage for correlated fields. Example: cross address and transaction type.

6. SAMPLING: In write(T t) method (required override), call covergroup.sample() with transaction data.

7. COVERAGE REPORTING: In report_phase, call $get_coverage() or covergroup.get_coverage() to report percentage.

8. OPTIONS: Set covergroup options: option.per_instance = 1; option.at_least = 1; etc.

9. Test Case 1 - Basic Coverage: Send transactions covering all bins. Verify coverage increments.

10. Test Case 2 - Cross Coverage: Send transactions hitting cross bins. Verify cross coverage updates.

11. Test Case 3 - Unreached Bins: Some bins not hit. Report shows <100% coverage.

12. Test Case 4 - Coverage Goal: Reach 100% coverage. Report shows complete coverage.

13. Test Case 5 - Multiple Instances: Multiple subscribers (if testing). Verify per-instance coverage tracked correctly.

---

## Hints


