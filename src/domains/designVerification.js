/**
 * Design Verification Questions
 * Domains: UVM, Assertions, Coverage, Constrained Random, etc.
 */

const designVerification = {
  'Constraints': [
    {
      id: 'const1',
      shortName: 'Array Sum Constraint',
      question: 'Generate Integer Array of Size 10 with Sum Exactly 100',
      description: 'Write UVM SystemVerilog constraint to generate an integer array of size 10 where the sum of all elements equals exactly 100. Implement sum calculation without using .sum() array reduction method. Define element bounds to ensure solver feasibility.',
      difficulty: 'Medium',
      topics: ['Constraints', 'Array', 'Sum'],
      requirements: [
        'ARRAY SIZE: Fixed size = 10 elements.',
        'SUM REQUIREMENT: Sum of all 10 elements must equal exactly 100. Total = a[0] + a[1] + ... + a[9] = 100.',
        'NO .sum() METHOD: Cannot use array.sum() built-in. Must implement sum using foreach loop with accumulator variable or explicit addition.',
        'ELEMENT BOUNDS: Define range for each element (e.g., each element in [0:100] or [minus 50:150]). Without bounds, solver has infinite domain (unsolvable).',
        'SUM VARIABLE: Introduce intermediate variable (e.g., int unsigned tmp_sum) to hold computed sum. Constrain tmp_sum == 100 and tmp_sum == (a[0]+a[1]+...).',
        'SOLVER PERFORMANCE: Bounds improve solver speed. Tighter bounds = faster solving.',
        'Test Case 1 - Sum Verification: Randomize 100 times. For each randomization, compute actual_sum = a[0]+a[1]+...+a[9] in testbench. Assert actual_sum == 100.',
        'Test Case 2 - Array Size: Verify a.size() == 10 after each randomization.',
        'Test Case 3 - Boundary Solution: Add temporary constraint forcing a[0]=100, all others=0. Verify randomize succeeds and sum still equals 100.',
        'Test Case 4 - UNSAT Detection: Add conflicting constraint (all a[i] inside {[0:5]}, making max sum = 50 < 100). Verify randomize() returns 0 (failure).',
        'Test Case 5 - Element Distribution: Over many randomizations, verify elements are distributed (not always same solution). Check variance > 0.'
      ],
      hints: [
        'Accumulator approach: int unsigned tmp_sum; constraint c_sum { tmp_sum == 100; tmp_sum == a[0]+a[1]+a[2]+a[3]+a[4]+a[5]+a[6]+a[7]+a[8]+a[9]; }',
        'Alternative: Use foreach but avoid .sum(). Some solvers support: int sum_val = 0; foreach(a[i]) sum_val += a[i]; constraint { sum_val == 100; }',
        'Element bounds example: constraint c_bounds { foreach(a[i]) a[i] inside {[0:100]}; } Ensures each element 0 to 100.',
        'Solve order (optional): solve a before tmp_sum; Can help solver but not always necessary.',
        'For signed elements: Use int instead of int unsigned if allowing negative values. Adjust bounds accordingly.',
        'Test incrementally: Start with size 3, sum 10 to verify logic. Then scale to size 10, sum 100.'
      ]
    },

    {
      id: 'const2',
      shortName: 'Exactly 3 Same Values',
      question: 'Array with Exactly 3 Identical Elements and 7 Unique Elements',
      description: 'Write UVM SystemVerilog constraint for integer array of 10 elements where exactly 3 elements share the same value (triplicate), and the remaining 7 elements are all unique and different from the triplicate value. Total: 8 distinct values (1 appearing 3 times, 7 appearing once each).',
      difficulty: 'Hard',
      topics: ['Constraints', 'Array', 'Uniqueness'],
      requirements: [
        'ARRAY SIZE: Fixed at 10 elements.',
        'TRIPLICATE: Exactly 3 elements must have identical value. Call this value dup_val.',
        'UNIQUE REMAINDER: Remaining 7 elements must be pairwise unique (all different from each other) AND different from dup_val.',
        'TOTAL DISTINCT VALUES: 8 unique values total. One value appears 3 times, seven values appear once.',
        'INDEX FLEXIBILITY: The 3 identical elements can be at any indices (not fixed positions). Must randomize which indices contain the triplicate.',
        'VALUE DOMAIN: Define element value range (e.g., [0:255]) large enough to provide 8+ distinct values.',
        'NO CONSTRAINTS ON WHICH VALUE: Any value from domain can be the triplicate or unique values (randomized).',
        'Test Case 1 - Count Verification: After randomize, create histogram of values. Verify exactly one value appears 3 times, exactly seven values appear 1 time.',
        'Test Case 2 - Index Permutation: Randomize 100 times. Track which indices contain triplicate. Verify different index combinations occur (e.g., indices {0,1,2} sometimes, {2,5,9} other times).',
        'Test Case 3 - Value Variety: Over many randomizations, verify different values serve as triplicate (not always same value).',
        'Test Case 4 - UNSAT Detection: Add constraint requiring all elements unique (unique constraint on entire array). Verify randomize fails (conflicts with "3 same" requirement).',
        'Test Case 5 - Distinctness: Verify 7 unique values are truly distinct from each other and from triplicate value.'
      ],
      hints: [
        'Modeling approach: Introduce auxiliary variables: (1) rand int dup_val (the triplicate value), (2) rand int dup_idx[3] (three indices where triplicate appears).',
        'Index selection: constraint c_idx { unique {dup_idx}; foreach(dup_idx[i]) dup_idx[i] inside {[0:9]}; } Ensures 3 distinct indices.',
        'Assignment: constraint c_assign { foreach(dup_idx[i]) a[dup_idx[i]] == dup_val; } Sets triplicate.',
        'Remainder uniqueness: Build index set of non-dup indices. Constraint those indices to be unique and != dup_val. Can use: foreach(a[i]) if (i not in dup_idx) a[i] != dup_val; and unique constraint on those elements.',
        'Alternative using foreach: constraint c_unique { foreach(a[i]) foreach(a[j]) if (i < j && i not in dup_idx && j not in dup_idx) a[i] != a[j]; }',
        'Simplification: Use bit mask or queue to represent which indices have triplicate. Apply unique{} only to subset.',
        'Value bounds: constraint c_bounds { dup_val inside {[0:255]}; foreach(a[i]) a[i] inside {[0:255]}; }'
      ]
    },

    {
      id: 'const3',
      shortName: 'Dynamic Array with Repetition Rules',
      question: 'Dynamic Array Size 300 with Value Frequency and Consecutive Constraints',
      description: 'Generate dynamic array of exactly 300 elements. Elements take values from {0,1,2,3,4}. UVM SV Constraints: (1) Each value (0,1,2,3,4) appears at least 40 times, (2) Value 0 can appear consecutively, (3) Values 1,2,3,4 cannot appear consecutively (no adjacent repeats).',
      difficulty: 'Hard',
      topics: ['Constraints', 'Dynamic Array', 'Consecutive'],
      requirements: [
        'ARRAY SIZE: Dynamic array with size = 300 (fixed).',
        'VALUE DOMAIN: Each element a[i] inside {0,1,2,3,4}. Only 5 possible values.',
        'MINIMUM FREQUENCY: Each value {0,1,2,3,4} must appear at least 40 times. Total minimum = 5*40 = 200. Leaves 100 elements flexible.',
        'CONSECUTIVE RULE FOR 0: Value 0 may appear consecutively. Pattern like 0,0,0 is allowed.',
        'NO CONSECUTIVE FOR 1-4: Values 1,2,3,4 cannot appear consecutively. If a[i] in {1,2,3,4} and a[i]==a[i+1], constraint violated. Each value 1-4 must alternate with different values.',
        'FEASIBILITY: 300 elements, 5 values, min 40 each = 200 mandatory, 100 flexible. Alternation for 1-4 is feasible with value 0 as separator.',
        'Test Case 1 - Frequency Count: After randomize, count occurrences of each value 0,1,2,3,4. Assert each count >= 40.',
        'Test Case 2 - Consecutive Rule for 1-4: Scan array: for i in [0:298], if a[i] in {1,2,3,4}, assert a[i] != a[i+1]. No adjacent repeats for these values.',
        'Test Case 3 - Consecutive Allowed for 0: Verify pattern like a[i]=0, a[i+1]=0 exists somewhere in array (value 0 can repeat).',
        'Test Case 4 - Stress Test: Randomize 200 times. Verify no randomization failures. Check solver performance (should complete in reasonable time).',
        'Test Case 5 - Edge Frequency: Verify at least one value appears exactly 40 times sometimes (not always much more).'
      ],
      hints: [
        'Array size constraint: constraint c_size { a.size() == 300; }',
        'Value domain: constraint c_domain { foreach(a[i]) a[i] inside {0,1,2,3,4}; }',
        'Consecutive rule: constraint c_no_consec { foreach(a[i]) if (i > 0 && a[i] inside {1,2,3,4}) a[i] != a[i-1]; }',
        'Frequency counting without .sum(): Use explicit counter variables. int cnt[5]; constraint c_count { cnt[0]==count of 0s; cnt[1]==count of 1s; ... foreach(v) cnt[v] >= 40; }',
        'Frequency with accumulator: Build count per value by iterating and summing boolean expressions: (a[i]==val) ? 1 : 0.',
        'Distribution hint: Use dist to guide solver toward minimum counts: a[i] dist {0:=40, 1:=40, 2:=40, 3:=40, 4:=40}; (weights approximate minimums).',
        'Performance: Avoid nested foreach over all pairs. Keep constraints linear in array size.'
      ]
    },

    {
      id: 'const4',
      shortName: 'No Consecutive Zeros',
      question: 'Dynamic Array Size 300 with No Adjacent Zeros',
      description: 'Generate dynamic array of 300 elements with values from {0,1,2,3,4,5}. UVM SV Constraints: (1) Each value appears at least 40 times, (2) No two consecutive 0s (adjacent 0s forbidden). Value 0 must be interspersed with other values.',
      difficulty: 'Hard',
      topics: ['Constraints', 'Dynamic Array', 'Pattern'],
      requirements: [
        'ARRAY SIZE: Dynamic array, size = 300.',
        'VALUE DOMAIN: Each a[i] inside {0,1,2,3,4,5}. Six possible values.',
        'MINIMUM FREQUENCY: Each value {0,1,2,3,4,5} appears at least 40 times. Total min = 6*40 = 240. Leaves 60 flexible.',
        'NO CONSECUTIVE ZEROS: Pattern 0,0 forbidden. For all i, NOT(a[i]==0 AND a[i+1]==0).',
        'ZEROS STILL APPEAR: Value 0 must appear >= 40 times but interspersed. Pattern like 0,1,0,2,0 is valid.',
        'FEASIBILITY: With 300 elements and needing >= 40 zeros non-adjacent, maximum consecutive 0s = 1. Achievable by spacing with other values.',
        'Test Case 1 - No Adjacent 0s: Scan array for i in [0:298]. Assert NOT(a[i]==0 AND a[i+1]==0). No two 0s side-by-side.',
        'Test Case 2 - Frequency Check: Count each value 0-5. Assert each count >= 40.',
        'Test Case 3 - 0s Present: Verify value 0 appears in array (count > 0). Ensure constraint doesnt accidentally exclude 0.',
        'Test Case 4 - Corner Case Exact Count: Add temporary constraint forcing count(0)==40 exactly. Verify still satisfiable with spacing constraint.',
        'Test Case 5 - Stress Test: Randomize 100 times. No failures. Verify solver performance acceptable.'
      ],
      hints: [
        'No consecutive 0s constraint: constraint c_no_00 { foreach(a[i]) if (i > 0) !(a[i]==0 && a[i-1]==0); }',
        'Alternative implication form: foreach(a[i]) if (i>0 && a[i]==0) a[i-1] != 0;',
        'Frequency constraints: Use counters or dist as in previous problem. int cnt[6]; foreach(v in [0:5]) cnt[v] >= 40;',
        'Element bounds: constraint c_domain { foreach(a[i]) a[i] inside {[0:5]}; }',
        'Spacing insight: With 40 zeros and 260 other values, plenty of room to space 0s. Max 0 density = 40/300 = 13%. Easily spaceable.',
        'If solver struggles: Use dist to encourage even distribution. Consider pre-building with construction then randomizing order.'
      ]
    },

    {
      id: 'const5',
      shortName: 'Even-Odd Index Constraint',
      question: 'Array with Even Values at Even Indices, Odd Values at Odd Indices',
      description: 'Write UVM SV constraint for array where parity of index matches parity of value. Even indices (0,2,4,...) contain even values. Odd indices (1,3,5,...) contain odd values. Support arbitrary integer values (positive, negative, or zero).',
      difficulty: 'Medium',
      topics: ['Constraints', 'Array', 'Parity'],
      requirements: [
        'ARRAY SIZE: Fixed size (define, e.g., 10 elements).',
        'PARITY RULE: For all indices i: (i % 2) == (a[i] % 2). Index parity matches value parity.',
        'EVEN INDEX: If i is even (i % 2 == 0), then a[i] must be even (a[i] % 2 == 0).',
        'ODD INDEX: If i is odd (i % 2 == 1), then a[i] must be odd (a[i] % 2 == 1).',
        'VALUE DOMAIN: Define a finite range or allow the full 32-bit int domain. Support negative values if desired.',
        'PARITY OF NEGATIVE NUMBERS: For negative numbers, parity defined by LSB or modulo. Be consistent. LSB method recommended: a[i][0] (bit 0) indicates odd/even.',
        'Test Case 1 - Parity Verification: For all i in [0:size-1], verify (a[i] % 2) == (i % 2). Use abs() if needed for negative modulo.',
        'Test Case 2 - Even Indices: For i in {0,2,4,6,8}, verify a[i] is even (a[i] % 2 == 0 or a[i][0] == 0).',
        'Test Case 3 - Odd Indices: For i in {1,3,5,7,9}, verify a[i] is odd (a[i] % 2 == 1 or a[i][0] == 1).',
        'Test Case 4 - Range Boundaries: If bounds are from -100 to 100, verify extreme values (-100, -99, 99, 100) appear and satisfy the parity rule.',
        'Test Case 5 - Robustness: Randomize 1000 times. Verify no failures, all parities correct.'
      ],
      hints: [
        'Bit-level parity (cleanest): constraint c_parity { foreach(a[i]) a[i][0] == i[0]; } Compares LSB of value with LSB of index.',
        'Modulo-based parity: constraint c_parity { foreach(a[i]) (a[i] % 2) == (i % 2); } Works but be careful with signed modulo in some languages.',
        'For 2-state integers, LSB comparison is solver-friendly and avoids modulo semantics issues.',
        'Value bounds: constraint c_range { foreach(a[i]) { a[i] >= -100; a[i] <= 100; } } or allow the full int range.',
        'Negative parity note: In SystemVerilog, -3 % 2 may give -1 (not 1). LSB check avoids this: -3 in binary ...11101, LSB=1 (odd). Recommended.',
        'Test with negative values explicitly: Set a[0]=-4 (even), a[1]=-3 (odd) and verify.'
      ]
    },

    {
      id: 'unique1',
      shortName: '3D Array All Unique',
      question: 'Generate 3×3×3 Array with All 27 Elements Unique',
      description: 'Write UVM SV constraint to randomize a 3-dimensional array (3×3×3 = 27 elements) such that all elements are distinct. No two elements can have the same value. Value domain must support at least 27 unique values.',
      difficulty: 'Medium',
      topics: ['Constraints', '3D Array', 'Uniqueness'],
      requirements: [
        'ARRAY DIMENSIONS: 3D array: a[3][3][3]. Total 27 elements.',
        'UNIQUENESS: All 27 elements must be pairwise unique. No value appears more than once.',
        'VALUE DOMAIN: Must support at least 27 distinct values. Example: int [0:255] provides 256 values (sufficient). Minimum domain: [0:26].',
        'CONSTRAINT FORM: Apply unique constraint across all 27 elements. May need to flatten 3D indices.',
        'NO OVER-CONSTRAINT: Do not add unnecessary constraints (like sorted order) unless required. Only enforce uniqueness.',
        'Test Case 1 - Uniqueness Verification: Flatten array to 1D list of 27 values. Assert all unique using set or histogram (all counts == 1).',
        'Test Case 2 - Domain Too Small: Restrict values to [0:10] (only 11 values < 27 required). Verify randomize() fails (UNSAT).',
        'Test Case 3 - Distribution Check: Over 100 randomizations, verify values distributed across domain (not clustered in small range).',
        'Test Case 4 - All Values Used: If domain size == 27 exactly, verify all 27 values from domain appear (permutation of domain).',
        'Test Case 5 - Index Access: Verify a[0][0][0], a[2][2][2], a[1][2][0] all different values.'
      ],
      hints: [
        'Flattening approach: Create 1D view of 3D array. foreach(a[i,j,k]) accumulate into flat list, then apply unique.',
        'Direct unique on multi-dimensional: constraint c_unique { foreach(a[i,j,k]) foreach(a[p,q,r]) if((i!=p)||(j!=q)||(k!=r)) a[i][j][k] != a[p][q][r]; } Pairwise unique.',
        'Unique operator (if supported): Some tools allow: unique {a[0][0][0], a[0][0][1], ..., a[2][2][2]}; List all 27 elements.',
        'Value bounds: constraint c_bounds { foreach(a[i,j,k]) a[i][j][k] inside {[0:255]}; } Ensures finite domain.',
        'Performance note: Uniqueness on 27 elements is tractable. Avoid nested loops if tool supports array-level unique.',
        'Alternative: Use flatten() streaming operator if available: unique {a}; (tool-dependent).'
      ]
    },

    {
      id: 'unique2',
      shortName: 'Divide into Three Unique Queues',
      question: 'Partition Queue into Three Disjoint Queues',
      description: 'Write UVM SV constraint: given one input queue, divide all elements into three output queues such that: (1) Each input element appears in exactly one output queue (partition), (2) Three output queues are pairwise disjoint (no element in multiple queues), (3) Concatenating three outputs in any order reproduces input multiset.',
      difficulty: 'Hard',
      topics: ['Constraints', 'Queue'],
      requirements: [
        'INPUT QUEUE: Source queue q_in with N elements. Values may have duplicates.',
        'OUTPUT QUEUES: Three queues q_out[0], q_out[1], q_out[2].',
        'PARTITION PROPERTY: Every element from q_in appears in exactly one output queue. No element dropped, no element duplicated.',
        'DISJOINTNESS: q_out[0], q_out[1], q_out[2] have no common elements (by position, not value). Intersection(q_out[i], q_out[j]) == empty for i≠j.',
        'MULTISET EQUALITY: Concatenate q_out[0] + q_out[1] + q_out[2] (any order). Result contains same elements (with multiplicity) as q_in.',
        'QUEUE SIZES: q_out[0].size() + q_out[1].size() + q_out[2].size() == q_in.size().',
        'EMPTY QUEUES ALLOWED: Output queues may be empty (unless additional constraint). No requirement for non-empty unless specified.',
        'Test Case 1 - Partition Verification: After randomize, concatenate all output queues. Sort both input and concatenated output. Assert equal.',
        'Test Case 2 - Non-Trivial Split: Verify not all elements go to one queue always. Check all three queues receive elements over multiple randomizations.',
        'Test Case 3 - Duplicates Handling: q_in = [5,3,5,7]. Verify partition handles duplicates correctly (both 5s assigned independently).',
        'Test Case 4 - Size Consistency: Assert sum of output sizes equals input size.'
      ],
      hints: [
        'Modeling with assignment array: Create rand int owner[N] where owner[i] inside {0,1,2} indicates which output queue gets q_in[i].',
        'Constraint: constraint c_assign { foreach(owner[i]) owner[i] inside {[0:2]}; } Assigns each element.',
        'Derive queues: In post_randomize(), build output queues: for(i=0; i<N; i++) q_out[owner[i]].push_back(q_in[i]);',
        'Disjointness automatic: Since each owner[i] has single value, each element goes to exactly one queue.',
        'Non-empty requirement (if needed): constraint c_non_empty { count(owner==0) >= 1; count(owner==1) >= 1; count(owner==2) >= 1; } Ensures all queues receive at least 1 element.',
        'Distribution control: Use dist on owner to balance queue sizes or keep uniform.',
        'Element uniqueness clarification: "Unique elements" in problem means unique by position (index), not by value. Duplicates in input handled by index.'
      ]
    },

    {
      id: 'unique3',
      shortName: 'Map to N Non-Empty Queues',
      question: 'Randomly Distribute Array into N Non-Empty Queues',
      description: 'Given an input array, randomly map elements to N output queues (N parameterized). Use UVM SystemVerilog constraints so that: (1) each input element appears in exactly one output queue, (2) all N output queues are non-empty, and (3) feasibility requires N ≤ input_size.',
      difficulty: 'Hard',
      topics: ['Constraints', 'Queue'],
      requirements: [
        'INPUT ARRAY: Fixed size array arr with M elements.',
        'PARAMETER N: Number of output queues. Must satisfy N ≤ M for feasibility (cannot create N non-empty queues from fewer than N elements).',
        'OUTPUT QUEUES: Array of queues out_q[N].',
        'EXACT ASSIGNMENT: Each arr[i] assigned to exactly one out_q[k]. No element dropped, no duplication.',
        'NON-EMPTY: For all k in [0:N-1], out_q[k].size() >= 1. Every output queue has at least one element.',
        'DUPLICATE VALUES: If input has duplicate values, assignment is by position (index), not value. Value duplicates can go to same or different queues.',
        'FEASIBILITY CONDITION: N ≤ M. If N > M, constraint is UNSAT (cannot create more non-empty queues than elements).',
        'Test Case 1 - Exact Cover: After randomize, collect all elements from all output queues. Verify multiset equals input array.',
        'Test Case 2 - Non-Empty Check: For each out_q[k], assert size() >= 1. All queues populated.',
        'Test Case 3 - Feasibility Boundary: Set N=M (each queue gets exactly 1 element). Verify randomize succeeds.',
        'Test Case 4 - Infeasibility: Set N=M+1. Verify randomize() fails (returns 0).',
        'Test Case 5 - Distribution Variety: Randomize many times with N<M. Verify different elements go to different queues across runs (not deterministic).'
      ],
      hints: [
        'Assignment array modeling: rand int owner[M] where owner[i] inside {[0:N-1]}. Indicates which queue gets arr[i].',
        'Non-empty constraint: For each queue k, ensure at least one element assigned. constraint c_non_empty { foreach(k in [0:N-1]) count(owner[i]==k for all i) >= 1; }',
        'Count implementation: Use accumulator or explicit sum: foreach(k) { int cnt = 0; foreach(owner[i]) if(owner[i]==k) cnt++; constraint cnt >= 1; }',
        'Alternative: Use distribution to guide solver: owner[i] dist {[0:N-1] := 1}; Then add non-empty constraints.',
        'Queue construction: In post_randomize(): foreach(k) out_q[k].delete(); foreach(i) out_q[owner[i]].push_back(arr[i]);',
        'Uniqueness by position: No special handling needed. owner[i] determines position i assignment.',
        'Feasibility check: Add precondition assertion: assert(N <= M); before randomize.'
      ]
    },

    {
      id: 'unique4',
      shortName: 'Two Arrays with Sorted Relationship',
      question: 'Generate Two Dynamic Arrays with Size, Sorted, and Membership Constraints',
      description: 'Generate two related dynamic arrays using UVM SystemVerilog constraints: (1) array1 size is in [6:9], (2) array2 size equals array1 size, (3) array1 is sorted in ascending order, and (4) every array2 element is a member of array1.',
      difficulty: 'Hard',
      topics: ['Constraints', 'Dynamic Array', 'Sorting'],
      requirements: [
        'ARRAY1 SIZE: Size must be in range [6:9]. Can be 6, 7, 8, or 9 elements.',
        'ARRAY2 SIZE: Must equal array1.size(). Both arrays same length.',
        'SORTING: array1 sorted in ascending order. For all i, array1[i] ≤ array1[i+1]. Non-strictly ascending (duplicates allowed) unless specified otherwise.',
        'MEMBERSHIP: Every element in array2 must exist in array1. array2[i] inside {array1} for all i.',
        'STRICTLY ASCENDING (OPTIONAL): If requiring strict: array1[i] < array1[i+1]. Document choice. Default: non-decreasing (≤).',
        'VALUE DOMAIN: Define element ranges (e.g., [0:100]) for both arrays.',
        'MULTIPLICITY: array2 can have duplicates from array1. Not required to be permutation, just subset.',
        'Test Case 1 - Size Range: Randomize 100 times. Verify array1.size() in {6,7,8,9}. All values in range appear.',
        'Test Case 2 - Equal Sizes: For each randomization, assert array1.size() == array2.size().',
        'Test Case 3 - Sorted Property: For array1, verify for all i: array1[i] ≤ array1[i+1] (or < if strict).',
        'Test Case 4 - Membership: For each array2[i], verify value exists in array1. Check array2[i] in set(array1).',
        'Test Case 5 - Multiplicity Handling: array1=[1,2,3,4,5,6]. array2 can be [2,2,3,4,5,6] (2 appears twice). Both 2s are valid (both from array1).'
      ],
      hints: [
        'Size constraints: constraint c_size { array1.size() inside {[6:9]}; array2.size() == array1.size(); }',
        'Sorted constraint: constraint c_sorted { foreach(array1[i]) if(i > 0) array1[i] >= array1[i-1]; } For non-decreasing.',
        'Strict sorting: Replace >= with > in constraint.',
        'Membership constraint (tool-dependent): constraint c_member { foreach(array2[i]) array2[i] inside {array1}; } If tool supports inside with dynamic array.',
        'Membership alternative (index-based): For each array2[i], there exists some j such that array2[i] == array1[j]. Use auxiliary index array: rand int idx[size] where idx[i] inside {[0:array1.size()-1]} and array2[i] == array1[idx[i]].',
        'Value bounds: constraint c_bounds { foreach(array1[i]) array1[i] inside {[0:100]}; foreach(array2[i]) array2[i] inside {[0:100]}; }',
        'Solver performance: Membership check can be expensive. Index-based approach often faster.'
      ]
    },

    {
      id: 'prob1',
      shortName: 'Conditional Probability Constraint',
      question: 'Variable Probability Based on Previous Value Parity',
      description: 'Write uvm sv constraint for 8-bit variable where next value parity depends on previous value: (1) If previous value was odd, next value is even with 75% probability, (2) If previous value was even, next value is even with 25% probability. Maintain state between randomizations.',
      difficulty: 'Hard',
      topics: ['Constraints', 'Probability'],
      requirements: [
        'VARIABLE: 8-bit variable x (rand bit [7:0] x).',
        'STATE: Maintain previous value in variable prev (not randomized). Updated after each randomization.',
        'PROBABILITY RULE 1: If prev is odd (prev[0]==1), then x is even with probability 75%, odd with probability 25%.',
        'PROBABILITY RULE 2: If prev is even (prev[0]==0), then x is even with probability 25%, odd with probability 75%.',
        'INITIALIZATION: On first randomization, prev uninitialized. Define behavior: treat as even, or seed with fixed value. Document.',
        'PARITY: Even number: LSB==0 (x[0]==0). Odd number: LSB==1 (x[0]==1).',
        'DISTRIBUTION: Use dist construct to specify probabilities. Weights approximate 75/25 split.',
        'STATE UPDATE: In post_randomize(), update prev = x for next call.',
        'Test Case 1 - Previous Odd: Set prev=3 (odd). Randomize 10,000 times. Count how many times x is even. Expected: ~7,500 (75% ± tolerance).',
        'Test Case 2 - Previous Even: Set prev=4 (even). Randomize 10,000 times. Count even x. Expected: ~2,500 (25% ± tolerance).',
        'Test Case 3 - Initialization: First randomize with prev uninitialized (or default 0). Verify behavior matches documented initial rule.',
        'Test Case 4 - State Persistence: Randomize with prev=5, then prev=6. Verify probability distribution changes between runs.',
        'Test Case 5 - Statistical Tolerance: Use chi-square or binomial test with significance level (e.g., 95% confidence interval).'
      ],
      hints: [
        'Conditional dist (tool-dependent syntax): constraint c_prob { if (prev[0]) x dist {[even_values]:=75, [odd_values]:=25}; else x dist {[even_values]:=25, [odd_values]:=75}; }',
        'Even/odd value sets: Even values (LSB=0): {0,2,4,6,...,254}. Odd values (LSB=1): {1,3,5,...,255}.',
        'Simplified parity distribution: Use 1-bit helper: rand bit is_even; constraint c_is_even { if(prev[0]) is_even dist {1:=75, 0:=25}; else is_even dist {1:=25, 0:=75}; } Then: constraint c_parity { x[0] == !is_even; }',
        'Weight scaling: dist weights are ratios. 75:25 = 3:1. Can use: dist {1:=3, 0:=1}.',
        'State update: function void post_randomize(); prev = x; endfunction',
        'Initialization: Initialize prev in constructor or define initial state rule explicitly.',
        'Statistical testing: For 10,000 samples, 75% = 7,500. Standard deviation ≈ sqrt(10000*0.75*0.25) ≈ 43. Tolerance: ±3σ ≈ ±130 (7,370 to 7,630 acceptable).'
      ]
    },

    {
      id: 'prob2',
      shortName: '5% Probability for Lower Bits Same',
      question: '4-bit Variable with Lower 2 Bits Same Probability 5%',
      description: 'Write uvm sv constraint on 4-bit variable such that the probability of lower two bits being equal is 5%. Lower bits equal means x[1:0] is 00 or 11. Remaining 95% covers patterns 01 and 10.',
      difficulty: 'Medium',
      topics: ['Constraints', 'Probability', 'Bits'],
      requirements: [
        'VARIABLE: 4-bit variable x (rand bit [3:0] x).',
        'LOWER BITS: x[1:0] (bits 1 and 0).',
        'SAME PATTERNS: x[1:0] same means 00 or 11. Two patterns total.',
        'DIFFERENT PATTERNS: x[1:0] different means 01 or 10. Two patterns total.',
        'PROBABILITY TARGET: P(x[1:0] in {00,11}) = 5%. P(x[1:0] in {01,10}) = 95%.',
        'DISTRIBUTION: Use dist to assign weights. Total 4 patterns: 2 same, 2 different.',
        'UPPER BITS: x[3:2] unconstrained unless specified otherwise.',
        'Test Case 1 - Distribution Check: Randomize 10,000 times. Count occurrences where x[1:0] in {2\'b00, 2\'b11}. Expected: ~500 (5% ± tolerance).',
        'Test Case 2 - Pattern Coverage: Verify all 4 lower-bit patterns (00,01,10,11) appear over many samples. Frequencies: 00≈2.5%, 01≈47.5%, 10≈47.5%, 11≈2.5%.',
        'Test Case 3 - Upper Bits Randomness: Verify x[3:2] distributed uniformly (if unconstrained).',
        'Test Case 4 - Seed Determinism: Different random seeds produce same statistical distribution.',
        'Test Case 5 - Edge Cases: Verify both 00 and 11 appear (not just one same pattern).'
      ],
      hints: [
        'Distribution on lower bits: constraint c_dist { x[1:0] dist {2\'b00 := 2.5, 2\'b01 := 47.5, 2\'b10 := 47.5, 2\'b11 := 2.5}; } Weights sum to 100, gives 5% same.',
        'Integer weights: If tool doesnt support fractional, scale: dist {2\'b00:=5, 2\'b01:=95, 2\'b10:=95, 2\'b11:=5}; Ratios preserved.',
        'Alternative formulation: Create helper bit same_bits; constraint c_same { same_bits dist {1:=5, 0:=95}; if(same_bits) x[1:0] inside {2\'b00, 2\'b11}; else x[1:0] inside {2\'b01, 2\'b10}; }',
        'Upper bits unconstrained: No constraint on x[3:2]. They randomize uniformly.',
        'Statistical tolerance: For 10,000 samples, 5% = 500. σ ≈ sqrt(10000*0.05*0.95) ≈ 22. Tolerance ±3σ ≈ ±66 (434-566 acceptable).',
        'Pattern symmetry: 00 and 11 should appear roughly equally (~2.5% each). 01 and 10 also equal (~47.5% each).'
      ]
    },

    {
      id: 'prob3',
      shortName: 'Uniform Distribution by Bit Count',
      question: '10-bit Variable with Uniform Popcount Distribution',
      description: 'Generate 10-bit variable where popcount (number of 1-bits) uniformly distributed: 10% probability for exactly 1 bit set, 10% for 2 bits, ..., 10% for all 10 bits set. Exclude popcount=0. write uvm sv constraint without $countones if constraint system doesnt support it.',
      difficulty: 'Hard',
      topics: ['Constraints', 'Probability', 'Distribution'],
      requirements: [
        'VARIABLE: 10-bit x (rand bit [9:0] x).',
        'POPCOUNT: Number of 1-bits in x. Values 1,2,3,...,10 (0 excluded per problem statement).',
        'UNIFORM BUCKETS: 10 buckets (popcount 1 through 10). Each bucket 10% probability.',
        'NO $COUNTONES IN CONSTRAINTS: Cannot use $countones() inside constraint. Must implement bit counting explicitly or use auxiliary variable.',
        'POPCOUNT CALCULATION: Count 1-bits via sum: x[0]+x[1]+...+x[9].',
        'DISTRIBUTION: Each popcount value appears equally likely. Not bit patterns (many patterns per popcount).',
        'Test Case 1 - Frequency Distribution: Randomize 20,000 times. Histogram popcount values 1-10. Each bucket expected ~2,000 occurrences (10% ± tolerance).',
        'Test Case 2 - Popcount=0 Excluded: Verify x never equals 0 (all bits zero). Count(x==0) should be 0.',
        'Test Case 3 - Popcount Range: For each popcount k in [1:10], verify at least one sample has exactly k bits set.',
        'Test Case 4 - Solver Performance: Verify randomize completes in reasonable time (not timeout). This is computationally heavy.',
        'Test Case 5 - Pattern Variety: Within each popcount bucket, verify different bit patterns appear (e.g., popcount=2 produces different pairs of bits set).'
      ],
      hints: [
        'Auxiliary variable approach: rand int popcount_target inside {[1:10]}; constraint c_dist { popcount_target dist {[1:10]:=10}; } Uniformly distribute popcount.',
        'Bit sum constraint: constraint c_popcount { x[0]+x[1]+x[2]+x[3]+x[4]+x[5]+x[6]+x[7]+x[8]+x[9] == popcount_target; }',
        'Alternative bit counting: int cnt = 0; foreach(x[i]) cnt += x[i]; constraint { cnt == popcount_target; }',
        'Avoiding $countones: Explicit sum as shown above. Each x[i] is 0 or 1, sum gives popcount.',
        'Solver performance: This is a heavy constraint (exponential bit patterns per popcount). Consider construction: (1) Randomize popcount_target (2) In post_randomize(), choose k random bit positions and set them.',
        'Construction approach: function void post_randomize(); x = 0; int positions[$]; for(int i=0; i<10; i++) positions.push_back(i); positions.shuffle(); for(int i=0; i<popcount_target; i++) x[positions[i]] = 1; endfunction',
        'Pure constraint is possible but slow. Construction faster and achieves same distribution.'
      ]
    },

    {
      id: 'prob4',
      shortName: '5 Bits Set with Consecutive Probability',
      question: '5 Set Bits, 80% Consecutive, 20% Non-Consecutive',
      description: 'Write uvm sv constraints to generate random number with exactly 5 bits set. With 80% probability, the 5 bits are consecutive (contiguous run). With 20% probability, the 5 bits are non-consecutive (spread out). Define word width to accommodate.',
      difficulty: 'Hard',
      topics: ['Constraints', 'Probability'],
      requirements: [
        'POPCOUNT: Exactly 5 bits set (popcount = 5). Always.',
        'WORD WIDTH: Define width W (must be ≥5). Example: W=16 or W=32.',
        'CONSECUTIVE (80%): 5 bits form contiguous run. Pattern: 00011111000 (example). Run can start at any position 0 to W-5.',
        'NON-CONSECUTIVE (20%): 5 bits set but NOT all consecutive. Example: 01010100100 (5 bits spread). No length-5 run exists.',
        'PROBABILITY: 80% consecutive, 20% non-consecutive.',
        'MODE SELECTION: Use helper variable to select mode. Then apply pattern constraint.',
        'Test Case 1 - Popcount Always 5: For every randomization, verify $countones(x) == 5 in testbench.',
        'Test Case 2 - Consecutive Rate: Randomize 10,000 times. Detect if x has contiguous 5-bit run. Expected ~8,000 have run (80% ± tolerance).',
        'Test Case 3 - Non-Consecutive Valid: In 20% cases (no run), verify popcount still 5 and no length-5 run exists.',
        'Test Case 4 - Start Position Variety: For consecutive mode, verify run starts at different positions across randomizations.',
        'Test Case 5 - Pattern Validity: Manually inspect samples to confirm 80/20 split visually.'
      ],
      hints: [
        'Mode selection: rand bit is_consec; constraint c_mode { is_consec dist {1:=80, 0:=20}; }',
        'Consecutive mode: If is_consec==1, choose start position s in [0:W-5]. Set x = (5\'b11111 << s). constraint c_consec { if(is_consec) { start inside {[0:W-5]}; x == (16\'b11111 << start); }}',
        'Non-consecutive mode: If is_consec==0, set 5 bits but ensure NOT consecutive. Hard to express as pure constraint. Use construction.',
        'Construction for non-consecutive: In post_randomize(): if(!is_consec) { do { x = 0; int pos[$]; for(i=0; i<W; i++) pos.push_back(i); pos.shuffle(); for(i=0; i<5; i++) x[pos[i]]=1; } while (has_run_of_5(x)); } Helper function checks for consecutive run.',
        'Run detection helper: function bit has_run_of_5(bit [W-1:0] val); for(int i=0; i<=W-5; i++) if(val[i+:5] == 5\'b11111) return 1; return 0; endfunction',
        'Popcount enforcement: constraint c_popcount { $countones(x) == 5; } Use in testbench or constraint if allowed.',
        'Mixed construction/constraint: Constraint handles mode and consecutive case. Construction handles non-consecutive 20% in post_randomize.'
      ]
    },

    {
      id: 'prob5',
      shortName: 'Exactly 5 Consecutive Bits',
      question: '100-bit Variable with Exactly One Run of 5 Consecutive 1s',
      description: 'Write uvm sv constraints to generate 100-bit variable where exactly 5 consecutive bits are 1, and all other bits are 0. Single contiguous run of five 1s. Run can start at any position from 0 to 95.',
      difficulty: 'Hard',
      topics: ['Constraints', 'Consecutive'],
      requirements: [
        'WIDTH: Fixed at 100 bits (bit [99:0] x).',
        'PATTERN: Exactly five consecutive 1s. Example: ...000111110000...',
        'ALL OTHERS ZERO: All bits except the 5-bit run must be 0.',
        'RUN POSITION: Run can start at any bit position s in [0:95]. If start=0, pattern: 11111000...000. If start=95, pattern: ...00011111.',
        'UNIQUENESS: Only one run. Not 6+ consecutive 1s, not multiple separate runs.',
        'POPCOUNT: Total 1-bits = 5 exactly.',
        'Test Case 1 - Structure Verification: Find all indices where x[i]==1. Must be exactly 5 indices and consecutive (i, i+1, i+2, i+3, i+4).',
        'Test Case 2 - Boundary Starts: Force start=0 (if exposing start variable). Verify x = 100\'b11111000...000. Force start=95. Verify x = 100\'b000...00011111.',
        'Test Case 3 - No Extra 1s: Verify popcount == 5. No additional 1s outside run.',
        'Test Case 4 - Run Length Exactly 5: Verify no length-6 run exists. Pattern must be 0(if exists)111110(if exists).',
        'Test Case 5 - Start Position Variety: Over many randomizations, verify run starts at different positions (uniform distribution over [0:95]).'
      ],
      hints: [
        'Simplest approach: Choose start position s, then set x = (5\'b11111) << s. constraint c_pattern { start inside {[0:95]}; x == (100\'(5\'b11111) << start); }',
        'Casting: 100\'(5\'b11111) extends 5-bit mask to 100 bits (zero-extended), then shifts.',
        'Alternative: Build mask explicitly: x = 0; x[start +: 5] = 5\'b11111; (in post_randomize or constraint).',
        'Constraint form: rand int start; constraint c_start { start inside {[0:95]}; } constraint c_value { x == (100\'d31 << start); } where 31 = 5\'b11111.',
        'Validation: Testbench function: function bit check_pattern(bit [99:0] val); int cnt=0, first=-1, last=-1; for(int i=0; i<100; i++) if(val[i]) begin cnt++; if(first<0) first=i; last=i; end return (cnt==5 && last==first+4); endfunction',
        'Performance: This is very efficient. Direct mask construction is fast.',
        'Parameterization (if needed): For variable width W and runlen R: start inside {[0:W-R]}; x == (W\'((1<<R)-1) << start);'
      ]
    },

    {
      id: 'matrix1',
      shortName: 'Binary Matrix with Sum Constraint',
      question: 'Generate M×N Binary Matrix with Total Sum < MAX_SUM',
      description: 'Write uvm sv constraints to generate M×N matrix where each element is {0,1} (binary). Constraint: Sum of all matrix elements must be less than MAX_SUM. Parameterize M, N, MAX_SUM. Avoid using .sum() reduction method.',
      difficulty: 'Medium',
      topics: ['Constraints', 'Matrix', 'Sum'],
      requirements: [
        'DIMENSIONS: M rows, N columns. Total M*N elements.',
        'ELEMENT VALUES: Each element mm[i][j] inside {0,1}. Binary only.',
        'SUM CONSTRAINT: Sum of all M*N elements < MAX_SUM. Total_count_of_1s < MAX_SUM.',
        'PARAMETERS: M, N, MAX_SUM defined as parameters or inputs. Ensure feasibility: 0 ≤ MAX_SUM ≤ M*N.',
        'NO .sum() METHOD: Implement sum manually using loops/accumulators.',
        'FEASIBILITY CASES: MAX_SUM=0 forces all zeros. MAX_SUM=M*N allows any matrix (no constraint).',
        'Test Case 1 - Typical Constraint: M=4, N=4, MAX_SUM=6. Randomize. Count total 1s in matrix. Assert count < 6 (i.e., ≤5).',
        'Test Case 2 - Boundary Zero: MAX_SUM=0. Verify all elements = 0 (sum=0 < 0 is false, but sum=0 and constraint<0 means must be 0).',
        'Test Case 3 - Boundary Max: MAX_SUM=M*N+1. Any matrix allowed. Verify matrices with different counts of 1s generated.',
        'Test Case 4 - UNSAT Detection: Set MAX_SUM negative (if signed). Verify randomize fails. Or add conflicting constraint: count>=MAX_SUM.',
        'Test Case 5 - Distribution: Over many randomizations, verify sum values distributed over [0, MAX_SUM-1].'
      ],
      hints: [
        'Sum accumulator: int total_ones = 0; constraint c_sum { foreach(mm[i,j]) total_ones += mm[i][j]; total_ones < MAX_SUM; }',
        'Binary sum = count of 1s: For binary elements, sum equals count of 1s.',
        'Manual loop: int sum_val; constraint c_compute { sum_val == 0; foreach(mm[i]) foreach(mm[i][j]) sum_val += mm[i][j]; sum_val < MAX_SUM; }',
        'Distribution hint (optional): If solver struggles, use dist to guide: mm[i][j] dist {0:=(MAX_SUM/(M*N)), 1:=...}; Approximate target density.',
        'Small dimensions: Keep M,N small (e.g., ≤10) unless testing solver limits.',
        'Feasibility: If MAX_SUM=0, only all-zero matrix satisfies sum<0? No, sum<0 is impossible for non-negative elements. Likely meant sum≤MAX_SUM or sum<MAX_SUM where MAX_SUM≥0. Clarify: sum < MAX_SUM with MAX_SUM=1 allows only sum=0 (all zeros).'
      ]
    },

    {
      id: 'matrix2',
      shortName: 'Adjacent Elements Distinct',
      question: 'Generate m×m Matrix with All Adjacent Elements Different',
      description: 'Write uvm sv constraints to generate square matrix (m×m) where all adjacent elements are distinct. Adjacent means 4-neighborhood (up, down, left, right). Diagonals not considered adjacent unless specified. Include boundary elements (edges have fewer neighbors).',
      difficulty: 'Hard',
      topics: ['Constraints', 'Matrix'],
      requirements: [
        'MATRIX SIZE: Square m×m (e.g., m=4 gives 4×4=16 elements).',
        'ADJACENCY: 4-connected neighborhood. Cell (i,j) adjacent to (i-1,j), (i+1,j), (i,j-1), (i,j+1) if they exist.',
        'DISTINCT REQUIREMENT: For all adjacent pairs (a,b), a ≠ b.',
        'BOUNDARY HANDLING: Edge and corner cells have fewer neighbors. Only compare with existing neighbors.',
        'VALUE DOMAIN: Define range (e.g., [0:10]). Must be large enough: minimum domain size = max_degree + 1. For grid, degree ≤4, so need ≥3 colors theoretically, but ≥5 recommended.',
        'DIAGONAL ADJACENCY (DEFAULT: NO): By default, diagonals not adjacent. If including diagonals (8-neighborhood), state explicitly.',
        'Test Case 1 - Adjacency Check: For each cell (i,j), compare with up/down/left/right neighbors (if exist). Assert all pairs different.',
        'Test Case 2 - Small Domain UNSAT: Restrict values to {0,1} (2 values). For m≥3, verify randomize fails (graph coloring requires ≥3 colors for grid).',
        'Test Case 3 - Solver Performance: m=5 (25 cells). Randomize 50 times. Verify completes without timeout.',
        'Test Case 4 - Boundary Cells: Verify corner cells (4 in m×m) and edge cells checked correctly (dont over-constrain non-existent neighbors).',
        'Test Case 5 - Distribution: Over randomizations, verify values distributed (not always same value assignments).'
      ],
      hints: [
        'Conditional neighbor constraints: constraint c_adj { foreach(a[i,j]) { if(i>0) a[i][j] != a[i-1][j]; if(i<m-1) a[i][j] != a[i+1][j]; if(j>0) a[i][j] != a[i][j-1]; if(j<m-1) a[i][j] != a[i][j+1]; }}',
        'Avoid double constraints: Checking only up and left (if(i>0) and if(j>0)) avoids redundant checks. Equivalent and faster.',
        'Domain size: For 4-neighborhood grid, 3-colorable (chromatic number ≤3 for planar grid). Domain {0,1,2} sufficient theoretically, but {0,1,2,3,4} recommended for solver ease.',
        'Graph coloring: This is a graph coloring problem. Grids are 2-colorable if bipartite (checkerboard), but with all cells same domain, need careful setup.',
        'Checkerboard hint: (i+j)%2 determines color parity. Can guide solver: a[i][j] in {even_set} if (i+j)%2==0 else {odd_set}.',
        'Performance: Large m with small domain is hard. Keep m≤10 for pure constraints.'
      ]
    },

    {
      id: 'matrix3',
      shortName: 'Unique Row Maximums',
      question: 'Matrix Where Each Row Has Unique Maximum and All Maximums Distinct',
      description: 'Write uvm sv constraints to generate 2D array (M rows, N columns) with constraints: (1) Each row has exactly one maximum value (strict maximum, appears once in that row), (2) Maximum values across all rows are distinct (no two rows share same max value).',
      difficulty: 'Hard',
      topics: ['Constraints', 'Matrix'],
      requirements: [
        'DIMENSIONS: M rows, N columns.',
        'ROW MAXIMUM: For each row r, there exists exactly one maximum value. All other entries in row r are strictly less than this maximum.',
        'STRICT MAXIMUM: Maximum appears exactly once per row. No ties. For row r: max_value > all other values in that row.',
        'CROSS-ROW UNIQUENESS: Maximum values of all rows must be pairwise distinct. If row0 max=50, row1 max=75, etc., all different.',
        'VALUE DOMAIN: Must support M distinct maxima plus smaller values. Example: M=4 requires 4 distinct max values. Domain [0:100] sufficient.',
        'Test Case 1 - Row Unique Max: For each row, find maximum value. Count occurrences in that row. Assert count == 1.',
        'Test Case 2 - Strict Inequality: For each row, verify all non-max elements < max element.',
        'Test Case 3 - Cross-Row Uniqueness: Collect max value from each row. Verify all M max values are distinct.',
        'Test Case 4 - UNSAT Corner: Restrict all values to be equal (e.g., all=5). Verify randomize fails (cant have unique max per row).',
        'Test Case 5 - Distribution: Over randomizations, verify different values serve as row maxima.'
      ],
      hints: [
        'Helper arrays: rand int maxcol[M]; rand int maxval[M]; maxcol[r] indicates column of max in row r. maxval[r] is the max value.',
        'Column selection: constraint c_maxcol { foreach(maxcol[r]) maxcol[r] inside {[0:N-1]}; }',
        'Max value assignment: constraint c_maxval { foreach(r in [0:M-1]) maxval[r] == a[r][maxcol[r]]; }',
        'Strict maximum: constraint c_strict { foreach(r in [0:M-1]) foreach(c in [0:N-1]) if(c != maxcol[r]) a[r][c] < maxval[r]; }',
        'Uniqueness of maxima: constraint c_unique_max { unique {maxval}; }',
        'Value bounds: Ensure domain large enough: constraint c_bounds { foreach(a[i,j]) a[i][j] inside {[0:100]}; }',
        'Construction alternative: First randomize M distinct max values. Assign each to random column per row. Fill other cells with smaller values.'
      ]
    },

    {
      id: 'matrix4',
      shortName: 'Sub-Square Maximum Constraint',
      question: 'Odd-Sized Matrix with Unique Sub-Square Maximums',
      description: 'Write uvm sv constraints to generate odd-sized square matrix where: (1) Divide matrix into non-overlapping sub-squares, (2) Each sub-square has exactly one unique maximum, (3) All other elements in sub-square less than max, (4) Maximum values across all sub-squares are distinct, (5) Design scales to 32-bit integer limits.',
      difficulty: 'Hard',
      topics: ['Constraints', 'Matrix'],
      requirements: [
        'MATRIX SIZE: Odd dimension N×N (e.g., N=9 for 9×9 matrix).',
        'SUB-SQUARE PARTITIONING: Define partitioning scheme. Example: For N=9, divide into 9 non-overlapping 3×3 sub-squares. Or define other tiling. Document clearly.',
        'UNIQUE MAX PER SUB-SQUARE: Each sub-square region has exactly one maximum element (strict, appears once). All other elements in that region < max.',
        'CROSS-REGION UNIQUENESS: Maximum values from all sub-squares are pairwise distinct.',
        'SCALING TO 32-BIT: Avoid combinatorial explosion. Use construction or efficient encoding. dont create factorial-sized domains.',
        'REGION MEMBERSHIP: Define function region(i,j) returning which sub-square cell (i,j) belongs to.',
        'Test Case 1 - Sub-Square Max Unique: For each sub-square region, find max. Verify appears exactly once in that region.',
        'Test Case 2 - Strict Inequality: Within each region, verify all non-max elements < max.',
        'Test Case 3 - Maxima Distinct: Collect max from each region. Verify all different.',
        'Test Case 4 - Boundary Regions: Verify edge and corner sub-squares handled correctly.',
        'Test Case 5 - Large Matrix: Test with N=15 or N=21. Verify solver completes.'
      ],
      hints: [
        'Partitioning example: For N=9, 3×3 sub-squares. Region r = (i/3)*3 + (j/3) for i,j in [0:8]. 9 regions total.',
        'Solvable by design: (1) Choose K distinct max values (K = number of regions). (2) Assign each max to one cell in each region. (3) Constrain other cells < their region max.',
        'Helper arrays: rand int max_val[K]; constraint { unique{max_val}; } K distinct maxima. rand int max_pos[K][2]; Position of max in each region.',
        'Assignment: For region r with max position (mi, mj): a[mi][mj] = max_val[r]; All other (i,j) in region r: a[i][j] < max_val[r].',
        'Region function: function int region(int i, int j); return (i/sub_size)*sub_div + (j/sub_size); endfunction Where sub_size = sqrt(N) for square partitions.',
        'Pure constraints very hard: Use construction approach. Randomize max values and positions first, then fill matrix accordingly.',
        'Scaling: Avoid enumerating all cells in constraints. Use procedural post_randomize() to enforce constraints.'
      ]
    },

    {
      id: 'matrix5',
      shortName: 'Matrix 90° Rotation',
      question: 'Generate Matrix and Its 90° Counterclockwise Rotation',
      description: 'Write uvm sv constraints to generate square matrix A and its 90° counterclockwise rotated version B. Establish constraint relationship between A and B such that B is exact rotation of A. Support parameterizable matrix size N.',
      difficulty: 'Medium',
      topics: ['Constraints', 'Matrix', 'Rotation'],
      requirements: [
        'MATRIX SIZE: Square N×N. Both A and B are N×N.',
        'ROTATION: B is A rotated 90° counterclockwise (CCW).',
        'ROTATION MAPPING: For N×N, CCW rotation: B[N-1-j][i] = A[i][j] for all i,j.',
        'CONSTRAINT vs PROCEDURAL: Clarify if both matrices randomized independently then constrained, or A randomized then B derived procedurally.',
        'BIJECTIVITY: Rotation preserves all elements. Multiset(A) == Multiset(B).',
        'Test Case 1 - Mapping Verification: After randomize, verify for all i,j: B[N-1-j][i] == A[i][j].',
        'Test Case 2 - Small Sizes: N=1 (trivial), N=2. Verify rotation correct.',
        'Test Case 3 - Multiset Equality: Flatten both matrices to 1D lists. Sort both. Assert equal.',
        'Test Case 4 - N=3 Example: A={{1,2,3},{4,5,6},{7,8,9}} → B={{3,6,9},{2,5,8},{1,4,7}}. Verify manually.',
        'Test Case 5 - Multiple Randomizations: Randomize A differently, verify B tracks correctly.'
      ],
      hints: [
        'Procedural approach (easiest): Randomize A freely. In post_randomize(), compute B: foreach(i,j) B[N-1-j][i] = A[i][j];',
        'Pure constraint approach: rand int A[N][N]; rand int B[N][N]; constraint c_rotate { foreach(A[i,j]) B[N-1-j][i] == A[i][j]; } Creates N² equality constraints.',
        'Performance: Procedural is faster and simpler. Pure constraint works but heavier for large N.',
        'Rotation formulas: CCW 90°: (i,j) → (N-1-j, i). CW 90°: (i,j) → (j, N-1-i). 180°: (i,j) → (N-1-i, N-1-j).',
        'Value bounds: Constrain A element range. B inherits same range via rotation.',
        'Testing: Use known A, manually compute expected B, verify generated B matches.'
      ]
    },

    {
      id: 'bit1',
      shortName: 'Grouped 1s in Binary',
      question: 'Generate Number with All 1-Bits Grouped in Single Contiguous Run',
      description: 'Write uvm sv constraint to generate number whose binary representation has all 1-bits grouped together in single contiguous run. Pattern: some 0s, then all 1s together, then some 0s. Run length can be 0 to W (width). Support all-zeros and all-ones edge cases if specified.',
      difficulty: 'Medium',
      topics: ['Constraints', 'Pattern'],
      requirements: [
        'WIDTH: Define bit width W (e.g., 16-bit, 32-bit).',
        'PATTERN: All 1-bits form single contiguous run. Examples: 000111110000, 11111000, 00001111111.',
        'NO GAPS: No 0s between 1s. Pattern like 01101 is invalid (gap in middle).',
        'EDGE CASES: All-zeros (run length=0) and all-ones (run length=W). Specify if allowed. Default: allow both.',
        'RUN PARAMETERS: Can represent as (start_position, run_length). start in [0:W-1], length in [0:W], start+length ≤ W.',
        'MASK GENERATION: x = ((1 << length) - 1) << start for width ≤64. For larger, use different representation.',
        'Test Case 1 - Contiguous Check: Find first and last 1-bit positions (ffs, fls). All bits between first and last must be 1. All bits outside must be 0.',
        'Test Case 2 - Edge Runs: start=0, length=W (all-ones). start=any, length=0 (all-zeros). Verify both appear in randomizations.',
        'Test Case 3 - Single-Bit Run: length=1. Pattern: single 1 at some position. Valid contiguous run.',
        'Test Case 4 - Degenerate (if allowing all-zeros): x=0. Technically "grouped" (empty group). Clarify if allowed.',
        'Test Case 5 - Mid-Run: start=5, length=3, W=16. Pattern: ...00011100000... Verify generated.'
      ],
      hints: [
        'Parameter representation: rand int start; rand int length; constraint c_range { start inside {[0:W-1]}; length inside {[0:W]}; start + length <= W; }',
        'Mask generation: constraint c_value { x == ((1 << length) - 1) << start; } For W≤64 (fits in long).',
        'For arbitrary W: Use bit vector constraints. All bits [0:start-1] and [start+length:W-1] must be 0. Bits [start:start+length-1] must be 1.',
        'Alternative: Constrain transitions. Count 0→1 and 1→0 transitions. Must be ≤2 total (one rising edge, one falling edge) for contiguous run.',
        'Transition counting: int rise=0, fall=0; foreach(x[i]) if(i>0) { if(!x[i-1] && x[i]) rise++; if(x[i-1] && !x[i]) fall++; } constraint { rise <= 1; fall <= 1; }',
        'Simplest approach: Use (start, length) and build mask directly.'
      ]
    },

    {
      id: 'bit2',
      shortName: '5 Non-Adjacent Set Bits',
      question: '10-bit Value with Exactly 5 Non-Adjacent 1-Bits',
      description: 'Write uvm sv constraints to generate 10-bit value with exactly 5 bits set such that no two set bits are adjacent (neighbors). Pattern must have gaps between 1s. Implement without using $countones in constraints',
      difficulty: 'Hard',
      topics: ['Constraints', 'Adjacent'],
      requirements: [
        'WIDTH: 10 bits (bit [9:0] x).',
        'POPCOUNT: Exactly 5 bits set. Total number of 1s = 5.',
        'NON-ADJACENT: For all i, NOT(x[i]==1 AND x[i+1]==1). No two consecutive bits both 1.',
        'FEASIBILITY: Maximum non-adjacent 1s in 10 bits is 5. Pattern: 1010101010 (5 ones). Constraint is feasible.',
        'NO $COUNTONES IN CONSTRAINTS: Implement popcount via explicit bit sum or construction.',
        'Test Case 1 - Non-Adjacent Check: For i in [0:8], verify NOT(x[i] AND x[i+1]). No adjacent 1s.',
        'Test Case 2 - Popcount: In testbench, verify $countones(x) == 5 for every randomization.',
        'Test Case 3 - Pattern Uniqueness: Randomize 100 times. Verify multiple different valid patterns appear (not always 1010101010).',
        'Test Case 4 - Edge Bits: Verify bits 0 and 9 can be 1 (not excluded by constraints).',
        'Test Case 5 - Maximum Density: With 5 ones non-adjacent, minimum width needed is 9 (101010101). 10 bits has 1 spare, allowing variations.'
      ],
      hints: [
        'Construction approach: Choose 5 positions p0 < p1 < p2 < p3 < p4 with constraint p{k+1} >= p{k}+2 (gap ≥1 between positions) and p4 <= 9.',
        'Position selection: rand int pos[5]; constraint c_order { foreach(pos[i]) if(i>0) pos[i] >= pos[i-1] + 2; pos[4] <= 9; } Then set bits: foreach(pos[i]) x[pos[i]] = 1;',
        'Sorted positions: constraint c_unique { unique{pos}; } ensures distinct. Ordering ensures non-adjacent.',
        'Alternative adjacency constraint: constraint c_adj { foreach(x[i]) if(i < 9) !(x[i] & x[i+1]); } No adjacent pairs.',
        'Popcount without $countones: int cnt = x[0]+x[1]+x[2]+x[3]+x[4]+x[5]+x[6]+x[7]+x[8]+x[9]; constraint { cnt == 5; }',
        'Combining both: Non-adjacent constraint + popcount constraint. Solver finds valid assignments.',
        'Performance: Position-based approach is faster. Pure bit constraints work but slower.'
      ]
    },

    {
      id: 'bit3',
      shortName: 'Equal 1s and 0s',
      question: 'Generate Value with Equal Number of 1-Bits and 0-Bits',
      description: 'Write uvm sv constraint for variable where number of 1-bits equals number of 0-bits. Balanced bit pattern. Requires even bit width. Implement popcount without $countones if needed.',
      difficulty: 'Medium',
      topics: ['Constraints', 'Balance'],
      requirements: [
        'WIDTH: Must be even (W % 2 == 0). Odd width makes equal 1s/0s impossible. Specify W (e.g., W=10).',
        'BALANCE: Number of 1s = Number of 0s = W/2.',
        'ODD WIDTH HANDLING: If W is odd, constraint is UNSAT. Verify randomize fails or define W as even.',
        'POPCOUNT: Exactly W/2 bits set.',
        'NO $COUNTONES IN CONSTRAINTS: Implement via explicit sum or construction.',
        'Test Case 1 - Even Width Balance: W=10. Verify $countones(x) == 5 in testbench.',
        'Test Case 2 - Odd Width UNSAT: W=11. Add constraint for equal 1s/0s. Verify randomize() fails.',
        'Test Case 3 - Pattern Variety: Randomize 100 times. Verify different balanced patterns appear.',
        'Test Case 4 - W=2: Minimal case. Possible values: 01 (1 one, 1 zero) or 10. Both valid.',
        'Test Case 5 - Large W: W=32. Verify 16 ones, 16 zeros.'
      ],
      hints: [
        'Width check: Assert W is even before applying constraint. static assert(W % 2 == 0);',
        'Popcount constraint: int k = W/2; int cnt = sum of all bits; constraint { cnt == k; }',
        'Bit sum: int cnt; constraint c_cnt { cnt == x[0]+x[1]+...+x[W-1]; cnt == W/2; }',
        'Construction: Choose W/2 positions, set them to 1. rand int pos[W/2]; constraint { unique{pos}; foreach(pos[i]) pos[i] inside {[0:W-1]}; } Then set bits: x=0; foreach(pos[i]) x[pos[i]]=1;',
        'Pure constraint: constraint c_balance { $countones(x) == W/2; } if $countones allowed in constraints (tool-dependent).',
        'Odd width error: If W odd, randomize will fail. Add check or define W as parameter enforced even.'
      ]
    },

    {
      id: 'bit4',
      shortName: 'Power of 4',
      question: 'Generate Number that is Power of 4',
      description: 'Write uvm sv constraint to generate number that is a power of 4: x = 4^n for some non-negative integer n. Values: 1, 4, 16, 64, 256, ... Bit pattern: single 1-bit at even bit position.',
      difficulty: 'Easy',
      topics: ['Constraints', 'Math', 'Power'],
      requirements: [
        'POWER OF 4: x ∈ {4^0, 4^1, 4^2, ...} = {1, 4, 16, 64, 256, ...} within width limits.',
        'BIT PATTERN: Power of 4 in binary: single bit set at position 0,2,4,6,... (even positions). 4^0=1 (bit 0), 4^1=4 (bit 2), 4^2=16 (bit 4), etc.',
        'VALUE DOMAIN: For W-bit variable, maximum n such that 4^n < 2^W. Example: 32-bit allows up to 4^15 = 2^30.',
        'ZERO EXCLUDED: Typically x > 0. Power of 4 starts at 4^0=1.',
        'Test Case 1 - Valid Set: Randomize 1000 times. Verify all generated values are in {1,4,16,64,256,...} up to width limit.',
        'Test Case 2 - Bit Position: Verify each generated value has exactly one bit set at even position (0,2,4,6,...).',
        'Test Case 3 - Edge Case: Largest power of 4 fitting in width appears sometimes.',
        'Test Case 4 - Invalid Value: Add constraint x==12. Verify randomize fails (12 not power of 4).',
        'Test Case 5 - Distribution: Over randomizations, multiple different powers appear (not stuck on one value).'
      ],
      hints: [
        'Bit trick: Power of 4 ⇔ (exactly one bit set) AND (bit position is even). $onehot(x) AND (x & 0x55555555) == x for 32-bit.',
        'One-hot check: $onehot(x) returns true if exactly one bit set. $countones(x) == 1.',
        'Even position mask: For 32-bit: 0x55555555 = 0101 0101 ... (1s at even positions). x & mask == x means all 1-bits at even positions.',
        'Combined: constraint c_pow4 { $onehot(x) && ((x & 32\'h55555555) == x); } For 32-bit.',
        'Without $onehot: constraint c_pow4 { $countones(x) == 1; x[1]==0; x[3]==0; ... } Ensure single bit and at even position.',
        'Alternative (exponent-based): Choose exponent n in [0:max_n]. Set x = 1 << (2*n). constraint { x == (1 << (2*exponent)); exponent inside {[0:W/2-1]}; }',
        'For unsigned int: Use int unsigned or bit [W-1:0] to avoid sign issues.'
      ]
    },

    {
      id: 'hist1',
      shortName: 'Last 4 Values Unique',
      question: 'Stream with Last 4 Generated Values All Different',
      description: 'Write uvm sv constraints to generate stream of random numbers where the most recent four values are always unique (no repeats in last 4). Maintain sliding window history. Define value domain large enough for feasibility (≥5 distinct values).',
      difficulty: 'Medium',
      topics: ['Constraints', 'Stream'],
      requirements: [
        'STREAM: Sequence of random values generated one at a time.',
        'SLIDING WINDOW: Maintain history of last 4 generated values.',
        'UNIQUENESS: Next generated value must differ from all 4 previous values. x[t] ∉ {x[t-1], x[t-2], x[t-3], x[t-4]}.',
        'VALUE DOMAIN: Must have ≥5 distinct values for feasibility. If domain={0,1,2,3,4}, just feasible. Recommend larger (e.g., [0:9]).',
        'WINDOW BEFORE FULL: For t<4, uniqueness constraint only applies to existing history. t=0: unconstrained. t=1: x[1]≠x[0]. t=2: x[2]∉{x[0],x[1]}, etc.',
        'RESET: On reset/initialization, clear history. First 4 values unconstrained by uniqueness.',
        'Test Case 1 - Sliding Window: Generate 20 values. For each t≥4, verify x[t] not equal to any of x[t-1], x[t-2], x[t-3], x[t-4].',
        'Test Case 2 - Small Domain UNSAT: Restrict domain to {0,1,2,3}. Fill window with all 4 values. Next randomize must fail (no valid 5th value).',
      ],
      hints: [
        'Stateful class: class StreamGen; rand int next_val; int history[$]; // Queue of last 4 values constraint c_unique { foreach(history[i]) next_val != history[i]; }',
        'Update history: function void post_randomize(); history.push_front(next_val); if(history.size() > 4) history.pop_back(); endfunction',
        'Domain: rand int next_val; constraint c_domain { next_val inside {[0:9]}; } Ensures 10 possible values (sufficient).',
        'Alternative: Use fixed-size array: int prev[4]; int cnt; (track how many valid). Only constrain against prev[0:cnt-1].',
        'Pure constraint (full sequence): If modeling entire sequence in one randomize, use: constraint c_window { foreach(x[t]) if(t>=4) x[t] not in {x[t-1], x[t-2], x[t-3], x[t-4]}; }',
        'Feasibility: Minimum domain size = 5 (need one value outside any 4-element window).'
      ]
    },

    {
      id: 'hist2',
      shortName: 'No Repeat in Next 3 Draws',
      question: 'Pick Ball from 10 Colors, No Repeat in Next 3 Picks',
      description: 'Randomly select a colored ball from 10 options. Once picked, that color cannot be selected in the next 3 draws (cooldown period). Write uvm sv constraint to implement sliding exclusion window of last 3 picks.',
      difficulty: 'Hard',
      topics: ['Constraints', 'Pattern'],
      requirements: [
        'COLORS: 10 different colored balls (e.g., values 0-9).',
        'EXCLUSION RULE: If color C picked at time t, then C cannot be picked at times t+1, t+2, t+3.',
        'SLIDING WINDOW: Maintain last 3 picks. Next pick must not match any of last 3.',
        'FEASIBILITY: 10 colors, exclude 3 → 7 available each turn. Always feasible.',
        'WITH REPLACEMENT: Same color can be picked multiple times (not permanent removal), just not within cooldown window.',
        'COOLDOWN EXPIRY: After 3 draws, color becomes available again. Color picked at t becomes available again at t+4.',
        'Test Case 1 - Window Rule: Generate 50 picks. For each t, verify pick[t] ∉ {pick[t-1], pick[t-2], pick[t-3]} (for t≥1,2,3 respectively).',
        'Test Case 2 - All Colors Appear: Over long sequence, verify all 10 colors appear (not permanently excluded).',
        'Test Case 3 - Cooldown Expiry: Pick color 5 at t=0. Verify color 5 excluded at t=1,2,3. Available again at t=4.'
      ],
      hints: [
        'Same approach as hist1: class BallPicker; rand int color; int prev[3]; constraint c_excl { foreach(prev[i]) if(i<cnt) color != prev[i]; }',
        'History queue: int history[$]; constraint c_excl { foreach(history[i]) color != history[i]; } function post_randomize(); history.push_front(color); if(history.size()>3) history.pop_back(); endfunction',
        'Domain: constraint c_domain { color inside {[0:9]}; }',
        'Uniform among available: Use dist for uniform distribution: color dist {[0:9] := 1}; Combined with exclusion.',
        'Full sequence modeling: constraint c_window { foreach(pick[t]) { int excl[$]; for(int d=1; d<=3 && t-d>=0; d++) excl.push_back(pick[t-d]); pick[t] not in excl; }}'
      ]
    },

    {
      id: 'classic1',
      shortName: 'Sudoku Puzzle Constraints',
      question: 'Generate Valid Solved 9×9 Sudoku Puzzle',
      description: 'Write UVM SystemVerilog constraints to generate a valid, complete 9×9 Sudoku solution. Constraints: Each row contains 1-9 exactly once, each column contains 1-9 exactly once, each 3×3 box contains 1-9 exactly once.',
      difficulty: 'Hard',
      topics: ['Constraints', 'Sudoku', 'Classic'],
      requirements: [
        'GRID: 9×9 array, values 1-9.',
        'ROW CONSTRAINT: For each row r, all 9 cells contain 1-9 exactly once (permutation).',
        'COLUMN CONSTRAINT: For each column c, all 9 cells contain 1-9 exactly once.',
        'BOX CONSTRAINT: Grid divided into 9 non-overlapping 3×3 boxes. Each box contains 1-9 exactly once.',
        'BOX INDEXING: Box b = (row/3)*3 + (col/3). 9 boxes total (0-8).',
        'SOLVER PERFORMANCE: Pure constraint solving for 9×9 Sudoku is computationally expensive. Consider symmetry breaking.',
        'SYMMETRY BREAKING: Fix first row to 1,2,3,4,5,6,7,8,9 to eliminate equivalent solutions. Reduces search space.',
        'Test Case 1 - Row Validity: For each row, verify all 9 values distinct and in [1:9].',
        'Test Case 2 - Column Validity: For each column, verify all 9 values distinct and in [1:9].',
        'Test Case 3 - Box Validity: For each 3×3 box, collect 9 values. Verify distinct and in [1:9].',
        'Test Case 4 - Multiple Solutions: Randomize with different seeds. Verify different valid solutions generated.',
        'Test Case 5 - Symmetry Break: If fixing first row, verify solutions still valid and diverse.'
      ],
      hints: [
        'Value domain: constraint c_domain { foreach(grid[i,j]) grid[i][j] inside {[1:9]}; }',
        'Row uniqueness: constraint c_rows { foreach(grid[r]) unique {grid[r]}; } For each row, all 9 cells unique.',
        'Column uniqueness: constraint c_cols { foreach(grid[,c]) unique {grid[c]}; } May need explicit loop: foreach(c in [0:8]) unique{grid[0][c], grid[1][c], ..., grid[8][c]};',
        'Box uniqueness: For each box b: collect 9 cells, apply unique. Explicit: foreach(box_id in [0:8]) { int box[$]; for(row in box_rows) for(col in box_cols) box.push_back(grid[row][col]); unique{box}; }',
        'Symmetry breaking: constraint c_break { grid[0] == {1,2,3,4,5,6,7,8,9}; } Fixes first row.',
        'Alternative: Use construction (backtracking algorithm) in post_randomize or pre-generation, then present as "constraint".',
        'Warning: Pure constraint solving may timeout for many solvers. Construction recommended for actual use.'
      ]
    },

    {
      id: 'classic2',
      shortName: '8 Queens Problem',
      question: 'Solve 8 Queens Problem Using Constraints',
      description: 'Write uvm sv constraints to Place 8 queens on 8×8 chessboard such that no two queens attack each other. Queens attack same row, column, or diagonal. Model as constraint problem: assign column position for each row\'s queen.',
      difficulty: 'Hard',
      topics: ['Constraints', 'Queens'],
      requirements: [
        'BOARD: 8×8 chessboard.',
        'QUEENS: 8 queens, one per row.',
        'MODELING: Use array col[8] where col[r] = column position of queen in row r. Domain: col[r] in [0:7].',
        'NO COLUMN CONFLICTS: No two queens in same column. unique{col}.',
        'NO DIAGONAL CONFLICTS: No two queens on same diagonal. For rows i,j: abs(col[i]-col[j]) ≠ abs(i-j).',
        'Test Case 1 - No Column Duplicates: Verify unique(col). All 8 values in [0:7] and distinct.',
        'Test Case 2 - Diagonal Check: For all pairs (i,j) with i<j, verify abs(col[i]-col[j]) ≠ abs(i-j).',
        'Test Case 3 - Solution Validity: Place queens on board per col[] assignments. Visually verify no attacks.',
        'Test Case 4 - Multiple Solutions: Randomize with different seeds. Verify different valid placements (8-Queens has 92 solutions, 12 unique under symmetry).',
        'Test Case 5 - UNSAT: Add conflicting constraint (e.g., col[0]==col[1]). Verify randomize fails.'
      ],
      hints: [
        'Column array: rand int col[8]; constraint c_domain { foreach(col[i]) col[i] inside {[0:7]}; }',
        'Unique columns: constraint c_unique_col { unique{col}; }',
        'Diagonal constraints: constraint c_diag { foreach(col[i]) foreach(col[j]) if(i < j) abs(col[i] - col[j]) != (j - i); } Pairwise O(N²) but fine for N=8.',
        'Absolute value: In SystemVerilog, use: (col[i]>col[j]) ? (col[i]-col[j]) : (col[j]-col[i]) or $abs() if available.',
        'Simplified diagonal: (col[i]-col[j]) != (j-i) AND (col[i]-col[j]) != (i-j). Covers both diagonals.',
        'Symmetry breaking (optional): constraint c_break { col[0] < col[7]; } Eliminates mirror solutions.',
        'Data type: Use int unsigned to avoid abs() issues: constraint c_diag { foreach(col[i]) foreach(col[j]) if(i<j) (col[i]+j != col[j]+i) && (col[i]+i != col[j]+j); }'
      ]
    },

    {
      id: 'classic3',
      shortName: "Knight's Tour Problem",
      question: "Generate Knight's Tour on Chessboard Using Constraints",
      description: "Write uvm sv constraints to solve Knight's Tour problem: knight visits every square on chessboard exactly once using legal knight moves. Represent as sequence of 64 positions with knight-move adjacency between successive positions. Pure constraints very difficult; consider algorithmic generation.",
      difficulty: 'Hard',
      topics: ['Constraints', 'Knight'],
      requirements: [
        'BOARD SIZE: Standard 8×8 (64 squares). Can start with smaller (e.g., 5×5) for testing.',
        'TOUR LENGTH: 64 moves (for 8×8). Visit each square exactly once.',
        'POSITION REPRESENTATION: Each position as (row, col) pair or single index 0-63.',
        'KNIGHT MOVE: From (r,c), knight moves to (r±1,c±2) or (r±2,c±1). 8 possible moves per position (if on board).',
        'ADJACENCY: For sequence pos[0], pos[1], ..., pos[63], each consecutive pair must be valid knight move.',
        'UNIQUENESS: All 64 positions must be distinct (visit each square once).',
        'STARTING POSITION: Can be fixed (e.g., (0,0)) or random.',
        'PURE CONSTRAINTS DIFFICULTY: This is extremely hard for solvers. Recommend algorithmic generation (Warnsdorff heuristic).',
        'Test Case 1 - Move Validity: For each consecutive pair pos[i], pos[i+1], verify delta is valid knight move.',
        'Test Case 2 - Uniqueness: Verify all 64 positions distinct.',
        'Test Case 3 - Full Coverage: Verify set of positions equals all board squares.',
        'Test Case 4 - Start Position: Test with fixed start (0,0) and with random start.',
        'Test Case 5 - Smaller Board: 5×5 board (25 squares) as simpler Test Case.'
      ],
      hints: [
        'Representation: rand int pos[64][2]; // Array of (row,col) pairs. Or: rand int pos_idx[64]; where pos_idx[i] in [0:63].',
        'Knight move delta: Valid deltas: (±1,±2) and (±2,±1). constraint c_moves { foreach(pos[i]) if(i<63) { int dr = abs(pos[i+1][0] - pos[i][0]); int dc = abs(pos[i+1][1] - pos[i][1]); (dr==1 && dc==2) || (dr==2 && dc==1); }}',
        'Uniqueness: constraint c_unique { unique{pos}; } For array of pairs, may need flattening.',
        'Bounds: constraint c_bounds { foreach(pos[i]) { pos[i][0] inside {[0:7]}; pos[i][1] inside {[0:7]}; }}',
        'Construction approach (recommended): Use Warnsdorff algorithm: From current position, choose next move to square with fewest onward moves. Generates tour probabilistically.',
        'Smaller boards: 5×5 (25 squares) or 6×6 (36 squares) much more tractable for constraints.',
        'Solver timeout: Pure constraint-based Knight Tour for 8×8 may timeout in most solvers. Use algorithmic generation for practical implementation.'
      ]
    },

    {
      id: 'classic4',
      shortName: 'Magic Square',
      question: 'Generate N×N Magic Square with All Sums Equal',
      description: 'Write uvm sv constraints to create magic square of size N where each row, column, and both main diagonals sum to the same magic constant. Use numbers 1 to N². All numbers appear exactly once. Start with N=3 (magic constant=15).',
      difficulty: 'Hard',
      topics: ['Constraints', 'Magic Square'],
      requirements: [
        'SIZE: N×N square (parameterized). Start with N=3. Note: N=2 has no magic square. N=1 is trivial.',
        'VALUES: Use integers 1 to N² each exactly once.',
        'MAGIC CONSTANT: S = N*(N²+1)/2. For N=3: S = 3*10/2 = 15.',
        'ROW SUMS: Each row sums to S.',
        'COLUMN SUMS: Each column sums to S.',
        'DIAGONAL SUMS: Both main diagonals sum to S. Main diagonal: (0,0), (1,1), ..., (N-1,N-1). Anti-diagonal: (0,N-1), (1,N-2), ..., (N-1,0).',
        'UNIQUENESS: All N² cells contain distinct values from [1:N²].',
        'SYMMETRY BREAKING: Fix one cell (e.g., grid[0][0]=1) or first row ordering to reduce equivalent solutions.',
        'Test Case 1 - Value Uniqueness: Flatten grid. Verify all values in [1:N²] and all distinct.',
        'Test Case 2 - Row Sums: For each row, sum all elements. Assert sum == S.',
        'Test Case 3 - Column Sums: For each column, assert sum == S.',
        'Test Case 4 - Diagonal Sums: Main diagonal sum == S. Anti-diagonal sum == S.',
        'Test Case 5 - Known N=3 Solution: Verify generated solution matches known magic squares (e.g., 2,7,6 / 9,5,1 / 4,3,8).'
      ],
      hints: [
        'Values: rand int grid[N][N]; constraint c_values { foreach(grid[i,j]) grid[i][j] inside {[1:N*N]}; } constraint c_unique { unique{grid}; } (requires flattening).',
        'Magic constant: parameter int S = N*(N*N+1)/2; For N=3: S=15.',
        'Row sums: constraint c_rows { foreach(grid[r]) grid[r][0]+grid[r][1]+...+grid[r][N-1] == S; }',
        'Column sums: constraint c_cols { foreach(c in [0:N-1]) grid[0][c]+grid[1][c]+...+grid[N-1][c] == S; }',
        'Main diagonal: constraint c_diag1 { grid[0][0]+grid[1][1]+...+grid[N-1][N-1] == S; }',
        'Anti-diagonal: constraint c_diag2 { grid[0][N-1]+grid[1][N-2]+...+grid[N-1][0] == S; }',
        'Symmetry breaking: constraint c_break { grid[0][0] == 1; } or fix first row ordering.',
        'Start with N=3: Only 8 unique magic squares (up to rotations/reflections). Constraints tractable.',
        'N=4 much harder: 880 distinct magic squares. Solver performance degrades.',
        'Construction: For odd N, use Siamese method algorithmically, then randomize equivalence.'
      ]
    },

    {
      id: 'pipe1',
      shortName: 'Instruction Repetition Constraints',
      question: 'Instruction Stream with Repetition Window Constraints',
      description: 'Write uvm sv constraints to generate instruction stream from {ADD, SUB, MUL, NOP} with rules: (1) ADD cannot repeat within last 3 cycles, (2) SUB cannot repeat within last 3 valid instructions, (3) NOP not allowed at all.',
      difficulty: 'Hard',
      topics: ['Constraints', 'Pipeline', 'Instructions'],
      requirements: [
        'INSTRUCTION SET: {ADD, SUB, MUL}. NOP excluded entirely.',
        'STREAM LENGTH: Define T cycles (e.g., T=30 for testing).',
        'ADD SPACING: If instr[t]==ADD, then instr[t-1], instr[t-2], instr[t-3] must not be ADD (cycle-based window).',
        'SUB SPACING: SUB cannot repeat within last 3 valid (non-bubble) instructions. Define "valid" (all instructions valid or handle bubbles).',
        'NOP EXCLUSION: No instruction can be NOP. constraint { instr[t] != NOP; }',
        'Test Case 1 - ADD Window: Generate sequence length 30. For each t where instr[t]==ADD, verify instr[t-1], instr[t-2], instr[t-3] ≠ ADD.',
        'Test Case 2 - SUB Window: Track last 3 valid SUB positions. Verify spacing >= 3 valid instructions.',
        'Test Case 3 - No NOP: Verify instr[] contains only {ADD, SUB, MUL}.',
        'Test Case 4 - Feasibility: With 3 opcodes and spacing constraints, verify randomize succeeds over many seeds.',
        'Test Case 5 - Distribution: Over many runs, verify all 3 opcodes appear (not stuck on one).'
      ],
      hints: [
        'Stateful generation: Maintain history queue. Generate one instruction at a time with constraints against history.',
        'Cycle-based spacing (ADD): constraint c_add { if(instr[t]==ADD) foreach(d in [1:3]) if(t-d>=0) instr[t-d] != ADD; }',
        'Valid instruction counting (SUB): More complex. Need to track count of valid instructions, not cycles.',
        'Full sequence constraint: rand instr_t instr[T]; constraint c_no_nop { foreach(instr[i]) instr[i] != NOP; }',
        'History approach: class InstrGen; rand instr_t next; instr_t history[$]; constraint c_spacing { // check against history } function post_randomize(); history.push_front(next); if(history.size()>K) history.pop_back(); endfunction',
        'Feasibility: 3 opcodes, spacing 3 → needs at least 4 distinct opcodes ideally, but with MUL as filler, feasible.'
      ]
    },
  {
      id: 'pipe2',
      shortName: 'No Overlapping Instructions',
      question: 'Generate Instruction Schedule with Latency-Based Non-Overlap Constraints',
      description: 'Write uvm sv constraints to generate instruction schedule where each instruction has execution latency. Constraint: No two identical instructions (same opcode) can have overlapping execution windows. Different opcodes can overlap. Instructions: ADD, SUB, MUL, NOP with defined latencies.',
      difficulty: 'Hard',
      topics: ['Constraints', 'Pipeline', 'Latency'],
      requirements: [
        'INSTRUCTIONS: {ADD, SUB, MUL, NOP} with execution latencies. Define latencies: ADD=3 cycles, SUB=2 cycles, MUL=5 cycles, NOP=1 cycle (example values).',
        'ISSUE RATE: One instruction can issue per cycle (or define rate). Issues are scheduled at specific start times.',
        'EXECUTION WINDOW: Instruction issued at time t with latency L occupies cycles [t, t+L-1].',
        'NON-OVERLAP RULE: Two instructions with same opcode cannot have overlapping execution windows. If ADD issues at t=0 (occupies 0-2), next ADD cannot issue before t=3.',
        'DIFFERENT OPCODES: Different opcodes CAN overlap. ADD and MUL can execute simultaneously.',
        'SCHEDULE LENGTH: Define total cycles T (e.g., T=20).',
        'REPRESENTATION: Schedule as array of issued instructions per cycle, or array of (opcode, start_time) pairs.',
        'Test Case 1 - No Same-Opcode Overlap: For each opcode, find all issue times. Verify for same opcode, if issued at t1 and t2 (t1<t2), then t2 >= t1 + latency(opcode).',
        'Test Case 2 - Different Opcode Overlap Allowed: Verify cases where ADD and MUL overlap (issued such that execution windows intersect).',
        'Test Case 3 - Boundary: Set latency=1 for all. Overlap constraint becomes "no same opcode in same cycle" (trivial, always satisfied if one issue per cycle).',
        'Test Case 4 - Dense Schedule: Short latencies, long schedule. Verify many instructions scheduled without conflicts.',
        'Test Case 5 - Latency Respect: For opcode with latency L, verify minimum spacing between consecutive issues is L cycles.'
      ],
      hints: [
        'Stateful generation (easiest): Maintain per-opcode "last_start_time". When issuing opcode, constrain: current_time >= last_start[opcode] + latency[opcode].',
        'Per-opcode cooldown: class SchedGen; rand opcode_t op; int cycle; int last_issue[NUM_OPCODES]; constraint c_spacing { cycle >= last_issue[op] + latency(op); } function post_randomize(); last_issue[op] = cycle; cycle++; endfunction',
        'Full schedule constraint: rand opcode_t sched[T]; For each opcode, find all issue times: int issue_times[opcode][$]; Pairwise spacing: foreach consecutive pairs, verify spacing >= latency.',
        'Issue time array: rand int start_time[N]; rand opcode_t op[N]; constraint c_order { foreach(start_time[i]) if(i>0) start_time[i] > start_time[i-1]; } constraint c_spacing { foreach(op[i]) foreach(op[j]) if(i<j && op[i]==op[j]) start_time[j] >= start_time[i] + latency(op[i]); }',
        'Latency lookup: function int latency(opcode_t op); case(op) ADD: return 3; SUB: return 2; MUL: return 5; NOP: return 1; endcase endfunction',
        'Stateful approach is much simpler than full-schedule constraint. Recommended for implementation.',
        'Cooldown timer: Alternative: maintain cooldown counter per opcode. Decrement each cycle. Block issue if cooldown > 0.'
      ]
    },

    {
      id: 'pipe3',
      shortName: 'Achieve Without Constraints',
      question: 'Implement Instruction Generation Rules Without SystemVerilog Constraints',
      description: 'Write uvm sv constraints to implement the instruction repetition and non-overlap rules from pipe1 and pipe2 using procedural code (algorithmic random generation) instead of declarative constraints. Must maintain same functional behavior: spacing rules, no-overlap, deterministic seed-based reproduction.',
      difficulty: 'Hard',
      topics: ['Alternative', 'Pipeline', 'Implementation'],
      requirements: [
        'NO SV CONSTRAINTS: Cannot use rand variables with constraint blocks. Pure procedural/algorithmic approach.',
        'FUNCTIONAL EQUIVALENCE: Must enforce same rules as constrained versions (ADD spacing, SUB spacing, latency-based overlap).',
        'RANDOM GENERATION: Use $urandom or $random with seed for randomness. Not deterministic selection.',
        'STATE MANAGEMENT: Maintain history, cooldown counters, or other state to track constraints.',
        'LEGAL FILTERING: Each step, determine legal opcodes (those not violating rules), then randomly select from legal set.',
        'SEED REPRODUCIBILITY: Same seed must produce same instruction sequence (deterministic).',
        'NO DEADLOCK: If no legal opcode exists, define behavior: insert bubble/NOP (if allowed), backtrack, or restart. Document choice.',
        'Test Case 1 - Rule Compliance: Generate long sequence (1000 instructions). Verify all spacing and overlap rules hold.',
        'Test Case 2 - Stress Test: Worst-case latencies and small opcode sets. Verify generator produces outputs without hanging.',
        'Test Case 3 - Determinism: Generate sequence with seed=42. Reset and regenerate with same seed. Verify identical sequences.',
        'Test Case 4 - Distribution: Over many seeds, verify opcodes distributed reasonably (not heavily biased unless required).',
        'Test Case 5 - No Deadlock: Test with tight constraints. Verify generator handles cases where few/no legal opcodes remain.'
      ],
      hints: [
        'Picker function approach: function opcode_t pick_next_instr(instr_queue_t history, int cooldown[NUM_OPCODES]); opcode_t legal[$]; foreach(opcode op) if(is_legal(op, history, cooldown)) legal.push_back(op); if(legal.size()==0) handle_no_legal(); // bubble, backtrack, etc. return legal[$urandom % legal.size()]; endfunction',
        'Legality check: function bit is_legal(opcode_t op, ...); if(op==ADD) check last 3 cycles; if(op==SUB) check last 3 valid; check cooldown[op]==0; return all_checks_pass; endfunction',
        'Cooldown maintenance: After issuing opcode, set cooldown[opcode] = latency(opcode). Each cycle, decrement all cooldowns: foreach(cooldown[i]) if(cooldown[i]>0) cooldown[i]--;',
        'History queue: Keep sliding window of last K instructions/cycles. Update after each issue.',
        'Seed setting: Initial: $urandom(seed); or my_random_state = seed; then use custom RNG.',
        'Uniform selection from legal set: Once legal opcodes identified, use $urandom_range or modulo to select uniformly.',
        'Bubble insertion (if no legal): If legal.size()==0 and NOP allowed: insert NOP or idle cycle. If NOP not allowed: backtrack or restart with different seed.',
        'Testing: Compare output statistics (opcode frequencies, spacing histograms) with constrained version to verify equivalence.'
      ]
    },

    {
      id: 'game1',
      shortName: 'Tic-Tac-Toe Constraints',
      question: 'Generate Valid Tic-Tac-Toe Board State with Reachability Constraints',
      description: 'Write SystemVerilog UVM constraints for 3×3 Tic-Tac-Toe board. Define encoding (empty/X/O). Optionally enforce reachability: board represents valid game state (legal move sequence exists, turn counts correct, at most one winner).',
      difficulty: 'Medium',
      topics: ['Constraints', 'Game', 'Tic-Tac-Toe'],
      requirements: [
        'BOARD SIZE: 3×3 grid (9 cells).',
        'CELL ENCODING: Each cell in {EMPTY, X, O}. Define enum or integer encoding (e.g., 0=EMPTY, 1=X, 2=O).',
        'SIMPLE BOARD (Option 1): Any combination of EMPTY/X/O allowed. No game rules enforced. Just randomize cells.',
        'REACHABLE BOARD (Option 2): Board must be reachable through legal game play. Constraints: (1) Turn count: #X == #O or #X == #O+1 (X moves first), (2) At most one winner: not (X wins AND O wins), (3) If X wins, no more O moves after (optional).',
        'WINNER DETECTION: Check rows, columns, diagonals for three-in-a-row.',
        'TURN COUNT: count(X) - count(O) in {0, 1}. If X starts, X can have at most one more mark than O.',
        'TERMINAL vs NON-TERMINAL (Optional): Specify if board is terminal (game over) or mid-game (can continue).',
        'Test Case 1 - Reachable Turn Count: Count X and O marks. Verify count(X) == count(O) or count(X) == count(O)+1.',
        'Test Case 2 - Winner Logic: Check all 8 win conditions (3 rows, 3 cols, 2 diags). Verify at most one player wins.',
        'Test Case 3 - Empty Board: All cells EMPTY. Valid reachable state (game start).',
        'Test Case 4 - Full Board: All 9 cells filled. Verify turn count valid (5 X, 4 O).',
        'Test Case 5 - Randomization Variety: Over many randomizations, generate mix of empty, partial, and full boards with different patterns.'
      ],
      hints: [
        'Cell encoding: typedef enum {EMPTY, X, O} cell_t; rand cell_t board[3][3];',
        'Simple board: constraint c_simple { foreach(board[i,j]) board[i][j] inside {EMPTY, X, O}; } No other constraints.',
        'Count marks: int cnt_x, cnt_o; constraint c_count { cnt_x == count(board==X); cnt_o == count(board==O); } Implementation: foreach sum of (board[i][j]==X).',
        'Turn count constraint: constraint c_turns { (cnt_x == cnt_o) || (cnt_x == cnt_o + 1); }',
        'Winner check: function bit x_wins(); return (row_win(X) || col_win(X) || diag_win(X)); endfunction function bit row_win(cell_t p); for(int r=0; r<3; r++) if(board[r][0]==p && board[r][1]==p && board[r][2]==p) return 1; return 0; endfunction Similar for col and diag.',
        'At most one winner: constraint c_winner { !(x_wins() && o_wins()); } Cannot both win.',
        'Terminal state constraint (optional): constraint c_terminal { x_wins() || o_wins() || (cnt_x + cnt_o == 9); } Game over conditions.',
        'Symmetry breaking (optional): Fix center cell or a corner to reduce equivalent solutions.',
        'Reachable boards: If too complex, use simpler "any board" version first, then add turn count, then winner logic.'
      ]
    },

    {
      id: 'game2',
      shortName: 'Two Matrices Unique Minimums',
      question: 'Generate Two 3×3 Matrices with Different Minimum Values',
      description: 'Write SystemVerilog uvm constraints to generate two 3×3 matrices such that the minimum value in matrix A differs from the minimum value in matrix B. Optionally enforce minimum uniqueness within each matrix.',
      difficulty: 'Medium',
      topics: ['Constraints', 'Matrix', 'Minimum'],
      requirements: [
        'TWO MATRICES: matA[3][3] and matB[3][3].',
        'ELEMENT RANGE: Define value domain (e.g., int [0:100]).',
        'MINIMUM VALUES: minA = minimum element in matA. minB = minimum element in matB.',
        'UNIQUENESS ACROSS MATRICES: minA ≠ minB. The two minimum values must differ.',
        'WITHIN-MATRIX UNIQUENESS (Optional): Minimum value in each matrix appears exactly once (strict minimum). Not required unless specified.',
        'VALUE REPETITION: Values can repeat within and across matrices (unless uniqueness enforced).',
        'Test Case 1 - Minimum Computation: After randomize, compute minA = min(matA). Compute minB = min(matB). Verify minA ≠ minB.',
        'Test Case 2 - Boundary Values: Force minA=0 (add temp constraint). Verify minB ≠ 0 and solver succeeds.',
        'Test Case 3 - UNSAT: Constrain all elements in both matrices to equal same value (e.g., all=50). Verify randomize fails (would force minA==minB).',
        'Test Case 4 - Distribution: Over many randomizations, verify minA and minB span domain (not stuck at same values).',
        'Test Case 5 - Within-Matrix Min Unique (if enforced): For each matrix, verify minimum appears exactly once.'
      ],
      hints: [
        'Declare matrices: rand int matA[3][3]; rand int matB[3][3];',
        'Value bounds: constraint c_bounds { foreach(matA[i,j]) matA[i][j] inside {[0:100]}; foreach(matB[i,j]) matB[i][j] inside {[0:100]}; }',
        'Helper variables for minimums: rand int minA; rand int minB; These will hold computed minimums.',
        'Minimum is <= all elements: constraint c_minA_le { foreach(matA[i,j]) minA <= matA[i][j]; }',
        'Minimum equals at least one element: constraint c_minA_eq { (matA[0][0]==minA) || (matA[0][1]==minA) || ... || (matA[2][2]==minA); } Or use existential: int min_idx_a; constraint { matA[min_idx_a/3][min_idx_a%3] == minA; minA <= all others; }',
        'Simpler approach: Choose minimum value first, then constrain one cell to equal it and all others >= it. rand int minA inside {[0:100]}; constraint c_setA { matA[min_posA_row][min_posA_col] == minA; foreach(matA[i,j]) matA[i][j] >= minA; }',
        'Uniqueness across matrices: constraint c_diff { minA != minB; }',
        'Strict minimum (within-matrix): Add constraint that minA appears exactly once: constraint c_unique_minA { count(matA==minA) == 1; }',
        'Partial approach: Randomize minimums first (distinct), then build matrices around them.'
      ]
    },

    {
      id: 'misc1',
      shortName: 'Fixed Index Value',
      question: 'Array with Specific Element Fixed at Index 5',
      description: 'Write uvm sv constraints to generate array where element at index 5 is always fixed to value 100, while all other elements are randomized within defined bounds. Array size must be at least 6 to have index 5.',
      difficulty: 'Easy',
      topics: ['Constraints', 'Array'],
      requirements: [
        'ARRAY SIZE: Fixed size >= 6. Define exact size (e.g., size=10).',
        'FIXED ELEMENT: a[5] must always equal 100. Hard constraint, no randomization.',
        'OTHER ELEMENTS: All indices except 5 are randomized. Define bounds (e.g., [0:200]).',
        'NO CONFLICTS: Ensure index 5 constraint doesnt conflict with range constraints (100 must be within allowed range).',
        'Test Case 1 - Fixed Value: Randomize 1000 times. For every randomization, verify a[5] == 100.',
        'Test Case 2 - Other Elements Random: Verify at least one other index changes across randomizations. Not all elements fixed.',
        'Test Case 3 - Bounds Check: If element bounds are [0:200], verify 100 is in range. If bounds are [0:50], constraint would be UNSAT (verify failure).',
        'Test Case 4 - Index Boundary: Test with size=6 (exactly index 5 exists). Verify works.',
        'Test Case 5 - Distribution: For other indices, verify values distributed across allowed range.'
      ],
      hints: [
        'Array declaration: rand int a[10]; // Fixed size 10',
        'Fixed constraint: constraint c_fix { a[5] == 100; } Single equality constraint.',
        'Other elements bounds: constraint c_bounds { foreach(a[i]) if(i != 5) a[i] inside {[0:200]}; } Or simpler if index 5 also within bounds: constraint c_bounds { foreach(a[i]) a[i] inside {[0:200]}; } constraint c_fix { a[5] == 100; }',
        'Avoid over-constraining: Dont apply conflicting constraints to index 5.',
        'Alternative syntax: constraint c_bounds { a[0] inside {[0:200]}; a[1] inside {[0:200]}; ... a[4] inside {[0:200]}; a[5] == 100; a[6] inside {[0:200]}; ... }',
        'Testing: In testbench, add assertion: assert(a[5] == 100) else $error("Index 5 not fixed!");',
        'Use case: Useful for fixing seed values, known constants, or boundary conditions in random stimulus.'
      ]
    },

    {
      id: 'misc2',
      shortName: 'Queue with Size-Based Range',
      question: 'Generate Queue with Element Count and Value Range Dependent on Size',
      description: 'Write uvm sv constraint to populate a queue with exactly "size" elements, where each element value is in range [0:size]. The queue length and element values are coupled through the size variable.',
      difficulty: 'Medium',
      topics: ['Constraints', 'Queue', 'Range'],
      requirements: [
        'SIZE VARIABLE: rand int size. Can be constrained to specific range (e.g., [0:20]) or left wide.',
        'QUEUE SIZE: Queue q must have exactly size elements. q.size() == size.',
        'ELEMENT RANGE: Each element q[i] must be in range [0:size] inclusive. Value depends on size.',
        'DYNAMIC SIZING: Queue is dynamic, sized during randomization based on size value.',
        'SIZE=0 CASE: If size=0, queue is empty (q.size()==0). No elements.',
        'SIZE>0 CASE: For size=5, queue has 5 elements, each in [0:5].',
        'Test Case 1 - Size Match: For size in {0,1,5,10,20}, randomize and verify q.size() == size.',
        'Test Case 2 - Element Range: For each element q[i], verify 0 <= q[i] <= size.',
        'Test Case 3 - Edge Case size=0: Verify queue empty (size 0, no elements).',
        'Test Case 4 - Edge Case size=1: Verify queue has 1 element in range [0:1] (values 0 or 1).',
        'Test Case 5 - Distribution: Over many randomizations, verify size values and element values distributed.'
      ],
      hints: [
        'Variable declaration: rand int size; rand int q[$]; // Dynamic queue',
        'Size constraint: constraint c_size { q.size() == size; }',
        'Element range: constraint c_range { foreach(q[i]) q[i] inside {[0:size]}; } Uses variable size in range.',
        'Size bounds (optional): constraint c_size_bounds { size inside {[0:20]}; } Limits size to reasonable range.',
        'Variable-size queue support: Not all solvers handle dynamic queue sizing well. Alternative: Use dynamic array. rand int arr[]; constraint c_arr_size { arr.size() == size; foreach(arr[i]) arr[i] inside {[0:size]}; } Then convert to queue in post_randomize.',
        'Post-randomize conversion: function void post_randomize(); q.delete(); foreach(arr[i]) q.push_back(arr[i]); endfunction',
        'Testing: for(int s=0; s<=10; s++) begin size = s; assert(randomize()); assert(q.size() == s); foreach(q[i]) assert(q[i] >= 0 && q[i] <= s); end',
        'Use case: Generating variable-length packets, bursts, or data structures with size-dependent properties.'
      ]
    }
  ],


  'Assertions': [
    {
      id: 'assert1',
      shortName: 'Signal High When Valid',
      question: 'Data Signal High Whenever Valid Asserted',
      description: 'Write UVM SystemVerilog assertion to verify that signal "data" is high (logic 1) whenever signal "valid" is asserted (logic 1). This is a basic implication property: when valid=1, data must equal 1 in the same clock cycle.',
      difficulty: 'Easy',
      topics: ['Assertions', 'Basic', 'Signal'],
      requirements: [
        'ASSERTION TYPE: Use assert property (not immediate assertion). Clocked assertion for RTL verification.',
        'CLOCKING: Sample on clock edge: @(posedge clk). Synchronous assertion.',
        'RESET HANDLING: Use disable iff (rst) to prevent assertion failures during reset. Define reset polarity (active high/low).',
        'IMPLICATION: When valid==1, require data==1. Property: valid |-> data.',
        'UNKNOWN HANDLING: If valid can be X/Z, use 4-state equality: valid===1\'b1 to avoid X-propagation failures. Or gate with valid==1 (2-state).',
        'Test Case 1 - Basic Pass: valid=1, data=1 for several cycles. Assertion passes.',
        'Test Case 2 - Basic Fail: valid=1, data=0 for one cycle. Assertion fails.',
        'Test Case 3 - No Implication: valid=0, data=0 or data=1. Assertion passes (antecedent false, property vacuously true).',
        'Test Case 4 - X/Z Handling: Drive valid=X or data=X. Verify assertion behavior per chosen handling (gated or fails).',
        'Test Case 5 - Reset Behavior: Assert reset. Drive valid=1, data=0. Assertion should NOT fail (disabled during reset). Release reset, repeat. Assertion should fail.'
      ],
      hints: [
        'Basic form: assert property (@(posedge clk) disable iff (rst) valid |-> data);',
        'Implication operator |-> : If antecedent (valid) true, consequent (data) must be true same cycle.',
        'Reset disable: disable iff (rst) prevents checking during reset. Choose polarity: active-high rst or active-low !rst_n.',
        '4-state vs 2-state: valid===1\'b1 (4-state equality) checks for exact 1, rejects X/Z. valid==1 (2-state) treats X optimistically.',
        'Gating unknowns: (valid===1\'b1) |-> (data===1\'b1) or (!$isunknown(valid) && valid) |-> data.',
        'Label assertion: p_data_high_when_valid: assert property (...); for easier debug.',
        'Test methodology: Create directed testbench with specific valid/data combinations. Use waveform viewer to confirm assertion fires/passes correctly.'
      ]
    },

    {
      id: 'assert2',
      shortName: 'Data Stable for One Cycle',
      question: 'Data Remains Stable When Enable Asserted',
      description: 'Write SystemVerilog assertion to verify that signal "data" remains stable (unchanged) for at least one clock cycle after "enable" is asserted. Stability means data value at current cycle equals value at next cycle.',
      difficulty: 'Easy',
      topics: ['Assertions', 'Basic', 'Stability'],
      requirements: [
        'ASSERTION TYPE: Clocked assert property.',
        'STABILITY DEFINITION: Data stable = data[current_cycle] == data[next_cycle]. Use $stable(data) which is equivalent to (data == $past(data)).',
        'TRIGGER: When enable asserted (enable==1), check stability in NEXT cycle. Use implication with ##1.',
        'ENABLE SEMANTICS: Clarify if "one cycle" means: (1) stability for exactly 1 cycle after enable, or (2) stability while enable remains high. Default: one cycle after.',
        'RESET HANDLING: disable iff (rst).',
        'UNKNOWN HANDLING: If enable or data can be X, gate appropriately.',
        'Test Case 1 - Pass: enable=1 at cycle N, data=5. At cycle N+1, data=5. Assertion passes.',
        'Test Case 2 - Fail: enable=1 at cycle N, data=5. At cycle N+1, data=7. Assertion fails.',
        'Test Case 3 - Multiple Enables: enable=1 for 3 consecutive cycles. Data changes each cycle. Verify each enable checks its own next cycle.',
        'Test Case 4 - Enable with X: enable=X. Verify assertion gated or handles correctly.',
        'Test Case 5 - Data Change Before Enable: data changes, then enable=1, then data stable. Assertion passes (only checks after enable).'
      ],
      hints: [
        'Stability operator: $stable(signal) returns true if signal unchanged from previous sample. Equivalent to (signal == $past(signal,1)).',
        'One-cycle delay: enable |-> ##1 $stable(data). When enable true, check data stable at next cycle.',
        'Extended stability (while enable high): enable |-> (data[*1] throughout enable[*1]) or use until.',
        'Alternative without $stable: enable |-> ##1 (data == $past(data)).',
        'Edge detection: If enable is level-sensitive and stays high, multiple checks trigger. Use $rose(enable) if single check desired: $rose(enable) |-> ##1 $stable(data).',
        'Unknown data: $stable(X) may not behave as expected. Gate: !$isunknown(data) throughout sequence.',
        'Test: Drive enable pulse, vary data before/after. Observe assertion pass/fail in waveform.'
      ]
    },

    {
      id: 'assert3',
      shortName: 'Count Zero on Reset',
      question: 'Counter Zero When Reset Asserted',
      description: 'Write SystemVerilog assertion to ensure that "count" signal is zero whenever "reset" signal is asserted. This is synchronous or asynchronous reset check depending on design.',
      difficulty: 'Easy',
      topics: ['Assertions', 'Basic', 'Reset'],
      requirements: [
        'RESET POLARITY: Define if reset is active-high (rst) or active-low (rst_n). Document clearly.',
        'RESET TYPE: Synchronous (sampled at clock edge) or Asynchronous (immediate). Affects assertion structure.',
        'SYNCHRONOUS RESET: Check count==0 at clock edge when reset asserted. Property: reset |-> (count==0).',
        'ASYNCHRONOUS RESET: Use immediate assertion or concurrent with special handling. Typically still use clocked assertion with disable iff.',
        'RESET HANDLING: Do NOT use disable iff for this assertion. Or use separate assertion for reset state.',
        'Test Case 1 - Reset Active: reset=1, verify count==0. Assertion passes.',
        'Test Case 2 - Reset Violation: reset=1, count=5. Assertion fails.',
        'Test Case 3 - Reset Inactive: reset=0, count=10. Assertion passes (antecedent false).',
        'Test Case 4 - Reset Edge (sync): reset rises at clock edge. count should be 0 at that edge. Test.',
        'Test Case 5 - Reset Edge (async): For async reset, count should become 0 immediately when reset asserted (not at clock edge). May need immediate assertion.'
      ],
      hints: [
        'Synchronous reset assertion: @(posedge clk) reset |-> (count==0);',
        'Active-low reset: @(posedge clk) !rst_n |-> (count==0);',
        'Asynchronous reset: Count becomes 0 immediately upon reset assertion, not synchronized to clock. Standard clocked assertion may miss immediate behavior. Consider: always @(reset) if(reset) assert(count==0); (immediate assertion in procedural block).',
        'Separate reset de-assertion check: When reset de-asserts, count should remain/become 0 within 1 cycle: $fell(reset) |-> ##[0:1] (count==0);',
        'Avoid disable iff: This assertion CHECKS reset behavior, so dont disable it during reset.',
        'Unknown reset: Handle reset===1\'b1 for 4-state safety.',
        'Test: Apply reset at various times (middle of counting, at start). Verify count zeros.'
      ]
    },

    {
      id: 'assert4',
      shortName: 'Detect Rising Edge',
      question: 'Detect Rising Edge on Signal',
      description: 'Write SystemVerilog assertion to detect a rising edge on a signal. Typically detect edge of a control signal (not the clock itself). Use $rose() function sampled on clock.',
      difficulty: 'Easy',
      topics: ['Assertions', 'Basic', 'Edge Detection'],
      requirements: [
        'SIGNAL: Detect rising edge on signal "sig" (not clock). Clock is sampling reference.',
        'EDGE FUNCTION: Use $rose(sig) which detects 0→1 transition sampled at clock edge.',
        'SAMPLING: @(posedge clk). $rose(sig) compares current sample with previous sample.',
        'RESET: disable iff (rst) to avoid false detections during reset.',
        'COVER vs ASSERT: For edge detection, typically use cover property to count occurrences. Can also assert if edge must occur under certain conditions.',
        'Test Case 1 - Rising Edge: sig transitions 0→1 at clock edge. $rose(sig) returns true. Cover hits.',
        'Test Case 2 - No Edge: sig remains 0 or 1. $rose(sig) returns false.',
        'Test Case 3 - Falling Edge: sig transitions 1→0. $rose(sig) false (use $fell for falling).',
        'Test Case 4 - X Transition: sig transitions X→1 or 0→X. $rose behavior may vary by tool. Test.',
        'Test Case 5 - Reset: During reset, sig may toggle. With disable iff, edge detection disabled.'
      ],
      hints: [
        'Edge detection: $rose(signal) true when signal was 0 at previous sample and 1 at current sample.',
        'Falling edge: $fell(signal) for 1→0 transitions.',
        'Stable signal: $stable(signal) for no change.',
        'Cover property example: cover property (@(posedge clk) $rose(enable));',
        'Assert with edge: If requesting edge within window: req |-> ##[1:5] $rose(ack);',
        'Avoid clock edge: Do NOT use $rose(clk) in SVA sampled on clk. $rose is for non-clock signals sampled by clock.',
        'Initial state: $rose may be false at simulation start (no previous value). Use $past valid after first clock.',
        'Test: Toggle signal at various cycles. Verify cover count matches actual transitions in waveform.'
      ]
    },

    {
      id: 'assert5',
      shortName: 'Output Equals Sum',
      question: 'Output Equals Sum of Two Inputs',
      description: 'Write SystemVerilog assertion to verify that output "out" always equals the sum of input signals "a" and "b". Account for arithmetic width, overflow, and pipeline delay if applicable.',
      difficulty: 'Easy',
      topics: ['Assertions', 'Basic', 'Arithmetic'],
      requirements: [
        'ARITHMETIC OPERATION: out should equal a + b.',
        'WIDTH HANDLING: Define widths of a, b, out. If out narrower than full sum, overflow/wrapping occurs. Document expected behavior.',
        'OVERFLOW: If a and b are N-bit, sum is potentially N+1 bits. If out is N-bit, check: out == a + b (modulo 2^N wrapping). Or assert no overflow expected.',
        'SIGNEDNESS: Specify if a, b, out are signed or unsigned. Affects sum computation.',
        'PIPELINE DELAY: If out is registered (combinational or pipelined), add appropriate delay. out == a + b (combinational). out == $past(a,1) + $past(b,1) (1-cycle pipeline).',
        'RESET: disable iff (rst).',
        'UNKNOWN HANDLING: Gate assertion when inputs are X: !$isunknown({a,b}) |-> (out == a+b).',
        'Test Case 1 - Correct Sum: a=5, b=3, out=8. Assertion passes.',
        'Test Case 2 - Incorrect Sum: a=5, b=3, out=7. Assertion fails.',
        'Test Case 3 - Overflow: a=255 (8-bit), b=1. Sum=256 (9-bit). If out 8-bit, out=0 (wrap). Verify assertion accounts for wrap: out == (a+b) & 8\'hFF.',
        'Test Case 4 - X Inputs: a=X or b=X. Assertion gated if using !$isunknown, else may fail unpredictably.',
        'Test Case 5 - Pipelined: If out registered, delay inputs: out == $past(a,1) + $past(b,1). Test with various delays.'
      ],
      hints: [
        'Combinational adder: assert property (@(posedge clk) disable iff (rst) (out == a + b));',
        'Width matching: If a,b,out all N-bit, sum wraps at 2^N. Assertion: out == (a + b); Implicit modulo.',
        'Explicit width: out == (a + b) & MASK; where MASK = (1<<WIDTH)-1.',
        'Pipelined: out == $past(a,D) + $past(b,D); where D = pipeline delay in cycles.',
        'Signed arithmetic: If signed, cast: out == $signed(a) + $signed(b); Be careful with overflow.',
        'Unknown gating: (!$isunknown(a) && !$isunknown(b)) |-> (out == a+b);',
        'Alternative: (a !== \'x && b !== \'x) |-> (out == a+b); for 4-state.',
        'Test: Sweep a,b values including edge cases (0, max, max-1). Verify sum correct for all.'
      ]
    },

    {
      id: 'assert6',
      shortName: 'Signal Always High',
      question: 'Signal Always High in Clock Domain',
      description: 'Write temporal assertion to ensure signal "sig" is always high (logic 1) on every clock cycle within the clock domain, outside of reset. This is a safety property.',
      difficulty: 'Medium',
      topics: ['Assertions', 'Temporal', 'Always'],
      requirements: [
        'ALWAYS PROPERTY: Signal must be 1 on every cycle (after reset).',
        'RESET HANDLING: disable iff (rst) to exclude reset period.',
        'TEMPORAL FORM: No explicit temporal operators needed for "always on every cycle". Simple Boolean check suffices.',
        'ALTERNATIVE: property p_signal_always_high; @(posedge clk) disable iff (rst) (sig == 1\'b1); endproperty',
        'INITIALIZATION: If sig may be 0 initially after reset, add delay: ##1 sig; to check after first cycle.',
        'UNKNOWN: Handle X: sig === 1\'b1 for strict checking.',
        'Test Case 1 - Always High: sig=1 for all cycles. Assertion passes.',
        'Test Case 2 - Glitch Low: sig=0 for one cycle. Assertion fails.',
        'Test Case 3 - Reset Behavior: During reset, sig=0. After reset, sig=1. Assertion passes (disabled during reset).',
        'Test Case 4 - X State: sig=X at some cycle. Assertion may fail or be gated depending on handling.',
        'Test Case 5 - Continuous Monitoring: Run for 1000+ cycles with sig=1. Assertion continuously passes.'
      ],
      hints: [
        'Simple form: assert property (@(posedge clk) disable iff (rst) sig);',
        'Explicit value: assert property (@(posedge clk) disable iff (rst) (sig == 1));',
        'Safety property: Checked every cycle. If sig ever drops to 0, assertion fails.',
        'No temporal operator needed: This is not "eventually high" or "becomes high". "always already high".',
        'Eventually high then stay: Different property. Would be: ##[0:$] (sig ##1 sig[*0:$]).',
        'Unknown handling: (sig === 1\'b1) rejects X. (sig == 1) may pass with X (2-state).',
        'Reset de-assertion: If sig allowed to be 0 immediately after reset, add: $fell(rst) |-> ##1 sig;',
        'Test: Force sig to 0 at random cycle. Verify assertion fails. Return to 1, verify no further failures.'
      ]
    },

    {
      id: 'assert7',
      shortName: 'Event Within 5 Cycles',
      question: 'Event1 Occurs Within 5 Cycles After Event0',
      description: 'Write temporal assertion to verify that event1 occurs within 5 clock cycles after event0. Use bounded delay operator to specify timing window.',
      difficulty: 'Medium',
      topics: ['Assertions', 'Temporal', 'Timing'],
      requirements: [
        'EVENT DEFINITION: Define what constitutes event0 and event1. Typically rising edges: $rose(event0_sig), $rose(event1_sig).',
        'TIMING WINDOW: event1 must occur within 1 to 5 cycles after event0. Use ##[1:5].',
        'SAME-CYCLE: Decide if event1 in same cycle as event0 allowed. If yes: ##[0:5]. If no: ##[1:5].',
        'IMPLICATION: When event0 occurs, event1 must follow within window.',
        'OVERLAPPING EVENTS: If event0 can re-trigger before event1, multiple assertion threads may run. Ensure this is acceptable or use non-overlapping implication |=>.',
        'RESET: disable iff (rst).',
        'Test Case 1 - Event1 at Cycle 3: event0 at cycle 0, event1 at cycle 3. Within [1:5]. Assertion passes.',
        'Test Case 2 - Event1 at Cycle 6: event0 at cycle 0, event1 at cycle 6. Outside window. Assertion fails.',
        'Test Case 3 - Event1 Same Cycle: event0 and event1 both at cycle 0. If using ##[0:5], passes. If ##[1:5], fails.',
        'Test Case 4 - No Event1: event0 occurs, event1 never. Assertion fails (bounded eventually violated).',
        'Test Case 5 - Back-to-Back Event0: event0 at cycle 0 and cycle 2. Two assertion threads. event1 at cycle 4 satisfies first, event1 at cycle 5 satisfies second. Test overlap handling.'
      ],
      hints: [
        'Bounded delay: ##[1:5] means "between 1 and 5 cycles later (inclusive)".',
        'Overlapping implication: |-> starts new thread immediately. event0 |-> ##[1:5] event1_condition.',
        'Non-overlapping: |=> delays by one cycle before starting consequent. Less common for this use case.',
        'Event detection: $rose(sig) for rising edge. $fell(sig) for falling. Level: sig==1.',
        'Multiple event0: Each event0 starts separate assertion thread. All must satisfy consequent.',
        'Example: assert property (@(posedge clk) disable iff (rst) $rose(start) |-> ##[1:5] $rose(done));',
        'Same cycle: ##[0:5] allows event1 in same cycle as event0. ##1 excludes same cycle.',
        'Test: Create directed stimulus with exact cycle delays. Vary from 1 to 5 (pass) and 6+ (fail). Observe assertion reports.'
      ]
    },

    {
      id: 'assert8',
      shortName: 'High for 3 Consecutive Cycles',
      question: 'Signal High for 3 Consecutive Cycles',
      description: 'Write temporal assertion to verify that signal "sig" is high (logic 1) for at least 3 consecutive clock cycles at some point. Use consecutive repetition operator.',
      difficulty: 'Easy',
      topics: ['Assertions', 'Temporal', 'Consecutive'],
      requirements: [
        'CONSECUTIVE REPETITION: Signal must be 1 for 3 consecutive samples. Use sig[*3].',
        'COVERAGE vs ASSERTION: Typically "at least 3 consecutive" is covered, not asserted (liveness). Use cover property. If asserting, need trigger condition.',
        'TRIGGER CONDITION: If asserting, define when 3-cycle high must occur. Example: "after enable asserted, sig must be high for 3 cycles": enable |-> sig[*3].',
        'MINIMUM vs EXACT: sig[*3] means exactly 3. sig[*3:$] means 3 or more. Clarify requirement.',
        'RESET: disable iff (rst).',
        'Test Case 1 - Exactly 3: sig=1 for cycles 10-12. sig[*3] matches. Cover hits.',
        'Test Case 2 - More Than 3: sig=1 for cycles 10-15. sig[*3] matches at 10-12 and subsequent. Cover hits.',
        'Test Case 3 - Less Than 3: sig=1 for cycles 10-11, then 0. sig[*3] does not match.',
        'Test Case 4 - Interrupted: sig=1,1,0,1,1,1. Second group of 3 matches. Cover hits.',
        'Test Case 5 - Never 3: sig toggles frequently, never 3 consecutive. Cover never hits.'
      ],
      hints: [
        'Consecutive repetition: sig[*3] means sig true for 3 consecutive clock samples.',
        'General form: sig[*N] for N repetitions. sig[*N:M] for N to M repetitions.',
        'At least 3: sig[*3:$] (unbounded upper). In practice, use large number or just sig[*3].',
        'Cover property: Tracks when pattern occurs. cover property (@(posedge clk) sig[*3]);',
        'Assert with trigger: trigger |-> sig[*3]; When trigger, require next 3 cycles sig=1.',
        'Non-consecutive: For "3 times in window", use sig[->3] (goto repetition).',
        'Liveness without trigger: "Eventually sig high for 3 cycles" hard to assert. Use cover.',
        'Test: Drive sig=1 for varying lengths. Verify cover hits only when consecutive count >= 3.'
      ]
    },

    {
      id: 'assert9',
      shortName: 'Counter Zero After Reset',
      question: 'Counter Zero Within 1 Cycle After Reset De-assertion',
      description: 'Write temporal assertion to ensure that after reset is de-asserted, counter becomes zero within 1 clock cycle. Handles synchronous reset with timing check.',
      difficulty: 'Medium',
      topics: ['Assertions', 'Temporal', 'Reset'],
      requirements: [
        'RESET DE-ASSERTION: Detect when reset goes inactive. Use $fell(reset) for active-high reset, $rose(rst_n) for active-low.',
        'TIMING WINDOW: Counter must be 0 within 0 to 1 cycles after reset de-assertion. ##[0:1] (counter==0).',
        'SYNCHRONOUS RESET: For synchronous reset, counter becomes 0 at clock edge when reset de-asserts.',
        'ASYNCHRONOUS RESET: Counter may become 0 immediately or at next clock.',
        'EXACT TIMING: If counter guaranteed 0 at exact cycle after reset: ##1 (counter==0). If same cycle: ##0 or just (counter==0).',
        'RESET: Do not use disable iff here, as we are checking reset behavior.',
        'Test Case 1 - Reset De-assert, Counter 0 Same Cycle: reset falls, counter=0 immediately. Assertion passes.',
        'Test Case 2 - Reset De-assert, Counter 0 Next Cycle: reset falls at cycle N, counter=0 at cycle N+1. If using ##[0:1], passes.',
        'Test Case 3 - Reset De-assert, Counter Not 0: reset falls, counter=5 at both N and N+1. Assertion fails.',
        'Test Case 4 - Multiple Reset Pulses: Assert and de-assert reset multiple times. Each de-assertion must satisfy property.',
        'Test Case 5 - Reset During Count: Counter at 10, reset asserts, then de-asserts. Counter should be 0 within window.'
      ],
      hints: [
        'Reset de-assertion detection: $fell(reset) for active-high. $rose(!reset) alternative.',
        'Active-low reset: $fell(rst_n) becomes $rose(rst_n) to detect de-assertion.',
        'Synchronous reset: Counter updates on clock edge. $fell(reset) sampled on clk edge, so counter==0 same cycle.',
        'Asynchronous reset: Counter clears immediately when reset asserts, but we check after de-assert. May need ##0 or ##1 depending on when counter re-enables.',
        'Bounded eventually: ##[0:1] allows 0 or 1 cycle delay. Covers both immediate and delayed clear.',
        'Example: assert property (@(posedge clk) $fell(rst) |-> (counter==0));',
        'If counter clears on de-assert edge: $fell(rst) |-> (counter==0) (same cycle).',
        'If counter clears one cycle later: $fell(rst) |-> ##1 (counter==0).',
        'Test: Toggle reset, observe counter clear timing in waveform. Match assertion delay to actual behavior.'
      ]
    },

    {
      id: 'assert10',
      shortName: 'No Signal Overlap',
      question: 'Start and End Signals Do Not Overlap',
      description: 'Write temporal assertion to ensure that signals "start" and "end" do not overlap in time, meaning both cannot be asserted simultaneously in any clock cycle.',
      difficulty: 'Medium',
      topics: ['Assertions', 'Temporal', 'Mutual Exclusion'],
      requirements: [
        'NON-OVERLAP: start and end cannot both be 1 in same cycle. !(start && end).',
        'SIMPLE INVARIANT: This is Boolean check every cycle, not complex temporal pattern.',
        'ALTERNATIVE: property p_no_overlap; @(posedge clk) disable iff (rst) (start && end) == 0; endproperty',
        'PULSE ORDERING (Optional): If start and end are pulses with ordering (start before end), add: start |-> !end[*1:$] ##1 end. But basic non-overlap is simpler.',
        'UNKNOWN HANDLING: !(start===1\'b1 && end===1\'b1) for 4-state safety.',
        'RESET: disable iff (rst).',
        'Test Case 1 - No Overlap: start=1, end=0 for some cycles. Then start=0, end=1. Assertion passes.',
        'Test Case 2 - Overlap: start=1, end=1 simultaneously. Assertion fails.',
        'Test Case 3 - Both Low: start=0, end=0. Assertion passes.',
        'Test Case 4 - Start Pulse Then End Pulse: start pulse at cycle 5, end pulse at cycle 10. No overlap. Assertion passes.',
        'Test Case 5 - Overlapping Pulses: start pulse cycles 5-7, end pulse cycles 6-8. Overlap at cycles 6-7. Assertion fails.'
      ],
      hints: [
        'Mutual exclusion: assert property (@(posedge clk) disable iff (rst) !(start && end));',
        'Equivalent forms: (start && end) == 0; or start |-> !end; or end |-> !start;',
        'Bitwise AND: !(start & end) for bit-level. Same for 1-bit signals.',
        'Unknown gating: !(start===1\'b1 && end===1\'b1) or (start!==1\'b1 || end!==1\'b1).',
        'Pulse ordering: If start must precede end: start |-> !end ##1 !end[*0:$] ##1 end. (end not asserted until after start).',
        'Overlapping prevention: If start can stay high and end can assert while start high, this checks they never both high same cycle.',
        'Test: Drive start and end with various patterns. Intentionally overlap for one cycle. Verify assertion fails. Non-overlapping patterns pass.'
      ]
    },

    {
      id: 'assert11',
      shortName: 'Event Precedence by 10 Cycles',
      question: 'Event1 Precedes Event2 by At Least 10 Cycles',
      description: 'Write sequence assertion to verify that event1 always occurs at least 10 clock cycles before event2. When event2 occurs, event1 must have occurred at least 10 cycles prior.',
      difficulty: 'Medium',
      topics: ['Assertions', 'Sequence', 'Precedence'],
      requirements: [
        'PRECEDENCE: event1 must happen first, and event2 cannot occur until at least 10 cycles after event1.',
        'TRIGGER: On event2 occurrence, check that event1 occurred at least 10 cycles earlier.',
        'ALTERNATIVE (Forward): On event1, event2 cannot occur in next 9 cycles: $rose(event1) |-> ##[1:9] !$rose(event2).',
        'MULTIPLE OCCURRENCES: If event1 and event2 can occur multiple times, track latest event1 relative to each event2.',
        'PAST FUNCTION: $past(sig, N) references signal value N cycles ago. Must be within simulation history.',
        'RESET: disable iff (rst). Also ensure $past not accessed before N cycles elapsed (use $past validity or cycle counter).',
        'Test Case 1 - Correct Precedence: event1 at cycle 5, event2 at cycle 15 (10 cycles gap). Assertion passes.',
        'Test Case 2 - Violation (Too Soon): event1 at cycle 5, event2 at cycle 14 (9 cycles gap). Assertion fails.',
        'Test Case 3 - No event1 Before event2: event2 at cycle 10, no prior event1. Assertion fails (assuming $past returns 0/false).',
        'Test Case 4 - Multiple event1s: event1 at cycles 5, 8, 12. event2 at cycle 20. Latest event1 is cycle 12 (8 cycles before). Depending on property, may pass or fail.',
        'Test Case 5 - Back-to-Back: event1 at cycle 10, event2 at cycle 20. Then event1 at cycle 21, event2 at cycle 31. Both satisfy 10-cycle gap.'
      ],
      hints: [
        'Backward check: On event2, verify event1 occurred 10+ cycles ago: $rose(event2) |-> $past($rose(event1), 10);',
        'Forward check: On event1, event2 must not occur in next 9 cycles: $rose(event1) |-> ##[1:9] !$rose(event2); Then event2 allowed at ##10 or later.',
        'Past validity: $past(sig, N) valid only after N cycles. Use: if (!$past_valid(10)) disable property. Or: (cyc_count >= 10) |-> ...',
        'Alternative with history: Maintain last_event1_cycle register. On event2: assert (current_cycle - last_event1_cycle) >= 10.',
        'Multiple events: If event1 can occur multiple times, each event2 checks against latest event1. May need more complex temporal logic or auxiliary code.',
        'Example: assert property (@(posedge clk) disable iff (rst) $rose(event2) |-> $past($rose(event1), 10));',
        'Test: Drive event1, wait exactly 10 cycles, drive event2 (pass). Then drive event1, wait 9 cycles, drive event2 (fail). Verify assertion behavior.'
      ]
    },

    {
      id: 'assert12',
      shortName: 'Signal Toggles Every 4 Cycles',
      question: 'Signal Toggles Every 4 Clock Cycles',
      description: 'Write sequence assertion to verify that a signal toggles (changes state) every 4 clock cycles, creating a regular periodic pattern.',
      difficulty: 'Medium',
      topics: ['Assertions', 'Sequence', 'Toggle'],
      requirements: [
        'TOGGLE DEFINITION: Signal changes value from previous check. If sig was 0, now 1. If was 1, now 0.',
        'EVERY 4 CYCLES: Check toggle every 4 clock cycles. sig at cycle N should differ from sig at cycle N-4.',
        'INITIAL CYCLES: $past(sig, 4) valid only after 4 cycles. Gate: (cycle_count >= 4) |-> ...',
        'PERFECT SQUARE WAVE: If expecting perfect 50% duty cycle at 4-cycle period: sig high for 2, low for 2, repeat. Check: sig == $past(sig, 2) && sig != $past(sig, 4).',
        'ALTERNATIVE (Edge-based): $rose(sig) or $fell(sig) must occur within every 4-cycle window.',
        'RESET: disable iff (rst). Also avoid checking first 4 cycles.',
        'Test Case 1 - Perfect Toggle: sig pattern: 0,0,0,0,1,1,1,1,0,0,0,0,... (toggles at cycles 4,8,12,...). Assertion passes.',
        'Test Case 2 - Toggle at Every 4th: sig: 0 at cycle 0, 1 at cycle 4, 0 at cycle 8. sig != $past(sig,4) always true. Passes.',
        'Test Case 3 - Missed Toggle: sig: 0 for cycles 0-7, then 1. Toggle at cycle 4 missed. Assertion fails at cycle 4.',
        'Test Case 4 - Faster Toggle: sig toggles every 2 cycles. sig != $past(sig,4) may still be true (depends on pattern). Test edge case.',
        'Test Case 5 - Initial Period: First 4 cycles undefined for $past(sig,4). Use $past_valid or cycle counter to skip.'
      ],
      hints: [
        'Toggle check: (sig != $past(sig, 4)) true if signal different from 4 cycles ago.',
        'Gating initial: Use $past_valid(4) or cycle_count: (cycle_count >= 4) |-> (sig != $past(sig,4));',
        'Perfect square wave: sig toggles every 4, creating 8-cycle period. Check: sig == $past(sig,2) (same 2 cycles ago, period/2) and sig != $past(sig,4) (different 4 cycles ago, full period).',
        'At least once per window: "Toggles within 4 cycles" different from "every 4 cycles". Clarify requirement.',
        'Alternative: Track last toggle cycle. (current_cycle - last_toggle_cycle) <= 4.',
        'Example: assert property (@(posedge clk) disable iff (rst) ($past_valid(4)) |-> (sig != $past(sig,4)));',
        'Test: Generate perfect 4-cycle toggle pattern. Verify passes. Introduce skip (no toggle at expected cycle). Verify fails.'
      ]
    },

    {
      id: 'assert13',
      shortName: 'Rising Then Falling Edge',
      question: 'Rising Edge Followed by Falling Edge Within 10 Cycles',
      description: 'Write sequence assertion to verify that a rising edge on signal is followed by a falling edge within 10 clock cycles. Ensure edge ordering and timing.',
      difficulty: 'Medium',
      topics: ['Assertions', 'Sequence', 'Edge'],
      requirements: [
        'EDGE DETECTION: Rising edge: $rose(sig). Falling edge: $fell(sig).',
        'TIMING CONSTRAINT: After rising edge, falling edge must occur within 1 to 10 cycles.',
        'SAME-CYCLE: Typically rising and falling cannot occur same cycle (signal cannot be both 0→1 and 1→0). Window starts at ##1.',
        'MULTIPLE RISES: If signal can rise again before falling, property handles with multiple threads. Each rise must be followed by fall within 10.',
        'INTERMEDIATE STATE: Signal may rise, stay high for N cycles, then fall. As long as N <= 10, passes.',
        'RESET: disable iff (rst).',
        'Test Case 1 - Rise at 0, Fall at 5: sig rises at cycle 0, falls at cycle 5. Within [1:10]. Assertion passes.',
        'Test Case 2 - Rise at 0, Fall at 11: sig rises at cycle 0, falls at cycle 11. Outside window. Assertion fails.',
        'Test Case 3 - Rise at 0, Fall at 1: sig rises cycle 0, falls cycle 1 (minimum delay). Assertion passes.',
        'Test Case 4 - No Fall: sig rises, never falls. Assertion fails (bounded eventually violated).',
        'Test Case 5 - Multiple Rises: sig rises at cycle 0, rises again at cycle 3 (after going low at 2), falls at cycle 6. Two threads: first satisfied by fall at 6 (if sig went low at 2 first), second satisfied by fall at 6. Verify.'
      ],
      hints: [
        'Edge detection: $rose(sig) for 0→1 transition, $fell(sig) for 1→0 transition.',
        'Sequence: $rose(sig) |-> ##[1:10] $fell(sig); Rising triggers, falling must occur within window.',
        'Cannot rise and fall same cycle: Physical impossibility. ##[1:10] starts at next cycle.',
        'Intermediate behavior: Signal stays high between rise and fall. Pattern: rise at N, high for M cycles, fall at N+M where M in [1:10].',
        'Overlapping: If sig can toggle rapidly, multiple rise events may occur. Each starts separate assertion thread.',
      ]
    },
    {
  id: 'assert14',
  shortName: 'Data Consistent After Enable',
  question: 'Data Remains Stable for 5 Cycles After Enable',
  description: 'Write sequence assertion to ensure data signal remains consistent (unchanged) for 5 consecutive clock cycles after enable signal is asserted.',
  difficulty: 'Medium',
  topics: ['Assertions', 'Sequence', 'Consistency'],
  requirements: [
    'CONSISTENCY: Data value must not change for 5 cycles after enable asserted.',
    'BASELINE SAMPLE: Capture data value when enable asserts. Compare subsequent cycles against this baseline.',
    'TRIGGER: Use $rose(enable) to trigger check, avoiding re-trigger every cycle enable is high.',
    'ALTERNATIVE: Store data value at trigger: $rose(enable) |-> ##1 (data == $past(data,1))[*5]; Data at cycles 1-5 after trigger equals data at trigger.',
    'OVERLAPPING ENABLES: If enable can assert again within 5-cycle window, multiple threads run. Define if this is allowed or should be prevented.',
    'RESET: disable iff (rst).',
    'UNKNOWN DATA: If data can be X, gate: !$isunknown(data) throughout sequence.',
    'Test Case 1 - Stable Data: enable rises at cycle 10, data=0x55 from cycle 10-15. Assertion passes.',
    'Test Case 2 - Data Changes: enable rises at cycle 10, data=0x55. data changes to 0xAA at cycle 12. Assertion fails.',
    'Test Case 3 - Exact 5 Cycles: enable at cycle 10, data stable 10-14 (5 cycles), changes at 15. Assertion passes (checks cycles 10-14).',
    'Test Case 4 - Overlapping Enables: enable rises at cycle 10 and 12. Two threads checking data stability. Both must pass independently.',
    'Test Case 5 - Enable Level vs Edge: If using level (enable==1) instead of $rose(enable), triggers every cycle enable high. Use edge-based trigger.'
  ],
  hints: [
    'Consecutive stability: (data == $past(data))[*5] means data equals its previous value for 5 consecutive cycles.',
    'Alternative syntax: $stable(data)[*5] equivalent to (data == $past(data))[*5].',
    'Capture baseline: On $rose(enable), current data value is baseline. Next 5 cycles checked against it.',
    'Delayed check: $rose(enable) |-> ##1 $stable(data)[*5]; Checks 5 cycles starting from cycle after trigger.',
    'Immediate check: $rose(enable) |-> $stable(data)[*5]; Checks 5 cycles starting from trigger cycle (including trigger).',
    'Overlapping prevention: If enable should not re-assert during stability window: $rose(enable) |-> (!enable)[*5].',
    'Example: assert property (@(posedge clk) disable iff (rst) $rose(enable) |-> $stable(data)[*5]);',
    'Test: Assert enable, hold data constant for 5 cycles (pass). Assert enable, change data at cycle 3 of stability window (fail).'
  ]
},

{
  id: 'assert15',
  shortName: 'Sequence A Before B',
  question: 'Sequence A Occurs Before Sequence B',
  description: 'Write sequence assertion to ensure that sequence A always occurs before sequence B in the clock domain. Define concrete sequences and establish temporal ordering.',
  difficulty: 'Easy',
  topics: ['Assertions', 'Sequence', 'Order'],
  requirements: [
    'SEQUENCE DEFINITION: Define what constitutes sequence A and sequence B. Example: A = (sig1 ##1 sig2); B = (sig3 ##1 sig4);',
    'ORDERING CONSTRAINT: B cannot complete before A has completed. Or: When B completes, A must have completed earlier.',
    'ALTERNATIVE (B forbidden until A): property p_no_B_until_A; @(posedge clk) disable iff (rst) !A_done |-> !B; endproperty Track A completion with flag.',
    'EVENTUAL OCCURRENCE: Clarify if B must eventually occur after A, or just that B cannot precede A.',
    'UNBOUNDED: For "B never before A", use state machine or flag tracking A completion.',
    'RESET: disable iff (rst).',
    'Test Case 1 - Correct Order: Sequence A completes at cycle 10, B completes at cycle 20. Assertion passes.',
    'Test Case 2 - Wrong Order: Sequence B completes at cycle 10, A completes at cycle 20 (or never). Assertion fails.',
    'Test Case 3 - A Only: Sequence A completes, B never occurs. Assertion passes (no violation, B not triggered).',
    'Test Case 4 - Neither: Neither A nor B occurs. Assertion vacuously passes.',
    'Test Case 5 - Multiple A Before B: A completes at cycle 5, 10, 15. B completes at cycle 20. Verify earliest A (cycle 5) satisfies precedence.'
  ],
  hints: [
    'Sequence ended: Use .ended property of sequence or track with flag. sequence A; sig1 ##1 sig2; endsequence',
    'Backward check on B: When B ends, verify A ended earlier: B.ended |-> $past(A.ended);',
    'Forward prevention: On A not complete, prevent B: !A_complete |-> !B_start;',
    'Flag tracking: reg A_done; always @(posedge clk) if(A.matched) A_done <= 1; Then: B |-> A_done;',
    'Until operator: A ##1 !B[*0:$] ##1 B; (A happens, then eventually B, with no B before A). Complex.',
    'Example sequences: sequence A; a ##1 b; endsequence sequence B; c ##1 d; endsequence',
    'Example property: assert property (@(posedge clk) disable iff (rst) B.triggered |-> A_done);',
    'Test: Drive A sequence, then B sequence (pass). Drive B then A (fail). Drive A multiple times then B (pass).'
  ]
},

{
  id: 'assert16',
  shortName: 'FSM State Transition Coverage',
  question: 'Write Coverage for FSM State Transitions',
  description: 'Write coverage assertions to measure functional coverage of state transitions in a finite state machine. Track all legal and illegal transitions. Ensure comprehensive FSM coverage.',
  difficulty: 'Hard',
  topics: ['Assertions', 'Coverage', 'FSM'],
  requirements: [
    'STATE DEFINITION: Define FSM states (e.g., IDLE, ACTIVE, DONE). Use state encoding from design.',
    'LEGAL TRANSITIONS: Define all valid state transitions. Example: IDLE→ACTIVE, ACTIVE→DONE, DONE→IDLE.',
    'ILLEGAL TRANSITIONS: Identify and assert against illegal transitions. Example: IDLE→DONE (if not allowed).',
    'COVERAGE FORM: Use cover property for each legal transition: cover property (@(posedge clk) (state==IDLE) ##1 (state==ACTIVE));',
    'ASSERTION FORM: Assert illegal transitions never occur: assert property (@(posedge clk) disable iff (rst) (state==IDLE) |-> ##1 (state != DONE));',
    'RESET STATE: Cover reset to IDLE transition. Assert FSM in IDLE after reset.',
    'UNREACHABLE STATES: If certain states should never be reached, assert against them: assert property (@(posedge clk) disable iff (rst) state != UNREACHABLE);',
    'CROSS COVERAGE: Use covergroups to cross state transitions with input conditions.',
    'Test Case 1 - Legal Transition Coverage: Run random stimulus. Verify all legal transitions hit in coverage report.',
    'Test Case 2 - Illegal Transition Detection: Force illegal transition (e.g., IDLE→DONE). Verify assertion fires.',
    'Test Case 3 - Reset Coverage: Assert and release reset. Verify coverage hits RESET→IDLE transition.',
    'Test Case 4 - Unreachable State: If state encoding allows unreachable states, verify assertion prevents entry.',
    'Test Case 5 - Coverage Closure: Ensure 100% state transition coverage achieved before test completion.'
  ],
  hints: [
    'Cover each transition: cover property (@(posedge clk) ($rose(state==S1) ##1 (state==S2)));',
    'Alternative covergroup: covergroup cg @(posedge clk); cp_state: coverpoint state; cp_trans: coverpoint {$past(state), state}; endgroup',
    'Cross coverage: cross state with inputs: cross state, input_sig; To track transitions under conditions.',
    'Assert legal set: assert property (@(posedge clk) disable iff (rst) state inside {IDLE, ACTIVE, DONE});',
    'Assert specific illegal: assert property (@(posedge clk) disable iff (rst) (state==IDLE) |-> ##1 (state inside {IDLE, ACTIVE})); No direct IDLE→DONE.',
    'Reset assertion: assert property (@(posedge clk) $rose(!rst) |-> ##1 (state==IDLE));',
    'Unreachable: If state is 2-bit enum with only 3 states defined, 4th encoding is unreachable: assert property (@(posedge clk) state != 2\'b11);',
    'Test: Run random and directed tests. Generate coverage report. Identify missing transitions and add directed tests.'
  ]
},

{
  id: 'assert17',
  shortName: 'Signal Within Range',
  question: 'Write Parameterized Assertion: Signal Within Specified Range',
  description: 'Write parameterized assertion to verify that signal "data" is always within specified range [MIN, MAX]. Include coverage bins for boundary hits.',
  difficulty: 'Medium',
  topics: ['Assertions', 'Coverage', 'Range'],
  requirements: [
    'PARAMETERS: Define MIN and MAX as parameters or localparams. Assertion uses these values.',
    'RANGE CHECK: data must be >= MIN and <= MAX on every cycle.',
    'SIGNED vs UNSIGNED: Clarify signedness. For signed: $signed(data) >= $signed(MIN). For unsigned: default comparison.',
    'COVERAGE BINS: Add coverpoint with bins for MIN, MAX, and mid-range values to track boundary hits.',
    'RESET: disable iff (rst).',
    'UNKNOWN: Gate X values: !$isunknown(data) |-> range_check.',
    'Test Case 1 - Within Range: data values between MIN and MAX. Assertion passes continuously.',
    'Test Case 2 - At MIN: data = MIN. Assertion passes. Coverage bin for MIN hits.',
    'Test Case 3 - At MAX: data = MAX. Assertion passes. Coverage bin for MAX hits.',
    'Test Case 4 - Below MIN: data = MIN - 1. Assertion fails.',
    'Test Case 5 - Above MAX: data = MAX + 1. Assertion fails.'
  ],
  hints: [
    'Parameterized assertion: parameter MIN = 0; parameter MAX = 255; assert property (@(posedge clk) disable iff (rst) (data >= MIN && data <= MAX));',
    'Inside operator: assert property (@(posedge clk) disable iff (rst) data inside {[MIN:MAX]});',
    'Signed comparison: For signed signals: ($signed(data) >= $signed(MIN)) && ($signed(data) <= $signed(MAX));',
    'Coverage: covergroup cg @(posedge clk); cp_data: coverpoint data { bins min_val = {MIN}; bins max_val = {MAX}; bins mid = {[MIN+1:MAX-1]}; } endgroup',
    'Unknown gating: (!$isunknown(data)) |-> (data inside {[MIN:MAX]});',
    'Alternative with implication: 1 |-> (data inside {[MIN:MAX]}); (always check)',
    'Test: Sweep data from MIN-1 to MAX+1. Verify assertion fails at boundaries MIN-1 and MAX+1. Verify coverage hits MIN and MAX bins.'
  ]
},

{
  id: 'assert18',
  shortName: 'Array Index Valid Range',
  question: 'Array Access Index Within Valid Range',
  description: 'Write assertion to ensure that array "data_array" is accessed only with valid indices within range [0, SIZE-1]. Catch out-of-bounds accesses.',
  difficulty: 'Medium',
  topics: ['Assertions', 'Coverage', 'Array'],
  requirements: [
    'ARRAY SIZE: Define array size (fixed or dynamic). Example: logic [7:0] data_array [0:15]; SIZE=16.',
    'ACCESS CONTROL: Index valid only when access occurring (read_en or write_en asserted).',
    'INDEX RANGE: index must be in [0:SIZE-1] when accessing.',
    'DYNAMIC ARRAY: For dynamic array, use data_array.size(): index < data_array.size().',
    'UNKNOWN INDEX: Gate X: !$isunknown(index) when accessing.',
    'COVERAGE: Cover boundary indices (0, SIZE-1) to ensure edge access tested.',
    'Test Case 1 - Valid Index: read_en=1, index=5 (within [0:15]). Assertion passes.',
    'Test Case 2 - Index 0: Access with index=0. Assertion passes. Coverage bin hits.',
    'Test Case 3 - Index MAX: Access with index=15 (SIZE-1). Assertion passes. Coverage bin hits.',
    'Test Case 4 - Index Out-of-Bounds (Negative): index=-1. Assertion fails (if signed index).',
    'Test Case 5 - Index Out-of-Bounds (Over): index=16 (>= SIZE). Assertion fails.'
  ],
  hints: [
    'Fixed array: parameter SIZE = 16; assert property (@(posedge clk) disable iff (rst) (read_en|write_en) |-> (index inside {[0:SIZE-1]}));',
    'Dynamic array: assert property (@(posedge clk) disable iff (rst) (access_en) |-> (index < data_array.size()));',
    'Unsigned index: If index is unsigned, negative check not needed. Just (index < SIZE).',
    'Signed index: Include (index >= 0) check if index can be negative.',
    'Unknown index: ((read_en|write_en) && !$isunknown(index)) |-> (index inside {[0:SIZE-1]});',
    'Coverage: covergroup cg @(posedge clk); cp_idx: coverpoint index iff (read_en|write_en) { bins zero = {0}; bins max = {SIZE-1}; bins mid = {[1:SIZE-2]}; } endgroup',
    'Test: Access with valid indices (pass). Intentionally use index=SIZE or -1 (fail). Verify assertion catches violations.'
  ]
},

{
  id: 'assert19',
  shortName: 'Protocol Event Sequence Coverage',
  question: 'Write Coverage for Protocol Event Sequences',
  description: 'Write coverage assertions to measure coverage of different valid event sequences in a communication protocol. Track sequence patterns and protocol phases.',
  difficulty: 'Hard',
  topics: ['Assertions', 'Coverage', 'Protocol'],
  requirements: [
    'EVENT DEFINITION: Define protocol events (e.g., REQ, ACK, DATA, DONE).',
    'VALID SEQUENCES: Identify valid event sequences. Example: REQ→ACK→DATA→DONE, REQ→ACK→DONE (no data).',
    'COVERAGE PROPERTIES: Create cover property for each valid sequence.',
    'INVALID SEQUENCES: Optionally assert against invalid sequences (e.g., DATA before ACK).',
    'SEQUENCE MARKERS: Define clear start/end markers to avoid counting overlapping sequences incorrectly.',
    'BINS: Use covergroup bins for sequence types or SVA cover properties for temporal sequences.',
    'RESET: disable iff (rst).',
    'Test Case 1 - Sequence REQ→ACK→DATA→DONE: Generate this sequence. Verify coverage bin/cover property hits.',
    'Test Case 2 - Sequence REQ→ACK→DONE: Generate short sequence without DATA. Verify separate coverage.',
    'Test Case 3 - Multiple Sequences: Generate several sequences of different types. Verify each tracked independently.',
    'Test Case 4 - Overlapping Sequences: REQ at cycle 0, another REQ at cycle 5 (before first DONE). Verify both sequences tracked correctly.',
    'Test Case 5 - Coverage Report: Ensure all expected sequences covered before test end.'
  ],
  hints: [
    'Cover property per sequence: cover property (@(posedge clk) disable iff (rst) $rose(REQ) ##1 ACK ##[1:5] DATA ##1 DONE);',
    'Alternative sequence: cover property (@(posedge clk) $rose(REQ) ##1 ACK ##1 DONE); For short sequence.',
    'Covergroup with bins: covergroup cg @(posedge clk); cp_seq: coverpoint event_type { bins req_ack_data_done = (REQ => ACK => DATA => DONE); bins req_ack_done = (REQ => ACK => DONE); } endgroup',
    'State-based coverage: Track protocol FSM states. Cross states with transitions.',
    'Overlapping handling: Use sequence.triggered/.matched to count separate instances.',
    'Invalid sequence assertion: assert property (@(posedge clk) disable iff (rst) DATA |-> $past(ACK)); Data must follow ACK.',
    'Test: Generate all valid sequences using directed/random stimulus. Check coverage report for 100% sequence coverage.'
  ]
},

{
  id: 'assert20',
  shortName: 'Signal Pattern Match',
  question: 'Signal Matches Predefined Bit Pattern',
  description: 'Write assertion to verify that a signal pattern matches a predefined bit pattern, optionally with masking for don\'t-care bits. Ensure pattern validity.',
  difficulty: 'Medium',
  topics: ['Assertions', 'Coverage', 'Pattern'],
  requirements: [
    'PATTERN DEFINITION: Define expected pattern as parameter/localparam. Example: PATTERN = 8\'b1010_xxxx.',
    'MASK: If partial match (some bits don\'t care), define mask. Example: MASK = 8\'b1111_0000 (upper 4 bits checked).',
    'MATCH CHECK: (signal & MASK) == (PATTERN & MASK). Only masked bits compared.',
    'PERSISTENCE: If pattern must persist for N cycles, use [*N] repetition.',
    'COVERAGE: Add cover property to ensure pattern reached: cover property (@(posedge clk) (signal & MASK) == (PATTERN & MASK));',
    'RESET: disable iff (rst).',
    'Test Case 1 - Exact Match: signal = 8\'b1010_1111, PATTERN = 8\'b1010_xxxx, MASK = 8\'b1111_0000. Match on upper 4 bits. Assertion passes.',
    'Test Case 2 - Mismatch: signal = 8\'b0010_1111. Upper 4 bits don\'t match pattern 1010. Assertion fails.',
    'Test Case 3 - Full Match (No Mask): signal = PATTERN exactly. MASK = all 1s. Assertion passes.',
    'Test Case 4 - Persistent Pattern: signal matches pattern for 3 consecutive cycles. If checking persistence, assertion passes.',
    'Test Case 5 - Coverage: Generate pattern match in simulation. Verify cover property hits.'
  ],
  hints: [
    'Pattern with mask: assert property (@(posedge clk) disable iff (rst) ((signal & MASK) == (PATTERN & MASK)));',
    'No mask (full match): assert property (@(posedge clk) disable iff (rst) (signal == PATTERN));',
    'Persistent pattern: ((signal & MASK) == (PATTERN & MASK))[*N] for N-cycle persistence.',
    'Cover property: cover property (@(posedge clk) (signal & MASK) == (PATTERN & MASK));',
    'Don\'t-care encoding: X in pattern not directly supported. Use mask to ignore bits.',
    'Example: PATTERN = 8\'hA0; MASK = 8\'hF0; Checks upper nibble = 0xA, lower nibble don\'t care.',
    'Throughout operator: If pattern must hold throughout some interval: (signal & MASK) == (PATTERN & MASK) throughout (condition[*N])',
    'Test: Drive signal with various values. Verify match/mismatch detected. Check coverage hit when pattern occurs.'
  ]
},

{
  id: 'assert21',
  shortName: 'Bus Protocol Address Alignment',
  question: 'Write UVM Assertion: Bus Address and Data Alignment',
  description: 'Write assertion to verify bus protocol address and data alignment during transactions. Ensure address is properly aligned for data width. Integrate with UVM monitor.',
  difficulty: 'Hard',
  topics: ['Assertions', 'UVM', 'Bus Protocol'],
  requirements: [
    'BUS PROTOCOL: Define protocol (e.g., AXI, AHB, custom). Specify address and data widths.',
    'ALIGNMENT RULE: Address must be aligned to data size. Example: For 32-bit (4-byte) data, address[1:0] == 0.',
    'DATA BEAT SIZE: If protocol supports variable beat sizes (HSIZE, AxSIZE), alignment varies. addr % (2^SIZE) == 0.',
    'HANDSHAKE: Check alignment only on valid transfers. Condition: (valid && ready) or protocol-specific handshake.',
    'UVM INTEGRATION: Place assertion in interface (bind) or monitor. Use virtual interface in UVM components.',
    'RESET: disable iff (rst).',
    'Test Case 1 - Aligned Access: addr=0x100 (aligned to 4 bytes), data_size=4. Assertion passes.',
    'Test Case 2 - Misaligned Access: addr=0x102 (misaligned), data_size=4. Assertion fails.',
    'Test Case 3 - Variable Sizes: addr=0x104, size=2 (16-bit transfer). Alignment: addr%2==0. Passes.',
    'Test Case 4 - Handshake Gating: valid=1, ready=0. No transfer, assertion not checked.',
    'Test Case 5 - Coverage: Cover aligned and various misaligned patterns to ensure assertion tested.'
  ],
  hints: [
    'Alignment check: (addr % DATA_BYTES) == 0. For 4-byte data: addr[1:0] == 2\'b00.',
    'Bit-level check: For 4-byte alignment: !addr[1] && !addr[0]. For 8-byte: addr[2:0] == 0.',
    'Variable size: If beat size variable (AXI AxSIZE): (addr % (1 << size)) == 0.',
    'Handshake condition: (HREADY && HTRANS==NONSEQ) or (AWVALID && AWREADY) depending on protocol.',
    'Interface binding: bind bus_if bus_assertions u_assert (.clk, .addr, .valid, .ready);',
    'UVM monitor: In monitor, access virtual interface: assert property (@(posedge vif.clk) ...',
    'Example (AXI): assert property (@(posedge ACLK) disable iff (!ARESETn) (AWVALID && AWREADY) |-> (AWADDR % (1 << AWSIZE)) == 0);',
    'Test: Generate aligned and misaligned transactions. Verify assertion catches misalignment. Use UVM RAL or driver to create Test Cases.'
  ]
},

{
  id: 'assert22',
  shortName: 'Transaction Data Validity',
  question: 'Write UVM Assertion: Transaction Data Validity Check',
  description: 'Write assertion to check transaction data validity in UVM sequence or monitor. Verify data fields meet protocol requirements (parity, range, no X).',
  difficulty: 'Hard',
  topics: ['Assertions', 'UVM', 'Transaction'],
  requirements: [
    'DATA VALIDITY: Define what makes data valid. Examples: (1) No X/Z values, (2) Parity correct, (3) Value within range, (4) Checksum/CRC correct.',
    'CHECKING POINT: Decide where to check: (1) In sequence before/after item send, (2) In driver before driving, (3) In monitor after sampling, (4) In interface with SVA.',
    'IMMEDIATE ASSERTION: For checks in sequence/driver (procedural code), use immediate assertion: assert (condition) else $error.',
    'CONCURRENT ASSERTION: For cycle-accurate checks, use SVA in interface.',
    'UVM INTEGRATION: Place SVA in interface. Access via virtual interface in monitor. Or use immediate assertions in sequence/driver.',
    'Test Case 1 - Valid Data: data=0x55 (no X, within range). Assertion passes.',
    'Test Case 2 - X Data: data=8\'hXX. Assertion fails if checking for no X.',
    'Test Case 3 - Out-of-Range: data=0x1FF (out of [0:255]). Assertion fails.',
    'Test Case 4 - Parity Error: data with incorrect parity bit. Parity checker fails.',
    'Test Case 5 - Sequence Check: In sequence, check item.data before sending. assert(item.data inside {[0:255]});'
  ],
  hints: [
    'No unknown: assert property (@(posedge clk) valid |-> !$isunknown(data));',
    'Range check: assert property (@(posedge clk) valid |-> (data inside {[MIN:MAX]}));',
    'Parity: Compute expected parity, compare: assert property (@(posedge clk) valid |-> (parity_bit == ^data));',
    'Immediate assertion in sequence: class my_seq extends uvm_sequence; task body(); assert(item.data inside {[0:255]}) else `uvm_error(...) endtask endclass',
    'Driver timing: Check data in drive() method before applying to interface: assert(!$isunknown(item.data)) else `uvm_fatal(...)',
    'Monitor post-sampling: In monitor, after sampling transaction: assert(tr.data != \'x) else `uvm_error(...)',
    'Interface SVA: In interface: assert property (@(posedge clk) data_valid |-> !$isunknown(data_bus));',
    'Test: Generate valid and invalid data in sequence. Verify assertions catch invalid data. Use error injection.'
  ]
},

{
  id: 'assert23',
  shortName: 'UVM Assertion Coverage Integration',
  question: 'Integrate Assertion Coverage into UVM Testbench',
  description: 'Integrate assertion coverage metrics into UVM testbench to track which assertions have been exercised. Report assertion coverage at end of test.',
  difficulty: 'Hard',
  topics: ['Assertions', 'UVM', 'Coverage'],
  requirements: [
    'ASSERTION COVERAGE: Track which assertions passed, failed, or were covered (for cover properties).',
    'COVER PROPERTIES: Convert key assertions to cover properties to track hits: cover property (p_assertion);',
    'TOOL REPORTING: Use tool-specific commands for assertion coverage. Examples: VCS: $get_coverage(), Questa: $assertcover.',
    'UVM REPORTING: In final_phase or report_phase, dump assertion coverage to log.',
    'ENABLE/DISABLE: Allow assertions to be enabled/disabled per test via plusargs or uvm_config_db.',
    'INTEGRATION: Bind assertion module to DUT or interface. Ensure assertions compiled with coverage enabled (-assert cover).',
    'Test Case 1 - Coverage Report: Run test. At end, verify assertion coverage report generated.',
    'Test Case 2 - Cover Property Hits: Generate stimulus to hit cover properties. Verify coverage report shows hits.',
    'Test Case 3 - Assertion Pass/Fail Stats: Track how many times each assertion passed. Report stats.',
    'Test Case 4 - Disable Assertions: Use +uvm_set_config to disable assertions for specific test. Verify disabled.',
    'Test Case 5 - Merge Coverage: Run multiple tests. Merge assertion coverage reports.'
  ],
  hints: [
    'Cover property: cover property (@(posedge clk) p_my_assertion); Tracks when assertion consequent evaluates true.',
    'Tool-specific coverage: VCS: Use -assert cover option. Access via $get_coverage(). Questa: -assertcover. Access via $assertcover.',
    'UVM reporting: In test: function void report_phase(uvm_phase phase); super.report_phase(phase); `uvm_info("COV", $sformatf("Assertion coverage: ..."), UVM_LOW) endfunction',
    'Enable/disable: In interface or bind module: `ifdef ENABLE_ASSERTIONS assert property (...); `endif. Control via compile-time define or runtime plusarg.',
    'Config DB: In test: uvm_config_db#(bit)::set(null, "*", "enable_assertions", 1); In assertion module: bit enable; uvm_config_db#(bit)::get(null, "", "enable_assertions", enable); if(enable) assert ...',
    'Bind assertions: bind dut assertion_module u_assert (.*); Binds assertions to DUT signals.',
    'Test: Run tests with various stimuli. Generate coverage report. Verify assertions exercised. Use uncovered assertions to guide test improvements.'
  ]
},

{
  id: 'assert24',
  shortName: 'UVM RAL Register Access',
  question: 'Write UVM RAL Assertion for Register Reads and Writes',
  description: 'Write assertions for UVM Register Abstraction Layer (RAL) to verify register read/write access policies (RO/WO/RW) and mirror value updates. Ensure register behavior correct.',
  difficulty: 'Hard',
  topics: ['Assertions', 'UVM', 'RAL'],
  requirements: [
    'ACCESS POLICY: Verify read/write access restrictions. RO: read-only (writes ignored). WO: write-only (reads return 0 or undefined). RW: read-write.',
    'MIRROR VALUE: Verify RAL mirror value updated correctly after read/write.',
    'RESET VALUE: Check register resets to default value after reset.',
    'PREDICTED VALUE: After write, predicted value should match written value (for RW registers).',
    'CALLBACKS: Hook into uvm_reg_cbs or monitor to sample register transactions.',
    'Test Case 1 - RW Register: Write value to RW register. Read back. Verify value matches.',
    'Test Case 2 - RO Register: Write to RO register. Verify write has no effect. Read returns original value.',
    'Test Case 3 - WO Register: Write to WO register. Verify write accepted. Read returns 0 or undefined (per spec).',
    'Test Case 4 - Reset Value: After reset, verify register value equals default from RAL model.',
    'Test Case 5 - Mirror Update: After write, verify RAL mirror reflects new value. After read, mirror matches read value.'
  ],
  hints: [
    'RAL callbacks: class reg_cb extends uvm_reg_cbs; virtual task post_write(uvm_reg_item rw); assert(rw.status == UVM_IS_OK) else `uvm_error(...) endtask endclass',
    'Access policy check: In callback: if(rw.element_kind == UVM_REG) begin uvm_reg r = rw.element; if(r.get_rights() == "RO") assert(!rw.kind == UVM_WRITE) else `uvm_error(...) end',
    'Mirror check: After write: assert(reg.get() == written_value) else `uvm_error(...)',
    'Reset check: After reset: assert(reg.get() == reg.get_reset()) else `uvm_error(...)',
    'Monitor-based: In bus monitor: On write transaction: if(addr == REG_ADDR) assert(access_allowed(addr, WRITE)) else `uvm_error(...)',
    'Immediate assertion: In sequence after read: reg.read(status, rdata); assert(status == UVM_IS_OK && rdata == reg.get()) else `uvm_error(...)',
    'Test: Use RAL backdoor/frontdoor access. Test all access types (RO/WO/RW). Verify assertions catch violations.'
  ]
},

{
  id: 'assert25',
  shortName: 'Driver-Monitor Communication',
  question: 'Verify UVM Driver and Monitor Communication',
  description: 'Write assertion to verify proper communication between UVM driver and monitor. Ensure every driven item is observed by monitor with matching fields within latency bound.',
  difficulty: 'Hard',
  topics: ['Assertions', 'UVM', 'Components'],
  requirements: [
    'COMMUNICATION CONTRACT: Every item driver sends must be observed by monitor. Fields must match (address, data, etc.).',
    'LATENCY BOUND: Monitor may observe transaction with delay (pipeline latency). Define acceptable latency.',
    'TIMESTAMP: In driver, record timestamp when item driven. In monitor, record when observed. Check latency.',
    'ANALYSIS PORTS: Driver and monitor use analysis ports to send transactions to scoreboard. Scoreboard correlates.',
    'ASSERTION LOCATION: Procedural assertion in scoreboard (immediate assertion) or SVA in interface (concurrent assertion).',
    'RACE AVOIDANCE: Sample at stable points (clocking blocks) to avoid race conditions.',
    'Test Case 1 - Matching Items: Driver sends item A. Monitor observes A. Scoreboard verifies match.',
    'Test Case 2 - Latency: Driver sends item at cycle 10. Monitor observes at cycle 12 (2-cycle latency). Verify within bound.',
    'Test Case 3 - Mismatch: Driver sends A, monitor observes B (due to bus error). Assertion fails.',
    'Test Case 4 - Lost Transaction: Driver sends item, monitor never observes. Timeout assertion fails.',
    'Test Case 5 - Out-of-Order: Driver sends A then B. Monitor observes B then A. If order required, assertion fails.'
  ],
  hints: [
    'Scoreboard correlation: class scoreboard extends uvm_scoreboard; my_item_t exp_q[$]; // Expected from driver function void write_drv(my_item_t item); exp_q.push_back(item); endfunction function void write_mon(my_item_t item); my_item_t exp = exp_q.pop_front(); assert(item.compare(exp)) else `uvm_error(...) endfunction endclass',
    'Latency check: Record timestamps: int drv_time[$]; function void write_drv(item); drv_time.push_back($time); endfunction function void write_mon(item); int expected_time = drv_time.pop_front(); assert(($time - expected_time) <= MAX_LATENCY) else `uvm_error(...) endfunction',
    'Interface SVA: In interface: property p_drv_mon_match; @(posedge clk) $rose(drv_valid) |-> ##[1:LATENCY] (mon_valid && (mon_data == drv_data)); endproperty',
    'Clocking blocks: clocking cb @(posedge clk); input data; endclocking Sample from clocking block to avoid races.',
    'Timeout: In scoreboard: fork wait(exp_q.size() == 0); #(TIMEOUT); assert(exp_q.size() == 0) else `uvm_error("Timeout"); join_none',
    'Test: Send transactions via driver. Verify monitor captures all. Inject errors (data corruption, drops). Verify assertions catch.'
  ]
},

{
  id: 'assert26',
  shortName: 'FIFO Full and Empty Flags',
  question: 'FIFO Full and Empty Flags Correctness',
  description: 'Write assertion to verify FIFO buffer full and empty flag behavior. Ensure flags correctly indicate FIFO state and prevent overflow/underflow.',
  difficulty: 'Medium',
  topics: ['Assertions', 'Protocol', 'FIFO'],
  requirements: [
    'EMPTY FLAG: When empty=1, read operation should not produce valid data. Assert: empty |-> !rd_valid (or read ignored).',
    'FULL FLAG: When full=1, write operation should not be accepted. Assert: full |-> !wr_accept (or write ignored).',
    'POINTER/LEVEL: If FIFO exposes level/pointer, assert: level inside {[0:DEPTH]}. Never exceed.',
    'RESET: After reset, assert empty=1 and full=0.',
    'TRANSITIONS: When going from empty to not-empty, write must have occurred. When going from full to not-full, read must have occurred.',
    'OVERFLOW/UNDERFLOW: Assert no overflow (write when full) or underflow (read when empty) unless flagged.',
    'Test Case 1 - Empty Prevents Read: FIFO empty, assert rd_en. Verify rd_valid=0 or read ignored.',
    'Test Case 2 - Full Prevents Write: FIFO full, assert wr_en. Verify write ignored or overflow flag.',
    'Test Case 3 - Level Invariant: Fill and drain FIFO. Verify level always in [0:DEPTH].',
    'Test Case 4 - Reset: Assert reset. Verify empty=1, full=0.',
    'Test Case 5 - Transition Consistency: Write when empty. Verify empty→0. Read when level=1. Verify →empty.'
  ],
  hints: [
    'Empty assertion: assert property (@(posedge clk) disable iff (rst) empty |-> !rd_valid);',
    'Full assertion: assert property (@(posedge clk) disable iff (rst) full |-> !wr_accept); Or assert !(full && wr_en); if write should be blocked.',
    'Level bounds: assert property (@(posedge clk) disable iff (rst) level inside {[0:DEPTH]});',
    'Reset: assert property (@(posedge clk) $rose(!rst) |-> ##1 (empty && !full));',
    'Empty to not-empty: assert property (@(posedge clk) disable iff (rst) ($fell(empty)) |-> $past(wr_en && !full));',
    'Full to not-full: assert property (@(posedge clk) ($fell(full)) |-> $past(rd_en && !empty));',
    'Test: Write until full. Verify full=1. Attempt write, verify ignored. Read until empty. Verify empty=1. Attempt read, verify ignored.'
  ]
},

{
  id: 'assert27',
  shortName: 'Arbiter Fair Granting',
  question: 'Arbiter Grants Requests Fairly',
  description: 'Write assertion to verify arbiter grants requests fairly to multiple clients. Define fairness metric (bounded wait or round-robin ordering). Prevent starvation.',
  difficulty: 'Hard',
  topics: ['Assertions', 'Protocol', 'Arbiter'],
  requirements: [
    'FAIRNESS DEFINITION: Choose metric: (1) Bounded wait: request granted within N cycles, (2) Round-robin: requests granted in cyclic order, (3) No starvation: every persistent request eventually granted.',
    'BOUNDED WAIT: If request held high, grant must occur within N cycles: req[i] |-> ##[0:N] grant[i].',
    'ROUND-ROBIN: After granting client i, next grant (if multiple requests) goes to client (i+1) mod NUM_CLIENTS.',
    'MUTUAL EXCLUSION: Only one grant at a time: $onehot0(grant).',
    'PRIORITY: If arbiter has priority levels, document. Higher priority granted first, but lower priority not starved.',
    'RESET: disable iff (rst). After reset, grant=0.',
    'Test Case 1 - Bounded Wait: Assert req[0]=1 continuously. Within N cycles, grant[0]=1. Assertion passes.',
    'Test Case 2 - Round-Robin: req[0]=1, req[1]=1. grant[0] first, then grant[1], then grant[0] again. Verify order.',
    'Test Case 3 - No Starvation: req[2]=1 for long time with other requests. Eventually grant[2]=1.',
    'Test Case 4 - Mutual Exclusion: Never grant[0] && grant[1] simultaneously.',
    'Test Case 5 - Reset: After reset, all grants=0.'
  ],
  hints: [
    'Bounded wait: assert property (@(posedge clk) disable iff (rst) req[i] |-> ##[0:MAX_WAIT] grant[i]);',
    'Round-robin tracking: Use property with sequence. Or track last_grant: assert property (@(posedge clk) grant[i] |-> ##[1:$] (!grant[i] until grant[(i+1)%N])); (Simplified)',
    'Mutual exclusion: assert property (@(posedge clk) disable iff (rst) $onehot0(grant));',
    'No starvation (bounded): assert property (@(posedge clk) req[i][*N] |-> ##[0:M] grant[i]); Request held for N cycles must be granted within M more.',
    'Fairness coverage: Cover grants to each client. Ensure all clients receive grants over time.',
    'Test: Generate continuous requests from all clients. Verify grants rotate. Single client request: verify bounded wait. Stress test with varying request patterns.'
  ]
},

{
  id: 'assert28',
  shortName: 'No Starvation in Arbiter',
  question: 'Ensure No Starvation in Multi-Client Arbiter',
  description: 'Write assertion to ensure no client is starved in multi-client arbiter. Continuous request must eventually be granted within bounded time.',
  difficulty: 'Hard',
  topics: ['Assertions', 'Protocol', 'Fairness'],
  requirements: [
    'STARVATION DEFINITION: Client starved if request never granted despite being continuously asserted.',
    'BOUNDED LIVENESS: Use bounded eventually: persistent request granted within N cycles. Unbounded eventually hard in simulation.',
    'CONTINUOUS REQUEST: Request must remain asserted (stable) to trigger fairness guarantee. If request drops, counter resets.',
    'VACUITY: If request drops before N cycles, property vacuously passes. Gate with request stability.',
    'Test Case 1 - Persistent Request Granted: req[0] held for N cycles. Within M cycles after, grant[0]=1. Assertion passes.',
    'Test Case 2 - Starvation Violation: req[0] held continuously for N+M cycles, grant[0] never. Assertion fails.',
    'Test Case 3 - Request Drops: req[0] held for N-1 cycles, then drops. Assertion vacuously passes (antecedent not met).',
    'Test Case 4 - Multiple Clients: All clients request continuously. Verify all eventually granted.',
    'Test Case 5 - High vs Low Priority: Lower priority client requests. Higher priority dominates. Verify lower still granted within bound (no starvation).'
  ],
  hints: [
    'Bounded eventually: req[i][*N] |-> ##[0:M] grant[i]; Requires request stable for N cycles, then grant within M.',
    'Stable request: Use throughout: (req[i] throughout (##N 1)) |-> ##[0:M] grant[i]; Request must remain high.',
    'Unbounded eventually: req[i] |-> ##[1:$] grant[i]; Hard to verify in finite simulation. Use bounded for practical checking.',
    'Vacuous pass: Antecedent req[i][*N] fails if request drops. Property passes without checking consequent. Add cover to ensure antecedent hits.',
    'Example: assert property (@(posedge clk) disable iff (rst) req[i][*10] |-> ##[0:50] grant[i]); Request held 10 cycles granted within 50 more.',
    'Test: Hold single request continuously. Verify grant within bound. Add competing requests. Verify no starvation despite contention.'
  ]
},

{
  id: 'assert29',
  shortName: 'Mutual Exclusion Verification',
  question: 'Verify Mutual Exclusion in Shared Resource Access',
  description: 'Write assertion to verify mutual exclusion in shared resource access. Ensure no two clients access resource simultaneously. Verify grant vector is one-hot or zero.',
  difficulty: 'Hard',
  topics: ['Assertions', 'System', 'Mutual Exclusion'],
  requirements: [
    'MUTUAL EXCLUSION: At most one client granted access at any time. Never grant[i] && grant[j] for i≠j.',
    'ONE-HOT-ZERO: Grant vector is one-hot (exactly one bit set) or zero (no bits set). Use $onehot0(grant).',
    'LOCK PROTOCOL (Optional): If resource has lock/release protocol, verify proper acquire/release ordering.',
    'UNKNOWN HANDLING: For 4-state signals, $onehot0 may not handle X correctly. Gate with known check.',
    'RESET: disable iff (rst). After reset, grant=0 (no grants).',
    'Test Case 1 - Single Grant: grant = 4\'b0001 (client 0 granted). $onehot0 true. Assertion passes.',
    'Test Case 2 - No Grant: grant = 4\'b0000 (no clients). $onehot0 true. Assertion passes.',
    'Test Case 3 - Multiple Grants: grant = 4\'b0011 (clients 0 and 1). $onehot0 false. Assertion fails.',
    'Test Case 4 - X in Grant: grant = 4\'bXXX1. $onehot0 may return X. Handle with gating.',
    'Test Case 5 - Lock Protocol: Client acquires lock (grant=1), performs operation, releases (grant=0). Verify no other grant during this period.'
  ],
  hints: [
    'One-hot-zero check: assert property (@(posedge clk) disable iff (rst) $onehot0(grant));',
    'Manual check (no $onehot0): assert property (@(posedge clk) ($countones(grant) <= 1)); At most one bit set.',
    'Pairwise exclusion: assert property (@(posedge clk) !(grant[i] && grant[j])); for all i≠j. Scales poorly.',
    'Unknown gating: (!$isunknown(grant)) |-> $onehot0(grant);',
    'Lock acquire/release: On acquire (lock request granted): assert no other grant until release. acquire[i] |-> (grant == (1<<i)) until release[i];',
    'Test: Generate simultaneous requests. Verify only one grant. Force multiple grants in test. Verify assertion fires. Check reset behavior.'
  ]
},

{
  id: 'assert30',
  shortName: 'Ready-Valid Handshaking',
  question: 'Verify Ready-Valid Handshaking Protocol',
  description: 'Write assertion to verify correct ready-valid handshaking in interface. Ensure payload remains stable when valid high but not ready. Transfer occurs only when both valid and ready.',
  difficulty: 'Medium',
  topics: ['Assertions', 'System', 'Handshaking'],
  requirements: [
    'HANDSHAKE DEFINITION: Transfer occurs if and only if valid=1 AND ready=1 in same cycle.',
    'PAYLOAD STABILITY: When valid=1 and ready=0, payload (data, address, etc.) must remain stable until handshake completes.',
    'VALID PERSISTENCE: Once valid asserted, it must remain high until ready (no dropping valid before handshake).',
    'READY INDEPENDENCE: Ready can change freely. No requirement for ready to persist (though some protocols require).',
    'RESET: disable iff (rst).',
    'Test Case 1 - Handshake: valid=1, ready=1. Transfer occurs. Assertion passes.',
    'Test Case 2 - No Handshake (Not Ready): valid=1, ready=0. No transfer. Payload must remain stable next cycle.',
    'Test Case 3 - Payload Stability: valid=1, ready=0 for 3 cycles, payload constant. Then ready=1, handshake. Assertion passes.',
    'Test Case 4 - Payload Change (Violation): valid=1, ready=0. Next cycle, payload changes. Assertion fails.',
    'Test Case 5 - Valid Drop (Violation): valid=1, ready=0. Next cycle, valid=0 (drops before handshake). Assertion fails if persistence required.'
  ],
  hints: [
    'Payload stability: assert property (@(posedge clk) disable iff (rst) (valid && !ready) |-> ##1 ($stable(payload) && valid));',
    'Valid persistence: assert property (@(posedge clk) disable iff (rst) (valid && !ready) |-> ##1 valid); Valid must stay high.',
    'Handshake definition: wire transfer = valid && ready; All logic keys off this condition.',
    'Combinational loop warning: If ready depends combinationally on valid (or vice versa), document. Most protocols allow this.',
    'Alternative: Use clocking blocks to sample valid/ready/payload at stable points.',
    'Example: assert property (@(posedge clk) disable iff (rst) (valid && !ready) |-> ##1 (valid && $stable({data, addr})));',
    'Test: Hold valid=1, toggle ready. Verify payload stable while waiting. Change payload before handshake. Verify assertion fails.'
  ]
}
],



  'UVM Tb': [
  {
    id: 'uvm_adv_1',
    shortName: 'Out-of-Order Scoreboard',
    question: 'Design Out-of-Order Transaction Matching Scoreboard Using Transaction IDs',
    description: 'Implement UVM scoreboard that handles out-of-order transaction arrival from multiple sources (predictor and monitor). Transactions matched by unique transaction_id field. Support scenarios where expected transaction arrives before/after actual, or transactions arrive with arbitrary ordering. Report mismatches and manage memory by removing matched pairs.',
    difficulty: 'Hard',
    topics: ['UVM', 'Scoreboard', 'Transaction Matching'],
    requirements: [
      'CLASS STRUCTURE: Extend uvm_scoreboard base class. Implement two uvm_analysis_imp ports (or separate imp_expected and imp_actual).',
      'STORAGE: Maintain two associative arrays: (1) expected_q[transaction_id] for expected transactions, (2) actual_q[transaction_id] for actual transactions. Use transaction_id as key.',
      'TRANSACTION ID: Each transaction has unique transaction_id field (int or similar). Used as key for matching.',
      'WRITE METHODS: Implement write_expected(T trans) and write_actual(T trans) analysis imp callback functions.',
      'MATCHING LOGIC (Expected Arrival): On write_expected: Check if actual_q[trans.id] exists. If yes: compare, report pass/fail, delete from actual_q. If no: store in expected_q[trans.id].',
      'MATCHING LOGIC (Actual Arrival): On write_actual: Check if expected_q[trans.id] exists. If yes: compare, report pass/fail, delete from expected_q. If no: store in actual_q[trans.id].',
      'COMPARISON: Use transaction compare() method or field-by-field comparison. If mismatch: `uvm_error("MISMATCH", message).',
      'MEMORY MANAGEMENT: Delete entries from associative arrays after successful match to prevent memory leak.',
      'END-OF-TEST CHECK: In check_phase or final_phase, verify both expected_q and actual_q are empty. Report unmatched transactions as errors.',
      'Test Case 1 - In-Order Match: Expected arrives first, then actual with same ID. Verify match succeeds, both arrays empty.',
      'Test Case 2 - Out-of-Order (Actual First): Actual arrives, stored in actual_q. Later expected arrives, match succeeds, arrays cleared.',
      'Test Case 3 - Multiple Transactions: Mix of in-order and out-of-order. IDs: 1,2,3. Arrival order: E1, A2, E3, A1, E2, A3. Verify all match correctly.',
      'Test Case 4 - Mismatch Detection: Expected and actual with same ID but different data fields. Verify `uvm_error called with mismatch details.',
      'Test Case 5 - Missing Transaction: Expected transaction never receives matching actual (or vice versa). At end of test, verify `uvm_error for unmatched entries.',
      'Test Case 6 - Duplicate ID: Same transaction_id appears twice (protocol error). Verify graceful handling or error reporting.'
    ],
    hints: [
      'Associative array declaration: my_transaction expected_q[int]; my_transaction actual_q[int]; Keys are transaction IDs.',
      'Analysis imp: uvm_analysis_imp_expected#(my_transaction, my_scoreboard) expected_imp; Separate implementation names for two ports.',
      'Write method: virtual function void write_expected(my_transaction trans); if(actual_q.exists(trans.id)) begin // Match found, compare my_transaction act = actual_q[trans.id]; if(!trans.compare(act)) `uvm_error(...); actual_q.delete(trans.id); end else expected_q[trans.id] = trans; endfunction',
      'Comparison: Use built-in compare(): if(!trans.compare(act)) or manual: if(trans.data != act.data) `uvm_error(...)',
      'End-of-test check: function void check_phase(uvm_phase phase); if(expected_q.size() != 0) `uvm_error("UNMATCHED", $sformatf("%0d expected transactions unmatched", expected_q.size())); // Similar for actual_q endfunction',
      'Memory safety: Always delete matched entries: expected_q.delete(id); actual_q.delete(id);',
      'Logging: Use `uvm_info for successful matches (optional, can be verbose). Use `uvm_error for mismatches and unmatched at end.',
      'Deep copy: When storing transactions, consider deep copy to avoid reference issues: expected_q[id] = trans.clone();'
    ]
  },

  {
    id: 'uvm_adv_2',
    shortName: 'OOO Router Scoreboard',
    question: 'Implement Scoreboard for 2-Input to 2-Output Router with Out-of-Order Delivery',
    description: 'Design scoreboard for router DUT with 2 input ports and 2 output ports. Input transactions do not carry explicit output port tag. Routing determined by DUT internal logic (e.g., based on address or transaction_id). Outputs can arrive out-of-order relative to inputs. Match each output to correct input using transaction_id or address field. Handle scenarios where outputs interleave from both inputs.',
    difficulty: 'Hard',
    topics: ['UVM', 'Scoreboard', 'Routing'],
    requirements: [
      'CLASS STRUCTURE: Extend uvm_scoreboard. Implement analysis ports for: (1) input_port0_imp, (2) input_port1_imp, (3) output_port0_imp, (4) output_port1_imp.',
      'INPUT STORAGE: Maintain associative array expected_q[transaction_id] to store all input transactions from both ports.',
      'ROUTING LOGIC: Determine expected output port based on transaction fields. Example: if(trans.addr[0]==0) → output_port0 else → output_port1. Or routing based on transaction_id parity.',
      'OUTPUT MATCHING: On output transaction arrival: (1) Extract transaction_id, (2) Check expected_q[id] exists, (3) Verify routing matches (output port matches expected), (4) Compare data fields, (5) Report mismatch or success, (6) Delete from expected_q.',
      'OUT-OF-ORDER HANDLING: Outputs from both ports can interleave. Use transaction_id as universal key across all outputs.',
      'MISSING/EXTRA DETECTION: At end of test, check for unmatched expected (missing outputs) or extra outputs (no matching input).',
      'MULTIPLE INPUTS: Both input ports feed same expected_q. Track which port input came from if needed for debug.',
      'Test Case 1 - Correct Routing: Input on port0 with addr[0]=0 → output on port0. Verify match.',
      'Test Case 2 - Cross Routing: Input on port0 with addr[0]=1 → output on port1. Verify correct routing.',
      'Test Case 3 - Out-of-Order Outputs: Inputs: I0(id=1), I1(id=2), I0(id=3). Outputs: O0(id=3), O1(id=2), O0(id=1). Verify all match correctly.',
      'Test Case 4 - Missing Output: Input transaction never appears at output. Verify `uvm_error at end of test.',
      'Test Case 5 - Extra Output: Output transaction with no matching input. Verify `uvm_error immediately.',
      'Test Case 6 - Wrong Port: Input routed to wrong output port. Verify routing mismatch reported.'
    ],
    hints: [
      'Expected queue: my_transaction expected_q[int]; // Keyed by transaction_id',
      'Input write method: function void write_input0(my_transaction trans); expected_q[trans.id] = trans; endfunction // Same for input1',
      'Output write method: function void write_output0(my_transaction trans); if(!expected_q.exists(trans.id)) begin `uvm_error("EXTRA", $sformatf("Output id=%0d has no matching input", trans.id)); return; end my_transaction exp = expected_q[trans.id]; // Check routing: determine expected output port based on exp fields int expected_port = (exp.addr[0] == 0) ? 0 : 1; if(expected_port != 0) `uvm_error("ROUTE", "Wrong output port"); // Compare data if(!trans.compare(exp)) `uvm_error("DATA", "Mismatch"); expected_q.delete(trans.id); endfunction',
      'Routing function: function int get_expected_port(my_transaction trans); return (trans.addr[0] == 0) ? 0 : 1; endfunction Use in output write methods.',
      'Port tracking: If needed, add field to transaction: int input_port; Set when storing in expected_q.',
      'End check: Verify expected_q.size() == 0. If not, iterate and report: foreach(expected_q[id]) `uvm_error("MISSING", $sformatf("Input id=%0d never appeared at output", id));',
      'Analysis imp: Use uvm_analysis_imp_input0, uvm_analysis_imp_output0 with different suffixes for each port.',
      'Test: Generate inputs with known routing. Verify outputs appear at correct ports. Inject errors (wrong port, missing, extra). Verify scoreboard catches.'
    ]
  },

  {
    id: 'uvm_adv_3',
    shortName: 'Framing Monitor ABCD→CAFE',
    question: 'Design Monitor for Serial 4-bit Interface with Start/Stop Framing Patterns',
    description: 'Implement monitor for serial nibble (4-bit) interface with framing protocol. Start delimiter: 0xABCD (two consecutive nibbles 0xA, 0xB, 0xC, 0xD). Stop delimiter: 0xCAFE (nibbles 0xC, 0xA, 0xF, 0xE). Monitor detects start pattern, captures all payload nibbles until stop pattern detected, then publishes complete payload as single transaction via analysis port. Handle partial patterns, false starts, and nested patterns.',
    difficulty: 'Hard',
    topics: ['UVM', 'Monitor', 'Protocol'],
    requirements: [
      'CLASS STRUCTURE: Extend uvm_monitor. Implement analysis_port to publish captured transactions.',
      'STATE MACHINE: Use FSM with states: (1) IDLE (waiting for start), (2) START_DETECT (detecting ABCD sequence), (3) PAYLOAD_CAPTURE (capturing data), (4) STOP_DETECT (detecting CAFE sequence).',
      'START PATTERN: Detect 4 consecutive nibbles: A, B, C, D. Transition to PAYLOAD_CAPTURE after D.',
      'STOP PATTERN: Detect 4 consecutive nibbles: C, A, F, E during PAYLOAD_CAPTURE. Transition to IDLE after E.',
      'PAYLOAD STORAGE: Store captured nibbles in dynamic array or queue during PAYLOAD_CAPTURE state.',
      'PARTIAL PATTERN HANDLING: If start pattern partially matches (e.g., A,B,X), reset and restart detection.',
      'NESTED PATTERNS: If CAFE appears within payload, treat as end. If ABCD appears within payload before CAFE, handle as protocol error or nested frame (define behavior).',
      'TRANSACTION PUBLISHING: After stop pattern complete, pack payload nibbles into transaction object. Publish via analysis_port.write(trans).',
      'ERROR HANDLING: Timeout if no stop pattern after N nibbles. Report protocol errors for malformed frames.',
      'Test Case 1 - Valid Frame: Nibble stream: A,B,C,D,1,2,3,4,C,A,F,E. Payload: [1,2,3,4]. Verify transaction published with correct payload.',
      'Test Case 2 - Partial Start: Stream: A,B,X,A,B,C,D,5,6,C,A,F,E. First start fails at X, second succeeds. Payload: [5,6].',
      'Test Case 3 - Multiple Frames: Two frames back-to-back: A,B,C,D,1,2,C,A,F,E,A,B,C,D,3,4,C,A,F,E. Two transactions published.',
      'Test Case 4 - No Stop Pattern: Start detected, payload nibbles, but never CAFE. Timeout error.',
      'Test Case 5 - Start Pattern in Payload: A,B,C,D,1,A,B,C,D,2,C,A,F,E. Payload includes ABCD sequence. Verify handled correctly (either as payload or error).',
      'Test Case 6 - Immediate Stop: A,B,C,D,C,A,F,E (empty payload). Verify transaction with zero-length payload.'
    ],
    hints: [
      'State machine: typedef enum {IDLE, START_DETECT, PAYLOAD, STOP_DETECT} state_t; state_t state;',
      'Start detection: Use counter/index: int start_idx; nibble_queue[3:0] start_pattern = {4\'hA, 4\'hB, 4\'hC, 4\'hD}; if(nibble == start_pattern[start_idx]) start_idx++; else start_idx=0; if(start_idx==4) state=PAYLOAD;',
      'Payload capture: nibble_queue_t payload_q; if(state==PAYLOAD) payload_q.push_back(nibble);',
      'Stop detection: Similar counter for CAFE pattern. int stop_idx; if(nibble == stop_pattern[stop_idx]) stop_idx++; if(stop_idx==4) publish_transaction();',
      'Transaction publish: my_transaction trans = my_transaction::type_id::create("trans"); trans.payload = new[payload_q.size()]; foreach(payload_q[i]) trans.payload[i] = payload_q[i]; analysis_port.write(trans);',
      'Timeout: Use counter: int nibble_count; if(nibble_count > MAX_PAYLOAD) `uvm_error("TIMEOUT", "No stop pattern");',
      'Reset on error: On partial pattern match fail or timeout: state = IDLE; payload_q.delete(); start_idx = 0;',
      'Run phase: forever @(posedge vif.clk) begin nibble = vif.data; // FSM logic end',
      'Test: Drive nibble interface with test patterns. Verify monitor publishes correct transactions. Use sequence to generate patterns.'
    ]
  },

  {
    id: 'uvm_adv_4',
    shortName: 'Split-Beat Driver',
    question: 'Implement Driver that Splits 64-bit Transaction into Two 32-bit Beats',
    description: 'Design UVM driver for 32-bit data interface that receives 64-bit transactions from sequencer and splits each into two 32-bit beats. First beat transmits lower 32 bits [31:0], second beat transmits upper 32 bits [63:32]. Handle ready/valid handshake with backpressure. Support configurable inter-beat gap. Call item_done() only after both beats transmitted.',
    difficulty: 'Medium',
    topics: ['UVM', 'Driver', 'Split Transactions'],
    requirements: [
      'CLASS STRUCTURE: Extend uvm_driver#(my_transaction_64bit). Transaction has 64-bit data field.',
      'INTERFACE: 32-bit data bus, valid signal (driver asserts), ready signal (DUT asserts for backpressure).',
      'BEAT SPLITTING: For each 64-bit transaction: (1) First beat: drive data[31:0], assert valid, (2) Wait for ready, (3) Second beat: drive data[63:32], assert valid, (4) Wait for ready.',
      'BACKPRESSURE: Before each beat, wait for ready signal. If ready=0, hold valid and data until ready=1.',
      'INTER-BEAT GAP (Optional): Configurable cycles between beats. If gap=0, back-to-back. If gap>0, deassert valid for gap cycles.',
      'ITEM DONE: Call seq_item_port.item_done() only after second beat completes (ready seen for second beat).',
      'TRANSACTION INTEGRITY: Both beats belong to same transaction. If transaction has ID field, maintain same ID for both beats (if ID sent on bus).',
      'RESET HANDLING: If reset asserts mid-transaction, abort current transaction and restart.',
      'Test Case 1 - No Backpressure: ready always high. 64-bit transaction split into two consecutive beats. Verify both halves transmitted correctly.',
      'Test Case 2 - Backpressure on First Beat: ready=0 for 3 cycles after first valid. Driver waits, then transmits first beat when ready=1. Then second beat.',
      'Test Case 3 - Backpressure on Second Beat: First beat transmitted immediately. ready=0 for second beat. Driver waits, transmits when ready.',
      'Test Case 4 - Inter-Beat Gap: gap=2 cycles. After first beat, valid=0 for 2 cycles, then second beat. Verify gap respected.',
      'Test Case 5 - Multiple Transactions: Send 3 transactions back-to-back. Verify all 6 beats (2 per transaction) transmitted in order.',
      'Test Case 6 - Reset During Transaction: First beat transmitted, reset asserts before second beat. Driver aborts, resets state.'
    ],
    hints: [
      'Run phase structure: forever begin seq_item_port.get_next_item(req); drive_first_beat(req.data[31:0]); drive_second_beat(req.data[63:32]); seq_item_port.item_done(); end',
      'Drive beat task: task drive_beat(bit [31:0] data); @(vif.cb); vif.cb.data <= data; vif.cb.valid <= 1; @(vif.cb iff vif.cb.ready); vif.cb.valid <= 0; endtask',
      'Backpressure wait: @(posedge vif.clk iff vif.ready); or @(vif.cb iff vif.cb.ready);',
      'Inter-beat gap: repeat(gap_cycles) @(vif.cb); Between beats.',
      'Clocking block: clocking cb @(posedge clk); output data, valid; input ready; endclocking Use for timing.',
      'Reset handling: always @(posedge vif.rst) begin // Abort current, reset outputs vif.valid <= 0; end In separate thread.',
      'Complete example: task run_phase(uvm_phase phase); forever begin seq_item_port.get_next_item(req); // First beat @(vif.cb); vif.cb.data <= req.data[31:0]; vif.cb.valid <= 1; @(vif.cb iff vif.cb.ready); // Wait for ready // Gap if(gap > 0) begin vif.cb.valid <= 0; repeat(gap) @(vif.cb); end // Second beat @(vif.cb); vif.cb.data <= req.data[63:32]; vif.cb.valid <= 1; @(vif.cb iff vif.cb.ready); vif.cb.valid <= 0; seq_item_port.item_done(); end endtask',
      'Test: Create sequence with 64-bit transactions. Monitor interface to verify both beats transmitted. Vary ready signal timing. Verify correct backpressure handling.'
    ]
  },

  {
    id: 'uvm_adv_5',
    shortName: 'Split-Beat Monitor Reassembly',
    question: 'Design Monitor that Reassembles 64-bit Transactions from Two 32-bit Beats',
    description: 'Implement UVM monitor for 32-bit data interface that receives split 64-bit transactions as two consecutive 32-bit beats. Monitor detects beat boundaries using valid/ready handshake, correlates beats using transaction_id, reassembles into single 64-bit transaction, and publishes via analysis port. Handle timeout for missing second beat and out-of-order beats (if IDs present).',
    difficulty: 'Hard',
    topics: ['UVM', 'Monitor', 'Split Transactions'],
    requirements: [
      'CLASS STRUCTURE: Extend uvm_monitor. Implement analysis_port to publish reassembled 64-bit transactions.',
      'BEAT DETECTION: Sample data when valid=1 and ready=1 (handshake). Each sample is one beat.',
      'BEAT CORRELATION: Use transaction_id (if present on bus) to correlate first and second beats. If no ID, assume consecutive beats belong to same transaction.',
      'REASSEMBLY STORAGE: Maintain associative array keyed by transaction_id: partial_trans[id] stores first beat data.',
      'FIRST BEAT: On beat with beat_num=0 (or first of pair): store data[31:0] in partial_trans[id].',
      'SECOND BEAT: On beat with beat_num=1 (or second of pair): retrieve partial_trans[id], combine with current data[31:0] to form 64-bit value, publish transaction, delete from partial_trans.',
      'TIMEOUT: If first beat received but second beat doesnt arrive within N cycles, report `uvm_error("TIMEOUT") and remove from partial_trans.',
      'OUT-OF-ORDER: If beats from different transactions interleave (ID-based), handle correctly. Example: ID1_beat0, ID2_beat0, ID1_beat1, ID2_beat1.',
      'NO ID CASE: If no transaction_id on bus, assume strict beat pairs (consecutive). Use simple toggle or counter.',
      'Test Case 1 - In-Order Beats: Two beats arrive consecutively with same ID. Monitor reassembles, publishes 64-bit transaction.',
      'Test Case 2 - Out-of-Order: ID1_b0, ID2_b0, ID2_b1, ID1_b1. Monitor reassembles both transactions correctly using IDs.',
      'Test Case 3 - Timeout: First beat arrives, second beat never comes. After timeout, `uvm_error reported.',
      'Test Case 4 - No ID (Sequential): Beats alternate: b0, b1, b0, b1. Monitor pairs them sequentially into two transactions.',
      'Test Case 5 - Backpressure: Beats separated by cycles where ready=0. Monitor correctly samples only valid beats.',
      'Test Case 6 - Multiple Transactions: Stream of many beat pairs. Verify all reassembled correctly.'
    ],
    hints: [
      'Partial storage: my_transaction_64bit partial_trans[int]; // Keyed by transaction_id',
      'Sample beat: @(posedge vif.clk); if(vif.valid && vif.ready) begin bit [31:0] data = vif.data; int id = vif.transaction_id; int beat_num = vif.beat_num; // Process beat end',
      'First beat: if(beat_num == 0) begin my_transaction_64bit trans = my_transaction_64bit::type_id::create("trans"); trans.data[31:0] = data; trans.transaction_id = id; partial_trans[id] = trans; end',
      'Second beat: if(beat_num == 1) begin if(!partial_trans.exists(id)) `uvm_error("ORPHAN", "Second beat without first"); else begin my_transaction_64bit trans = partial_trans[id]; trans.data[63:32] = data; analysis_port.write(trans); partial_trans.delete(id); end end',
      'Timeout implementation: Use time tracking: realtime first_beat_time[int]; On first beat: first_beat_time[id] = $realtime; In separate thread: forever begin #(TIMEOUT_CYCLES); foreach(first_beat_time[id]) if(($realtime - first_beat_time[id]) > TIMEOUT) begin `uvm_error("TIMEOUT", $sformatf("ID %0d missing second beat", id)); partial_trans.delete(id); first_beat_time.delete(id); end end',
      'No ID case: Use toggle: bit beat_toggle; my_transaction_64bit pending_trans; if(!beat_toggle) begin // First beat pending_trans.data[31:0] = data; beat_toggle = 1; end else begin // Second beat pending_trans.data[63:32] = data; analysis_port.write(pending_trans); beat_toggle = 0; end',
      'Clocking block: clocking cb @(posedge clk); input valid, ready, data, transaction_id, beat_num; endclocking',
      'Test: Drive split beats with monitor. Verify reassembly. Inject missing second beat. Verify timeout. Vary beat order (with IDs). Verify correct reassembly.'
    ]
  },

  {
    id: 'uvm_adv_6',
    shortName: 'Functional Coverage Subscriber',
    question: 'Implement UVM Subscriber with Covergroup for Transaction Coverage',
    description: 'Create UVM subscriber component that receives transactions via TLM analysis export and samples functional coverage using covergroup. Subscriber automatically connected to monitor analysis port. Covergroup includes coverpoints for transaction fields and crosses for corner case coverage. Report coverage statistics at end of test.',
    difficulty: 'Medium',
    topics: ['UVM', 'Coverage', 'Subscriber'],
    requirements: [
      'CLASS STRUCTURE: Extend uvm_subscriber#(my_transaction). Subscriber has built-in analysis_export (no need to declare).',
      'COVERGROUP DECLARATION: Declare covergroup with relevant coverpoints and crosses. Include in class.',
      'COVERPOINTS: Cover key transaction fields. Example: address ranges, data values, transaction types, burst lengths.',
      'BINS: Define bins for coverpoints. Use explicit bins, ranges, or transitions.',
      'CROSSES: Create cross coverage for correlated fields. Example: cross address and transaction type.',
      'SAMPLING: In write(T t) method (required override), call covergroup.sample() with transaction data.',
      'COVERAGE REPORTING: In report_phase, call $get_coverage() or covergroup.get_coverage() to report percentage.',
      'OPTIONS: Set covergroup options: option.per_instance = 1; option.at_least = 1; etc.',
      'Test Case 1 - Basic Coverage: Send transactions covering all bins. Verify coverage increments.',
      'Test Case 2 - Cross Coverage: Send transactions hitting cross bins. Verify cross coverage updates.',
      'Test Case 3 - Unreached Bins: Some bins not hit. Report shows <100% coverage.',
      'Test Case 4 - Coverage Goal: Reach 100% coverage. Report shows complete coverage.',
      'Test Case 5 - Multiple Instances: Multiple subscribers (if testing). Verify per-instance coverage tracked correctly.'
    ],
    hints: [
      'Class structure: class my_subscriber extends uvm_subscriber#(my_transaction); covergroup cg; addr_cp: coverpoint trans.addr { bins low = {[0:127]}; bins high = {[128:255]}; } data_cp: coverpoint trans.data; type_cp: coverpoint trans.trans_type; addr_type_cross: cross addr_cp, type_cp; endgroup function new(string name, uvm_component parent); super.new(name, parent); cg = new(); endfunction virtual function void write(my_transaction t); trans = t; cg.sample(); endfunction endclass',
      'Sampling: Store transaction in class variable: my_transaction trans; Then sample: trans = t; cg.sample();',
      'Coverage reporting: function void report_phase(uvm_phase phase); real cov = cg.get_coverage(); `uvm_info("COV", $sformatf("Coverage: %0.2f%%", cov), UVM_LOW) endfunction',
      'Bins: Use ranges: bins addr_low = {[0:63]}; bins addr_high = {[64:127]}; Use lists: bins types = {READ, WRITE, IDLE};',
      'Transitions: bins trans_seq = (IDLE => READ => WRITE);',
      'Crosses: cross addr_cp, data_cp; Creates bins for all combinations.',
      'Options: covergroup cg; option.per_instance = 1; // Per-instance coverage option.at_least = 1; // Each bin hit at least once ... endgroup',
      'Connection: In env connect_phase: monitor.analysis_port.connect(subscriber.analysis_export);',
      'Test: Generate diverse transactions. Check coverage report. Identify missing bins. Add directed tests to hit them. Achieve 100% coverage.'
    ]
  },

  {
    id: 'uvm_adv_7',
    shortName: 'Coverage Placement in Env',
    question: 'Integrate Coverage Subscriber into UVM Environment with Monitor Connection',
    description: 'Implement coverage collection in UVM environment by instantiating coverage subscriber and connecting to monitor analysis port. Coverage subscriber samples transactions passively from monitor without affecting other components. Demonstrate proper TLM connection in connect_phase.',
    difficulty: 'Medium',
    topics: ['UVM', 'Coverage', 'Env Wiring'],
    requirements: [
      'ENVIRONMENT CLASS: In existing uvm_env, add coverage subscriber component.',
      'BUILD PHASE: Instantiate subscriber in env build_phase using factory create.',
      'CONNECT PHASE: Connect monitor.analysis_port to subscriber.analysis_export in env connect_phase.',
      'MULTIPLE CONNECTIONS: Monitor analysis port can fan out to multiple subscribers (coverage, scoreboard, logger).',
      'CONFIGURATION: Allow enable/disable of coverage via config_db. If disabled, dont create subscriber.',
      'HIERARCHY: Subscriber is child of env. Full path: top.env.subscriber.',
      'Test Case 1 - Connection Verification: Run test, verify subscriber receives transactions from monitor.',
      'Test Case 2 - Coverage Updates: Transactions sent, subscriber samples, coverage increments. Verify in report.',
      'Test Case 3 - Multiple Subscribers: Connect monitor to coverage subscriber and scoreboard. Both receive same transactions.',
      'Test Case 4 - Disable Coverage: Set config to disable coverage. Subscriber not created, no coverage collected.',
      'Test Case 5 - Hierarchy Check: Print topology, verify subscriber present in env.'
    ],
    hints: [
      'Environment class: class my_env extends uvm_env; my_agent agent; my_subscriber subscriber; my_scoreboard scoreboard; ... endclass',
      'Build phase: function void build_phase(uvm_phase phase); super.build_phase(phase); agent = my_agent::type_id::create("agent", this); subscriber = my_subscriber::type_id::create("subscriber", this); scoreboard = my_scoreboard::type_id::create("scoreboard", this); endfunction',
      'Connect phase: function void connect_phase(uvm_phase phase); super.connect_phase(phase); agent.monitor.analysis_port.connect(subscriber.analysis_export); agent.monitor.analysis_port.connect(scoreboard.analysis_export); endfunction',
      'Fan-out: Single analysis_port can connect to multiple analysis_exports. TLM automatically broadcasts.',
      'Conditional creation: bit enable_coverage; uvm_config_db#(bit)::get(this, "", "enable_coverage", enable_coverage); if(enable_coverage) subscriber = my_subscriber::type_id::create("subscriber", this);',
      'Configuration in test: class my_test extends uvm_test; function void build_phase(uvm_phase phase); uvm_config_db#(bit)::set(this, "env", "enable_coverage", 1); ... endfunction endclass',
      'Verification: In subscriber, add `uvm_info in write(): `uvm_info("SUB", "Received transaction", UVM_HIGH) Check log for messages.',
      'Test: Run simulation. Check that subscriber receives transactions (log messages). Verify coverage report generated. Test with coverage disabled, verify no subscriber created.'
    ]
  },

  {
    id: 'uvm_adv_8',
    shortName: 'Analysis FIFO Scoreboard',
    question: 'Design Scoreboard Using uvm_tlm_analysis_fifo for Timing Decoupling',
    description: 'Implement scoreboard that uses uvm_tlm_analysis_fifo to decouple monitor sampling timing from scoreboard checking logic. Monitor writes transactions to FIFO via analysis port. Scoreboard checking thread gets transactions from FIFO at its own pace using get() blocking call. FIFO buffers transactions, allowing monitor and checker to run independently. Handles burst traffic and timing variations.',
    difficulty: 'Hard',
    topics: ['UVM', 'Scoreboard', 'TLM'],
    requirements: [
      'CLASS STRUCTURE: Extend uvm_scoreboard. Instantiate uvm_tlm_analysis_fifo#(my_transaction).',
      'FIFO INSTANTIATION: Create FIFO in build_phase: fifo = new("fifo", this);',
      'MONITOR CONNECTION: In env connect_phase: monitor.analysis_port.connect(scoreboard.fifo.analysis_export);',
      'CHECKING THREAD: In scoreboard run_phase, create forever loop that calls fifo.get(trans) to retrieve transactions.',
      'BLOCKING GET: fifo.get(trans) blocks until transaction available. Checker runs at own pace.',
      'TRANSACTION PROCESSING: After get(), perform checking logic (compare with expected, update state, etc.).',
      'EXPECTED TRANSACTION HANDLING: Maintain expected queue or predictor. Compare actual (from FIFO) with expected.',
      'FIFO DEPTH: FIFO has unlimited depth by default. Can set max depth if needed: fifo.set_max_size(N);',
      'END-OF-TEST: In check_phase, verify FIFO empty. If not, unprocessed transactions remain (error).',
      'Test Case 1 - Timing Decoupling: Monitor writes transactions in bursts. Checker processes at slower rate. FIFO buffers transactions.',
      'Test Case 2 - Burst Traffic: 10 transactions arrive in 10 cycles. Checker takes 50 cycles to process all. FIFO holds pending transactions.',
      'Test Case 3 - Immediate Processing: Checker fast, FIFO mostly empty. Transactions processed as soon as they arrive.',
      'Test Case 4 - FIFO Depth: Set max depth. Fill FIFO beyond limit. Verify overflow handling (blocking or error).',
      'Test Case 5 - End-of-Test Check: All transactions processed, FIFO empty. Test passes.',
      'Test Case 6 - Unprocessed Transactions: Simulation ends with transactions in FIFO. check_phase reports error.'
    ],
    hints: [
      'Scoreboard class: class my_scoreboard extends uvm_scoreboard; uvm_tlm_analysis_fifo#(my_transaction) fifo; function void build_phase(uvm_phase phase); super.build_phase(phase); fifo = new("fifo", this); endfunction task run_phase(uvm_phase phase); my_transaction trans; forever begin fifo.get(trans); check_transaction(trans); end endtask endclass',
      'Get method: Blocking call. task run_phase(uvm_phase phase); my_transaction trans; forever begin fifo.get(trans); // Blocks until available `uvm_info("SCB", $sformatf("Got transaction: %s", trans.convert2string()), UVM_HIGH) // Checking logic end endtask',
      'Connection: In env: monitor.analysis_port.connect(scoreboard.fifo.analysis_export);',
      'Multiple FIFOs: If multiple monitors, use separate FIFOs: uvm_tlm_analysis_fifo#(my_transaction) fifo_in0, fifo_in1; Process in parallel threads or merge logic.',
      'End check: function void check_phase(uvm_phase phase); if(fifo.used() != 0) `uvm_error("FIFO", $sformatf("%0d transactions unprocessed", fifo.used())); endfunction',
      'Max depth: In build_phase: fifo = new("fifo", this); fifo.set_max_size(16); // Limit to 16 entries. If full, put() blocks or errors depending on implementation.',
      'Try get: Non-blocking: if(fifo.try_get(trans)) // Process else // No transaction available. Useful for polling.',
      'Peek: Look at next transaction without removing: fifo.peek(trans); Transaction remains in FIFO.',
      'Test: Generate transactions at varying rates. Slow down checker. Observe FIFO fills and drains. Verify correct operation. Check end-of-test FIFO state.'
    ]
  },

  {
    id: 'uvm_adv_9',
    shortName: 'Driver Response Path',
    question: 'Implement Driver with Response Path Back to Sequencer',
    description: 'Design UVM driver that not only drives stimulus to DUT but also returns response transactions back to sequencer. After completing request on DUT, driver creates response transaction, populates with DUT response data, and sends to sequencer using item_done(rsp). Sequence retrieves response using get_response(rsp) and can use response data for future requests (reactive sequence).',
    difficulty: 'Medium',
    topics: ['UVM', 'Driver', 'Response'],
    requirements: [
      'DRIVER CLASS: Extend uvm_driver#(my_transaction). Handle both request and response.',
      'REQUEST HANDLING: Get request from sequencer: seq_item_port.get_next_item(req);',
      'DUT DRIVE: Drive request onto DUT interface. Wait for DUT operation to complete.',
      'RESPONSE CREATION: Create response transaction: rsp = my_transaction::type_id::create("rsp");',
      'RESPONSE POPULATION: Populate response fields with DUT response data (e.g., read data, status, error flags).',
      'RESPONSE RETURN: Call seq_item_port.item_done(rsp); Sends response back to sequencer.',
      'SEQUENCE RECEIVE: In sequence body(), after finish_item(req), call get_response(rsp) to retrieve response.',
      'REACTIVE SEQUENCE: Use response data to generate next request. Example: read response data, write modified data back.',
      'BIDIRECTIONAL: Request goes sequencer→driver→DUT. Response goes DUT→driver→sequencer.',
      'Test Case 1 - Basic Response: Sequence sends read request, receives read data in response. Verify data correct.',
      'Test Case 2 - Reactive Sequence: Read register, modify value, write back. Use response from read to generate write request.',
      'Test Case 3 - Error Response: DUT returns error status. Driver includes in response. Sequence checks and handles error.',
      'Test Case 4 - Multiple Transactions: Send 10 requests, receive 10 responses. Verify all responses received in correct order.',
      'Test Case 5 - No Response: Driver calls item_done() without response (NULL). Sequence handles gracefully (no get_response).'
    ],
    hints: [
      'Driver run_phase: task run_phase(uvm_phase phase); my_transaction req, rsp; forever begin seq_item_port.get_next_item(req); drive_dut(req); rsp = my_transaction::type_id::create("rsp"); rsp.set_id_info(req); // Copy ID/metadata sample_dut_response(rsp); // Read DUT outputs into rsp seq_item_port.item_done(rsp); end endtask',
      'Drive DUT: task drive_dut(my_transaction req); @(vif.cb); vif.cb.addr <= req.addr; vif.cb.data <= req.data; vif.cb.wr_en <= 1; @(vif.cb); vif.cb.wr_en <= 0; endtask',
      'Sample response: task sample_dut_response(my_transaction rsp); @(vif.cb iff vif.cb.valid); rsp.data = vif.cb.rdata; rsp.status = vif.cb.status; endtask',
      'Sequence with response: class my_seq extends uvm_sequence#(my_transaction); task body(); my_transaction req, rsp; req = my_transaction::type_id::create("req"); start_item(req); req.randomize(); finish_item(req); get_response(rsp); // Retrieve response `uvm_info("SEQ", $sformatf("Response: data=%0h status=%0d", rsp.data, rsp.status), UVM_LOW) endtask endclass',
      'Reactive sequence: task body(); my_transaction req, rsp; // Read req = my_transaction::type_id::create("req"); start_item(req); req.addr = 32\'h100; req.wr_en = 0; finish_item(req); get_response(rsp); // Write modified data req = my_transaction::type_id::create("req"); start_item(req); req.addr = 32\'h104; req.data = rsp.data + 1; req.wr_en = 1; finish_item(req); get_response(rsp); // Get write response (ack) endtask',
      'No response: Driver can call: seq_item_port.item_done(); Without argument. Sequence should not call get_response() in this case.',
      'Response metadata: Copy request metadata to response: rsp.set_id_info(req); rsp.set_sequence_id(req.get_sequence_id());',
      'Test: Create sequences that use responses. Verify correct data returned. Test reactive behavior. Check error handling.'
    ]
  },

  {
    id: 'uvm_adv_10',
    shortName: 'Protocol Assertion Monitor',
    question: 'Implement Protocol Checking Monitor with Inline Assertions',
    description: 'Design lightweight UVM monitor that performs protocol violation checking using procedural assertions (if statements with `uvm_error). Monitor samples interface continuously and checks for protocol violations: (1) valid deasserted mid-packet, (2) ready toggling when not allowed, (3) data stability violations, (4) illegal state transitions. No SystemVerilog Assertions (SVA) used, only procedural checks. Report violations immediately with detailed error messages.',
    difficulty: 'Hard',
    topics: ['UVM', 'Monitor', 'Protocol Checks'],
    requirements: [
      'MONITOR CLASS: Extend uvm_monitor. Sample interface signals in run_phase.',
      'PROTOCOL RULES: Define specific protocol rules to check. Examples: (1) valid must remain high once asserted until packet complete, (2) data must be stable while valid high and ready low, (3) ready cannot toggle during specific phases.',
      'VIOLATION DETECTION: Use if statements to detect violations. Example: if(valid_dropped_mid_packet) `uvm_error("PROTO", "Valid deasserted mid-packet");',
      'STATE TRACKING: Maintain FSM or flags to track protocol state (idle, packet_in_progress, waiting_for_ready, etc.).',
      'VALID PERSISTENCE: Once valid asserted, track expected duration. Error if deasserted early.',
      'DATA STABILITY: Store data value when valid asserted. If valid remains high and ready low, data must not change.',
      'READY TOGGLING: Track ready state. Error if ready toggles when protocol forbids (e.g., during ACK phase).',
      'SEVERITY: Use `uvm_error for violations. Use `uvm_warning for suspicious patterns.',
      'ERROR MESSAGES: Include detailed context in error messages: cycle count, signal values, expected vs actual.',
      'Test Case 1 - Valid Drop Mid-Packet: Start packet (valid=1), deassert valid before completion. Monitor reports error.',
      'Test Case 2 - Data Change: valid=1, ready=0, data changes. Monitor reports stability violation.',
      'Test Case 3 - Ready Toggle: ready toggles during forbidden phase. Monitor reports error.',
      'Test Case 4 - Valid Packet: Protocol followed correctly. No errors reported.',
      'Test Case 5 - Multiple Violations: Inject multiple violations in sequence. Verify all detected and reported.',
      'Test Case 6 - Edge Cases: Back-to-back packets, zero-length packets, reset during packet. Verify correct checking.'
    ],
    hints: [
      'State tracking: typedef enum {IDLE, PKT_IN_PROGRESS, WAITING_ACK} state_t; state_t state; In run_phase: always @(posedge vif.clk) case(state) IDLE: if(vif.valid) begin state = PKT_IN_PROGRESS; ... end PKT_IN_PROGRESS: if(!vif.valid) `uvm_error("PROTO", "Valid dropped mid-packet"); ... endcase',
      'Valid persistence: int pkt_length; int beat_count; if(state == PKT_IN_PROGRESS) begin if(!vif.valid) `uvm_error("PROTO", $sformatf("Valid dropped at beat %0d/%0d", beat_count, pkt_length)); beat_count++; end',
      'Data stability: bit [31:0] prev_data; if(vif.valid && !vif.ready) begin if(vif.data != prev_data) `uvm_error("PROTO", $sformatf("Data changed while valid=1 ready=0: %0h -> %0h", prev_data, vif.data)); end prev_data = vif.data;',
      'Ready toggle: bit prev_ready; if(state == WAITING_ACK) begin if(vif.ready != prev_ready) `uvm_error("PROTO", "Ready toggled during ACK phase"); end prev_ready = vif.ready;',
      'Cycle count: int cycle_count; always @(posedge vif.clk) cycle_count++; Include in error messages: `uvm_error("PROTO", $sformatf("Violation at cycle %0d", cycle_count));',
      'Complete example: task run_phase(uvm_phase phase); state_t state = IDLE; bit [31:0] saved_data; int beat_count; forever @(posedge vif.clk) begin case(state) IDLE: begin if(vif.valid) begin state = PKT_IN_PROGRESS; saved_data = vif.data; beat_count = 0; end end PKT_IN_PROGRESS: begin if(!vif.valid) begin `uvm_error("PROTO", "Valid deasserted mid-packet"); state = IDLE; end else begin if(!vif.ready && vif.data != saved_data) `uvm_error("DATA_STABLE", "Data changed during backpressure"); if(vif.ready) begin beat_count++; if(beat_count == vif.pkt_length) state = IDLE; saved_data = vif.data; end end end endcase end endtask',
      'Test: Create test sequences that inject protocol violations. Verify monitor catches all. Run valid traffic, verify no false errors. Use assertions in testbench to verify `uvm_error called.'
    ]
  }
]
};

export default designVerification;
