# Scoreboard

**Domain:** computer-architecture — Cache & Memory  
**Difficulty:** Hard  
**Topics:** Scoreboard, OOO, RTL

---

## Problem Statement

Implement Scoreboard for Register Availability Tracking

Design a scoreboard tracking whether each register is busy (pending) or ready (available).\n\n' +
        '**Operations:**\n' +
        '```\nIssue:     scoreboard[dest] = 1 (busy)\nWriteback: scoreboard[dest] = 0 (ready)\nCheck:     can_issue = (scoreboard[src1]==0 && scoreboard[src2]==0)\n```\n\n' +
        '**Constraints:**\n' +
        '- Bit-vector: 1=busy, 0=ready\n' +
        '- Define same-cycle writeback+issue precedence\n' +
        '- Zero register always ready

---

## Requirements

1. SCOREBOARD STATE: Bit-vector or array indicating busy/ready for each register. Size: NUM_REGS bits. 1=busy (not ready), 0=ready.

2. ISSUE OPERATION: On instruction issue, mark destination register as busy: scoreboard[dest_reg] = 1.

3. WRITEBACK OPERATION: On instruction writeback completion, mark destination register as ready: scoreboard[dest_reg] = 0.

4. DEPENDENCY CHECK: Before issuing instruction, check scoreboard for source registers. Instruction can issue only if all source registers are ready (scoreboard[src1]==0 AND scoreboard[src2]==0).

5. WAKEUP: When writeback clears busy bit, all instructions waiting on that register become issuable (if other dependencies also satisfied).

6. SAME-CYCLE WRITEBACK+ISSUE: Define precedence when register is written back and new instruction issues using it in same cycle. Common: writeback completes before issue check (new instruction sees ready state).

7. ZERO REGISTER (OPTIONAL): If register 0 is hardwired zero, it should always be marked ready (scoreboard[0]=0).

8. Test Case 1 - Mark Busy on Issue: Issue instruction writing to register r4. Expected: scoreboard[4]=1 (busy). Dependent instruction cannot issue.

9. Test Case 2 - Clear Busy on Writeback: Writeback to register r4. Expected: scoreboard[4]=0 (ready). Dependent instruction becomes issuable.

10. Test Case 3 - Multiple Dependents: Two instructions wait for register r4. Writeback r4. Expected: both instructions become issuable simultaneously.

---

## Hints


