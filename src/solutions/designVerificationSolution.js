/**
 * designVerificationSolutions.js
 * Golden reference solutions for AI feedback comparison.
 * These are never shown directly to users.
 *
 * Usage: const sol = designVerSolutions(questionId, "systemverilog");
 */

export const designVerSolutions = (qId, language) => {
  if (language === 'systemverilog') {
    // ── Constraint Randomization ──
    if (qId === 'const1') {
      return `class array_sum_constraint extends uvm_object;
  \`uvm_object_utils(array_sum_constraint)

  rand int unsigned arr[10];

  function new(string name = "array_sum_constraint");
    super.new(name);
  endfunction

  // Each element between 0 and 100
  constraint c_bounds {
    foreach(arr[i]) arr[i] inside {[0:100]};
  }

  // Sum must be exactly 100
  constraint c_sum {
    arr[0] + arr[1] + arr[2] + arr[3] + arr[4] +
    arr[5] + arr[6] + arr[7] + arr[8] + arr[9] == 100;
  }

  function void post_randomize();
    int total = 0;
    foreach(arr[i]) total += arr[i];
    assert(total == 100) else $fatal("Sum mismatch: %0d", total);
  endfunction
endclass
`;
    }

    if (qId === 'const2') {
      return `class three_same extends uvm_object;
  \`uvm_object_utils(three_same)

  rand bit [7:0] arr[10];
  rand bit [7:0] dup_val;
  rand int unsigned dup_idx[3];

  function new(string name = "three_same");
    super.new(name);
  endfunction

  constraint c_dup_idx {
    unique {dup_idx};
    foreach(dup_idx[i]) dup_idx[i] inside {[0:9]};
  }

  constraint c_triplicate {
    foreach(arr[i]) {
      if ((i == dup_idx[0]) || (i == dup_idx[1]) || (i == dup_idx[2]))
        arr[i] == dup_val;
      else
        arr[i] != dup_val;
    }
  }

  constraint c_bounds {
    dup_val inside {[0:255]};
    foreach(arr[i]) arr[i] inside {[0:255]};
  }
endclass
`;
    }

    if (qId === 'const3') {
      return `
// Dynamic Array with Repetition Rules
class dyn_array_rep extends uvm_object;
  \`uvm_object_utils(dyn_array_rep)

  rand int unsigned arr[];
  int unsigned cnt[5];

  function new(string name = "dyn_array_rep");
    super.new(name);
  endfunction
  
  constraint c_size {
    arr.size() == 300;
  }
  
  constraint c_domain {
    foreach (arr[i]) arr[i] inside {[0:4]};
  }

  constraint c_frequency {
    cnt[0] == arr.sum() with (int'(item == 0));
    cnt[1] == arr.sum() with (int'(item == 1));
    cnt[2] == arr.sum() with (int'(item == 2));
    cnt[3] == arr.sum() with (int'(item == 3));
    cnt[4] == arr.sum() with (int'(item == 4));
    foreach (cnt[v]) cnt[v] >= 40;
  }

  constraint c_no_adjacent_repeat_for_1_to_4 {
    foreach (arr[i]) if ((i > 0) && (arr[i] inside {[1:4]})) arr[i] != arr[i-1];
  }
endclass
`;
    }

    if (qId === 'const4') {
      return `
// No Consecutive Zeros
class no_consec_zeros extends uvm_object;
  \`uvm_object_utils(no_consec_zeros)

  rand int unsigned arr[];
  int unsigned cnt[6];

  function new(string name = "no_consec_zeros");
    super.new(name);
  endfunction

  constraint c_size {
    arr.size() == 300;
  }

  constraint c_domain {
    foreach (arr[i]) arr[i] inside {[0:5]};
  }

  constraint c_frequency {
    cnt[0] == arr.sum() with (int'(item == 0));
    cnt[1] == arr.sum() with (int'(item == 1));
    cnt[2] == arr.sum() with (int'(item == 2));
    cnt[3] == arr.sum() with (int'(item == 3));
    cnt[4] == arr.sum() with (int'(item == 4));
    cnt[5] == arr.sum() with (int'(item == 5));
    foreach (cnt[v]) cnt[v] >= 40;
  }
  
  constraint c_no_consecutive_zeros {
    foreach (arr[i]) if (i > 0) !(arr[i] == 0 && arr[i-1] == 0);
  }
endclass
`;
    }

    if (qId === 'const5') {
      return `
// Even-Odd Index Constraint
class even_odd_idx extends uvm_object;
  \`uvm_object_utils(even_odd_idx)

  rand int arr[10];

  function new(string name = "even_odd_idx");
    super.new(name);
  endfunction
  
  constraint c_parity {
    foreach (arr[i]) arr[i][0] == i[0];
  }
  
  constraint c_bounds {
    foreach (arr[i]) {
      arr[i] >= -100;
      arr[i] <= 100;
    }
  }
endclass
`;
    }

    // ── Unique Constraints ──
    if (qId === 'unique1') {
      return `
// 3D Array All Unique
class unique_3d extends uvm_object;
  \`uvm_object_utils(unique_3d)

  rand bit [7:0] cube[3][3][3]; // 27 elements

  function new(string name = "unique_3d");
    super.new(name);
  endfunction
  
  constraint c_all_unique {
    unique {cube[0][0][0], cube[0][0][1], cube[0][0][2],
            cube[0][1][0], cube[0][1][1], cube[0][1][2],
            cube[0][2][0], cube[0][2][1], cube[0][2][2],
            cube[1][0][0], cube[1][0][1], cube[1][0][2],
            cube[1][1][0], cube[1][1][1], cube[1][1][2],
            cube[1][2][0], cube[1][2][1], cube[1][2][2],
            cube[2][0][0], cube[2][0][1], cube[2][0][2],
            cube[2][1][0], cube[2][1][1], cube[2][1][2],
            cube[2][2][0], cube[2][2][1], cube[2][2][2]};
  }
  
  constraint c_bounds {
    foreach (cube[i,j,k]) cube[i][j][k] inside {[0:255]};
  }
endclass
`;
    }

    if (qId === 'unique2') {
      return `
// Partition one input queue into three output queues
class three_queues extends uvm_object;
  \`uvm_object_utils(three_queues)

  int unsigned q_in[$];
  int unsigned q_out[3][$];
  rand int unsigned owner[];

  function new(string name = "three_queues");
    super.new(name);
  endfunction

  function void set_input(const ref int unsigned values[$]);
    q_in = values;
    owner = new[q_in.size()];
  endfunction
  
  constraint c_owner_size {
    owner.size() == q_in.size();
    foreach (owner[i]) owner[i] inside {[0:2]};
  }

  function void post_randomize();
    foreach (q_out[k]) q_out[k].delete();
    foreach (owner[i]) q_out[owner[i]].push_back(q_in[i]);
  endfunction

  function bit check_partition();
    int unsigned merged[$];
    foreach (q_out[k]) foreach (q_out[k][i]) merged.push_back(q_out[k][i]);
    return merged.size() == q_in.size();
  }
endclass
`;
    }

    if (qId === 'unique3') {
      return `
// Map to N Non-Empty Queues
class map_to_queues extends uvm_object;
  \`uvm_object_utils(map_to_queues)

  parameter int N = 4;
  localparam int M = 12;

  int unsigned values[M];
  int unsigned out_q[N][$];
  rand int unsigned assign_q[M];
  int unsigned queue_count[N];

  function new(string name = "map_to_queues");
    super.new(name);
  endfunction
  
  constraint c_bounds {
    foreach (values[i]) values[i] inside {[1:50]};
    foreach (assign_q[i]) assign_q[i] inside {[0:N-1]};
  }
  
  constraint c_all_queues_nonempty {
    foreach (queue_count[k]) {
      queue_count[k] == assign_q.sum() with (int'(item == k));
      queue_count[k] >= 1;
    }
  }

  function void post_randomize();
    foreach (out_q[k]) out_q[k].delete();
    foreach (assign_q[i]) out_q[assign_q[i]].push_back(values[i]);
  endfunction

  function bit is_feasible();
    return N <= M;
  }
endclass
`;
    }

    if (qId === 'unique4') {
      return `
// Two Arrays with Sorted Relationship
class sorted_relationship extends uvm_object;
  \`uvm_object_utils(sorted_relationship)

  rand int unsigned array1[];
  rand int unsigned array2[];
  rand int unsigned pick_idx[];

  function new(string name = "sorted_relationship");
    super.new(name);
  endfunction

  constraint c_size {
    array1.size() inside {[6:9]};
    array2.size() == array1.size();
    pick_idx.size() == array2.size();
  }
  
  constraint c_sorted_array1 {
    foreach (array1[i]) if (i > 0) array1[i] >= array1[i-1];
  }
  
  constraint c_membership {
    foreach (pick_idx[i]) {
      pick_idx[i] inside {[0:array1.size()-1]};
      array2[i] == array1[pick_idx[i]];
    }
  }
  
  constraint c_bounds {
    foreach (array1[i]) array1[i] inside {[0:100]};
    foreach (array2[i]) array2[i] inside {[0:100]};
  }
endclass
`;
    }

    // ── Probability Constraints ──
    if (qId === 'prob1') {
      return `
// Conditional Probability Constraint
class cond_prob extends uvm_object;
  rand bit [7:0] data;
  rand bit mode;
  
  constraint c_mode_dist {
    mode dist {0 := 70, 1 := 30};
  }
  
  constraint c_data_by_mode {
    if (mode == 0) data inside {[0:127]};
    else           data inside {[128:255]};
  }
endclass
`;
    }

    if (qId === 'prob2') {
      return `
// 5% Probability for Lower Bits Same
class lower_bits_prob extends uvm_object;
  rand bit [15:0] data;
  rand bit lower_same;
  
  constraint c_lower_same_dist {
    lower_same dist {1 := 5, 0 := 95};
  }
  
  constraint c_apply {
    if (lower_same) data[3:0] == data[7:4];
  }
endclass
`;
    }

    if (qId === 'prob3') {
      return `
// Uniform Distribution by Bit Count
class uniform_bitcount extends uvm_object;
  rand bit [7:0] data;
  rand int unsigned target_ones;
  
  constraint c_target_dist {
    target_ones inside {[0:8]};
    // uniform across possible popcount values
  }
  
  constraint c_popcount {
    $countones(data) == target_ones;
  }
endclass
`;
    }

    if (qId === 'prob4') {
      return `
// 5 Bits Set with Consecutive Probability
class five_bits_consec extends uvm_object;
  rand bit [15:0] data;
  rand bit consecutive;
  
  constraint c_five_bits {
    $countones(data) == 5;
  }
  
  constraint c_consec_dist {
    consecutive dist {1 := 30, 0 := 70};
  }
  
  constraint c_apply_consec {
    if (consecutive) {
      // 5 consecutive bits set somewhere
      (data & 16'h001F) == 16'h001F ||
      (data & 16'h003E) == 16'h003E ||
      (data & 16'h007C) == 16'h007C ||
      (data & 16'h00F8) == 16'h00F8 ||
      (data & 16'h01F0) == 16'h01F0 ||
      (data & 16'h03E0) == 16'h03E0 ||
      (data & 16'h07C0) == 16'h07C0 ||
      (data & 16'h0F80) == 16'h0F80 ||
      (data & 16'h1F00) == 16'h1F00 ||
      (data & 16'h3E00) == 16'h3E00 ||
      (data & 16'h7C00) == 16'h7C00 ||
      (data & 16'hF800) == 16'hF800;
    }
  }
endclass
`;
    }

    if (qId === 'prob5') {
      return `
// Exactly 5 Consecutive Bits Set
class five_consecutive extends uvm_object;
  rand bit [15:0] data;
  rand int unsigned start_pos;
  
  constraint c_start {
    start_pos inside {[0:11]}; // 16 - 5 = 11
  }
  
  constraint c_consecutive {
    // set exactly bits [start_pos +: 5]
    foreach (data[i]) {
      if (i >= start_pos && i < start_pos + 5)
        data[i] == 1'b1;
      else
        data[i] == 1'b0;
    }
  }
endclass
`;
    }

    // ── Matrix Constraints ──
    if (qId === 'matrix1') {
      return `
// Binary Matrix with Sum Constraint
class binary_matrix_sum extends uvm_object;
  rand bit matrix[4][4];
  
  constraint c_row_sums {
    foreach (matrix[i,]) {
      matrix[i][0] + matrix[i][1] + matrix[i][2] + matrix[i][3] == 2;
    }
  }
  
  constraint c_col_sums {
    matrix[0][0] + matrix[1][0] + matrix[2][0] + matrix[3][0] == 2;
    matrix[0][1] + matrix[1][1] + matrix[2][1] + matrix[3][1] == 2;
    matrix[0][2] + matrix[1][2] + matrix[2][2] + matrix[3][2] == 2;
    matrix[0][3] + matrix[1][3] + matrix[2][3] + matrix[3][3] == 2;
  }
endclass
`;
    }

    if (qId === 'matrix2') {
      return `
// Adjacent Elements Distinct
class adj_distinct extends uvm_object;
  rand bit [3:0] matrix[4][4];
  
  constraint c_adj_horiz {
    foreach (matrix[i,j]) {
      if (j > 0) matrix[i][j] != matrix[i][j-1];
    }
  }
  
  constraint c_adj_vert {
    foreach (matrix[i,j]) {
      if (i > 0) matrix[i][j] != matrix[i-1][j];
    }
  }
  
  constraint c_bounds {
    foreach (matrix[i,j]) matrix[i][j] inside {[1:8]};
  }
endclass
`;
    }

    if (qId === 'matrix3') {
      return `
// Unique Row Maximums
class unique_row_max extends uvm_object;
  rand bit [7:0] matrix[4][4];
  rand bit [7:0] row_max[4];
  
  constraint c_bounds {
    foreach (matrix[i,j]) matrix[i][j] inside {[1:50]};
  }
  
  constraint c_row_max_val {
    foreach (row_max[i]) {
      row_max[i] >= matrix[i][0];
      row_max[i] >= matrix[i][1];
      row_max[i] >= matrix[i][2];
      row_max[i] >= matrix[i][3];
      row_max[i] == matrix[i][0] || row_max[i] == matrix[i][1] ||
      row_max[i] == matrix[i][2] || row_max[i] == matrix[i][3];
    }
  }
  
  constraint c_unique_max {
    unique {row_max};
  }
endclass
`;
    }

    if (qId === 'matrix4') {
      return `
// Sub-Square Maximum Constraint
class sub_square_max extends uvm_object;
  rand bit [7:0] matrix[4][4];
  
  constraint c_bounds {
    foreach (matrix[i,j]) matrix[i][j] inside {[1:50]};
  }
  
  // Every 2x2 sub-square has max <= 30
  constraint c_sub_square {
    foreach (matrix[i,j]) {
      if (i < 3 && j < 3) {
        matrix[i][j] <= 30;
        matrix[i][j+1] <= 30;
        matrix[i+1][j] <= 30;
        matrix[i+1][j+1] <= 30;
      }
    }
  }
endclass
`;
    }

    if (qId === 'matrix5') {
      return `
// Matrix 90° Rotation
class matrix_rotation extends uvm_object;
  rand bit [7:0] original[4][4];
  rand bit [7:0] rotated[4][4];
  
  constraint c_bounds {
    foreach (original[i,j]) original[i][j] inside {[1:100]};
  }
  
  // rotated[j][N-1-i] = original[i][j] for 90° clockwise
  constraint c_rotate {
    foreach (original[i,j]) {
      rotated[j][3-i] == original[i][j];
    }
  }
endclass
`;
    }

    // ── Bit Manipulation Constraints ──
    if (qId === 'bit1') {
      return `
// Grouped 1s in Binary (all 1s contiguous)
class grouped_ones extends uvm_object;
  rand bit [15:0] data;
  rand int unsigned start_bit, num_ones;
  
  constraint c_ones_range {
    num_ones inside {[1:16]};
    start_bit inside {[0:15]};
    start_bit + num_ones <= 16;
  }
  
  constraint c_grouped {
    foreach (data[i]) {
      if (i >= start_bit && i < start_bit + num_ones)
        data[i] == 1'b1;
      else
        data[i] == 1'b0;
    }
  }
endclass
`;
    }

    if (qId === 'bit2') {
      return `
// 5 Non-Adjacent Set Bits
class non_adj_bits extends uvm_object;
  rand bit [15:0] data;
  
  constraint c_five_bits {
    $countones(data) == 5;
  }
  
  constraint c_non_adjacent {
    foreach (data[i]) {
      if (i > 0) !(data[i] && data[i-1]);
    }
  }
endclass
`;
    }

    if (qId === 'bit3') {
      return `
// Equal 1s and 0s
class equal_ones_zeros extends uvm_object;
  rand bit [15:0] data;
  
  constraint c_equal {
    $countones(data) == 8; // 16 bits, half 1s half 0s
  }
endclass
`;
    }

    if (qId === 'bit4') {
      return `
// Power of 4
class power_of_four extends uvm_object;
  rand bit [31:0] data;
  
  constraint c_power_of_4 {
    $countones(data) == 1;               // power of 2
    $countones(data & 32'h55555555) == 1; // bit in even position = power of 4
    data != 0;
  }
endclass
`;
    }

    // ── History Constraints ──
    if (qId === 'hist1') {
      return `
// Last 4 Values Unique
class last4_unique extends uvm_object;
  rand bit [7:0] value;
  bit [7:0] history[$];
  
  constraint c_bounds {
    value inside {[0:31]};
  }
  
  constraint c_not_in_history {
    if (history.size() >= 1) value != history[history.size()-1];
    if (history.size() >= 2) value != history[history.size()-2];
    if (history.size() >= 3) value != history[history.size()-3];
    if (history.size() >= 4) value != history[history.size()-4];
  }
  
  function void post_randomize();
    history.push_back(value);
    if (history.size() > 4) history.pop_front();
  endfunction
endclass
`;
    }

    if (qId === 'hist2') {
      return `
// No Repeat in Next 3 Draws
class no_repeat_3 extends uvm_object;
  rand bit [7:0] draw;
  bit [7:0] prev_draws[$];
  
  constraint c_bounds {
    draw inside {[0:15]};
  }
  
  constraint c_no_repeat {
    foreach (prev_draws[i]) {
      if (i >= prev_draws.size() - 3) draw != prev_draws[i];
    }
  }
  
  function void post_randomize();
    prev_draws.push_back(draw);
  endfunction
endclass
`;
    }

    // ── Classic Puzzle Constraints ──
    if (qId === 'classic1') {
      return `
// Sudoku Puzzle Constraints
class sudoku extends uvm_object;
  rand bit [3:0] grid[9][9]; // values 1-9
  
  constraint c_range {
    foreach (grid[i,j]) grid[i][j] inside {[1:9]};
  }
  
  // Row uniqueness
  constraint c_rows {
    foreach (grid[i,]) {
      unique {grid[i][0], grid[i][1], grid[i][2], grid[i][3],
              grid[i][4], grid[i][5], grid[i][6], grid[i][7], grid[i][8]};
    }
  }
  
  // Column uniqueness
  constraint c_cols {
    foreach (grid[,j]) {
      unique {grid[0][j], grid[1][j], grid[2][j], grid[3][j],
              grid[4][j], grid[5][j], grid[6][j], grid[7][j], grid[8][j]};
    }
  }
  
  // 3x3 box uniqueness (iterate over 9 boxes)
  constraint c_boxes {
    foreach (grid[i,j]) {
      if (i % 3 == 0 && j % 3 == 0) {
        unique {grid[i][j],     grid[i][j+1],   grid[i][j+2],
                grid[i+1][j],   grid[i+1][j+1], grid[i+1][j+2],
                grid[i+2][j],   grid[i+2][j+1], grid[i+2][j+2]};
      }
    }
  }
endclass
`;
    }

    if (qId === 'classic2') {
      return `
// 8 Queens Problem
class eight_queens extends uvm_object;
  rand int unsigned col[8]; // col[row] = column position of queen in that row
  
  constraint c_range {
    foreach (col[i]) col[i] inside {[0:7]};
  }
  
  constraint c_unique_cols {
    unique {col};
  }
  
  constraint c_diagonals {
    foreach (col[i]) {
      foreach (col[j]) {
        if (i < j) {
          (col[i] - col[j]) != (i - j);
          (col[i] - col[j]) != (j - i);
        }
      }
    }
  }
endclass
`;
    }

    if (qId === 'classic3') {
      return `
// Knight's Tour / Latin Square (context-dependent)
class latin_square extends uvm_object;
  rand bit [3:0] grid[5][5]; // 5x5 latin square
  
  constraint c_range {
    foreach (grid[i,j]) grid[i][j] inside {[1:5]};
  }
  
  constraint c_rows {
    foreach (grid[i,]) {
      unique {grid[i][0], grid[i][1], grid[i][2], grid[i][3], grid[i][4]};
    }
  }
  
  constraint c_cols {
    foreach (grid[,j]) {
      unique {grid[0][j], grid[1][j], grid[2][j], grid[3][j], grid[4][j]};
    }
  }
endclass
`;
    }

    if (qId === 'classic4') {
      return `
// Magic Square
class magic_square extends uvm_object;
  rand bit [7:0] grid[3][3];
  rand bit [7:0] magic_sum;
  
  constraint c_unique_vals {
    unique {grid[0][0], grid[0][1], grid[0][2],
            grid[1][0], grid[1][1], grid[1][2],
            grid[2][0], grid[2][1], grid[2][2]};
  }
  
  constraint c_range {
    foreach (grid[i,j]) grid[i][j] inside {[1:9]};
  }
  
  // All rows sum to magic_sum
  constraint c_row_sum {
    foreach (grid[i,]) {
      grid[i][0] + grid[i][1] + grid[i][2] == magic_sum;
    }
  }
  
  // All cols sum to magic_sum
  constraint c_col_sum {
    grid[0][0] + grid[1][0] + grid[2][0] == magic_sum;
    grid[0][1] + grid[1][1] + grid[2][1] == magic_sum;
    grid[0][2] + grid[1][2] + grid[2][2] == magic_sum;
  }
  
  // Diagonals
  constraint c_diag {
    grid[0][0] + grid[1][1] + grid[2][2] == magic_sum;
    grid[0][2] + grid[1][1] + grid[2][0] == magic_sum;
  }
endclass
`;
    }

    // ── Pipeline Constraints ──
    if (qId === 'pipe1') {
      return `
// Instruction Repetition Constraints
class instr_rep extends uvm_object;
  rand bit [3:0] opcode[10]; // 10 instructions
  
  constraint c_range {
    foreach (opcode[i]) opcode[i] inside {[0:7]}; // 8 opcodes
  }
  
  // Same opcode cannot appear more than 3 times consecutively
  constraint c_no_3_consec {
    foreach (opcode[i]) {
      if (i >= 2) !(opcode[i] == opcode[i-1] && opcode[i] == opcode[i-2]);
    }
  }
endclass
`;
    }

    if (qId === 'pipe2') {
      return `
// No Overlapping Instructions (RAW hazard model)
class no_overlap extends uvm_object;
  rand bit [2:0] rd[8];  // destination register
  rand bit [2:0] rs1[8]; // source register 1
  rand bit [2:0] rs2[8]; // source register 2
  
  constraint c_range {
    foreach (rd[i])  rd[i]  inside {[0:7]};
    foreach (rs1[i]) rs1[i] inside {[0:7]};
    foreach (rs2[i]) rs2[i] inside {[0:7]};
  }
  
  // No RAW: instruction i+1 sources != instruction i destination
  constraint c_no_raw {
    foreach (rd[i]) {
      if (i < 7) {
        rs1[i+1] != rd[i];
        rs2[i+1] != rd[i];
      }
    }
  }
endclass
`;
    }

    if (qId === 'pipe3') {
      return `
// Achieve Without Constraints (post_randomize approach)
class achieve_post extends uvm_object;
  rand bit [7:0] data;
  bit [7:0] transformed;
  
  function void post_randomize();
    // Gray code encoding
    transformed = data ^ (data >> 1);
  endfunction
endclass
`;
    }

    // ── Game Constraints ──
    if (qId === 'game1') {
      return `
// Tic-Tac-Toe Constraints
class tictactoe extends uvm_object;
  rand bit [1:0] board[3][3]; // 0=empty, 1=X, 2=O
  
  constraint c_valid_values {
    foreach (board[i,j]) board[i][j] inside {[0:2]};
  }
  
  // X and O differ by at most 1 (X goes first)
  constraint c_turn_order {
    board[0][0] + board[0][1] + board[0][2] +
    board[1][0] + board[1][1] + board[1][2] +
    board[2][0] + board[2][1] + board[2][2] > 0; // not empty
  }
  
  // Count constraint approach
  function void post_randomize();
    int x_count = 0, o_count = 0;
    foreach (board[i,j]) begin
      if (board[i][j] == 1) x_count++;
      if (board[i][j] == 2) o_count++;
    end
    assert(x_count == o_count || x_count == o_count + 1);
  endfunction
endclass
`;
    }

    if (qId === 'game2') {
      return `
// Two Matrices Unique Minimums
class unique_minimums extends uvm_object;
  rand bit [7:0] m1[3][3];
  rand bit [7:0] m2[3][3];
  rand bit [7:0] min1, min2;
  
  constraint c_bounds {
    foreach (m1[i,j]) m1[i][j] inside {[1:50]};
    foreach (m2[i,j]) m2[i][j] inside {[1:50]};
  }
  
  constraint c_min1 {
    foreach (m1[i,j]) min1 <= m1[i][j];
    min1 == m1[0][0] || min1 == m1[0][1] || min1 == m1[0][2] ||
    min1 == m1[1][0] || min1 == m1[1][1] || min1 == m1[1][2] ||
    min1 == m1[2][0] || min1 == m1[2][1] || min1 == m1[2][2];
  }
  
  constraint c_min2 {
    foreach (m2[i,j]) min2 <= m2[i][j];
    min2 == m2[0][0] || min2 == m2[0][1] || min2 == m2[0][2] ||
    min2 == m2[1][0] || min2 == m2[1][1] || min2 == m2[1][2] ||
    min2 == m2[2][0] || min2 == m2[2][1] || min2 == m2[2][2];
  }
  
  constraint c_unique_mins {
    min1 != min2;
  }
endclass
`;
    }

    // ── Miscellaneous Constraints ──
    if (qId === 'misc1') {
      return `
// Fixed Index Value
class fixed_index extends uvm_object;
  rand int unsigned arr[8];
  
  constraint c_bounds {
    foreach (arr[i]) arr[i] inside {[0:100]};
  }
  
  // arr[3] must always be 42
  constraint c_fixed {
    arr[3] == 42;
  }
endclass
`;
    }

    if (qId === 'misc2') {
      return `
// Queue with Size-Based Range
class queue_size_range extends uvm_object;
  rand int unsigned q[$];
  
  constraint c_size {
    q.size() inside {[3:10]};
  }
  
  constraint c_val_range {
    foreach (q[i]) q[i] inside {[0 : q.size() * 10]};
  }
  
  constraint c_sorted {
    foreach (q[i]) {
      if (i > 0) q[i] >= q[i-1];
    }
  }
endclass
`;
    }

    // ── SystemVerilog Assertions (SVA) ──
    if (qId === 'assert1') {
      return `
// Signal High When Valid
module assert_valid_data;
  property p_data_when_valid;
    @(posedge clk) disable iff (rst)
    valid |-> data;
  endproperty
  
  a_data_when_valid: assert property (p_data_when_valid)
    else $error("FAIL: data not high when valid asserted");
endmodule
`;
    }

    if (qId === 'assert2') {
      return `
// Data Stable for One Cycle
module assert_data_stable;
  property p_data_stable;
    @(posedge clk) disable iff (rst)
    valid |=> $stable(data);
  endproperty
  
  a_data_stable: assert property (p_data_stable)
    else $error("FAIL: data changed one cycle after valid");
endmodule
`;
    }

    if (qId === 'assert3') {
      return `
// Count Zero on Reset
module assert_count_reset;
  property p_count_zero_on_reset;
    @(posedge clk)
    rst |-> (count == '0);
  endproperty
  
  a_count_reset: assert property (p_count_zero_on_reset)
    else $error("FAIL: count not zero during reset");
endmodule
`;
    }

    if (qId === 'assert4') {
      return `
// Detect Rising Edge
module assert_rising_edge;
  // Rising edge of sig should trigger ack within 1 to 3 cycles
  property p_rising_edge_fixed;
    @(posedge clk) disable iff (rst)
    $rose(sig) |-> ##[1:3] ack;
  endproperty
  
  a_rising: assert property (p_rising_edge_fixed)
    else $error("FAIL: ack not within 1-3 cycles after sig rising edge");
endmodule
`;
    }

    if (qId === 'assert5') {
      return `
// Output Equals Sum
module assert_sum;
  property p_sum;
    @(posedge clk) disable iff (rst)
    valid |-> (out == (a + b));
  endproperty
  
  a_sum: assert property (p_sum)
    else $error("FAIL: out != a + b when valid");
endmodule
`;
    }

    if (qId === 'assert6') {
      return `
// Signal Always High (during operation)
module assert_always_high;
  property p_always_high;
    @(posedge clk) disable iff (rst)
    en |-> sig_out;
  endproperty
  
  a_always_high: assert property (p_always_high)
    else $error("FAIL: sig_out not high while en asserted");
endmodule
`;
    }

    if (qId === 'assert7') {
      return `
// Event Within 5 Cycles
module assert_within_5;
  property p_req_ack;
    @(posedge clk) disable iff (rst)
    req |-> ##[1:5] ack;
  endproperty
  
  a_req_ack: assert property (p_req_ack)
    else $error("FAIL: ack not received within 5 cycles of req");
endmodule
`;
    }

    if (qId === 'assert8') {
      return `
// High for 3 Consecutive Cycles
module assert_3_consec;
  property p_high_3;
    @(posedge clk) disable iff (rst)
    $rose(sig) |-> sig [*3];
  endproperty
  
  a_high_3: assert property (p_high_3)
    else $error("FAIL: sig not high for 3 consecutive cycles after rising");
endmodule
`;
    }

    if (qId === 'assert9') {
      return `
// Counter Zero After Reset
module assert_counter_reset;
  property p_counter_after_reset;
    @(posedge clk)
    $fell(rst_n) |=> (counter == 0);
  endproperty
  
  a_counter_reset: assert property (p_counter_after_reset)
    else $error("FAIL: counter not zero after reset deasserted");
endmodule
`;
    }

    if (qId === 'assert10') {
      return `
// No Signal Overlap
module assert_no_overlap;
  property p_no_overlap;
    @(posedge clk) disable iff (rst)
    !(sig_a && sig_b);
  endproperty
  
  a_no_overlap: assert property (p_no_overlap)
    else $error("FAIL: sig_a and sig_b asserted simultaneously");
endmodule
`;
    }

    if (qId === 'assert11') {
      return `
// Event Precedence by 10 Cycles
module assert_precedence;
  property p_a_before_b;
    @(posedge clk) disable iff (rst)
    $rose(event_a) |-> ##[1:10] event_b;
  endproperty
  
  a_precedence: assert property (p_a_before_b)
    else $error("FAIL: event_b not within 10 cycles after event_a");
endmodule
`;
    }

    if (qId === 'assert12') {
      return `
// Signal Toggles Every 4 Cycles
module assert_toggle_4_fixed;
  property p_toggle_fixed;
    @(posedge clk) disable iff (rst)
    $rose(sig) |-> sig[*4] ##1 !sig[*4];
  endproperty
  
  a_toggle: assert property (p_toggle_fixed)
    else $error("FAIL: sig not toggling every 4 cycles");
endmodule
`;
    }

    if (qId === 'assert13') {
      return `
// Rising Then Falling Edge
module assert_rise_fall;
  property p_rise_then_fall;
    @(posedge clk) disable iff (rst)
    $rose(sig) |-> ##[1:10] $fell(sig);
  endproperty
  
  a_rise_fall: assert property (p_rise_then_fall)
    else $error("FAIL: no falling edge within 10 cycles of rising edge");
endmodule
`;
    }

    if (qId === 'assert14') {
      return `
// Data Consistent After Enable
module assert_data_after_en;
  property p_data_consistent;
    @(posedge clk) disable iff (rst)
    $rose(enable) |=> $stable(data) [*3];
  endproperty
  
  a_data_consistent: assert property (p_data_consistent)
    else $error("FAIL: data not stable for 3 cycles after enable rose");
endmodule
`;
    }

    if (qId === 'assert15') {
      return `
// Event A Must Happen Before B After Start
module assert_a_before_b_fixed;
  // Correct property: B must not occur before A after start
  property p_a_before_b_fixed;
    @(posedge clk) disable iff (rst)
    $rose(start) |-> (!event_b until event_a);
  endproperty

  a_order: assert property (p_a_before_b_fixed)
    else $error("FAIL: event_b occurred before event_a after start");
endmodule
`;
    }

    if (qId === 'assert16') {
      return `
// FSM State Transition Coverage
module assert_fsm_coverage;
  // Assertion: only valid transitions
  property p_valid_transition;
    @(posedge clk) disable iff (rst)
    (state == IDLE)  |=> (state inside {IDLE, ACTIVE});
  endproperty
  
  property p_active_transition;
    @(posedge clk) disable iff (rst)
    (state == ACTIVE) |=> (state inside {ACTIVE, DONE, ERROR});
  endproperty
  
  property p_done_transition;
    @(posedge clk) disable iff (rst)
    (state == DONE)   |=> (state inside {DONE, IDLE});
  endproperty
  
  a_idle:   assert property (p_valid_transition);
  a_active: assert property (p_active_transition);
  a_done:   assert property (p_done_transition);
  
  // Coverage
  covergroup cg_fsm @(posedge clk);
    cp_state: coverpoint state {
      bins idle   = {IDLE};
      bins active = {ACTIVE};
      bins done   = {DONE};
      bins error  = {ERROR};
    }
    cp_transitions: coverpoint state {
      bins idle_to_active   = (IDLE   => ACTIVE);
      bins active_to_done   = (ACTIVE => DONE);
      bins active_to_error  = (ACTIVE => ERROR);
      bins done_to_idle     = (DONE   => IDLE);
    }
  endgroup
endmodule
`;
    }

    if (qId === 'assert17') {
      return `
// Signal Within Range
module assert_range;
  property p_in_range;
    @(posedge clk) disable iff (rst)
    valid |-> (data >= MIN_VAL && data <= MAX_VAL);
  endproperty
  
  a_range: assert property (p_in_range)
    else $error("FAIL: data=%0d not in range [%0d:%0d]", data, MIN_VAL, MAX_VAL);
endmodule
`;
    }

    if (qId === 'assert18') {
      return `
// Array Index Valid Range
module assert_index_range;
  property p_valid_index;
    @(posedge clk) disable iff (rst)
    rd_en |-> (addr < DEPTH);
  endproperty
  
  a_valid_index: assert property (p_valid_index)
    else $error("FAIL: addr=%0d exceeds DEPTH=%0d", addr, DEPTH);
endmodule
`;
    }

    if (qId === 'assert19') {
      return `
// Protocol Event Sequence Coverage
module assert_protocol_seq;
  // REQ -> GNT -> DATA -> ACK sequence
  sequence s_protocol;
    req ##[1:3] gnt ##1 data_valid ##[1:2] ack;
  endsequence
  
  property p_protocol;
    @(posedge clk) disable iff (rst)
    req |-> s_protocol;
  endproperty
  
  a_protocol: assert property (p_protocol);
  c_protocol: cover property (p_protocol);
  
  covergroup cg_protocol @(posedge clk);
    cp_req_to_gnt: coverpoint (req && !gnt) {
      bins wait_1 = {1} iff ($past(req, 1) && !$past(gnt, 1));
    }
  endgroup
endmodule
`;
    }

    if (qId === 'assert20') {
      return `
// Signal Pattern Match
module assert_pattern;
  sequence s_pattern;
    sig == 1 ##1 sig == 0 ##1 sig == 1 ##1 sig == 1;
  endsequence
  
  property p_pattern_detect;
    @(posedge clk) disable iff (rst)
    s_pattern |-> ##1 detected;
  endproperty
  
  a_pattern: assert property (p_pattern_detect)
    else $error("FAIL: detected not asserted after pattern 1011");
  
  c_pattern: cover property (s_pattern);
endmodule
`;
    }

    if (qId === 'assert21') {
      return `
// Bus Protocol Address Alignment
module assert_addr_align;
  property p_aligned;
    @(posedge clk) disable iff (rst)
    valid |-> (addr % ALIGN == 0);
  endproperty
  
  property p_aligned_4byte;
    @(posedge clk) disable iff (rst)
    (valid && size == 2'b10) |-> (addr[1:0] == 2'b00);  // 4-byte aligned
  endproperty
  
  property p_aligned_2byte;
    @(posedge clk) disable iff (rst)
    (valid && size == 2'b01) |-> (addr[0] == 1'b0);      // 2-byte aligned
  endproperty
  
  a_align4: assert property (p_aligned_4byte);
  a_align2: assert property (p_aligned_2byte);
endmodule
`;
    }

    if (qId === 'assert22') {
      return `
// Transaction Data Validity
module assert_txn_valid;
  property p_txn_data;
    @(posedge clk) disable iff (rst)
    txn_valid |-> !$isunknown(txn_data) && !$isunknown(txn_addr);
  endproperty
  
  property p_txn_response;
    @(posedge clk) disable iff (rst)
    txn_valid |-> ##[1:10] txn_done;
  endproperty
  
  a_data_valid: assert property (p_txn_data);
  a_response:   assert property (p_txn_response);
endmodule
`;
    }

    if (qId === 'assert23') {
      return `
// UVM Assertion Coverage Integration
class assert_cov_subscriber extends uvm_subscriber #(my_transaction);
  covergroup cg_txn with function sample(my_transaction t);
    cp_addr: coverpoint t.addr {
      bins low  = {[0:63]};
      bins mid  = {[64:191]};
      bins high = {[192:255]};
    }
    cp_data: coverpoint t.data {
      bins zero  = {0};
      bins small = {[1:127]};
      bins large = {[128:255]};
    }
    cross cp_addr, cp_data;
  endgroup
  
  function new(string name, uvm_component parent);
    super.new(name, parent);
    cg_txn = new();
  endfunction
  
  function void write(my_transaction t);
    cg_txn.sample(t);
    // inline assertion checks
    assert(t.addr < 256) else \`uvm_error("COV", "addr out of range")
    assert(!$isunknown(t.data)) else \`uvm_error("COV", "data is X")
  endfunction
endclass
`;
    }

    if (qId === 'assert24') {
      return `
// UVM RAL Register Access
class ral_reg_test extends uvm_reg_sequence;
  my_reg_block reg_model;
  
  task body();
    uvm_status_e status;
    uvm_reg_data_t rdata;
    
    // Write and readback
    reg_model.ctrl_reg.write(status, 32'hDEAD_BEEF, UVM_FRONTDOOR);
    assert(status == UVM_IS_OK) else \`uvm_error("RAL", "Write failed")
    
    reg_model.ctrl_reg.read(status, rdata, UVM_FRONTDOOR);
    assert(status == UVM_IS_OK) else \`uvm_error("RAL", "Read failed")
    assert(rdata == 32'hDEAD_BEEF) else
      \`uvm_error("RAL", $sformatf("Readback mismatch: exp=0xDEADBEEF got=0x%0h", rdata))
    
    // Mirror check
    reg_model.ctrl_reg.mirror(status, UVM_CHECK);
    assert(status == UVM_IS_OK) else \`uvm_error("RAL", "Mirror check failed")
  endtask
endclass
`;
    }

    if (qId === 'assert25') {
      return `
// Driver-Monitor Communication
class driver_monitor_check extends uvm_scoreboard;
  uvm_analysis_imp #(my_transaction, driver_monitor_check) drv_imp;
  uvm_analysis_imp #(my_transaction, driver_monitor_check) mon_imp;
  
  my_transaction drv_q[$];
  my_transaction mon_q[$];
  
  function void write_drv(my_transaction t);
    drv_q.push_back(t);
    check_match();
  endfunction
  
  function void write_mon(my_transaction t);
    mon_q.push_back(t);
    check_match();
  endfunction
  
  function void check_match();
    while (drv_q.size() > 0 && mon_q.size() > 0) begin
      my_transaction d = drv_q.pop_front();
      my_transaction m = mon_q.pop_front();
      assert(d.compare(m)) else
        \`uvm_error("SCB", $sformatf("Driver/Monitor mismatch: drv=%s mon=%s",
                   d.sprint(), m.sprint()))
    end
  endfunction
endclass
`;
    }

    if (qId === 'assert26') {
      return `
// FIFO Full and Empty Flags
module assert_fifo_flags;
  property p_full_no_write;
    @(posedge clk) disable iff (rst)
    full |-> !wr_en || overflow;
  endproperty
  
  property p_empty_no_read;
    @(posedge clk) disable iff (rst)
    empty |-> !rd_en || underflow;
  endproperty
  
  property p_count_range;
    @(posedge clk) disable iff (rst)
    count >= 0 && count <= DEPTH;
  endproperty
  
  property p_full_at_depth;
    @(posedge clk) disable iff (rst)
    (count == DEPTH) |-> full;
  endproperty
  
  property p_empty_at_zero;
    @(posedge clk) disable iff (rst)
    (count == 0) |-> empty;
  endproperty
  
  a_full:      assert property (p_full_no_write);
  a_empty:     assert property (p_empty_no_read);
  a_range:     assert property (p_count_range);
  a_full_cnt:  assert property (p_full_at_depth);
  a_empty_cnt: assert property (p_empty_at_zero);
endmodule
`;
    }

    if (qId === 'assert27') {
      return `
// Arbiter Fair Granting
module assert_fair_arbiter;
  property p_req_eventually_granted(req_bit, gnt_bit);
    @(posedge clk) disable iff (rst)
    req_bit |-> ##[1:MAX_LATENCY] gnt_bit;
  endproperty
  
  property p_mutual_exclusive_grant;
    @(posedge clk) disable iff (rst)
    $onehot0(grant); // at most one grant active
  endproperty
  
  a_req0: assert property (p_req_eventually_granted(req[0], grant[0]));
  a_req1: assert property (p_req_eventually_granted(req[1], grant[1]));
  a_req2: assert property (p_req_eventually_granted(req[2], grant[2]));
  a_mutex: assert property (p_mutual_exclusive_grant);
endmodule
`;
    }

    if (qId === 'assert28') {
      return `
// No Starvation in Arbiter
module assert_no_starvation;
  parameter MAX_WAIT = 100;
  
  genvar i;
  generate
    for (i = 0; i < NUM_PORTS; i++) begin : g_no_starve
      property p_no_starvation;
        @(posedge clk) disable iff (rst)
        req[i] |-> ##[1:MAX_WAIT] grant[i];
      endproperty
      
      a_no_starve: assert property (p_no_starvation)
        else $error("Port %0d starved: req held for >%0d cycles", i, MAX_WAIT);
    end
  endgenerate
endmodule
`;
    }

    if (qId === 'assert29') {
      return `
// Mutual Exclusion Verification
module assert_mutex;
  property p_mutex;
    @(posedge clk) disable iff (rst)
    $onehot0({lock_a, lock_b, lock_c}); // at most one lock held
  endproperty
  
  property p_lock_release;
    @(posedge clk) disable iff (rst)
    $rose(lock_a) |-> ##[1:TIMEOUT] $fell(lock_a);
  endproperty
  
  a_mutex:   assert property (p_mutex)
    else $error("FAIL: multiple locks held simultaneously");
  a_release: assert property (p_lock_release)
    else $error("FAIL: lock_a held longer than TIMEOUT cycles");
endmodule
`;
    }

    if (qId === 'assert30') {
      return `
// Ready-Valid Handshaking
module assert_ready_valid;
  // Valid must stay asserted until ready (no dropping valid)
  property p_valid_until_ready;
    @(posedge clk) disable iff (rst)
    (valid && !ready) |=> valid;
  endproperty
  
  // Data must be stable while valid and not ready
  property p_data_stable;
    @(posedge clk) disable iff (rst)
    (valid && !ready) |=> $stable(data);
  endproperty
  
  // Transfer occurs when valid && ready
  property p_handshake;
    @(posedge clk) disable iff (rst)
    valid |-> ##[0:MAX_WAIT] (valid && ready);
  endproperty
  
  a_valid_hold: assert property (p_valid_until_ready)
    else $error("FAIL: valid dropped before ready");
  a_data_stable: assert property (p_data_stable)
    else $error("FAIL: data changed while waiting for ready");
  a_handshake: assert property (p_handshake)
    else $error("FAIL: handshake not completed within MAX_WAIT");
endmodule
`;
    }

    // ── UVM Advanced Components ──
    if (qId === 'uvm_adv_1') {
      return `
// Out-of-Order Scoreboard
class ooo_scoreboard extends uvm_scoreboard;
  \`uvm_component_utils(ooo_scoreboard)
  
  uvm_analysis_imp_expected #(my_txn, ooo_scoreboard) expected_port;
  uvm_analysis_imp_actual   #(my_txn, ooo_scoreboard) actual_port;
  
  my_txn expected_q[int]; // keyed by transaction ID
  my_txn actual_q[int];
  int match_count, mismatch_count;
  
  function new(string name, uvm_component parent);
    super.new(name, parent);
    expected_port = new("expected_port", this);
    actual_port   = new("actual_port", this);
  endfunction
  
  function void write_expected(my_txn t);
    if (actual_q.exists(t.id)) begin
      compare_txn(t, actual_q[t.id]);
      actual_q.delete(t.id);
    end else begin
      expected_q[t.id] = t;
    end
  endfunction
  
  function void write_actual(my_txn t);
    if (expected_q.exists(t.id)) begin
      compare_txn(expected_q[t.id], t);
      expected_q.delete(t.id);
    end else begin
      actual_q[t.id] = t;
    end
  endfunction
  
  function void compare_txn(my_txn exp, my_txn act);
    if (exp.compare(act)) begin
      match_count++;
      \`uvm_info("SCB", $sformatf("MATCH id=%0d", exp.id), UVM_MEDIUM)
    end else begin
      mismatch_count++;
      \`uvm_error("SCB", $sformatf("MISMATCH id=%0d exp=%s act=%s",
                 exp.id, exp.sprint(), act.sprint()))
    end
  endfunction
  
  function void check_phase(uvm_phase phase);
    if (expected_q.size() > 0)
      \`uvm_error("SCB", $sformatf("%0d unmatched expected transactions", expected_q.size()))
    if (actual_q.size() > 0)
      \`uvm_error("SCB", $sformatf("%0d unmatched actual transactions", actual_q.size()))
  endfunction
endclass
`;
    }

    if (qId === 'uvm_adv_2') {
      return `
// OOO Router Scoreboard
class router_scoreboard extends uvm_scoreboard;
  \`uvm_component_utils(router_scoreboard)
  
  uvm_analysis_imp #(packet_txn, router_scoreboard) inp_port;
  uvm_analysis_imp_port #(packet_txn, router_scoreboard) out_ports[4];
  
  packet_txn pending[int]; // keyed by packet ID
  
  function void write(packet_txn t);
    pending[t.pkt_id] = t; // store input packet
  endfunction
  
  function void write_port(int port_num, packet_txn t);
    if (!pending.exists(t.pkt_id)) begin
      \`uvm_error("RTR_SCB", $sformatf("Unexpected packet id=%0d on port %0d", t.pkt_id, port_num))
      return;
    end
    
    packet_txn exp = pending[t.pkt_id];
    // Check correct output port based on routing
    assert(port_num == exp.expected_port) else
      \`uvm_error("RTR_SCB", $sformatf("Packet %0d routed to port %0d, expected %0d",
                 t.pkt_id, port_num, exp.expected_port))
    // Compare payload
    assert(t.compare(exp)) else
      \`uvm_error("RTR_SCB", $sformatf("Payload mismatch pkt %0d", t.pkt_id))
    
    pending.delete(t.pkt_id);
  endfunction
endclass
`;
    }

    if (qId === 'uvm_adv_3') {
      return `
// Framing Monitor ABCD->CAFE
class framing_monitor extends uvm_monitor;
  \`uvm_component_utils(framing_monitor)
  
  uvm_analysis_port #(frame_txn) ap;
  virtual frame_if vif;
  
  typedef enum {HUNT, SYNC} state_e;
  state_e state;
  byte unsigned buffer[$];
  
  task run_phase(uvm_phase phase);
    state = HUNT;
    forever begin
      @(posedge vif.clk);
      if (vif.data_valid) begin
        case (state)
          HUNT: begin
            buffer.push_back(vif.data);
            if (buffer.size() >= 4) begin
              // Check for ABCD marker (start of frame)
              if (buffer[$-3] == 8'hAB && buffer[$-2] == 8'hCD) begin
                state = SYNC;
                buffer = {};
              end else begin
                buffer.pop_front();
              end
            end
          end
          SYNC: begin
            buffer.push_back(vif.data);
            // Check for CAFE end marker
            if (buffer.size() >= 2 &&
                buffer[$-1] == 8'hCA && buffer[$] == 8'hFE) begin
              frame_txn t = frame_txn::type_id::create("frame");
              t.payload = new[buffer.size() - 2];
              foreach (t.payload[i]) t.payload[i] = buffer[i];
              ap.write(t);
              buffer = {};
              state = HUNT;
            end
          end
        endcase
      end
    end
  endtask
endclass
`;
    }

    if (qId === 'uvm_adv_4') {
      return `
// Split-Beat Driver
class split_beat_driver extends uvm_driver #(burst_txn);
  \`uvm_component_utils(split_beat_driver)
  
  virtual bus_if vif;
  
  task run_phase(uvm_phase phase);
    forever begin
      burst_txn txn;
      seq_item_port.get_next_item(txn);
      drive_burst(txn);
      seq_item_port.item_done();
    end
  endtask
  
  task drive_burst(burst_txn txn);
    // Drive address phase
    @(posedge vif.clk);
    vif.addr   <= txn.addr;
    vif.len    <= txn.beat_count - 1;
    vif.valid  <= 1'b1;
    
    // Wait for address accept
    @(posedge vif.clk iff vif.ready);
    vif.valid <= 1'b0;
    
    // Drive data beats
    for (int i = 0; i < txn.beat_count; i++) begin
      @(posedge vif.clk);
      vif.wdata  <= txn.data[i];
      vif.wvalid <= 1'b1;
      vif.wlast  <= (i == txn.beat_count - 1);
      @(posedge vif.clk iff vif.wready);
    end
    vif.wvalid <= 1'b0;
    vif.wlast  <= 1'b0;
  endtask
endclass
`;
    }

    if (qId === 'uvm_adv_5') {
      return `
// Split-Beat Monitor Reassembly
class split_beat_monitor extends uvm_monitor;
  \`uvm_component_utils(split_beat_monitor)
  
  uvm_analysis_port #(burst_txn) ap;
  virtual bus_if vif;
  
  task run_phase(uvm_phase phase);
    forever begin
      burst_txn txn;
      collect_burst(txn);
      ap.write(txn);
    end
  endtask
  
  task collect_burst(output burst_txn txn);
    txn = burst_txn::type_id::create("mon_txn");
    
    // Wait for address phase
    @(posedge vif.clk iff (vif.valid && vif.ready));
    txn.addr       = vif.addr;
    txn.beat_count = vif.len + 1;
    txn.data       = new[txn.beat_count];
    
    // Collect data beats
    for (int i = 0; i < txn.beat_count; i++) begin
      @(posedge vif.clk iff (vif.wvalid && vif.wready));
      txn.data[i] = vif.wdata;
      if (vif.wlast && i != txn.beat_count - 1)
        \`uvm_warning("MON", "Premature wlast")
    end
  endtask
endclass
`;
    }

    if (qId === 'uvm_adv_6') {
      return `
// Functional Coverage Subscriber
class func_cov_subscriber extends uvm_subscriber #(my_txn);
  \`uvm_component_utils(func_cov_subscriber)
  
  covergroup cg_txn with function sample(my_txn t);
    cp_opcode: coverpoint t.opcode {
      bins read  = {OP_READ};
      bins write = {OP_WRITE};
      bins rmw   = {OP_RMW};
      illegal_bins bad = default;
    }
    
    cp_size: coverpoint t.size {
      bins byte_sz = {1};
      bins half    = {2};
      bins word    = {4};
    }
    
    cp_addr: coverpoint t.addr[7:0] {
      bins low   = {[0:63]};
      bins mid   = {[64:191]};
      bins high  = {[192:255]};
    }
    
    cx_op_size: cross cp_opcode, cp_size;
    cx_op_addr: cross cp_opcode, cp_addr;
  endgroup
  
  function new(string name, uvm_component parent);
    super.new(name, parent);
    cg_txn = new();
  endfunction
  
  function void write(my_txn t);
    cg_txn.sample(t);
  endfunction
  
  function void report_phase(uvm_phase phase);
    \`uvm_info("COV", $sformatf("Coverage = %.1f%%", cg_txn.get_coverage()), UVM_LOW)
  endfunction
endclass
`;
    }

    if (qId === 'uvm_adv_7') {
      return `
// Coverage Placement in Env
class my_env extends uvm_env;
  \`uvm_component_utils(my_env)
  
  my_agent       agent;
  my_scoreboard  scoreboard;
  func_cov_subscriber cov_sub;
  
  function void build_phase(uvm_phase phase);
    super.build_phase(phase);
    agent      = my_agent::type_id::create("agent", this);
    scoreboard = my_scoreboard::type_id::create("scoreboard", this);
    cov_sub    = func_cov_subscriber::type_id::create("cov_sub", this);
  endfunction
  
  function void connect_phase(uvm_phase phase);
    super.connect_phase(phase);
    // Monitor -> Scoreboard
    agent.monitor.ap.connect(scoreboard.analysis_export);
    // Monitor -> Coverage
    agent.monitor.ap.connect(cov_sub.analysis_export);
  endfunction
endclass
`;
    }

    if (qId === 'uvm_adv_8') {
      return `
// Analysis FIFO Scoreboard
class fifo_scoreboard extends uvm_scoreboard;
  \`uvm_component_utils(fifo_scoreboard)
  
  uvm_analysis_fifo #(my_txn) expected_fifo;
  uvm_analysis_fifo #(my_txn) actual_fifo;
  
  // Export ports for external connection
  uvm_analysis_export #(my_txn) expected_export;
  uvm_analysis_export #(my_txn) actual_export;
  
  function new(string name, uvm_component parent);
    super.new(name, parent);
    expected_fifo   = new("expected_fifo", this);
    actual_fifo     = new("actual_fifo", this);
    expected_export = new("expected_export", this);
    actual_export   = new("actual_export", this);
  endfunction
  
  function void connect_phase(uvm_phase phase);
    expected_export.connect(expected_fifo.analysis_export);
    actual_export.connect(actual_fifo.analysis_export);
  endfunction
  
  task run_phase(uvm_phase phase);
    my_txn exp_txn, act_txn;
    forever begin
      expected_fifo.get(exp_txn);
      actual_fifo.get(act_txn);
      
      if (!exp_txn.compare(act_txn))
        \`uvm_error("SCB", $sformatf("Mismatch: exp=%s act=%s",
                   exp_txn.sprint(), act_txn.sprint()))
      else
        \`uvm_info("SCB", "Match", UVM_HIGH)
    end
  endtask
endclass
`;
    }

    if (qId === 'uvm_adv_9') {
      return `
// Driver Response Path
class resp_driver extends uvm_driver #(my_txn, my_txn);
  \`uvm_component_utils(resp_driver)
  
  virtual bus_if vif;
  
  task run_phase(uvm_phase phase);
    forever begin
      my_txn req, rsp;
      seq_item_port.get_next_item(req);
      
      // Drive request
      drive_request(req);
      
      // Collect response from DUT
      rsp = my_txn::type_id::create("rsp");
      rsp.set_id_info(req); // copy sequence/transaction IDs
      collect_response(rsp);
      
      // Send response back to sequence
      seq_item_port.item_done(rsp);
    end
  endtask
  
  task drive_request(my_txn req);
    @(posedge vif.clk);
    vif.addr  <= req.addr;
    vif.data  <= req.data;
    vif.valid <= 1'b1;
    @(posedge vif.clk iff vif.ready);
    vif.valid <= 1'b0;
  endtask
  
  task collect_response(my_txn rsp);
    @(posedge vif.clk iff vif.resp_valid);
    rsp.data   = vif.resp_data;
    rsp.status = vif.resp_status;
  endtask
endclass
`;
    }

    if (qId === 'uvm_adv_10') {
      return `
// Protocol Assertion Monitor
class protocol_assertion_monitor extends uvm_monitor;
  \`uvm_component_utils(protocol_assertion_monitor)
  
  virtual bus_if vif;
  uvm_analysis_port #(my_txn) ap;
  
  int unsigned valid_hold_violations;
  int unsigned data_stable_violations;
  
  task run_phase(uvm_phase phase);
    fork
      check_valid_hold();
      check_data_stable();
      collect_transactions();
    join
  endtask
  
  // Valid must not drop until ready
  task check_valid_hold();
    forever begin
      @(posedge vif.clk);
      if (vif.valid && !vif.ready) begin
        @(posedge vif.clk);
        if (!vif.valid) begin
          valid_hold_violations++;
          \`uvm_error("PROTO", "Valid dropped before ready asserted")
        end
      end
    end
  endtask
  
  // Data must be stable while valid && !ready
  task check_data_stable();
    logic [31:0] saved_data;
    forever begin
      @(posedge vif.clk);
      if (vif.valid && !vif.ready) begin
        saved_data = vif.data;
        @(posedge vif.clk);
        if (vif.valid && vif.data !== saved_data) begin
          data_stable_violations++;
          \`uvm_error("PROTO", "Data changed while waiting for ready")
        end
      end
    end
  endtask
  
  task collect_transactions();
    forever begin
      my_txn t;
      @(posedge vif.clk iff (vif.valid && vif.ready));
      t = my_txn::type_id::create("mon_txn");
      t.addr = vif.addr;
      t.data = vif.data;
      ap.write(t);
    end
  endtask
  
  function void report_phase(uvm_phase phase);
    \`uvm_info("PROTO", $sformatf("Valid-hold violations: %0d", valid_hold_violations), UVM_LOW)
    \`uvm_info("PROTO", $sformatf("Data-stable violations: %0d", data_stable_violations), UVM_LOW)
  endfunction
endclass
`;
    }

    return `// No reference solution available for this question`;
  }

  return null;
};
