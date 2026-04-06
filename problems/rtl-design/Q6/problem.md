# Vending Machine FSM

**Domain:** rtl-design — FIFO / Queue  
**Difficulty:** Hard  
**Topics:** FSM, State Machine, Design

---

## Problem Statement

Design Vending Machine FSM with Coin Input and Change Output

Implement a vending machine FSM that accepts coins, accumulates credit, dispenses items, and provides change.\n\n' +
        '**Example:**\n' +
        '```\nItem price = 25 cents\nInsert 10c (credit=10) → Insert 25c (credit=35)\n→ Dispense + change=10c + credit=0\n```\n\n' +
        '**Constraints:**\n' +
        '- Multiple coin denominations (5c, 10c, 25c)\n' +
        '- Support multiple purchases per session\n' +
        '- Handle overpayment and invalid coins

---

## Requirements

1. COIN INPUTS: Support multiple coin denominations (define supported coins, e.g., 5 cents, 10 cents, 25 cents). Input interface: coin_value (encoded value of inserted coin) and coin_valid (pulse indicating coin inserted).

2. ITEM PRICE: Define item price (parameterize or fixed, e.g., 25 cents). Only one item type for simplicity, or extend to multiple items with price selection.

3. CREDIT ACCUMULATION: Maintain internal credit register. On coin insertion (coin_valid=1), add coin_value to credit.

4. DISPENSE LOGIC: When credit >= item_price, assert dispense output (single-cycle pulse or level until acknowledged). Reduce credit by item_price.

5. CHANGE CALCULATION: After dispense, remaining credit becomes change. Assert change_valid and output change_amount. Change can be returned immediately or held until user requests.

6. MULTIPLE PURCHASES: Support multiple purchases in one session. After dispensing, if credit still >= item_price, can dispense again.

7. CREDIT REFUND (OPTIONAL): Provide mechanism to refund accumulated credit without purchase (e.g., refund button).

8. INVALID COIN HANDLING: Define behavior for invalid coin_value (e.g., coin_value=0 or unsupported denomination). Options: ignore coin, assert error. Document choice.

9. SIMULTANEOUS COIN INPUTS: Define behavior if coin_valid asserted for multiple cycles or with different coin_value in consecutive cycles. Typically: process each coin separately.

10. FSM TYPE: Can be Moore or Mealy. Document: if Mealy, dispense/change may pulse on transition. If Moore, create specific DISPENSE and CHANGE states.

11. RESET: On reset, clear credit to 0, deassert all outputs.

12. Test Case 1 - Exact Payment: Item price = 25 cents. Insert 25-cent coin (coin_valid=1, coin_value=25). Expected: dispense=1 (single cycle or until ack), change_amount=0, credit returns to 0.

13. Test Case 2 - Overpayment: Item price = 25 cents. Insert 10-cent coin, then insert 25-cent coin (total credit=35 cents). Expected: dispense=1, change_amount=10, credit=0 after change returned.

14. Test Case 3 - Underpayment: Item price = 25 cents. Insert 10-cent coin (credit=10). Expected: dispense=0, credit=10, wait for more coins.

15. Test Case 4 - Multiple Purchases: Item price = 25 cents. Insert 50-cent coin (credit=50). Expected: dispense=1 (first), credit=25, then dispense=1 (second), credit=0.

16. Test Case 5 - Invalid Coin: Insert coin with coin_value=0 or unsupported value (e.g., 17 cents). Expected: behavior per specification (ignored, error flag, etc.).

17. Test Case 6 - Sequential Coin Insertion: Insert 5-cent coin (credit=5), then 10-cent coin (credit=15), then 10-cent coin (credit=25). Expected: dispense after third coin, credit=0.

---

## Hints

<details>
<summary>Hint 1</summary>
Credit as state vs register: For small denominations, can use states (STATE_0, STATE_5, STATE_10, ...). For general case, use credit register (more flexible).
</details>
