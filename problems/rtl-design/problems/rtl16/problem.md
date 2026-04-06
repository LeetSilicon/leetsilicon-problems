# CDC Fast→Slow Handshake

**Domain:** rtl-design — FIFO / Queue  
**Difficulty:** Hard  
**Topics:** RTL, CDC, Handshake

---

## Problem Statement

Handshake CDC for Fast Domain to Slow Domain

Implement a request/ack handshake for reliable event communication from fast to slow domain.\n\n' +
        '**Signals:**\n' +
        '```\nreq (fast→slow): held until slow captures\nack (slow→fast): synchronized back\n```\n\n' +
        '**Constraints:**\n' +
        '- req held until acknowledged\n' +
        '- Both req and ack must be synchronized into receiving domain

---

## Requirements

1. DOMAINS: fast_clk and slow_clk.

2. SIGNALS: req (fast→slow) and ack (slow→fast).

3. HOLD: req must be held until slow side captures it.

4. SYNC: req and ack must each be synchronized into the receiving domain.

5. BUSY/IDLE: Define whether the fast side exposes a busy indication while a request is outstanding.

6. Test Case - Single request produces single acknowledge.

7. Test Case - Outstanding request: fast side remains busy until the synchronized acknowledge returns.

---

## Hints

<details>
<summary>Hint 1</summary>
Use small FSMs in each domain and synchronizers on req/ack.
</details>
