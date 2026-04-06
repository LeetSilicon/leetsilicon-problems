# Cache Tag Comparison

**Domain:** computer-architecture — Cache & Memory  
**Difficulty:** Medium  
**Topics:** Cache, Comparison, RTL

---

## Problem Statement

Implement Cache Tag Comparison and Hit/Miss Detection Logic

Design the tag comparison logic for a set-associative cache.\n\n' +
        'Compare incoming address tag against all valid ways using parallel comparators. Generate hit/miss signals and identify matching way.\n\n' +
        '**Example:**\n' +
        '```\nSet has 4 ways, way 2 valid with matching tag\nOthers invalid or non-matching\n→ hit=1, hit_way=2\n```\n\n' +
        '**Constraints:**\n' +
        '- Invalid ways must never generate false hits\n' +
        '- Match condition: (tag == request_tag) AND valid\n' +
        '- Define multi-hit behavior

---

## Requirements

1. PARALLEL COMPARISON: For each way in the set, compare request tag against stored tag AND check valid bit. Generate per-way match signal.

2. HIT DETECTION: Combine all way matches with OR to generate overall hit signal. Generate miss signal as NOT(hit).

3. WAY IDENTIFICATION: Generate hit_way output indicating which way matched. Use priority encoder or one-hot encoding.

4. MULTI-HIT HANDLING: Define behavior if multiple ways match same tag (cache corruption scenario). Options: (1) select lowest way index, (2) assert error flag, (3) other documented behavior.

5. VALID BIT INTEGRATION: Ensure invalid ways never generate false hits. Match condition: (tag[way] == request_tag) AND valid[way].

6. EDGE CASES: Handle all-invalid set (all miss), all-valid but no match (miss), exactly one match (normal hit).

7. Test Case 1 - Single Hit: Set has 4 ways. Way 2 is valid with matching tag. Ways 0,1,3 are invalid or non-matching. Expected: hit=1, hit_way=2.

8. Test Case 2 - Miss Scenarios: (a) All ways invalid - hit=0. (b) All ways valid but no tag match - hit=0, miss=1.

9. Test Case 3 - Multi-Hit Error: Two ways (1 and 3) are valid with identical matching tag. Expected: hit=1, hit_way follows documented resolution (e.g., way 1), optionally assert multi_hit_error flag.

---

## Hints


