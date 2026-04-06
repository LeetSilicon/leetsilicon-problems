# N-to-2^N Decoder

**Domain:** computer-architecture — Cache & Memory  
**Difficulty:** Medium  
**Topics:** Decoder, RTL

---

## Problem Statement

Design N-to-2^N Binary Decoder

Implement a parameterizable binary decoder converting N-bit input to 2^N one-hot output with enable control.\n\n' +
        '**Example (N=3):**\n' +
        '```\ninput=5, enable=1 → output=0b00100000 (bit 5 high)\ninput=3, enable=0 → output=0b00000000\n```\n\n' +
        '**Constraints:**\n' +
        '- Parameterizable N\n' +
        '- Output is one-hot when enabled, all-zero when disabled\n' +
        '- Exactly one output bit high when enabled

---

## Requirements

1. PARAMETERIZATION: Parameter N defines input width. Output width is 2^N.

2. DECODING LOGIC: For input value i (0 to 2^N-1), output[i]=1 and all other outputs=0.

3. ENABLE CONTROL: Input enable signal. When enable=1, perform decoding. When enable=0, all outputs=0.

4. ONE-HOT OUTPUT: Exactly one output bit is 1 when enabled. Verify one-hot property.

5. EDGE CASES: Handle N=1 (2 outputs), large N values, enable transitions.

6. Test Case 1 - N=3 Decode: Input=5 (101 binary), enable=1. Expected: output=0b00100000 (bit 5 high, all others low).

7. Test Case 2 - Enable Low: Input=3, enable=0. Expected: output=0b00000000 (all zeros).

8. Test Case 3 - Sweep All Inputs: For N=3, iterate input from 0 to 7 with enable=1. Verify each output is one-hot and matches input index.

---

## Hints

<details>
<summary>Hint 1</summary>
output = enable ? (1 << input) : 0;
</details>
